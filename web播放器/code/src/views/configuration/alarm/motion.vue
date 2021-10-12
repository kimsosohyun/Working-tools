<template>
  <main-content class="motion" :title="_('Motion Detection')">
    <better-form
      ref="motionForm"
      :model="formData"
      @submit="submitData"
      :btns="['submit', 'sync']"
      @sync="showSync"
      :disableBtns="formData.ability ? [] : ['submit', 'sync']"
    >
      <v-form-item :label="_('Channel')" prop="channel">
        <v-select
          v-model="formData.channel"
          :options="channelOptions"
        ></v-select>
      </v-form-item>
      <v-form-item :label="_('Motion Detection')" prop="enable">
        <v-switch
          v-model="formData.detectSettings.enable"
          :disabled="!formData.ability"
          @change="changeSensitive"
        ></v-switch>
      </v-form-item>

      <v-form-item :is-no-label="true" :required="false">
        <v-tabs v-model="type" :lazy="false">
          <v-tab-pane :label="_('Detection Settings')" value="1">
            <motion-set
              ref="motionSet"
              :set="formData.detectSettings"
              :currentChannel="formData.channel"
              :showSensitiveTip="showSensitiveTip"
            />
          </v-tab-pane>
          <v-tab-pane :label="_('Arming Sched.')" value="2">
            <motion-period
              ref="period"
              v-model="formData.timeSection"
              @change="setPeriod"
            ></motion-period>
          </v-tab-pane>
          <v-tab-pane :label="_('Linkage Action')" value="3">
            <motion-event
              ref="event"
              :event="formData.event"
              :channel-options="channelOptions"
            ></motion-event>
          </v-tab-pane>
        </v-tabs>
        <div
          :class="['disabledd-mask', { 'noAbility-mask': !formData.ability }]"
          v-show="!formData.detectSettings.enable"
        ></div>
      </v-form-item>
    </better-form>
    <v-dialog
      v-model="showSyncDialog"
      :title="_('Sync to')"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      @confirm="syncChannel"
      :confirm-button-text="_('Sync')"
      class="channel-sync"
    >
      <v-checkbox-group
        is-select-all
        v-model="checked"
        class="check-group"
        :options="channelDisableOptions"
      ></v-checkbox-group>
    </v-dialog>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import MotionPeriod from "./motionPeriod.vue";
import MotionEvent from "./motionEvent.vue";
import MotionSet from "./motionSet.vue";
import { clone, channelResultHandle } from "@/utils/common.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "motion",
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:MotionDetect";
    this.setUrl = "/RPC2:configManager.setConfig:MotionDetect";
    return {
      showSyncDialog: false,
      checked: [],
      type: "1",
      max: 8,
      formData: {
        timeSection: [],
        detectSettings: {
          enable: true,
          sensitive: 0,
          region: []
        },
        channel: "",
        ability: true,
        event: {
          record: [],
          linked: []
        }
      }
    };
  },
  components: {
    MainContent,
    BetterForm,
    MotionPeriod,
    MotionEvent,
    MotionSet
  },
  computed: {
    ...mapState([
      "channelOptions",
      "channelDisableOptions",
      "channelStatus",
      "channelToTitle",
      "protocolList"
    ]),
    showSensitiveTip() {
      const protocol = this.protocolList[this.formData.channel],
        { sensitive, enable } = this.formData.detectSettings;

      //灵敏度为0且侦测开关打开且协议为onvif
      return !sensitive && enable && protocol === 2;
    }
  },
  watch: {
    "formData.channel"(val, oldVal) {
      this.watchChannel(val, oldVal);
    },
    channelOptions(channels) {
      if (this.formData && channels.length > 0) {
        this.formData.channel = channels[0].value;
      }
    }
  },
  methods: {
    ...mapActions(["getChannels"]),
    channelResultHandle: channelResultHandle,
    setPeriod(val) {
      this.formData.timeSection = val;
    },
    showSync() {
      this.channelDisableOptions.forEach(item => {
        const channel = this.allChannels[item.value];

        item.disabled =
          item.value == this.formData.channel || (channel && !channel.ability);
      });
      this.checked = [this.formData.channel];
      this.showSyncDialog = true;
    },
    syncChannel() {
      let data = {};
      this.checked.forEach(channel => {
        // 录像联动数据不同步
        let record = [];
        if (this.allChannels[channel] && this.allChannels[channel].event) {
          record = this.allChannels[channel].event.record || [];
        }
        data[channel] = this.allChannels[channel] = {
          channel: channel,
          detectSettings: clone(this.formData.detectSettings),
          event: clone(this.formData.event),
          timeSection: clone(this.formData.timeSection)
        };
        data[channel].event.record = this.allChannels[
          channel
        ].event.record = record;
      });
      this.submitData(this.formatSetData(data), true);
      this.showSyncDialog = false;
      this.checked = [];
    },

    watchChannel(val, oldVal) {
      // this.$refs.motionSet.updateDraw();
      if (oldVal !== undefined && oldVal !== "") {
        let oldData = this.allChannels[oldVal];
        if (oldData) {
          oldData.detectSettings = this.formData.detectSettings;
          oldData.event = this.formData.event;
          oldData.timeSection = this.formData.timeSection;
        }
      }
      if (this.allChannels && this.allChannels[val]) {
        let channel = this.allChannels[val];
        this.formData.timeSection = channel.timeSection || [];
        this.formData.detectSettings = channel.detectSettings;
        this.formData.event = channel.event;
        this.formData.ability = channel.ability;
        if (!channel.ability) {
          this.$message.error("该通道不支持此项功能");
        }
      }
    },
    formatGetData(data) {
      let res = {};
      data.forEach(item => {
        if (!this.channelStatus[item.channel]) {
          return;
        }
        res[item.channel] = item;
        // 处理时间段
        item.timeSection = this.$refs.period.formatGetData(item.timeSection);
        item.event = this.$refs.event.formatGetData(item.event);
      });
      return res;
    },
    formatSetData(channels) {
      let res = [];
      channels = channels || this.allChannels;
      for (let key in channels) {
        let data = channels[key];
        let channelItem = {
          name: "MotionDetect",
          channel: data.channel,
          detectSettings: data.detectSettings,
          event: this.$refs.event.formatSetData(data.event),
          timeSection: this.$refs.period.formatSetData(data.timeSection)
        };
        res.push(channelItem);
      }
      return res;
    },
    async getData() {
      let res = await this.$axiosPost(this.getUrl);
      this.allChannels = this.formatGetData(res.getParams());
      this.watchChannel(this.formData.channel);
    },
    async submitData(data, custom) {
      // this.$refs.motionSet.updateDraw(); 解决未切换通道直接保存下发为上次数据的情况
      let res = await this.$axiosPost(
        this.setUrl,
        custom ? data : this.formatSetData()
      );
      // if (res.getResult() === true) {
      //   this.$message.success(_("Saved Successfully"));
      // } else {
      //   this.$message.error(_("Failed to save"));
      // }
      this.channelResultHandle(res);

      if (res.getResult()) {
        await this.getChannels();
        this.getData();
      }
    },
    //打开移动侦测开关，默认灵敏度设置为60
    changeSensitive(val) {
      if (val && !this.formData.detectSettings.sensitive) {
        this.formData.detectSettings.sensitive = 60;
      }
    }
  },
  async mounted() {
    await this.getChannels();
    this.getData();
  }
};
</script>

<style lang="scss">
.motion {
  .better-form-toolbar .v-form-item__content {
    margin-left: 0 !important;
  }
  .timebox {
    width: 1000px;
    padding-top: 30px;
    margin: 0 auto;
  }
  .noAbility-mask {
    top: -60px;
    height: 135%;
  }
}
</style>
