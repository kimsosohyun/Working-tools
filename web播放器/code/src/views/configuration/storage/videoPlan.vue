<template>
  <main-content class="video-plan" :title="_('Schedule')">
    <better-form
      :rules="rules"
      :btns="['submit', 'sync']"
      :model="formData"
      @submit="submitData"
      @sync="showSync"
    >
      <v-form-item :label="_('Channel')" prop="channel">
        <v-select
          v-model="formData.channel"
          :options="channelOptions"
        ></v-select>
      </v-form-item>
      <v-form-item :label="_('Recording')" prop="enable">
        <v-switch v-model="formData.enable"></v-switch>
      </v-form-item>
      <v-form-item :is-no-label="true">
        <period :events="events" v-model="formData.period" :max="max">
          <v-button class="period-btn" @click="allDay(0)" type="info" size="M">
            <i class="icon icon-timing"></i>
            <label class="text">{{ _("All Normal Recording") }}</label>
          </v-button>
          <v-button class="period-btn" @click="allDay(1)" type="info" size="M">
            <i class="icon icon-people"></i>
            <label class="text">{{ _("All Alarm Recording") }}</label>
          </v-button>
          <template v-slot:tool>
            <label class="video-plan-tip">{{
              _("Tip: 8 periods are supported for one day at most")
            }}</label>
          </template>
        </period>
        <v-button class="btn-advance" @click="showAdvanced" type="text">{{
          _("Advanced>>")
        }}</v-button>
        <div class="disabledd-mask" v-show="!formData.enable"></div>
      </v-form-item>
      <!-- <template v-slot:after-button>
        <v-button type="info" @click="showSync">同步至其它通道</v-button>
      </template> -->
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
    <v-dialog
      v-model="showAdvanceDialog"
      :title="_('Advanced')"
      :close-on-click-modal="false"
      :modal="true"
      @confirm="setAdvanced"
    >
      <v-form :model="advanced" class="no-margin">
        <!-- <v-form-item :label="_('Record Audio')" prop="audioRecord">
          <v-switch v-model="advanced.audioRecord"></v-switch>
        </v-form-item>
        <v-form-item :label="_('Pre-record')" prop="preRecord">
          <v-select v-model="advanced.preRecord" :options="options"></v-select>
          <label class="v-form-item__label--medium record-seconds">{{
            _("second(s)")
          }}</label>
        </v-form-item> -->
        <v-form-item :label="_('Post-record')" prop="recordLatch">
          <v-select
            v-model="advanced.recordLatch"
            :options="options"
          ></v-select>
          <label class="v-form-item__label--medium record-seconds">{{
            _("second(s)")
          }}</label>
        </v-form-item>
      </v-form>
    </v-dialog>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import period from "@/components/period/index.vue";
import { clone, channelResultHandle } from "@/utils/common.js";

// 不用区分在线离线，都可用进行配置
const DEFAULT_PERIOD = "0 00:00:00-00:00:00";
export default {
  name: "videoplan",
  components: {
    MainContent,
    BetterForm,
    period
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:Record";
    this.setUrl = "/RPC2:configManager.setConfig:Record";
    this.getChannelUrl = "/RPC2:configManager.getConfig:RemoteDevice";
    this.options = [
      { label: 10, value: 10 },
      { label: 15, value: 15 },
      { label: 20, value: 20 }
    ];

    this.max = 8;
    return {
      events: [
        { label: _("Normal"), type: "primary", value: 0 },
        { label: _("Alarm"), type: "danger", value: 1 }
      ],
      checked: [],
      showAdvanceDialog: false,
      showSyncDialog: false,
      formData: {
        enable: true,
        channel: "",
        period: [],
        // preRecord: 5,
        recordLatch: 5
        // audioRecord: true
      },
      advanced: {
        // preRecord: 5,
        recordLatch: 5
        // audioRecord: true
      },
      rules: {},
      channelOptions: [],
      channelDisableOptions: [],
      channelToTitle: {}
    };
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
    channelResultHandle: channelResultHandle,
    allDay(type) {
      let arr = [];
      for (let i = 0; i < 7; i++) {
        arr.push([{ startTime: "00:00", endTime: "24:00", event: type }]);
      }
      this.formData.period = arr;
    },
    syncChannel() {
      let data = {};
      this.setCurrentChannel();
      this.checked.forEach(channel => {
        data[channel] = this.allChannels[channel] = {
          channel,
          enable: this.formData.enable,
          period: clone(this.formData.period),
          recordLatch: this.formData.recordLatch
          // preRecord: this.formData.preRecord,
          // audioRecord: this.formData.audioRecord
        };
      });
      this.submitData(this.formatSetData(data), true);
      this.showSyncDialog = false;
      this.checked = [];
    },
    setCurrentChannel() {
      this.allChannels[this.formData.channel] = {
        channel: this.formData.channel,
        enable: this.formData.enable,
        period: clone(this.formData.period),
        recordLatch: this.formData.recordLatch
        // preRecord: this.formData.preRecord,
        // audioRecord: this.formData.audioRecord
      };
    },
    setAdvanced() {
      let channel = this.allChannels[this.formData.channel];
      channel.recordLatch = this.formData.recordLatch = this.advanced.recordLatch;
      // channel.preRecord = this.formData.preRecord = this.advanced.preRecord;
      // channel.audioRecord = this.formData.audioRecord = this.advanced.audioRecord;
      this.showAdvanceDialog = false;
    },
    showSync() {
      this.channelDisableOptions.forEach(item => {
        item.disabled = item.value == this.formData.channel;
      });
      this.checked = [this.formData.channel];
      this.showSyncDialog = true;
    },
    showAdvanced() {
      this.advanced.recordLatch = this.formData.recordLatch;
      // this.advanced.preRecord = this.formData.preRecord;
      // this.advanced.audioRecord = this.formData.audioRecord;
      this.showAdvanceDialog = true;
    },
    watchChannel(val, oldVal) {
      if (oldVal !== undefined && oldVal !== "") {
        let oldData = this.allChannels[oldVal];
        if (oldData) {
          oldData.enable = this.formData.enable;
          oldData.period = this.formData.period;
          oldData.recordLatch = this.formData.recordLatch;
          // oldData.preRecord = this.formData.preRecord;
          // oldData.audioRecord = this.formData.audioRecord;
        }
      }
      if (this.allChannels && this.allChannels[val]) {
        let channel = this.allChannels[val];
        this.formData.period = channel.period || [];
        this.formData.enable = channel.enable;
        this.formData.recordLatch = channel.recordLatch;
        // this.formData.preRecord = channel.preRecord;
        // this.formData.audioRecord = channel.audioRecord;
      } else {
        this.formData.period = [];
        this.formData.enable = true;
        this.formData.recordLatch = 5;
        // this.formData.preRecord = 5;
        // this.formData.audioRecord = true;
      }
    },
    formatGetData(data) {
      let res = {};
      data.forEach(item => {
        res[item.channel] = item;
        item.period = item.timeSection.map(weekday => {
          let dayItem = [];
          for (let i = 0; i < weekday.length; i++) {
            if (i !== 0 && weekday[i] === DEFAULT_PERIOD) {
              break;
            }
            let period = weekday[i];
            period = period.split(" ");
            if (period.length === 2) {
              let time = period[1].split("-");
              dayItem.push({
                startTime: time[0].replace(/:00$/, ""),
                endTime: time[1].replace(/:00$/, ""),
                event: +period[0]
              });
            }
          }
          return dayItem;
        });
        delete item.timeSection;
      });
      return res;
    },
    formatSetData(channels) {
      this.setCurrentChannel();
      let res = [];
      channels = channels || this.allChannels;
      for (let key in channels) {
        let data = channels[key];
        let channelItem = {
          channel: data.channel,
          enable: data.enable,
          recordLatch: data.recordLatch,
          // preRecord: data.preRecord,
          // audioRecord: data.audioRecord,
          name: "Record",
          timeSection: []
        };
        data.period.forEach(item => {
          let dayItem = [];
          for (let i = 0; i < this.max; i++) {
            let period = item[i];
            if (period === undefined) {
              dayItem.push(DEFAULT_PERIOD);
              continue;
            }
            dayItem.push(
              `${period.event} ${period.startTime}:00-${period.endTime}:00`
            );
          }
          channelItem.timeSection.push(dayItem);
        });
        res.push(channelItem);
      }
      return res;
    },
    async getChannels() {
      let res = await this.$axiosPost(this.getChannelUrl);
      let channels = [],
        channelToTitle = {},
        disChannels = [];

      res.getParams().forEach(({ channel, title }) => {
        channels.push({
          label: `D${channel + 1} ${title}`,
          value: channel
        });
        disChannels.push({
          label: `D${channel + 1}`,
          value: channel,
          disabled: false
        });
        channelToTitle[channel] = `D${channel + 1}`;
      });

      this.channelOptions = channels;
      this.channelDisableOptions = disChannels;
      this.channelToTitle = channelToTitle;
    },
    async getData() {
      let res = await this.$axiosPost(this.getUrl);
      this.allChannels = this.formatGetData(res.getParams());
      this.watchChannel(this.formData.channel);
    },
    async submitData(data, custom) {
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
    }
  },
  async created() {
    await this.getChannels();
    this.getData();
  }
};
</script>

<style lang="scss">
.video-plan {
  .icon-people {
    color: #f7421e;
  }

  .icon-timing {
    color: #17cc82;
  }

  .btn-advance {
    color: #262626;
    padding-left: 54px;
    margin-top: 4px;
    &:hover {
      color: #ff801f;
    }
  }
  .record-seconds {
    padding-left: 8px;
  }

  .video-plan-tip {
    color: #8d8d8d;
    font-size: 12px;
  }
  .better-form-toolbar {
    .v-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>
