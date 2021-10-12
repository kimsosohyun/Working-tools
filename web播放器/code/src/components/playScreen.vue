<template>
  <div class="screen-wrapper">
    <!-- 1/4/9/16通道 start -->
    <template v-if="channelNumsSqrt % 1 === 0">
      <div
        v-for="item in _indexList"
        :key="item"
        :class="['window-screen']"
        :style="{
          width: `${100 / channelNumsSqrt}%`,
          height: `${100 / channelNumsSqrt}%`
        }"
        @click="handleClick(item)"
        @dblclick="handleDblclick"
      >
        <Player ref="players" :window-id="item" />
        <span v-show="active === item" class="active-window"></span>
      </div>
    </template>
    <!-- 1/4/9/16通道 end -->

    <template v-else><!-- 八通道画面，待实现 --></template>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// import { throttle } from "@/utils/common";
import elementResizeDetectorMaker from "element-resize-detector";
import Player from "@/components/player";
export default {
  name: "playScreen",
  components: {
    Player
  },
  props: {
    active: Number, // 聚焦窗口id
    count: {
      // 窗口数量
      type: Number,
      default: 4
    },
    ratio: {
      type: String,
      default: "full"
    },
    indexList: Array // 窗口索引序号
  },
  data() {
    this.resizeHandlers = {};
    return {
      erd: null // 监听dom事件方法
    };
  },
  computed: {
    _indexList() {
      const result = Array.from(Array(this.count), (item, idx) => idx);
      return this.indexList || result;
    },
    channelNumsSqrt() {
      return Math.sqrt(this.count);
    }
  },
  mounted() {
    this.setToVuex();
    this.handleScreenResizeEvent();
  },
  beforeDestroy() {
    this.handleScreenResizeEvent("uninstall");
  },
  methods: {
    ...mapMutations(["setPlayers"]),
    handleScreenResizeEvent(event = "listenTo") {
      if (!this.erd) {
        this.erd = elementResizeDetectorMaker();
      }

      this.$refs.players.forEach(({ $el }) => {
        if (!this.resizeHandlers[$el]) {
          // this.resizeHandlers[$el] = throttle(() => {
          //   this.switchAspectRatio(this.ratio);
          // }, 300);
          this.resizeHandlers[$el] = () => {
            this.switchAspectRatio(this.ratio);
          };
        }
        this.erd[event]($el.parentNode, this.resizeHandlers[$el]);
      });
    },
    setToVuex() {
      this.setPlayers(this.$refs.players);
    },
    handleClick(windowId) {
      this.$emit("click", windowId);
    },
    handleDblclick(e) {
      this.$emit("dblclick", e);
    },

    switchAspectRatio(ratioValue) {
      this.$refs.players.forEach(player =>
        this.setAspectRatio(player, ratioValue)
      );
    },
    /**
     * 播放画面设置比例
     */
    setAspectRatio(playerVm, ratioValue) {
      let keep = "height", // 默认保持100%的属性
        modify = "width"; // 默认需要修改的属性

      const [width, height] = ratioValue.split(":");
      let ratioObj = { width, height };

      const {
          resolutionW,
          resolutionH,
          $el: playerDom // 最终需要改变的dom元素
        } = playerVm,
        resolutionObj = { width: resolutionW, height: resolutionH }, // ratioValue = 1:1, 视频流的分辨率
        playerClientRect = playerDom.parentNode.getBoundingClientRect();

      const styleObj = {
        // 最终width、height属性值,默认为ratioValue="full"的参数值
        [keep]: "100%",
        [modify]: "100%"
      };

      if (ratioValue !== "full") {
        if (ratioValue === "1:1") {
          // 设置视频流自身的分辨率为需要修改的比例值
          if (
            playerClientRect[modify] >= resolutionObj[modify] &&
            playerClientRect[keep] >= resolutionObj[keep]
          ) {
            // 分辨率宽高都在窗口宽高之内，取自身分辨率宽高
            playerDom.style[modify] = `${resolutionObj[modify]}px`;
            playerDom.style[keep] = `${resolutionObj[keep]}px`;
            return;
          } else {
            ratioObj = resolutionObj;
          }
        }

        if (
          ratioObj[modify] / ratioObj[keep] >
          playerClientRect[modify] / playerClientRect[keep]
        ) {
          /**
           * 16:9,4:3
           * 修改的比例与当前比例对比
           * 前者比后者大，按照比例修改当前height属性，反之修改当前width属性
           */
          [modify, keep] = [keep, modify];
        }

        styleObj[modify] = `${(ratioObj[modify] / ratioObj[keep]) *
          playerClientRect[keep]}px`;
      }

      playerDom.style[modify] = styleObj[modify];
      playerDom.style[keep] = styleObj[keep];
    }
  },
  watch: {
    count() {
      this.$nextTick(() => {
        this.setToVuex();
      });
    },
    indexList() {
      this.handleScreenResizeEvent("uninstall");
      this.$nextTick(() => {
        this.handleScreenResizeEvent();
      });
    },
    ratio(newVal) {
      this.switchAspectRatio(newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.screen-wrapper {
  width: 100%;
  height: 100%;
  font-size: 0;
  @include clearfix;
  .window-screen {
    float: left;
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #1b1d21;
    border: 1px solid $info-color;
    // cursor: zoom-in;

    .active-window {
      $border-width: 2px;
      $offset: -$border-width/2;
      position: absolute;
      top: $offset;
      right: $offset;
      bottom: $offset;
      left: $offset;
      border: $border-width solid $main-active-color;
    }
  }
}
</style>
