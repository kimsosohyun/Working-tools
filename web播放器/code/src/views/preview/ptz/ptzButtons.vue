<template>
  <div class="ptz-buttons">
    <div class="ptz-directions">
      <i
        v-for="item in ptzDirections"
        :key="item.id"
        :class="['icon-button-status', `icon-direction-${item.icon}`]"
        @mousedown="handleMousedown(item)"
      ></i>
    </div>
    <div class="ptz-args">
      <i
        v-for="item in ptzArgs"
        :key="item.id"
        v-tooltip="{
          enterable: false,
          betweenSpace: 4,
          content: item.title
        }"
        :class="['icon-button-status', `${item.icon}`]"
        @mousedown="handleMousedown(item)"
      ></i>
    </div>
    <div class="ptz-bottom-buttons">
      <div class="ptz-speed">
        <label class="speed-title">{{ _("g#Imr#Speed") }}</label>
        <v-select
          class="speed-select"
          v-model="speedValue"
          :options="speedOption"
        ></v-select>
      </div>

      <!-- 3d定位web已实现，n6p隐藏该功能 -->
      <div v-if="show3dPosition" class="ptz-3d">
        <i
          v-tooltip="{
            enterable: false,
            betweenSpace: 4,
            content: _('3D Positioning')
          }"
          class="icon-button-status icon-3d"
          @click="handle3dPosition"
        ></i>
        <DashRectDraw
          ref="dashRectDraw"
          :is-show="!disabled3d && is3dOn"
          :can-draw="true"
          @after-drawed="set3dPosition"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import { getEntriesByAttr } from "@/utils/dicts";
import { on, off } from "@/utils/common";
import DashRectDraw from "@/components/dashRectDraw";
export default {
  name: "ptzButtons",
  props: {
    windowId: Number
  },
  inject: ["setStartUrl", "setStopUrl", "defaultSpeed", "speedOption"],
  components: {
    DashRectDraw
  },
  data() {
    this.listener = { on, off };
    this.modelName = "PREVIEW";
    this.show3dPosition = false;
    return {
      autoScanCfgs: {},

      speedValue: this.defaultSpeed,
      reqData: {}
    };
  },
  computed: {
    ...mapState({
      activeChannel: "activeChannel",
      $players: "$players"
    }),
    ...mapGetters({
      channelConfigs: "channelConfigs"
    }),
    player() {
      return (
        this.$players.find(({ windowId }) => windowId === this.windowId) || {}
      );
    },
    channelConfig() {
      return this.channelConfigs[this.activeChannel] || {};
    },
    is3dOn() {
      return this.channelConfig.is3dOn;
    },
    ptzDirections() {
      return getEntriesByAttr("ptzDirections", this.modelName);
    },
    ptzArgs() {
      return getEntriesByAttr("ptzArgs", this.modelName);
    },
    mouseupCodes() {
      return [
        ...this.ptzDirections.map(({ code }) => code),
        ...this.ptzArgs.map(({ code }) => code)
      ];
    },
    disabled3d() {
      // 以下三个条件任何一个不满足，则“3d定位”功能不可使用
      return (
        this.channelConfig.windowId !==
          this.windowId /* 播放器没有绑定通道 */ ||
        // this.player.isEnlargeEnabled /* “区域放大”已开启 */ ||
        this.player.status !== "playing" /* 视频没有在播放 */
      );
    }
  },
  mounted() {
    this.documentMouseup("on");
  },
  beforeDestroy() {
    this.documentMouseup("off");
  },
  methods: {
    ...mapMutations(["setCustomConfigs"]),
    documentMouseup(event) {
      this.listener[event](
        document,
        "mouseup",
        () => {
          const { reqData, mouseupCodes } = this,
            { code } = reqData;

          if (!mouseupCodes.includes(code)) {
            // 点击的按钮不触发mouseup事件，后续代码不执行
            return;
          }
          this.reqData = {}; // 执行完成一次操作，清空req数据

          if (typeof code !== "string") {
            // 自动巡航按钮(方向中间按钮)特殊处理
            const idx = this.getAutoScanCode();
            reqData.code = code[idx];
            return this.ptzStart(reqData);
          }

          this.ptzStop(reqData);
        },
        event === "off"
      );
    },
    handleMousedown({ code }) {
      const req = {
        code,
        channel: this.activeChannel,
        arg1: this.speedValue
      };
      this.reqData = req;

      if (typeof code !== "string") {
        // 自动巡航按钮(方向中间按钮)在mouseup特殊处理
        return;
      }

      this.ptzStart(req);
    },
    getAutoScanCode() {
      const { autoScanCfgs, activeChannel } = this;

      let curCfg = autoScanCfgs[activeChannel],
        code = 0;

      if (!curCfg) {
        curCfg = autoScanCfgs[activeChannel] = {
          autoScan: code
        };
      }
      code = +!curCfg.autoScan;
      curCfg.autoScan = code;

      return code;
    },
    handle3dPosition() {
      if (this.disabled3d) {
        // 按钮禁用状态，不处理点击事件
        return;
      }

      const { activeChannel, is3dOn } = this;

      this.setCustomConfigs({
        channel: activeChannel,
        configs: { is3dOn: !is3dOn }
      });

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
          },
          is3dOn
        } = this,
        oper = is3dOn ? "append" : "remove";

      try {
        // 新增/移除“绘制dom”元素
        player.$el[`${oper}Child`](operateAreaDom);
      } catch (e) {
        /* 容错处理 */
      }
    },
    set3dPosition([[[ltX, ltY], , [rbX, rbY]]]) {
      const reqData = {
        channel: this.activeChannel,
        code: "MoveDirectly",
        arg1: (rbX + ltX) / 2, // 画框中心点X轴坐标比例
        arg2: (rbY + ltY) / 2, // 画框中心点Y轴坐标比例
        arg3: (rbY - ltY) * (rbX - ltX) // 面积占比
      };

      this.ptzStart(reqData);
    },
    async ptzStart(reqData) {
      let result = await this.$axiosPost(this.setStartUrl, reqData);
      result = result.getResult();

      if (!result) {
        this.$message.error(_("PTZ does not support this function"));
      }
    },
    async ptzStop(reqData) {
      await this.$axiosPost(this.setStopUrl, reqData);
      // let result = await this.$axiosPost(this.setStopUrl, reqData);
      // result = result.getResult();

      // if (!result) {
      //   this.$message.error("云台不支持此功能");
      // }
    }
  },
  watch: {
    windowId() {
      if (this.show3dPosition) {
        this.handleRectDraw();
      }
    },
    ["player.isEnlargeEnabled"](newVal) {
      if (newVal && this.is3dOn) {
        this.handle3dPosition();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ptz-buttons {
  padding: 16px 10px;
  .icon-button-status {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    font-size: 24px;
    border-width: 1px;
    border-style: solid;
    border-radius: 1px;
  }
  .ptz-directions {
    display: inline-flex;
    flex-flow: wrap;
    justify-content: space-between;
    width: 118px;
    height: 120px;
  }
  .ptz-args {
    display: inline-flex;
    flex-flow: wrap;
    margin-left: 14px;
    width: 76px;
    height: 120px;
    .icon-button-status {
      &:hover,
      &:active {
        z-index: 1;
      }
      &:nth-of-type(2n) {
        margin-left: -1px;
      }
    }
  }

  .ptz-bottom-buttons {
    display: inline-flex;
    align-items: center;
    margin-top: 14px;
  }

  .ptz-speed {
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    width: 118px;
    .speed-title {
      margin-right: 8px;
      color: $title-color;
    }
    .speed-select {
      width: 54px;
    }
  }

  .ptz-3d {
    display: inline-flex;
    margin-left: 14px;
    .icon-button-status {
      width: 76px;
    }
  }
}
</style>
