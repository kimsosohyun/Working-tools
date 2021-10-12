<template>
  <div class="motion-event">
    <v-row>
      <v-col class="motion-box motion-border" :span="12">
        <v-checkbox-group
          is-select-all
          :select-text="_('Common Linkage')"
          v-model="event.linked"
          :options="eventOptions"
        ></v-checkbox-group>
      </v-col>
      <v-col class="motion-box motion-border" :span="12">
        <v-checkbox-group
          is-select-all
          :select-text="_('Recording Linkage')"
          v-model="event.record"
          :options="channelCheckboxes"
          class="motin-channel"
        ></v-checkbox-group>
      </v-col>
    </v-row>
    <!-- <v-dialog
      v-model="showConfirmDialog"
      :title="_('Tips')"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      :confirm-button-text="_('Enable')"
      cancel-button-text="暂不开启"
      @confirm="confirm"
    >
      <div>建议同步开启人形侦测以减少非人类目标触发的报警推送</div>
    </v-dialog> -->
  </div>
</template>

<script>
const eventType = {
  0: "tipEnable",
  1: "mailEnable",
  2: "cloudPushEnabled"
  // 3: "voiceAlarm",
  // 4: "lightAlarm"
};
export default {
  name: "motion-event",
  props: {
    channelOptions: Array,
    event: {
      type: Object,
      default() {
        return {
          linked: [],
          record: []
        };
      }
    }
    // humanDetectEnable: Boolean
  },
  data() {
    return {
      eventOptions: [
        { label: _("Monitor single-screen display"), value: 0 },
        { label: _("Send Email"), value: 1 },
        { label: _("Message Notification"), value: 2 }
        // { label: _("Audio Alarm (Camera)"), value: 3 },
        // { label: _("Light Alarm (Camera)"), value: 4 }
      ]
      // showConfirmDialog: false
    };
  },

  computed: {
    channelCheckboxes() {
      return this.channelOptions.map(({ value }) => ({
        label: `D${value + 1}`,
        value
      }));
    }
  },

  methods: {
    formatGetData(data) {
      let res = [];
      for (let key in eventType) {
        if (data[eventType[key]]) {
          res.push(+key);
        }
      }
      data["linked"] = res;
      return data;
    },
    formatSetData(data) {
      let res = { record: data.record };
      let linked = data.linked;

      for (let key in eventType) {
        res[eventType[key]] = linked.indexOf(+key) > -1;
      }
      return res;
    }
    //勾选消息推送时需要弹窗提示
    // eventChange(val) {
    //   if (val.includes(2) && !this.humanDetectEnable) {
    //     this.showConfirmDialog = true;
    //   }
    // },
    // confirm() {
    //   this.$emit("open-enable");
    //   this.showConfirmDialog = false;
    // }
  }
};
</script>

<style lang="scss">
.motion-event {
  width: 542px;
  border: 1px solid #e9e9e9;
  .v-checkbox-group__item,
  .v-checkbox-group {
    width: 100%;
  }
  .motion-box {
    padding-left: 10px;
    padding-right: 10px;
  }

  .motion-border {
    padding-bottom: 12px !important;
    &:first-child {
      border-right: 1px solid #e9e9e9;
    }
    &:last-child {
      border-left: 1px solid #e9e9e9;
      margin-left: -1px;
    }
  }

  .v-checkbox-group__item:first-child {
    line-height: 48px;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 12px;
  }

  .v-checkbox-group__item {
    padding-left: 24px;
    .v-checkbox__item {
      margin: 0;
    }
  }
  .v-checkbox-group__item:not(:first-child) {
    margin: 7px 0;
  }
  .motin-channel {
    .v-checkbox-group__item:not(:first-child) {
      width: 34%;
    }
  }
}
</style>
