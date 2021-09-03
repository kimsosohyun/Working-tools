<template class="map">
  <div class="bg">
    <ul class="metro-line" ref="metroLine">
      <li
        v-for="item in metroData.edges"
        :key="item.id"
        @mouseenter="showBg($event, item)"
        @mouseleave="showBg($event, item, 'black')"
        @click="showEdge($event, item)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div id="container"></div>

    <Dialog ref="dialog" :dialogOption="dialogOption" :clickNode="clickNode" @setClickNode="setClickNode" />
  </div>
</template>

<script>
import G6 from "@antv/g6";
import axios from "axios";
import img from "../../assets/img/transfer.png";
import Dialog from "./Dialog";
export default {
  components: {
    Dialog
  },
  data() {
    return {
      cw: 0,
      ch: 0,
      chooseEdge: "",
      metroData: {},
      metroInfo: [],
      graph: {},
      tooltipEdge: {},
      tooltipNode: {},
      dialogOption: {},
      clickNode: false,
      chooseMiddleId: "" 
    };
  },
  created() {
    this.dialogOption = {
      show: false,
      name: "",
      style: {
        //  background:"red",
        left: "0px",
        top: "0px"
      },
      info: {}
    };
  },
  mounted() {


    const vm = this;

    this.cw = document.getElementById("container").offsetWidth;
    this.ch = document.getElementById("container").offsetHeight;

    this.getMetroData("cd");
    this.getMetroInfo("cd");

    const textLg = [
      { x: 0, y: -6, ta: "center" },
      { x: 6, y: -6, ta: "start" },
      { x: 6, y: 6, ta: "start" },
      { x: 6, y: 18, ta: "start" },
      { x: 0, y: 18, ta: "center" },
      { x: -6, y: 18, ta: "end" },
      { x: -6, y: 6, ta: "end" },
      { x: -6, y: -6, ta: "end" }
    ];

    G6.registerNode(
      "breath-node",
      {
        draw(cfg, group) {
          //用于画基本图形
          const r = cfg.size / 2;
          let node = null;
          if (cfg.transfer) {
            //可换乘
            node = group.addShape("circle", {
              zIndex: 4,
              attrs: {
                x: 0,
                y: 0,
                r: 1.4 * r,
                fill: "pink",
                cursor: "pointer",
                opacity: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? 0.8 : 0.5
              },
              name: ""
            });
          } else {
            //普通节点
            node = group.addShape("circle", {
              zIndex: 4,
              attrs: {
                x: 0,
                y: 0,
                r,
                // fill: "white",
                stroke: "black",
                cursor: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? "pointer" : "default",
                opacity: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? 0.6 : 0.1
              },
              name: ""
            });
          }
          const text = group.addShape("text", {
            zIndex: -4,
            attrs: {
              text: cfg.name,
              x: textLg[cfg.lg].x,
              y: textLg[cfg.lg].y,
              fill: cfg.transfer ? "black" : "#696969",
              fontStyle: "10px",
              opacity: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? 1 : 0.1,
              textAlign: textLg[cfg.lg].ta,
              cursor: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? "pointer" : "default"
            },
            name: "text-shape"
          });

          return node;
        },
        afterDraw(cfg, group) {
          //用于动效制作

          const r = cfg.size / 2;
          if (cfg.transfer) {
            const width = 3 * r;
            const height = 3 * r;
            // 添加图片 shape
            const image = group.addShape("image", {
              attrs: {
                x: -width / 2,
                y: -height / 2,
                width: width,
                height: height,
                img: img,
                cursor: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? "pointer" : "default",
                opacity: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? 1 : 0.1
              },
              // must be assigned in G6 3.3 and later versions. it can be any value you want
              name: "image-shape"
            });

            // 该图片 shape 的动画
            image.animate(
              (ratio) => {
                const toMatrix = G6.Util.transform([1, 0, 0, 0, 1, 0, 0, 0, 1], [["r", ratio * Math.PI * 2]]);
                return {
                  matrix: toMatrix
                };
              },
              {
                repeat: true, // 动画重复
                duration: 3000,
                easing: "easeCubic"
              }
            );
          } else {
            const back1 = group.addShape("circle", {
              zIndex: -3,
              attrs: {
                x: 0,
                y: 0,
                r,
                cursor: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? "pointer" : "default",
                fill: cfg.color || (cfg.style && cfg.style.fill),
                opacity: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? 0.6 : 0.1
              },
              name: "back1-shape"
            });
            const back2 = group.addShape("circle", {
              zIndex: -2,
              attrs: {
                x: 0,
                y: 0,
                r,
                cursor: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? "pointer" : "default",
                fill: cfg.color || (cfg.style && cfg.style.fill),
                // 为了显示清晰，随意设置了颜色
                opacity: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? 0.6 : 0.1
              },
              name: "back2-shape"
            });
            const back3 = group.addShape("circle", {
              zIndex: -1,
              attrs: {
                x: 0,
                y: 0,
                r,
                cursor: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? "pointer" : "default",
                fill: cfg.color || (cfg.style && cfg.style.fill),
                opacity: cfg.under.indexOf(vm.chooseEdge) !== -1 || !vm.chooseEdge ? 0.6 : 0.1
              },
              name: "back3-shape"
            });
            //group.sort(); // 排序，根据zIndex 排序
            const delayBase = Math.random() * 2000;
            back1.animate(
              {
                // 逐渐放大，并消失
                r: r + 10,
                opacity: 0.0
              },
              {
                repeat: true, // 循环
                duration: 3000,
                easing: "easeCubic",
                delay: delayBase // 无延迟
              }
            );
            back2.animate(
              {
                // 逐渐放大，并消失
                r: r + 10,
                opacity: 0.0
              },
              {
                repeat: true, // 循环
                duration: 3000,
                easing: "easeCubic",
                delay: delayBase + 1000 // 1 秒延迟
              }
            );
            back3.animate(
              {
                // 逐渐放大，并消失
                r: r + 10,
                opacity: 0.0
              },
              {
                repeat: true, // 循环
                duration: 3000,
                easing: "easeCubic",
                delay: delayBase + 2000 // 2 秒延迟
              }
            );
          }
        },
        setState(name, value, item) {
          //用于状态改变
          const group = item.getContainer();
          const shape = group.get("children")[0];

          if (name === "selected") {
            if (value) {
              shape.attr("opacity", "1");
            } else {
              shape.attr("opacity", "0");
            }
          }
        }
      },
      "circle"
    );
    G6.registerEdge(
      "running-polyline",
      {
        draw(cfg, group) {
          const edge = group.addShape("path", {
            attrs: {
              path: [
                ["M", 100, 100],
                ["L", 200, 200]
              ],
              stroke: cfg.color,
              lineAppendWidth: cfg.style.lineAppendWidth,
              opacity: cfg.id === vm.chooseEdge || !vm.chooseEdge ? 0.8 : 0.1
            },
            // must be assigned in G6 3.3 and later versions. it can be any value you want
            name: "path-shape"
          });

          return edge;
        },
        afterDraw(cfg, group) {
          const shape = group.get("children")[0];

          const length = shape.getTotalLength();
          let circleCount = Math.ceil(length / 120);
          circleCount = circleCount === 0 ? 1 : circleCount;

          const _loop = function _loop(i) {
            const delay = Math.random() * 1000;
            const start = shape.getPoint(i / circleCount);
            const circle = group.addShape("circle", {
              attrs: {
                x: start.x,
                y: start.y,
                r: 1,
                fill: "black",
                shadowColor: "#fff",
                shadowBlur: 30,
                opacity: cfg.id === vm.chooseEdge || !vm.chooseEdge ? 1 : 0.1
              },
              name: "circle-shape"
            });
            circle.animate(
              (ratio) => {
                // console.log("ratio", ratio)
                ratio += i / circleCount;
                if (ratio > 1) {
                  ratio %= 1;
                }
                const tmpPoint = shape.getPoint(ratio);
                return {
                  x: tmpPoint.x,
                  y: tmpPoint.y
                };
              },
              {
                repeat: true,
                duration: 10 * length,
                easing: "easeCubic",
                delay
              }
            );
          };

          for (let i = 0; i < circleCount; i++) {
            _loop(i);
          }
        }
      },
      "polyline"
    );
    this.tooltipNode = new G6.Tooltip({
      className: "dialog",
      itemTypes: ["node"],
      // offsetX: -316,
      // offsetY: 16,
      getContent: (ev) => {
        const node = ev.item,
          id = node.get("id"),
          info = vm.createDialogInfo(id),
          offset = {
            padding: 16,
            border: 39,
            margin: 10,
            one: 39,
            two: 59
          };
        let num = 0;

        const mouseoverDialog = document.getElementsByClassName("dialog")[0];
        let height = offset.border + offset.padding;

        for (var attr in info) {
          num++;
          const item = info[attr];
          if (item.length === 1) {
            height += offset.one;
          } else if (item.length === 2) {
            height += offset.two;
          }
        }

        height += (num - 1) * 10;

        mouseoverDialog.style.height = height + "px";
        // return outDiv;

        return `
          <div class="dialog-title">
            <h3>望京西</h3>
            <div class="close">
              <i class="iconfont icon-guanbi"></i>
            </div>
          </div>
          
          <div class="dialog-content">
            <div class="line">
              <p class="line-title">地铁1号线(科学城-韦家碾)</p>
              <ul>
                <li>
                  <p class="line-left">
                    <span>开往</span>
                    <strong>科学城</strong>
                  </p>
                  <div class="line-right">
                    <span>首 06:20</span>
                    <span>末 23:22</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          `;
      },
      shouldBegin: (e) => {
        return true;
        //  return true;
      }
    });

    this.tooltipEdge = new G6.Tooltip({
      className: "edgeTip",
      itemTypes: ["edge"],
      getContent: (e) => {
        const id = e.item.get("id"),
          edge = this.metroData.edges.find((item) => {
            return item.id === id;
          });

        if (id == this.chooseEdge || !this.chooseEdge) {
          return `<div style="background:${edge.color}">
              <span>${edge.name}</span>
            </div>`;
        }
      }
    });

    // 创建 G6 图实例
    this.graph = new G6.Graph({
      container: "container", // 指定图画布的容器 id，与第 9 行的容器对应
      // 画布宽高
      width: this.cw,
      height: this.ch,
      minZoom: 0.47,
      maxZoom: 5.65,
      modes: {
        default: ["drag-canvas", "zoom-canvas"],
        custom: []
      },

      defaultNode: {
        type: "breath-node",
        size: 6,
        style: {
          lineWidth: 0,
          fill: "#FFB6C1"
        }
      },
      defaultEdge: {
        type: "running-polyline",
        size: 3,
        color: "rgb(14,142,63)",
        style: {
          // opacity: 0.6,
          lineAppendWidth: 3
        }
      },
      plugins: [this.tooltipEdge, this.tooltipNode]
    });

     window.onresize=function(){
      vm.cw = document.getElementById("container").offsetWidth;
      vm.ch = document.getElementById("container").offsetHeight;


      vm.graph.changeSize(vm.cw, vm.ch)
      // vm.graph.fitCenter();
      vm.graph.zoomTo(0.8, { x: vm.cw / 2, y: vm.ch / 2 });

    }
  },
  methods: {
    showBg(ev, item, color) {
      if (this.chooseEdge !== item.id) {

        ev.target.style.background = color ? color : item.color;
      }
    },
    showEdge(ev, item) {
      const lis = this.$refs.metroLine.children;
      for (let i = 0; i < lis.length; i++) {
        lis[i].style.background = "black";
      }
      if (item.id === this.chooseEdge) {
        this.chooseEdge = "";
        this.renderMetro();
      } else {
        ev.target.style.background = item.color;
        this.chooseEdge = item.id;
        this.focusNode(item);
      }
    },

    focusNode(item) {
      const positionArr = item.controlPoints,
        { graph } = this;
      let length = positionArr.length;

      if (length % 2 != 0) {
        length = length - 1;
      }
      const middle = length / 2,
        node = positionArr[middle],
        idNode = this.metroData.nodes.find((item) => Math.abs(item.x - node.x) < 50 && Math.abs(item.y - node.y) < 50);

     

      if (!idNode) {
        this.chooseMiddleId = item.source;
      } else {
        this.chooseMiddleId = idNode.id;
      }

      graph.render();
      graph.zoomTo(1);
      graph.focusItem(this.chooseMiddleId);
     
    },
    getMetroInfo(city) {
      axios.get(`${MOCK_HTTP}/goform/get${city}MetroInfo`).then((res) => this.handleInfoRes(res));
    },
    handleInfoRes(res) {
      if (res.status != 200) {
        return;
      }
      const { data } = res;
      data.l.forEach((item) => {
        item.st.forEach((el) => {
          this.metroInfo.push(el);
        });
      });
      console.log("metroInfo", this.metroInfo[0]);
    },
    getMetroData(city) {
      axios.get(`${MOCK_HTTP}/goform/get${city}Metro`).then((res) => this.handleDataRes(res));
    },
    handleDataRes(res) {
      if (res.status != 200) {
        return;
      }
      const { data } = res,
        arr = data.l,
        nodes = this.createNodes(arr),
        edges = this.createEdges(arr, nodes);

      this.metroData = {
        nodes,
        edges
      };

      console.log("metroData", this.metroData);
      this.renderMetro();
    },
    renderMetro() {
      const { graph } = this;
      // 读取数据

      graph.data(this.metroData);
      // 渲染图
      graph.render();

      graph.fitCenter();
      graph.zoomTo(0.8, { x: this.cw / 2, y: this.ch / 2 });

      graph.on("node:click", (ev) => {
        const node = ev.item,
          id = node.get("id"),
          item = this.metroData.nodes.find((el) => el.id === id);

        if (item.under.indexOf(this.chooseEdge) !== -1 || !this.chooseEdge) {
          const mouseoverDialog = document.getElementsByClassName("dialog")[0],
            { dialogOption } = this.$refs.dialog;

          this.info = this.createDialogInfo(id);
          dialogOption.name = this.metroData.nodes.find((el) => el.id === id).name;
          dialogOption.info = this.createDialogInfo(id);
          dialogOption.style.left = mouseoverDialog.style.left;
          dialogOption.style.top = parseInt(mouseoverDialog.style.top) + 50 + "px";
          dialogOption.style.opacity = 1;
          dialogOption.show = true;

          this.clickNode = true;

          // this.graph.setMode("custom");
        }
      });
    },

    createDialogInfo(id) {
      const info = this.metroInfo.find((item) => {
          return item.si === id;
        }),
        obj = {};

      info.d.forEach((item) => {
        const toNode = this.metroData.nodes.find((el) => el.id === item.n),
          edge = this.metroData.edges.find((el) => el.id === item.ls),
          key = edge.la ? edge.longName + "(" + edge.la + ")" : edge.longName;

        item.name = toNode.name;
        item.color = "color:" + edge.color;
        if (!obj[key]) {
          obj[key] = [];
        }
        item.ft != "--:--" && obj[key].push(item);
      });

      // console.log(obj);
      return obj;
    },
    createEdges(arr, nodesArr) {
      let newArr = [];

      arr.forEach((item) => {
        let obj = {},
          newControlPoint = [],
          controlPointsArr = item.c;

        obj.id = item.ls;
        obj.color = "#" + item.cl;
        obj.name = item.ln;
        obj.longName = item.kn;
        obj.la = item.la;
        controlPointsArr.forEach((el) => {
          let controlPointsObj = {},
            controlPoints = el.split(" ");

          controlPointsObj.x = controlPoints[0];
          controlPointsObj.y = controlPoints[1];
          newControlPoint.push(controlPointsObj);
        });
        obj.controlPoints = newControlPoint;
        let fx = newControlPoint[0].x,
          fy = newControlPoint[0].y,
          lx = newControlPoint[newControlPoint.length - 1].x,
          ly = newControlPoint[newControlPoint.length - 1].y;

        nodesArr.forEach((item) => {
          if (item.x == fx && item.y == fy) {
            obj.source = item.id;
          }
          if (item.x == lx && item.y == ly) {
            obj.target = item.id;
          }
        });

        if (!obj.source || !obj.target) {
          //高德地图提供数据有些绘图点不与出发点或结束点的位置重合，需要采用此来修正
          nodesArr.forEach((item) => {
            if (Math.abs(item.x - fx) < 10 && Math.abs(item.y - fy) < 10) {
              obj.source = item.id;
            }
            if (Math.abs(item.x - lx) < 10 && Math.abs(item.y - ly) < 10) {
              obj.target = item.id;
            }
          });
        }

        newArr.push(obj);
      });

      return newArr;
    },

    createNodes(arr) {
      let nodeArr = [],
        newArr = [];

      arr.forEach((item) => {
        nodeArr = nodeArr.concat(item.st);
      });
      nodeArr.forEach((item) => {
        let obj = {},
          posi = item.p.split(" "),
          under = item.r.split("|");

        obj.x = posi[0];
        obj.y = posi[1];
        obj.name = item.n;
        obj.id = item.sid;
        obj.lg = item.lg;
        obj.under = under;

        // let transfer = item.r.split("|");
        obj.transfer = item.t != 0 ? true : false;
        newArr.push(obj);
      });
      return newArr;
    },
    setClickNode(val) {
      this.clickNode = val;
    }
  }
};
</script>

<style lang="scss">
.bg {
  margin: 0 auto;
  width: 100vw;
  height: 100vh;
  background: #fffaf0;

  .metro-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 30px;
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
    li {
      height: 30px;
      min-width: 50px;
      padding-left: 6px;
      padding-right: 6px;
      margin: 0;
      text-align: center;
      font-size: 12px;
      color: white;
      line-height: 30px;
      cursor: pointer;
    }
  }
  #container {
    position: absolute;
    overflow: hidden;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    // width: 100vw;
    // height: 100vh;
  }
}
.edgeTip {
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  // width: 50px;
  height: 30px;
  background: white;
  padding: 2px;
  border: 2px solid #eee;
  font-size: 12px;
  border-radius: 6px;
}
.edgeTip div {
  // width: 42px;
  color: white;
  height: 22px;
  opacity: 0.8;
  text-align: center;
  line-height: 22px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 6px;
}
#container .dialog {
  // width: 300px;
  // height: 160px;
  // background-color: white;
  // opacity: 0;
  visibility: hidden !important;
  // z-index: 5;
}
</style>
