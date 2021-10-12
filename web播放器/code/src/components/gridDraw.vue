<template>
  <ul class="map"></ul>
</template>

<script>
import { on, off } from "@/utils/common.js";
export default {
  name: "gridDraw",
  data() {
    return {
      map: "",
      gridArr: [],
      row: 18,
      col: 22,
      gridW: 0,
      gridH: 0,
      cw: 0,
      ch: 0
    };
  },
  watch: {
    region(newVal) {
      this.gridArr = newVal;
      this.createGrid();
    }
  },
  props: {
    region: Array
  },
  mounted() {
    this.map = document.querySelector(".map");
    this.cw = this.map.offsetWidth;
    this.ch = this.map.offsetHeight;
    this.createArr();
    this.createGrid();
    on(this.map, "mousedown", this.mousedown);
  },
  methods: {
    /**
     * 生成行和列的二维数组
     * @param {Number} num 默认值为0，产生全0的二维数组
     */
    createArr(num = 0) {
      const { row, col, gridArr } = this;

      for (let i = 0; i < row; i++) {
        gridArr.push([]); //有多少行就添加多少个小数组，小数组个数代表行数
        for (let j = 0; j < col; j++) {
          gridArr[i].push(num); //有多少列就向小数组中添加多少个标识符，一个小数组中有多少个标识符代表列数
        }
      }
    },
    /**
     * 构造网格
     */
    createGrid() {
      const { gridArr, map, row, col, cw, ch } = this;

      this.gridW = cw / col;
      this.gridH = ch / row;
      const { gridW, gridH } = this;

      map.innerHTML = "";
      for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
          const li = document.createElement("li");
          li.style.left = j * gridW + "px";
          li.style.top = i * gridH + "px";
          li.style.width = gridW + 1 + "px";
          li.style.height = gridH + 1 + "px";
          if (gridArr[i][j] === 0) {
            li.style.background = "transparent";
            li.style.border = "none";
            // li.style.boxShadow = "0.5px 0.5px transparent,0.5px 0.5px transparent inset";
          }
          this.map.appendChild(li);
        }
      }
    },
    mousedown(e) {
      const { map, cw, ch } = this,
        cl = map.getBoundingClientRect().left,
        ct = map.getBoundingClientRect().top,
        event = window.event || e,
        startX = event.clientX - cl,
        startY = event.clientY - ct,
        vm = this;

      document.body.classList.add("no-select");
      if (event.button !== 0) {
        return;
      }
      const startRowNum = this.checkGrid(startX, startY).rowNum,
        startColNum = this.checkGrid(startX, startY).colNum,
        //如果绘制的起点是已绘制的区域内是删除否则是绘制
        drawNum = vm.gridArr[startRowNum][startColNum] === 1 ? 0 : 1;

      on(document, "mousemove", mousemove);
      function mousemove(e) {
        //todo: 正向拖动后反向拖动可收回选中区域
        // vm.gridArr = clone(gridArr);
        // vm.createGrid();

        const event = window.event || e;
        let moveX = event.clientX - cl,
          moveY = event.clientY - ct;

        if (moveX > cw) {
          moveX = cw;
        }
        if (moveY > ch) {
          moveY = ch;
        }
        if (moveX < 0) {
          moveX = 0;
        }
        if (moveY < 0) {
          moveY = 0;
        }

        const moveRowNum = vm.checkGrid(moveX, moveY).rowNum,
          moveColNum = vm.checkGrid(moveX, moveY).colNum,
          minRowNum = Math.min(moveRowNum, startRowNum),
          minColNum = Math.min(moveColNum, startColNum),
          maxRowNum = Math.max(moveRowNum, startRowNum),
          maxColNum = Math.max(moveColNum, startColNum);

        for (let i = minRowNum; i <= maxRowNum; i++) {
          for (let j = minColNum; j <= maxColNum; j++) {
            vm.gridArr[i][j] = drawNum;
          }
        }
        vm.createGrid();
      }
      on(document, "mouseup", mouseup);
      function mouseup() {
        off(document, "mousemove", mousemove);
        off(document, "mouseup", mouseup);
        document.body.classList.remove("no-select");
        vm.$emit("change-region", vm.gridArr);
      }
    },
    /**
     * 确定所在行和所在列
     * @param {Number} x -落点距画布左上角的横向距离
     * @param {Number} y -落点距画布右上角的纵向距离
     * @return {Number} rowNum -行数
     * @return {Number} colNum -列数
     */
    checkGrid(x, y) {
      const { gridW, gridH } = this,
        colNum =
          Math.ceil(x / gridW) > 0
            ? Math.ceil(x / gridW) - 1
            : Math.ceil(x / gridW),
        rowNum =
          Math.ceil(y / gridH) > 0
            ? Math.ceil(y / gridH) - 1
            : Math.ceil(y / gridH);

      return {
        rowNum,
        colNum
      };
    },
    clearAll() {
      this.gridArr = [];
      this.createArr();
      this.createGrid();
      this.$emit("change-region", this.gridArr);
    },
    fullScreen() {
      this.gridArr = [];
      this.createArr(1);
      this.createGrid();
      this.$emit("change-region", this.gridArr);
    }
  }
};
</script>

<style lang="scss">
.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: url("~@/assets/cursor/rect.cur") 12 12, default;
  li {
    position: absolute;
    transform-origin: 0 0;
    box-sizing: border-box;
    background: rgba(255, 128, 31, 0.3);
    border: 1px solid $main-active-color;
    // transform: scale(.5);
    // box-shadow: 0.5px 0.5px $main-active-color, 0.5px 0.5px $main-active-color inset;
  }
}
</style>
