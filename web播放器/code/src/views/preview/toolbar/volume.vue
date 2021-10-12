<template>
  <v-popups
    ref="popups"
    class="volume"
    :show-arrow="false"
    :between-space="8"
    :custom-style="{ boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.12)' }"
    position="top-center"
    @after-change="showPanel"
  >
    <div class="volume-panel">
      <i
        :class="[
          'volume-inner-icon',
          volumeValue === 0 ? 'icon-mute' : 'icon-volume'
        ]"
        @click="handleVolumeMute"
      ></i>
      <div class="volume-bar">
        <div ref="barLine" class="volume-bar-inner">
          <div class="click-modal" @click="handleModalClick"></div>
          <div ref="pointer" class="volume-pointer" :style="pointerStyle">
            <div class="volume-pointer-inner"></div>
          </div>
          <div
            class="volume-gray"
            :style="{ width: `${grayBarLineWidth}px` }"
          ></div>
        </div>
      </div>
      <!-- <div class="volume-num">{{ volumeValue }}</div> -->
    </div>
    <template #reference>
      <v-tooltip
        trigger="manual"
        v-model="buttonTooltipShow"
        :between-space="0"
        :enterable="false"
        :content="_('Audio')"
      >
        <span
          class="icon-button-status icon-button-vol-wrapper"
          @mouseenter="showBottonTooltip(true)"
          @mouseleave="showBottonTooltip(false)"
        >
          <i class="icon-volume"></i>
          <i class="icon-arrow-down"></i>
        </span>
      </v-tooltip>
    </template>
  </v-popups>
</template>

<script>
import * as utils from "@/utils/common";
const defaultVolume = 50;
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
      panelShow: false,
      buttonTooltipShow: false,
      isMouseEnter: false,

      volumeValue: this.value,

      barLineWidth: 0, // 音量元素宽度
      grayBarLineWidth: 0 // 灰色区域宽度
    };
  },
  computed: {
    pointerStyle() {
      return {
        left: `${this.barLineWidth - this.grayBarLineWidth}px`
      };
    }
  },
  methods: {
    init() {
      const { width } = this.$refs.barLine.getBoundingClientRect();

      if (!this.barLineWidth) {
        this.barLineWidth = width;
        // this.volumeValue = this.value;
      }

      this.setPointerPosition(this.volumeValue);

      // 元素渲染出来后再绑定事件
      this.handlePointerEvent(this.panelShow);
    },
    setPointerPosition(num) {
      const { barLine } = this.$refs,
        { width } = barLine.getBoundingClientRect(),
        numWidth = (num / 100) * width;

      this.grayBarLineWidth = width - numWidth;
      this.setVolumeValue();
    },
    handlePointerEvent(visible) {
      const { pointer } = this.$refs,
        event = visible ? "on" : "off"; // on的第四个参数意义useCapture，off的第四个参数意义isAnonymous
      let isMouseDown = false;

      utils[event](
        pointer,
        "mousedown",
        () => {
          isMouseDown = true;
          document.body.classList.add("no-select");
        },
        !visible
      );

      utils[event](
        document,
        "mousemove",
        e => {
          if (isMouseDown) {
            this.setBarLineStyle(e.clientX);
          }
        },
        !visible
      );

      utils[event](
        document,
        "mouseup",
        () => {
          if (isMouseDown) {
            isMouseDown = false;
            document.body.classList.remove("no-select");
          }
        },
        !visible
      );
    },
    handleVolumeMute() {
      const volNum = this.volumeValue === 0 ? defaultVolume : 0;

      this.volumeValue = volNum;
      this.setPointerPosition(volNum);
    },
    handleModalClick(e) {
      this.setBarLineStyle(e.clientX);
    },
    setBarLineStyle(clientX) {
      const { barLine } = this.$refs,
        { left: barLineLeft } = barLine.getBoundingClientRect();

      let totalLeft = clientX - barLineLeft; // 本次移动的宽度

      const minLeft = 0,
        // 最小宽度
        maxLeft = this.barLineWidth; // 最大宽度

      if (totalLeft <= minLeft) {
        totalLeft = minLeft;
      } else if (totalLeft >= maxLeft) {
        totalLeft = maxLeft;
      }

      if (this.grayBarLineWidth === maxLeft - totalLeft) {
        // 鼠标按下，未移动位置，不重复设置音量（处理chrome mousedown触发mousemove问题）
        return;
      }
      this.grayBarLineWidth = maxLeft - totalLeft;
      this.setVolumeValue();
    },
    setVolumeValue() {
      const { barLineWidth, grayBarLineWidth } = this;
      let vol = ((barLineWidth - grayBarLineWidth) / barLineWidth) * 100;

      vol = Math.round(vol);

      this.volumeValue = vol;
      this.$emit("change", vol);
    },
    showPanel(visible) {
      this.panelShow = visible;
      if (visible) {
        this.buttonTooltipShow = !visible;
        this.$nextTick(this.init);
      } else {
        this.handlePointerEvent(visible);
        this.showBottonTooltip(this.isMouseEnter);
      }
    },
    showBottonTooltip(show) {
      this.isMouseEnter = show;
      this.buttonTooltipShow = !this.panelShow && show;
    }
  },
  watch: {
    value(newVal) {
      this.volumeValue = newVal;
    }
  }
};
</script>

<style lang="scss">
.volume-panel {
  display: flex;
  align-items: center;

  .volume-inner-icon {
    flex: 1 0 24px;
    margin: 4px 12px 4px 4px;
    font-size: 24px;
    color: $title-color;
    cursor: pointer;
    &:hover {
      color: $main-active-color;
    }
  }

  .volume-bar {
    padding-right: 10px;

    &-inner {
      position: relative;
      width: 110px;
      height: 4px;

      background: linear-gradient(
        90deg,
        lighten($main-active-color, 40%) 0%,
        $main-active-color 100%
      );
      // background: linear-gradient(90deg, #ff801f 0%, #fff5e4 100%);
      border-radius: 4px;

      .click-modal {
        position: absolute;
        top: -100%;
        left: 0;
        padding: 4px 0;
        width: 100%;
        height: 300%;
        z-index: 5;
      }

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
        @include center-circle($pointer-width, true);
        background-color: #fff;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        z-index: 10;
        &-inner {
          $pointer-inner-width: $pointer-width / 2;
          @include center-circle($pointer-inner-width, true);
          background-color: $main-active-color;
        }
      }

      .volume-gray {
        position: absolute;
        top: 0;
        right: 0;
        height: 4px;
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
.icon-button-vol-wrapper {
  display: flex;
  align-items: center;
}
</style>
