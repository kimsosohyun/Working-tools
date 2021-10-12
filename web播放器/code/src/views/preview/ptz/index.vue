<template>
  <div ref="ptzControl" :class="['ptz-control', { collapsed: isCollapsed }]">
    <div class="collapse-btn-wrapper">
      <span
        v-tooltip="{
          position: isCollapsed ? 'top-right' : 'top-center',
          enterable: false,
          betweenSpace: 0,
          whiteSpace: 'nowrap',
          arrowOffset: 0,
          content: isCollapsed ? _('Show PTZ control') : _('Hide PTZ control')
        }"
        class="collapse-btn"
        @click="change(!isCollapsed)"
      >
        <i class="icon-arrow-left"></i>
      </span>
    </div>
    <transition name="fade">
      <div v-show="!isCollapsed" class="ptz-main">
        <div ref="ptzHeader" class="ptz-header">
          <h5 class="ptz-title bold">{{ _("PTZ Control") }}</h5>
        </div>
        <PtzButtons ref="ptzButtons" :window-id="$parent.activeWindowId" />
        <PtzTabs ref="ptzTabs" />
        <section v-show="!ptzAuth" class="disabledd-mask"></section>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import { throttle } from "@/utils/common";
import elementResizeDetectorMaker from "element-resize-detector";
import PtzButtons from "./ptzButtons.vue";
import PtzTabs from "./ptzTabs.vue";
// import { getEntriesByAttr } from "@/utils/dicts";
export default {
  name: "ptzController",
  components: { PtzButtons, PtzTabs },
  provide() {
    return {
      setStartUrl: "/RPC2:ptz.start",
      setStopUrl: "/RPC2:ptz.stop",
      defaultSpeed: this.defaultSpeed,
      speedOption: this.speedOption
    };
  },
  data() {
    this.defaultSpeed = 3;
    this.maxSpeed = 7;
    this.resizeHandler = null;
    return {
      isCollapsed: false,

      erd: null
    };
  },
  computed: {
    ...mapState({
      activeChannel: "activeChannel"
    }),
    ...mapGetters({
      channelConfigs: "channelConfigs"
    }),
    ptzAuth() {
      const channelCfg = this.channelConfigs[this.activeChannel] || {};

      return channelCfg.ptzAuth;
    },
    speedOption() {
      return Array.from(Array(this.maxSpeed), (item, idx) => ({
        value: idx + 1,
        label: idx + 1
      }));
    }
  },
  mounted() {
    this.handleScreenResizeEvent();
  },
  beforeDestroy() {
    this.handleScreenResizeEvent("uninstall");
  },
  methods: {
    ...mapMutations(["setSimpleTableHeight"]),
    change(val) {
      this.isCollapsed = val;
    },
    afterLeave() {
      this.$emit("afterLeave");
    },
    afterEnter() {
      this.$emit("afterEnter");
    },

    handleScreenResizeEvent(event = "listenTo") {
      if (!this.erd) {
        this.erd = elementResizeDetectorMaker();
      }

      const { $el: ptzControl } = this;

      if (!this.resizeHandler) {
        this.resizeHandler = throttle(() => {
          const {
              height: mainHeight,
              top: mainTop
            } = ptzControl.getBoundingClientRect(),
            { top: paneTop } = this.getClientRectByClassName(
              "tab-pane-wrapper"
            );

          this.setSimpleTableHeight(mainHeight - paneTop + mainTop);
        }, 300);
      }

      this.erd[event](ptzControl, this.resizeHandler);
    },
    getClientRectByClassName(className) {
      const eles = document.getElementsByClassName(className),
        result = eles.length ? eles[0].getBoundingClientRect() : {};

      return result;
    }
  }
};
</script>

<style lang="scss">
.ptz-control {
  display: flex;
  transition: all 0.5s;
  overflow: hidden;
  .collapse-btn-wrapper {
    flex: 0 0 12px;

    display: inline-flex;
    align-items: center;
    padding-bottom: 40px;
    width: 12px;
    height: 100%;

    .collapse-btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 56px;
      color: #fff;
      background-color: $main-active-color;
      cursor: pointer;

      .icon-arrow-left {
        font-size: 12px;
        transform: rotate3d(0, 0, 1, 180deg);
      }
    }
  }
  .ptz-main {
    flex: 0 0 256px;

    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    padding: 2px 14px 0;

    .ptz-header {
      padding: 16px 0;
      border-bottom: 1px solid $disabled-border-color;
      .ptz-title {
        padding-left: 2px;
        color: $title-color;
        font-size: 14px;
      }
    }

    .ptz-tabs {
      flex: 1;
    }
  }

  &.collapsed {
    flex-basis: 12px !important;
    .collapse-btn {
      .icon-arrow-left {
        transform: none;
      }
    }
  }
}
</style>
