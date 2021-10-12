<template>
  <div class="motion-set">
    <div class="motion-set-screen">
      <grid-draw
        ref="gridDraw"
        :region="set.region"
        @change-region="changeRegion"
      />
      <singlePlayer :currentChannel="currentChannel" />
      <div class="screen-btns">
        <v-button type="info" size="S" @click="fullScreen">{{
          _("Fullscreen")
        }}</v-button>
        <v-button type="info" size="S" @click="clearAll">{{
          _("Clear All")
        }}</v-button>
      </div>
    </div>
    <div class="motion-set-form">
      <v-form :model="set">
        <!-- <v-form-item>
          <template #label>
            <span>{{ _("Smart Detection") }}</span>
            <v-popover
              class="motion-set-help"
              :width="403"
              trigger="hover"
              position="right-top"
              :title="_('Smart Detection')"
            >
              <p>
                {{
                  _(
                    "An event will be triggered only when specific objects are detected in the area"
                  )
                }}
              </p>
              <template #reference>
                <i class="icon-help"></i>
              </template>
            </v-popover>
          </template>
          <v-checkbox v-model="set.humanDetectEnable" @change="enableChange">{{
            _("S-motion Detection")
          }}</v-checkbox>
        </v-form-item> -->
        <v-form-item :label="_('Sensitivity')">
          <v-slider
            show-input
            :min="0"
            :max="100"
            v-model="set.sensitive"
          ></v-slider>
          <span class="sensitiveTip" v-show="showSensitiveTip"
            >灵敏度设置为0，将自动关闭移动侦测功能</span
          >
        </v-form-item>
      </v-form>
    </div>
    <!-- <v-dialog
      v-model="showConfirmDialog"
      :title="_('Tips')"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      @after-close="close"
      @confirm="confirm"
    >
      <div>
        {{
          _(
            "Non-human targets can also trigger alarms when human detection is disabled. Continue?"
          )
        }}
      </div>
    </v-dialog> -->
  </div>
</template>

<script>
import singlePlayer from "@/components/singlePlayer";
import gridDraw from "@/components/gridDraw";
export default {
  name: "motionSet",
  props: {
    set: {
      type: Object,
      default() {
        return {
          enable: true,
          // humanDetectEnable: true,
          sensitive: 0,
          region: []
        };
      }
    },
    currentChannel: {
      type: [String, Number]
    },
    showSensitiveTip: Boolean
  },
  components: {
    singlePlayer,
    gridDraw
  },
  data() {
    return {
      showConfirmDialog: false
    };
  },
  methods: {
    // enableChange(val) {
    //   if (!val) {
    //     this.showConfirmDialog = true;
    //   }
    // },
    // confirm() {
    //   this.showConfirmDialog = false;
    // },
    // close() {
    //   this.set.humanDetectEnable = true;
    // },
    fullScreen() {
      this.$refs.gridDraw.fullScreen();
    },
    clearAll() {
      this.$refs.gridDraw.clearAll();
    },
    changeRegion(region) {
      this.set.region = region;
    }
    //todo: svgDraw可通过调用提交函数的方式更新画图数据
    // 1-切换通道时更新数据
    // 2-点击保存时更新数据
    // updateDraw() {
    //   this.set.region = this.$refs.svgDraw.submit();
    // }
  }
};
</script>

<style lang="scss">
.motion-set {
  &-screen {
    position: relative;
    margin-top: 13px;
    width: 476px;
    height: 268px;
    .screen-btns {
      float: right;
      margin-top: 8px;
    }
  }
  &-form {
    margin-top: 42px;
    .v-form-item:last-child {
      margin-bottom: 8px;
    }
  }
  &-help {
    margin-left: 8px;
    font-size: 0;
    vertical-align: top;
    cursor: pointer;
    .icon-help {
      vertical-align: middle;
      font-size: 16px;
      color: $light-color;
    }
  }
  .v-slider {
    width: 300px;
  }
  .v-slider__number {
    width: 56px;
  }
  .sensitiveTip {
    position: absolute;
    bottom: -18px;
    left: -6px;
    font-size: 14px;
    color: #f7421e;
    line-height: 14px;
  }
}
</style>
