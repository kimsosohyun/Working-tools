<template>
  <div class="area-enlarge">
    <i
      v-tooltip="{
        enterable: false,
        betweenSpace: 0,
        content: isEnlargeEnabled ? _('Stop zooming in') : _('Area zoom-in')
      }"
      :class="[
        'icon-enlarge',
        'icon-button-status',
        { active: isEnlargeEnabled, disabled }
      ]"
      @click="handleEnlarge"
    ></i>
    <DashRectDraw
      ref="dashRectDraw"
      :is-show="isEnlargeEnabled"
      :can-draw="!disabled && !isEnlarged"
      :style="operateAreaStyle"
      @mousedown="dragCanvas"
      @after-drawed="enlargeArea"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DashRectDraw from "@/components/dashRectDraw";
import { on, off } from "@/utils/common";
export default {
  name: "areaEnlarge",
  components: {
    DashRectDraw
  },
  props: {
    windowId: Number,
    ratio: String
  },
  data() {
    this.listener = { on, off };
    this.lastClientX = null;
    this.lastClientY = null;
    return {
      grabCursor: "grab",
      isDragging: false
    };
  },
  computed: {
    ...mapGetters({
      configsList: "channelCfgList"
    }),
    player() {
      const { $players } = this.$store.state;
      return $players.find(({ windowId }) => windowId === this.windowId) || {};
    },
    channelConfig() {
      return this.configsList.find(
        ({ windowId }) => windowId === this.windowId
      );
    },
    isEnlarged() {
      return this.player.isEnlarged;
    },
    isEnlargeEnabled() {
      return this.player.isEnlargeEnabled;
    },
    disabled() {
      // 以下两个条件任何一个不满足，则“区域放大”功能不可使用
      return (
        !this.channelConfig /* 播放器没有绑定通道 */ ||
        this.player.status !== "playing" /* 视频没有在播放 */
      );
    },
    operateAreaStyle() {
      const { isEnlarged, grabCursor } = this;

      return { cursor: isEnlarged ? grabCursor : "auto" };
    }
  },
  mounted() {
    this.handleContextmenu("on");
    this.handleDragEvent("on");
  },
  beforeDestroy() {
    this.handleContextmenu("off");
    this.handleDragEvent("off");
  },
  methods: {
    /**
     * 放大所框选的区域
     */
    enlargeArea([[[ltX, ltY], , [rbX, rbY]]]) {
      const { player } = this,
        {
          $el,
          $refs: { canvas }
        } = player,
        canvasStyle = canvas.style,
        { width, height } = $el.getBoundingClientRect();

      //   所绘制的矩形的宽
      let rectWidth = (rbX - ltX) * width,
        // 所绘制的矩形的高
        rectHeight = (rbY - ltY) * height;

      if (height / rectHeight > width / rectWidth) {
        // 绘画矩形比例以宽作为标准，调整Y轴坐标值
        [ltY, rbY] = this.adjustAxisByRatio(ltY, rbY, rectWidth, width, height);
        // 更新绘画区域的高度
        rectHeight = (rbY - ltY) * height;
      } else {
        // 绘画矩形比例以高作为标准，调整Y轴坐标值
        [ltX, rbX] = this.adjustAxisByRatio(
          ltX,
          rbX,
          rectHeight,
          height,
          width
        );
        // 更新绘画区域的宽度
        rectWidth = (rbX - ltX) * width;
      }

      // 视频画面放大后的宽
      const newWidth = width * (width / rectWidth),
        // 视频画面放大后的高
        newHeight = height * (height / rectHeight),
        // 所绘制的矩形中点按比例放大后的位置
        rectCenterX = ((rbX + ltX) / 2) * newWidth,
        rectCenterY = ((rbY + ltY) / 2) * newHeight;

      canvasStyle.width = `${newWidth}px`; // 放大canvas
      canvasStyle.height = `${newHeight}px`;
      canvasStyle.top = `-${rectCenterY - height / 2}px`; // 移动至所放大的位置
      canvasStyle.left = `-${rectCenterX - width / 2}px`;

      player.isEnlarged = true;
    },
    /**
     * 根据画面比例调整绘制矩形的坐标轴
     * @param {Number} ltAxis 绘画矩形的左上角坐标的X(或Y)轴，值为原始尺寸的百分比
     * @param {Number} rbAxis 绘画矩形的左上角坐标的X(或Y)轴，与ltAxis对应，百分比
     * @param {Number} referSide 绘画矩形参考的边(宽或高)，该边长不变，单位：px
     * @param {Number} referOriginSide 参考边的原始尺寸边长, 单位：px
     * @param {Number} originOtherSide 原始尺寸另一个边长, 单位：px
     */
    adjustAxisByRatio(
      ltAxis,
      rbAxis,
      referSide,
      referOriginSide,
      originOtherSide
    ) {
      // 需要调整的边，宽 or 高
      let adjustSide = referSide * (originOtherSide / referOriginSide);

      // 边需要扩展的大小（比例）
      adjustSide = adjustSide / originOtherSide - (rbAxis - ltAxis);

      // 两个方向分别需要扩展的大小（比例）
      adjustSide = adjustSide / 2;

      // 根据按比例缩小后的长度调整X/Y轴，默认X/Y分别扩展相同的距离
      ltAxis = ltAxis - adjustSide;
      rbAxis = rbAxis + adjustSide;

      if (ltAxis < 0) {
        // 如果左/上边的X/Y轴位置小于0，将小于0的坐标添加到右/下边
        rbAxis += 0 - ltAxis;
        ltAxis = 0;
      }

      if (rbAxis > 1) {
        // 如果右/下边的X/Y轴位置大于1，将大于1的坐标添加到左/上边
        ltAxis -= rbAxis - 1;
        rbAxis = 1;
      }

      return [ltAxis, rbAxis];
    },
    /**
     * 绑定/解绑鼠标右键事件
     */
    handleContextmenu(event) {
      this.listener[event](
        /* this.$refs.operateAreaDom, */
        this.$refs.dashRectDraw.$el,
        "contextmenu",
        () => {
          const { isEnlarged, player } = this;
          if (isEnlarged) {
            // 已经放大了画面，右键点击则重置画面样式
            player.resetCanvasStyle();

            player.isEnlarged = !isEnlarged;
          }
        },
        event === "off"
      );
    },
    /**
     * 使能“区域放大”功能
     */
    handleEnlarge() {
      if (this.disabled) {
        // 按钮禁用状态，不处理点击事件
        return;
      }

      const player = this.player,
        isEnlargeEnabled = !this.isEnlargeEnabled;

      if (!isEnlargeEnabled) {
        // 关闭使能，放大标识、画面样式重置
        player.isEnlarged = isEnlargeEnabled;
        player.resetCanvasStyle();
      }
      player.isEnlargeEnabled = isEnlargeEnabled;

      this.handleRectDraw();
    },
    /**
     * 添加/移除“绘制dom”元素
     */
    handleRectDraw() {
      const {
          player,
          $refs: {
            dashRectDraw: { $el: operateAreaDom }
          }
        } = this,
        oper = player.isEnlargeEnabled ? "append" : "remove";

      try {
        // 新增/移除“绘制dom”元素
        player.$el[`${oper}Child`](operateAreaDom);
      } catch (e) {
        /* 容错处理 */
      }
    },
    /**
     * 拖拽画面
     * @param {Object} e - 对象
     */
    dragCanvas({ button, clientX, clientY }) {
      // 不是鼠标左键拖拽，不执行
      if (button !== 0) return;
      this.isDragging = true;
      this.grabCursor = "grabbing";
      this.lastClientX = clientX;
      this.lastClientY = clientY;
      document.body.classList.add("no-select");
    },
    /**
     * 监听/解绑拖拽事件
     */
    handleDragEvent(event) {
      this.listener[event](
        document,
        "mousemove",
        ({ clientX, clientY }) => {
          if (!this.isDragging) {
            // 不是拖拽模式，不执行后续代码
            return;
          }

          const {
              player: {
                $refs: { canvas }
              },
              $refs: {
                dashRectDraw: { $el: operateAreaDom }
              }
            } = this,
            canvasStyle = canvas.style,
            {
              width: canvasWidth, // 放大后的画面大小
              height: canvasHeight
            } = canvas.getBoundingClientRect(),
            {
              width: areaWidth, // 能显示画面的区域大小
              height: areaHeight
            } = operateAreaDom.getBoundingClientRect();

          // 获取拖拽后的left/top
          let left = canvas.offsetLeft + clientX - this.lastClientX,
            top = canvas.offsetTop + clientY - this.lastClientY;

          if (left > 0) {
            // 画面拖动到最左，不能继续拖动
            left = 0;
          } else if (left < areaWidth - canvasWidth) {
            // 画面拖动到最右，不能继续拖动
            left = areaWidth - canvasWidth;
          }

          if (top > 0) {
            // 画面拖动到最上，不能继续拖动
            top = 0;
          } else if (top < areaHeight - canvasHeight) {
            // 画面拖动到最下，不能继续拖动
            top = areaHeight - canvasHeight;
          }

          canvasStyle.top = `${top}px`;
          canvasStyle.left = `${left}px`;
          document.body.style.cursor = "grabbing";

          // 保存本次移动位置
          this.lastClientX = clientX;
          this.lastClientY = clientY;
        },
        event === "off"
      );
      this.listener[event](
        document,
        "mouseup",
        () => {
          if (!this.isDragging) {
            // 不是拖拽模式，不执行后续代码
            return;
          }
          const bodyDom = document.body;
          this.isDragging = false;
          this.grabCursor = "grab";
          bodyDom.style.cursor = "auto";
          bodyDom.classList.remove("no-select");
        },
        event === "off"
      );
    }
  },
  watch: {
    windowId() {
      this.handleRectDraw();
    },
    disabled(newVal) {
      // disabled为true为停止播放状态或3d定位开启，需要移除rect画布
      newVal && this.handleRectDraw("remove", !newVal);
    },
    ["channelConfig.is3dOn"](newVal) {
      if (newVal && this.isEnlargeEnabled) {
        this.handleEnlarge();
      }
    },
    ratio() {
      if (this.isEnlargeEnabled) {
        this.handleEnlarge();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
