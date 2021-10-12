<template>
  <v-popups
    ref="popups"
    class="volume"
    :show-arrow="false"
    :custom-style="{ boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.12)' }"
    position="top-center"
    @after-change="visibleChanged"
  >
    <div class="volume-panel-replay">
      <div class="volume-bar">
        <div ref="barLine" class="volume-bar-inner">
          <div ref="pointer" class="volume-pointer">
            <div class="volume-pointer-inner"></div>
          </div>
          <div
            class="volume-gray"
            :style="{ height: `${grayBarLineHeight}px` }"
          ></div>
        </div>
      </div>
      <div class="volume-num">{{ volumeValue }}</div>
    </div>
    <template #reference>
      <i class="icon-volume icon-button-status"></i>
    </template>
  </v-popups>
</template>

<script>
/**
 * todo 初始化音量及样式 done
 * 点击bar直接跳转到对应的音量
 * 传入音量 done
 */
const defaultVolume = 50;
import * as utils from "@/utils/common";
export default {
  name: "volume",
  props: {
    value: {
      type: Number,
      default: defaultVolume
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      volumeValue: this.value,
      pointerR: 12 / 2,
      barLineHeight: 0, // 音量元素高度
      grayBarLineHeight: 0 // 灰色区域高度
    };
  },
  computed: {
    // volumeValue() {
    //   const { barLineHeight, grayBarLineHeight } = this,
    //     result = ((barLineHeight - grayBarLineHeight) / barLineHeight) * 100;
    //   return Math.round(result);
    // }
  },
  methods: {
    initPointerPosition(num) {
      const { pointer, barLine } = this.$refs,
        { height } = barLine.getBoundingClientRect();

      this.barLineHeight = height;
      this.grayBarLineHeight = height * (1 - num / 100);
      pointer.style.top = `${this.grayBarLineHeight - this.pointerR}px`;
    },
    handlePointerEvent(isShow) {
      const { pointer, barLine } = this.$refs,
        event = isShow ? "on" : "off"; // on的第四个参数意义useCapture，off的第四个参数意义isAnonymous
      let isMouseDown = false;

      utils[event](
        barLine,
        "click",
        e => {
          const { top: barLineTop } = barLine.getBoundingClientRect();

          this.grayBarLineHeight = e.clientY - barLineTop;
          pointer.style.top = `${this.grayBarLineHeight - this.pointerR}px`;
          this.setVolumeValue();
        },
        !isShow
      );

      utils[event](
        pointer,
        "mousedown",
        () => {
          isMouseDown = true;
        },
        !isShow
      );

      utils[event](
        document,
        "mousemove",
        e => {
          if (isMouseDown) {
            const {
                top: barLineTop,
                height: barLineHeight
              } = barLine.getBoundingClientRect(),
              pointerStyle = pointer.style;

            let totalTop = e.clientY - barLineTop; // 本次移动的高度

            const minTop = -this.pointerR,
              // 最小高度
              maxTop = barLineHeight + minTop; // 最大高度

            if (totalTop <= minTop) {
              totalTop = minTop;
            } else if (totalTop >= maxTop) {
              totalTop = maxTop;
            }
            pointerStyle.top = `${totalTop}px`;

            this.barLineHeight = barLineHeight;
            this.grayBarLineHeight = totalTop - minTop;
            this.setVolumeValue();
          }
        },
        !isShow
      );

      utils[event](
        document,
        "mouseup",
        () => {
          if (isMouseDown) {
            isMouseDown = false;
          }
        },
        !isShow
      );
    },
    setVolumeValue() {
      const { barLineHeight, grayBarLineHeight } = this,
        result = ((barLineHeight - grayBarLineHeight) / barLineHeight) * 100;

      let vol = Math.round(result);
      this.volumeValue = vol;
      this.$emit("change", vol);
    },
    visibleChanged(isShow) {
      if (isShow) {
        this.$nextTick(() => {
          const volumeValue = this.barLineHeight
            ? this.volumeValue
            : this.value;
          this.initPointerPosition(volumeValue);

          // 元素渲染出来后再绑定事件
          this.handlePointerEvent(isShow);
        });
      } else {
        this.handlePointerEvent(isShow);
      }
    }
  }
};
</script>

<style lang="scss">
.volume-panel-replay {
  .volume-bar {
    padding: 12px 10px 0;

    &-inner {
      position: relative;
      width: 4px;
      height: 110px;
      background: linear-gradient(
        180deg,
        $main-active-color 0%,
        lighten($main-active-color, 40%) 100%
      );
      border-radius: 4px;

      .volume-pointer {
        @mixin center-circle($width, $vertical: false, $horizontal: true) {
          position: absolute;
          @if $vertical {
            top: 50%;
            margin-top: -$width / 2;
          }
          @if $horizontal {
            left: 50%;
            margin-left: -$width / 2;
          }
          width: $width;
          height: $width;
          border-radius: $width / 2;
        }
        $pointer-width: 12px;
        @include center-circle($pointer-width);
        background-color: #fff;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        &-inner {
          $pointer-inner-width: $pointer-width / 2;
          @include center-circle($pointer-inner-width, true);
          background-color: $main-active-color;
        }
      }

      .volume-gray {
        background-color: $disabled-border-color;
        border-radius: 4px;
      }
    }
  }
  .volume-num {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.834); // 字体缩小到10px
    width: 100%;
    height: 22px;
    font-size: 12px;
  }
}
</style>
