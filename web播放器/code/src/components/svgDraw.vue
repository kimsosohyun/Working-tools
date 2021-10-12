<template>
  <div class="drawShape" @click="cancelDelete" :style="drawStyle">
    <div :id="mapId" class="map"></div>
    <button class="deleteShape" ref="deleteShape">
      <span>{{ _("Delete") }}</span>
    </button>
    <!-- <button @click="submit">提交</button>
    <button id="clear" @click="clearAll">清空</button>
    <button @click="fullScreen">全屏</button> -->
  </div>
</template>

<script>
import { titleColor } from "@/assets/scss/vars.scss";
import { clone } from "@/utils/common.js";
import SVG from "svg.js";
import "svg.draggable.js";
import "svg.select.js";
import "@/utils/svg.resize.js";

export default {
  data() {
    //保证id唯一，否则出现两个画布都初始化在同一个div容器中的情况
    this.mapId = `map-${this._uid}`;
    return {
      container: "",
      svg: "",
      draw: null, //画图工具
      count: 0, //绘点数量
      delete: false, //是否处于删除状态
      choose: 0, //是否处于选中状态
      drawShape: [], // 基本图形构成的数组
      suppleShape: [], //描点时所需要的辅助图形构成的数组
      suppleLine: null, //鼠标移动时所需要的辅助线
      supplePolygon: null, //鼠标移动时所需要的辅助图形
      suppleDot: null, //鼠标移动时所需要的辅助点
      points: [], //多边形:绘点构成的数组
      group: [], //线以及多边形：标识或标识组构成的数组
      lineRange: 24, //线: 线响应范围
      arrowArr: ["AB", "AB", "AB", "AB"] //线：线的方向数组
    };
  },
  props: {
    drawStyle: Object,
    type: String,
    arrow: String
  },
  watch: {
    arrow(val) {
      const index = this.choose - 1;
      this.arrowArr[index] = val;
      this.createGroup(index);
    }
  },
  mounted() {
    const id = this.mapId;

    this.draw = SVG(id).size("100%", "100%");
    this.container = document.getElementById(id);
    this.svg = this.container.children[0];

    const deleteShape = this.$refs.deleteShape,
      { container, svg } = this;

    switch (this.type) {
      case "polygon":
        this.drawPolygon();
        break;
      case "rect":
        container.className = "rectMap";
        this.drawRect();
        break;
      case "line":
        this.drawLine();
        break;
      case "playerRect":
        container.className = "playerRectMap";
        this.drawPlayerRect();
        break;
    }

    svg.addEventListener("contextmenu", this.rightClickMap, false);
    deleteShape.addEventListener(
      "click",
      e => {
        const event = window.event || e;
        event.stopPropagation();
        deleteShape.style.visibility = "hidden";
        this.deleteShape(this.choose - 1, this.type);
      },
      false
    );

    //todo:初始化画布
    // this.initMap([
    //   [
    //     [0.1092436974789916, 0.2873134328358209],
    //     [0.28991596638655465, 0.2873134328358209],
    //     [0.28991596638655465, 0.5634328358208955],
    //     [0.1092436974789916, 0.5634328358208955]
    //   ],
    //   [
    //     [0.4096638655462185, 0.27611940298507465],
    //     [0.657563025210084, 0.27611940298507465],
    //     [0.657563025210084, 0.6044776119402985],
    //     [0.4096638655462185, 0.6044776119402985]
    //   ],
    //   [
    //     [0.7647058823529411, 0.2798507462686567],
    //     [0.9810924369747899, 0.2798507462686567],
    //     [0.9810924369747899, 0.6194029850746269],
    //     [0.7647058823529411, 0.6194029850746269]
    //   ]
    // ]);
  },
  methods: {
    /**
     * 点击方框外部取消删除
     */
    cancelDelete() {
      const deleteShape = this.$refs.deleteShape;
      if (!this.delete) {
        return;
      }
      // this.clearChoose();
      deleteShape.style.visibility = "hidden";
      // this.choose = 0;
      this.delete = false;
    },
    /**
     * 是否可以继续作点
     */
    canDraw(e) {
      const event = window.event || e;
      if (
        (event.target.nodeName.toLowerCase() !== "svg" && this.count === 0) ||
        this.drawShape.length > 3 ||
        event.button !== 0 ||
        this.delete
      ) {
        return false;
      }
      // if (this.choose) {
      //   this.clearChoose();
      //   this.choose = 0;
      //   return false;
      // }
      return true;
    },
    /**
     * 画多边形
     */
    drawPolygon() {
      const { svg } = this,
        vm = this;

      svg.addEventListener(
        "mousedown",
        e => {
          const event = window.event || e;
          if (!this.canDraw(e)) {
            return;
          }

          //防止连续点击未调用mousemove事件，清除辅助图形报错
          mousemove(e);
          svg.addEventListener("mousemove", mousemove, false);
          const x = event.layerX,
            y = event.layerY;
          let { suppleShape, draw, points } = this;

          this.suppleLine && this.suppleLine.remove();
          this.suppleLine = null;
          this.suppleDot && this.suppleDot.remove();
          this.suppleDot = null;

          this.count++;
          suppleShape.push(
            draw
              .circle(5)
              .fill("#FF801F")
              .move(x - 2.5, y - 2.5)
          );
          points.push([x, y]);
          const len = points.length;

          if (this.count > 1 && this.count < 4) {
            suppleShape.push(
              draw
                .line(points[len - 2][0], points[len - 2][1], x, y)
                .stroke({ width: 1, color: "#FF801F" })
            );
          } else if (this.count > 3) {
            suppleShape.push(
              draw
                .line(
                  points[len - 1][0],
                  points[len - 1][1],
                  this.points[0][0],
                  this.points[0][1]
                )
                .stroke({ width: 1, color: "#FF801F" })
            );
            svg.removeEventListener("mousemove", mousemove, false);
            this.supplePolygon.remove();
            this.supplePolygon = null;
            this.count = 0;
            this.clearSuppleShape();
            // this.createPolygon();
            const polygon = this.draw
              .polygon(points)
              .fill("rgba(255, 128, 31, 0.2)")
              .stroke({ width: 1, color: "#FF801F" });

            this.bindEvent(polygon);
            this.points = [];
          }
        },
        false
      );
      function mousemove(e) {
        const event = window.event || e,
          x = event.layerX,
          y = event.layerY;

        if (vm.count > 0) {
          vm.suppleLine && vm.suppleLine.remove();
          vm.suppleDot && vm.suppleDot.remove();

          vm.suppleDot = vm.draw
            .circle(5)
            .fill("#FF801F")
            .move(x - 2.5, y - 2.5);

          vm.suppleLine = vm.draw
            .line(vm.points[vm.count - 1][0], vm.points[vm.count - 1][1], x, y)
            .stroke({ width: 1, color: "#FF801F" });
        }
        if (vm.count > 1) {
          const supplyPoints = vm.points.concat();
          supplyPoints.push([x, y]);

          const len = vm.drawShape.length;

          vm.createMark(len, supplyPoints);
          vm.supplePolygon && vm.supplePolygon.remove();
          vm.supplePolygon = vm.draw
            .polygon(supplyPoints)
            .fill("rgba(255, 128, 31, 0.2)");
        }
      }
    },
    // createPolygon() {
    //   const { points } = this,
    //     polygonDraw = this.draw
    //       .polygon(points)
    //       .fill("rgba(255, 128, 31, 0.2)")
    //       .stroke({ width: 1, color: "#FF801F" });

    //   polygonDraw.addClass("polygon");
    //   this.drawShape.push(polygonDraw);
    //   const index = this.drawShape.length - 1,
    //     polygon = polygonDraw.node;

    //   polygon.setAttribute("index", index); //用作图形标识
    //   this.shapeChoose(polygon);
    //   polygon.addEventListener("click", () => this.shapeChoose(polygon), false);
    // },
    /**
     * 生成标识：区域一
     * @param { Number } index  图形（线）的标识
     * @param { Object } points (非必须，可通过index直接生成) 包含多边形四个顶点的坐标，可通过此坐标配置生成图形标识
     */
    createMark(index, points) {
      if (this.group[index]) {
        this.group[index].remove();
        this.group[index] = null;
      }
      let pointArr,
        txArr = ["一", "二", "三", "四"];

      if (points) {
        pointArr = points;
      } else {
        pointArr = this.drawShape[index].array().value;
      }

      let len = pointArr.length,
        i = 0,
        idx = 0,
        min = 9999;

      for (; i < len; i++) {
        const sum = pointArr[i][0] + pointArr[i][1];
        if (sum < min) {
          min = sum;
          idx = i;
        }
      }
      const tx = this.draw.text(function(add) {
        add
          .tspan(`区域${txArr[index]}`)
          .addClass("words")
          .newLine();
      });
      tx.font({
        family: "PingFangSC-Regular, PingFang SC",
        size: 14,
        anchor: "center",
        fill: "#FF801F"
      });

      tx.move(pointArr[idx][0] - 20, pointArr[idx][1] - 20);
      this.group[index] = tx;
    },
    /**
     * 删除所有的辅助线
     */
    clearSuppleShape() {
      this.suppleShape.forEach(item => {
        item.remove();
      });
      this.suppleShape = [];
    },
    /**
     * 选中图形
     * @param {Object} shape 点击的图形节点
     */
    shapeChoose(shape) {
      const index = Number(shape.getAttribute("index")),
        drawShape = this.drawShape[index],
        { container, type } = this,
        cw = container.offsetWidth,
        ch = container.offsetHeight,
        constraint = {
          minX: 0,
          minY: 0,
          maxX: cw,
          maxY: ch
        };

      this.clearChoose();

      //线段改变选中时，切换select框箭头指向值
      if (this.choose - 1 != index && type === "line") {
        this.$emit("choose-change", this.arrowArr[index]);
      }

      //当作图点为第一个点时才响应选中事件，其余当正常作图构成图形
      if (this.count === 0) {
        this.choose = index + 1;

        //选中及可缩放图形
        drawShape
          .selectize({
            deepSelect: true,
            classPoints: "choosePoints",
            pointSize: 5
          })
          .resize({
            resizeLimits: {
              width: 4,
              height: 4
            },
            constraint
          });

        //图形可拖动
        drawShape.draggable(constraint);

        shape.oncontextmenu = e => {
          const event = window.event || e;
          this.rightClickShape(event, index);
        };

        //扩大删除响应面积，防止顶点聚集时无法点击右键删除
        const chooseGroup = document.getElementsByClassName("choosePoints")[0]
          .parentNode;

        chooseGroup.oncontextmenu = e => {
          const event = window.event || e;
          this.rightClickShape(event, index);
        };

        if (type !== "rect") {
          let startX = 0,
            startY = 0,
            pointArr = [],
            pointObj = {};

          // 图形开始拖拽时，记录下此时的坐标
          drawShape.on("dragstart.namespace", e => {
            const { event } = e.detail,
              { value } = this.drawShape[index].array();

            startX = event.layerX;
            startY = event.layerY;

            if (type === "polygon") {
              pointArr = clone(value);
            } else {
              pointObj.x = value[0][0];
              pointObj.y = value[0][1];
              pointObj.startX = value[1][0];
              pointObj.startY = value[1][1];
            }
          });

          // 图形拖拽时，跟随图形的位置形成新的标识或标识组
          drawShape.on("dragmove.namespace", e => {
            const { value } = this.drawShape[index].array();
            let reachBorder = false;

            value.forEach(item => {
              if (
                item[0] == 0 ||
                item[0] == cw ||
                item[1] == 0 ||
                item[1] == ch
              ) {
                type === "line" && this.createGroup(index);
                type === "polygon" && this.createMark(index);
                reachBorder = true;
              }
            });

            //到达边界
            if (reachBorder) {
              return;
            }

            const { event } = e.detail,
              x = event.layerX,
              y = event.layerY,
              moveX = x - startX,
              moveY = y - startY,
              movePointArr = clone(pointArr),
              movePointObj = clone(pointObj);

            if (type === "polygon") {
              movePointArr.forEach(item => {
                item[0] += moveX;
                item[1] += moveY;
              });
              this.createMark(index, movePointArr);
            } else {
              movePointObj.x += moveX;
              movePointObj.y += moveY;
              movePointObj.startX += moveX;
              movePointObj.startY += moveY;
              this.createGroup(index, movePointObj);
            }

            // if (moveX > moveY) {
            //   //针对X移动
            //   if (x > startX) {
            //     type === "polygon" && this.createMark(index, { x: 1, y: 0 });
            //     type === "line" && this.createGroup(index, { x: 0, y: 0 });
            //   } else {
            //     type === "polygon" && this.createMark(index, { x: -1, y: 0 });
            //     type === "line" && this.createGroup(index, { x: 0, y: 0 });
            //   }
            // } else {
            //   //针对Y移动
            //   if (y > startY) {
            //     type === "polygon" && this.createMark(index, { x: 0, y: 1 });
            //     type === "line" && this.createGroup(index, { x: 0, y: 0 });
            //   } else {
            //     type === "polygon" && this.createMark(index, { x: 0, y: -1 });
            //     type === "line" && this.createGroup(index, { x: 0, y: 0 });
            //   }
            // }
            // if (type === "line") {
            //   const choosePoints = document.getElementsByClassName(
            //     "choosePoints"
            //   );

            //   choosePoints.forEach(item => {
            //     item.style.visibility = "hidden"; // 让真点消失，防止图形错位
            //   });

            //   const group = this.group[index].node,
            //     dots = group.getElementsByClassName("lineDot");

            //   dots.forEach(item => {
            //     item.style.visibility = "visible";
            //   });
            // }
          });

          // drawShape.on("dragend.namespace", () => {
          //   if (type === "line") {
          //     const choosePoints = document.getElementsByClassName(
          //       "choosePoints"
          //     );
          //     choosePoints.forEach(item => {
          //       item.style.visibility = "visible"; // 移动结束时，让真点重新显示，假点消失，防止因层级关系中心不可选中
          //     });
          //   }
          //   type === "polygon" && this.createMark(index);
          //   type === "line" && this.createGroup(index);
          // });

          //图形缩放时，跟随图形的位置形成新的标识或标识组
          drawShape.on("resizing.namespace", () => {
            type === "polygon" && this.createMark(index);
            type === "line" && this.createGroup(index);
          });
        }
      }
    },
    /**
     * 取消选中
     */
    clearChoose() {
      this.drawShape.forEach(item => {
        item.selectize(false, { deepSelect: true });
        item.draggable(false);
        item.resize("stop");
        if (this.type !== "rect") {
          item.off("dragmove.namespace");
          item.off("resizing.namespace");
        }
      });
    },
    /**
     * 在作图状态下点击右键取消绘制
     */
    rightClickMap(e) {
      const event = window.event || e,
        { type } = this;

      if (event.preventDefault) {
        //标准格式
        event.preventDefault();
      } else {
        //IE格式
        event.returnValue = false;
      }
      if (!this.count) {
        return;
      }
      const index = this.drawShape.length;

      if ((this.count > 1 && type === "polygon") || type === "line") {
        this.group[index].remove();
        this.group[index] = null;
      }
      this.clearSuppleShape();
      this.points = [];
      this.count = 0;
      this.suppleLine && this.suppleLine.remove();
      this.suppleLine = null;
      this.suppleDot && this.suppleDot.remove();
      this.suppleDot = null;
      this.supplePolygon && this.supplePolygon.remove();
      this.supplePolygon = null;
    },
    /**
     * 在选中状态下在图形内点击右键显示删除框
     */
    rightClickShape(e, index) {
      if (index != this.choose - 1) {
        return;
      }

      this.delete = true;
      const event = window.event || e,
        x = event.layerX,
        y = event.layerY,
        deleteShape = this.$refs.deleteShape;

      if (event.preventDefault) {
        event.preventDefault(); //标准格式
      } else {
        event.returnValue = false; //IE格式
      }
      deleteShape.style.visibility = "visible";
      deleteShape.style.left = x + "px";
      deleteShape.style.top = y + "px";
    },
    /**
     * 删除图形
     * @param {Number} index 被删除图形的标识
     * @param {String} type 被删除图形的类型
     *
     */
    deleteShape(index, type) {
      this.clearChoose();
      const shape = this.drawShape[index];

      this.drawShape.splice(index, 1);
      this.drawShape.forEach(item => {
        const node = item.node,
          itemIndex = node.getAttribute("index");

        //更新标识
        if (itemIndex > index) {
          node.setAttribute("index", itemIndex - 1);
        }
      });
      this.delete = false;
      shape.remove();

      if (type !== "rect") {
        this.group[index].remove();
        this.group.splice(index, 1);

        this.drawShape.forEach(item => {
          const node = item.node,
            index = node.getAttribute("index");

          //重新生成图形组来更新界限
          if (index) {
            type === "line" && this.createGroup(index);
            type === "polygon" && this.createMark(index);
          }
        });
      }
      //删除图形后默认选中第一个图形
      if (this.drawShape.length) {
        const firstShape = this.drawShape[0].node;
        this.shapeChoose(firstShape);
      }
    },
    /**
     * 生成顶点距画布边的百分比数组
     * @returns {Array} points 顶点距画布边的百分比数组
     */
    submit() {
      const points = [],
        { container } = this,
        cw = container.offsetWidth,
        ch = container.offsetHeight;

      if (this.type === "rect" || this.type === "playerRect") {
        this.drawShape.forEach(item => {
          const shapeArr = [],
            node = item.node,
            width = Number(node.getAttribute("width")),
            height = Number(node.getAttribute("height")),
            x = Number(node.getAttribute("x")),
            y = Number(node.getAttribute("y"));
          shapeArr.push([x / cw, y / ch]);
          shapeArr.push([(x + width) / cw, y / ch]);
          shapeArr.push([(x + width) / cw, (y + height) / ch]);
          shapeArr.push([x / cw, (y + height) / ch]);
          points.push(shapeArr);
        });
      } else {
        this.drawShape.forEach(item => {
          const shape = item.array().value,
            shapeArr = [];
          shape.forEach(el => {
            const obj = {};
            obj.x = el[0] / cw;
            obj.y = el[1] / ch;
            shapeArr.push(obj);
          });
          points.push(shapeArr);
        });
      }

      return points;
    },
    /**
     * 初始化画布
     * @param {Array} data 初始化数据
     */
    initMap(data) {
      const { container, draw } = this,
        cw = container.offsetWidth,
        ch = container.offsetHeight;

      data.forEach(item => {
        item.forEach(point => {
          point[0] = point[0] * cw;
          point[1] = point[1] * ch;
        });
      });
      if (this.type === "rect") {
        data.forEach(item => {
          const x = item[0][0],
            y = item[0][1],
            w = item[1][0] - item[0][0],
            h = item[2][1] - item[1][1];

          const shape = draw
            .rect(w, h)
            .fill("rgba(255, 128, 31, 0.3)")
            .move(x, y);

          this.bindEvent(shape);
        });

        //默认选中第一个图形
        const chooseItem = this.drawShape[0].node;
        this.shapeChoose(chooseItem);
      }
    },
    /**
     * 绘制矩形
     */
    drawRect() {
      const { svg, container } = this,
        vm = this;

      svg.addEventListener(
        "mousedown",
        e => {
          const cw = container.offsetWidth,
            ch = container.offsetHeight,
            cl = container.getBoundingClientRect().left,
            ct = container.getBoundingClientRect().top,
            event = window.event || e;

          if (!this.canDraw(event)) {
            return;
          }
          let shape = null;
          const dx = event.layerX,
            dy = event.layerY;

          document.addEventListener("mousemove", mousemove, false);
          function mousemove(e) {
            const event = window.event || e;

            let ux = event.clientX - cl,
              uy = event.clientY - ct;

            if (ux > cw) {
              ux = cw;
            }
            if (uy > ch) {
              uy = ch;
            }
            if (ux < 0) {
              ux = 0;
            }
            if (uy < 0) {
              uy = 0;
            }

            const w = Math.abs(ux - dx),
              h = Math.abs(uy - dy),
              shapeX = Math.min(ux, dx),
              shapeY = Math.min(uy, dy);

            if (w > 0) {
              if (shape) {
                shape.remove();
              }
              shape = vm.draw
                .rect(w, h)
                .fill("rgba(255, 128, 31, 0.3)")
                .move(shapeX, shapeY);
            }
          }

          document.addEventListener("mouseup", mouseup, false);
          function mouseup() {
            document.removeEventListener("mousemove", mousemove, false);
            document.removeEventListener("mouseup", mouseup, false);

            if (shape) {
              vm.bindEvent(shape);
            }
          }
        },
        false
      );
    },
    /**
     * 绘制区域放大矩形
     */
    drawPlayerRect() {
      const { container, svg } = this,
        vm = this;

      svg.addEventListener(
        "mousedown",
        e => {
          const cw = container.offsetWidth,
            ch = container.offsetHeight,
            cl = container.getBoundingClientRect().left,
            ct = container.getBoundingClientRect().top,
            event = window.event || e;

          event.stopPropagation();
          if (!this.canDraw(event)) {
            return;
          }
          let shape = null;
          const dx = event.layerX,
            dy = event.layerY;

          document.addEventListener("mousemove", mousemove, false);
          function mousemove(e) {
            const event = window.event || e;

            event.stopPropagation();
            document.body.classList.add("no-select");

            let ux = event.clientX - cl,
              uy = event.clientY - ct;

            if (ux > cw) {
              ux = cw;
            }
            if (uy > ch) {
              uy = ch;
            }
            if (ux < 0) {
              ux = 0;
            }
            if (uy < 0) {
              uy = 0;
            }

            const w = Math.abs(ux - dx),
              h = Math.abs(uy - dy),
              shapeX = Math.min(ux, dx),
              shapeY = Math.min(uy, dy);

            if (w > 0) {
              if (shape) {
                shape.remove();
              }
              shape = vm.draw
                .rect(w, h)
                .fill("transparent")
                .move(shapeX, shapeY);
              shape.attr({
                "stroke-dasharray": "5,5",
                stroke: titleColor,
                "stroke-width": 2
              });
            }
          }

          document.addEventListener("mouseup", mouseup, false);
          function mouseup(e) {
            const event = window.event || e;

            event.stopPropagation();
            document.removeEventListener("mousemove", mousemove, false);
            document.removeEventListener("mouseup", mouseup, false);
            document.body.classList.remove("no-select");

            if (shape) {
              vm.drawShape.push(shape);
              const points = vm.submit();
              vm.$emit("after-create-shape", points);
              vm.clearAll();
            } else {
              vm.$emit("mouseup", {
                x: event.layerX,
                y: event.layerY
              });
            }
          }
        },
        false
      );
    },
    /**
     * 绘制线
     */
    drawLine() {
      const { svg, container } = this,
        vm = this;

      let startX = 0,
        startY = 0;

      svg.addEventListener(
        "mousedown",
        e => {
          const event = window.event || e;

          if (!this.canDraw(event)) {
            return;
          }
          this.count++;
          document.addEventListener("mousemove", mousemove, false);

          const x = event.offsetX,
            y = event.offsetY;
          let { suppleShape, draw } = this;

          suppleShape.push(
            draw
              .circle(5)
              .fill("#FF801F")
              .move(x - 2.5, y - 2.5)
          );
          if (this.count > 1 && startY != y && startX != x) {
            this.count = 0;
            this.clearSuppleShape();
            document.removeEventListener("mousemove", mousemove, false);
            this.suppleDot.remove();
            this.suppleDot = null;

            const lineShape = draw
              .line(startX, startY, x, y)
              .stroke({ width: this.lineRange, color: "#FF801F" });

            this.bindEvent(lineShape);
          } else {
            startX = x;
            startY = y;
          }
        },
        false
      );
      function mousemove(e) {
        const cw = container.offsetWidth,
          ch = container.offsetHeight,
          cl = container.getBoundingClientRect().left,
          ct = container.getBoundingClientRect().top,
          event = window.event || e,
          len = vm.drawShape.length;

        let x = event.clientX - cl,
          y = event.clientY - ct;

        if (x > cw) {
          x = cw;
        }
        if (y > ch) {
          y = ch;
        }
        if (x < 0) {
          x = 0;
        }
        if (y < 0) {
          y = 0;
        }
        if (vm.count > 0) {
          vm.createGroup(len, {
            x,
            y,
            startX,
            startY
          });
          vm.suppleDot && vm.suppleDot.remove();
          vm.suppleDot = vm.draw
            .circle(5)
            .fill("#FF801F")
            .move(x - 2.5, y - 2.5);
        }
      }
    },
    /**
     * 生成标识组： A<->B及附带文字
     * @param { Number } index  图形（线）的标识
     * @param { Object } option (非必须，可通过index直接生成) 包含x,y,startX,startY的对象，可通过此坐标配置生成图形组
     */
    createGroup(index, option) {
      if (this.group[index]) {
        this.group[index].remove();
        this.group[index] = null;
      }
      let value, x, y, startX, startY;

      if (!option) {
        value = this.drawShape[index].array().value;
        x = value[0][0];
        y = value[0][1];
        startX = value[1][0];
        startY = value[1][1];
      } else {
        //在鼠标移动时通过坐标生成图形组
        x = option.x;
        y = option.y;
        startX = option.startX;
        startY = option.startY;
      }

      const minX = Math.min(x, startX),
        minY = Math.min(y, startY),
        lineLenX = Math.abs(x - startX),
        lineLenY = Math.abs(y - startY),
        centerX = lineLenX / 2 + minX,
        centerY = lineLenY / 2 + minY,
        deg = (180 * Math.atan(lineLenY / lineLenX)) / Math.PI, //线的偏移角度
        { draw } = this,
        txArr = ["一", "二", "三", "四"];

      const line = draw
        .line(startX, startY, x, y)
        .stroke({ width: 1, color: "#FF801F" });

      const tx = draw.text(function(add) {
        add
          .tspan(`界限${txArr[index]}`)
          .addClass("words")
          .newLine();
      });
      tx.font({
        family: "PingFangSC-Regular, PingFang SC",
        size: 14,
        anchor: "center",
        fill: "#FF801F"
      });

      if (y > startY) {
        tx.move(startX + 5, startY - 10);
      } else {
        tx.move(x + 5, y - 10);
      }

      const txa = draw.text(function(add) {
        add
          .tspan("A")
          .addClass("words")
          .newLine();
      });

      txa.font({
        family: "PingFangSC-Regular, PingFang SC",
        size: 14,
        anchor: "center",
        fill: "#FF801F"
      });
      txa.move(centerX - 20, centerY - 10);

      const txb = draw.text(function(add) {
        add
          .tspan("B")
          .addClass("words")
          .newLine();
      });

      txb.font({
        family: "PingFangSC-Regular, PingFang SC",
        size: 14,
        anchor: "center",
        fill: "#FF801F"
      });
      txb.move(centerX + 10, centerY - 10);

      let tra,
        trb,
        trArrow = this.arrowArr[index];

      if (trArrow !== "B") {
        tra = draw
          .polygon([
            [centerX - 5, centerY + 2],
            [centerX - 5, centerY - 2],
            [centerX - 10, centerY]
          ])
          .fill("#FF801F")
          .id("A");
      }
      if (trArrow !== "A") {
        trb = draw
          .polygon([
            [centerX + 5, centerY + 2],
            [centerX + 5, centerY - 2],
            [centerX + 10, centerY]
          ])
          .fill("#FF801F")
          .id("B");
      }

      const rect = draw
        .rect(10, 1)
        .fill("#FF801F")
        .move(centerX - 5, centerY - 0.5);

      const arrowGroup = draw.group();
      arrowGroup.add(rect);
      trArrow !== "B" && arrowGroup.add(tra);
      trArrow !== "A" && arrowGroup.add(trb);
      arrowGroup.add(txa);
      arrowGroup.add(txb);

      this.group[index] = draw.group();
      this.group[index].addClass("fakeLine");
      this.group[index].add(tx);
      this.group[index].add(line);
      this.group[index].add(arrowGroup);

      if ((startX > x && startY < y) || (startX < x && startY > y)) {
        // 方向:/
        arrowGroup.rotate(90 - deg, centerX, centerY);
        if (y > startY) {
          tx.rotate(90 - deg, startX, startY);
        } else {
          tx.rotate(90 - deg, x, y); //围绕上方点旋转
        }
      } else {
        // 方向:\
        arrowGroup.rotate(deg - 90, centerX, centerY);
        if (y > startY) {
          tx.rotate(deg - 90, startX, startY);
        } else {
          tx.rotate(deg - 90, x, y);
        }
      }
    },
    /**
     * 清空整个画布
     */
    clearAll() {
      this.cancelDelete();
      this.clearChoose();
      this.drawShape.length > 0 &&
        this.drawShape.forEach(item => {
          item.remove();
        });
      this.drawShape = [];
      this.suppleShape.length > 0 &&
        this.suppleShape.forEach(item => {
          item.remove();
        });
      this.suppleShape = [];
      this.group.length > 0 &&
        this.group.forEach(item => {
          item.remove();
        });
      this.group = [];
      this.points = [];
      this.count = 0;
      this.choose = 0;
      this.delete = false;
      this.suppleLine && this.suppleLine.remove();
      this.suppleLine = null;
      this.suppleDot && this.suppleDot.remove();
      this.suppleDot = null;
      this.supplePolygon && this.supplePolygon.remove();
      this.supplePolygon = null;
    },
    /**
     * 全屏（rect时有效）
     */
    fullScreen() {
      if (this.type !== "rect" || this.drawShape.length < 1) {
        return;
      }
      this.clearAll();
      const { container } = this,
        cw = container.offsetWidth,
        ch = container.offsetHeight,
        fullRect = this.draw
          .rect(cw, ch)
          .fill("rgba(255, 128, 31, 0.3)")
          .move(0, 0);
      this.drawShape.push(fullRect);
      fullRect.addClass("rect");
      const index = this.drawShape.length - 1,
        rect = fullRect.node;

      rect.setAttribute("index", index);
      this.shapeChoose(rect);
      rect.addEventListener("click", () => this.shapeChoose(rect), false);
    },
    /**
     * 增加标识，绑定选中事件
     * @param {object} shape svg实例
     */
    bindEvent(shape) {
      const { type } = this;

      shape.addClass(type);
      this.drawShape.push(shape);
      const index = this.drawShape.length - 1,
        node = shape.node;

      //用作图形标识
      node.setAttribute("index", index);
      this.shapeChoose(node);
      node.addEventListener("click", () => this.shapeChoose(node), false);
    }
    /**
     * 创建假点用于显示
     * @param {Number} index - 第几个图形的标识
     */
    //因svg不可设置层级关系，新生成的假点始终会覆盖在可响应点的上方，导致正中区域不响应,故不采用
    // createShowDot(index) {
    //   const dots = document.getElementsByClassName("choosePoints"),
    //     point = [],
    //     g = document.getElementsByTagName("g")[0],
    //     matrixGroup = g.instance;

    //   dots.forEach((item) => {
    //     const cx = item.getAttribute("cx"),
    //       cy = item.getAttribute("cy"),
    //       obj = {};
    //     if (cx) {
    //       obj.cx = cx;
    //       obj.cy = cy;
    //       point.push(obj);
    //     }
    //   });
    //   if (this.showdot[index]) {
    //     this.showdot[index].remove();
    //     this.showdot[index] = null;
    //   }
    //   const group = this.draw.group();
    //   point.forEach((item) => {
    //     group.add(
    //       this.draw
    //         .circle(5)
    //         .fill("#FF801F")
    //         .move(Number(item.cx) - 2.5, Number(item.cy) - 2.5)
    //     );
    //   });
    //   this.showdot[index] = group;
    //   matrixGroup.add(group);
    // }
  }
};
</script>

<style lang="scss">
.drawShape {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 10;
  .map {
    width: 100%;
    height: 100%;
    cursor: url("~@/assets/cursor/draw.cur"), default;
  }
  .choosePoints {
    cursor: url("~@/assets/cursor/resize.cur"), pointer;
    fill: #ff801f;
    stroke-width: 10; //可根据此更改顶点选中范围
    stroke: transparent;
  }
  .line {
    opacity: 0;
  }
  .fakeLine {
    user-select: none;
  }
  .svg_select_boundingRect,
  .choosePoints_rot {
    display: none !important;
  }
  .deleteShape {
    position: absolute;
    outline: none;
    visibility: hidden;
    list-style: none;
    top: 0;
    left: 0;
    width: 60px;
    height: 32px;
    background: #fafafa;
    border-radius: 2px;
    border: 1px solid #e9e9e9;
    text-align: center;
    span {
      font-size: 14px;
      font-weight: 400;
      color: #595959;
      line-height: 32px;
    }
  }
  .rect,
  .line,
  .polygon {
    cursor: url("~@/assets/cursor/drag.cur") 12 12, move;
  }
  .rectMap {
    width: 100%;
    height: 100%;
    cursor: url("~@/assets/cursor/rect.cur") 12 12, default;
    .choosePoints_lt,
    .choosePoints_rb {
      cursor: url("~@/assets/cursor/lt.cur") 12 12, pointer;
    }
    .choosePoints_t,
    .choosePoints_b {
      cursor: url("~@/assets/cursor/tb.cur") 12 12, pointer;
    }
    .choosePoints_l,
    .choosePoints_r {
      cursor: url("~@/assets/cursor/lr.cur") 12 12, pointer;
    }
    .choosePoints_rt,
    .choosePoints_lb {
      cursor: url("~@/assets/cursor/rt.cur") 12 12, pointer;
    }
  }
  .playerRectMap {
    width: 100%;
    height: 100%;
    cursor: zoom-in;
  }
}
</style>
