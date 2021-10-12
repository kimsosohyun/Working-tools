<template>
  <main-content :title="_('Audio & Video')" class="audio-video">
    <better-form :model="formData" :rules="rules" @submit="submitData">
      <v-form-item :label="_('Channel')" prop="channel">
        <v-select v-model="channel" :options="channelOptions"></v-select>
      </v-form-item>
      <!-- <v-form-item>
        <h2 slot="label">{{ _("Audio Configuration") }}</h2>
      </v-form-item>
      <v-form-item
        :label="_('Audio Stream')"
        prop="enable"
        :disabled="options.enable.length === 0"
      >
        <v-switch v-model="formData.enable"></v-switch>
      </v-form-item>
      <v-form-item
        :label="_('Encoding Type')"
        prop="compression"
        :disabled="options.compression.length === 0 || !formData.enable"
      >
        <v-select
          v-model="formData.compression"
          :options="options.compression"
        ></v-select>
      </v-form-item> -->
      <!--<div>
         <v-form-item
          label="采样率"
          prop="frequency"
          :disabled="options.frequency.length === 0 || !formData.enable"
        >
          <v-select
            v-model="formData.frequency"
            :options="options.frequency"
          ></v-select>
          <label class="form-descript">Hz</label>
        </v-form-item>
        <v-form-item
          label="位深"
          prop="depth"
          :disabled="options.depth.length === 0 || !formData.enable"
        >
          <v-select
            v-model="formData.depth"
            :options="options.depth"
          ></v-select>
          <label class="form-descript">bit</label>
        </v-form-item>
      </div> -->
      <!-- <v-form-item>
        <h2 slot="label">{{ _("Video Configuration") }}</h2>
      </v-form-item> -->
      <v-form-item>
        <h3 slot="label">{{ _("Main Stream") }}</h3>
      </v-form-item>
      <v-form-item
        :label="_('Encoding Type')"
        prop="mainCompression"
        :disabled="options.mainCompression.disabled"
      >
        <v-select
          v-model="formData.mainCompression"
          :options="options.mainCompression.options"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Resolution')"
        prop="mainResolution"
        :disabled="options.mainResolution.disabled"
      >
        <v-select
          v-model="formData.mainResolution"
          @change="getOptions"
          :options="options.mainResolution.options"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Frame Rate')"
        prop="mainFps"
        :disabled="options.mainFps.disabled"
      >
        <v-select
          v-model="formData.mainFps"
          :options="options.mainFps.options"
        ></v-select>
        <label class="form-descript">fps</label>
      </v-form-item>
      <v-form-item
        :label="_('Smart Encoding')"
        prop="mainSmartEncode"
        :disabled="options.mainSmartEncode.disabled"
      >
        <v-select
          v-model="formData.mainSmartEncode"
          :options="options.mainSmartEncode.options"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Bitrate Type')"
        prop="mainBitRateControl"
        :disabled="options.mainBitRateControl.disabled"
      >
        <v-select
          v-model="formData.mainBitRateControl"
          :options="options.mainBitRateControl.options"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Bitrate')"
        prop="mainBitRate"
        :disabled="options.mainBitRate.disabled"
      >
        <v-select
          v-model="formData.mainBitRate"
          :options="options.mainBitRate.options"
        ></v-select>
        <label class="form-descript">Kbps</label>
      </v-form-item>
      <v-form-item>
        <h3 slot="label">{{ _("Sub-stream") }}</h3>
      </v-form-item>
      <v-form-item
        :label="_('Encoding Type')"
        prop="extraCompression"
        :disabled="options.extraCompression.disabled"
      >
        <v-select
          v-model="formData.extraCompression"
          :options="options.extraCompression.options"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Resolution')"
        prop="extraResolution"
        :disabled="options.extraResolution.disabled"
      >
        <v-select
          v-model="formData.extraResolution"
          :options="options.extraResolution.options"
          @change="getOptions"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Frame Rate')"
        prop="extraFps"
        :disabled="options.extraFps.disabled"
      >
        <v-select
          v-model="formData.extraFps"
          :options="options.extraFps.options"
        ></v-select>
        <label class="form-descript">fps</label>
      </v-form-item>
      <v-form-item
        :label="_('Smart Encoding')"
        prop="extraSmartEncode"
        :disabled="options.extraSmartEncode.disabled"
      >
        <v-select
          v-model="formData.extraSmartEncode"
          :options="options.extraSmartEncode.options"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Bitrate Type')"
        prop="extraBitRateControl"
        :disabled="options.extraBitRateControl.disabled"
      >
        <v-select
          v-model="formData.extraBitRateControl"
          :options="options.extraBitRateControl.options"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Bitrate')"
        prop="extraBitRate"
        :disabled="options.extraBitRate.disabled"
      >
        <v-select
          v-model="formData.extraBitRate"
          :options="options.extraBitRate.options"
        ></v-select>
        <label class="form-descript">Kbps</label>
      </v-form-item>
      <template v-slot:after-button>
        <v-button type="info" @click="showSync">{{ _("Sync to") }}</v-button>
      </template>
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
        v-model="syncChecked"
        class="check-group"
        :options="channelDisableOptions"
      ></v-checkbox-group>
    </v-dialog>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import { clone, channelResultHandle } from "@/utils/common.js";
import { mapState, mapActions } from "vuex";

function arrayToOption(arr, obj = {}) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return {
      disabled: true,
      options: DEFAULTOPTIONS
    };
  }
  return {
    disabled: false,
    options: arr.map(item => {
      return { label: obj[item] || item, value: item };
    })
  };
}

const DEFAULTOPTIONS = [
  {
    value: 0,
    label: _("Disable")
  },
  {
    value: "0",
    label: _("Disable")
  },
  {
    value: "CBR",
    label: _("Constant bitrate")
  },
  {
    value: "VBR",
    label: _("Variable")
  }
];

export default {
  name: "audioVideo",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:Encode";
    this.setUrl = "/RPC2:configManager.setConfig:Endcode";
    this.getOptionUrl = "/RPC2:encode.getConfigCaps";
    this.rules = {};
    this.allOptions = {};
    this.allChannelData = {};

    return {
      showSyncDialog: false,
      syncChecked: [],
      channel: "",
      formData: {
        // 音频配置
        // enable: true, // 音频流
        // compression: "", //编码类型
        // depth: "", // 位深
        // frequency: "", // 采样率
        // 视频配置
        // 主码流
        mainBitRate: "", //码率上限
        mainBitRateControl: "", //码率类型
        mainCompression: "", // 编码类型
        mainFps: "", //帧率
        mainResolution: "", // 分辨率
        mainSmartEncode: "", //智能编码
        mainEnable: "", //
        // 子码流
        extraBitRate: "", //码率上限
        extraBitRateControl: "", //码率类型
        extraCompression: "", // 编码类型
        extraFps: "", //帧率
        extraResolution: "", // 分辨率
        extraSmartEncode: "", //智能编码
        extraEnable: "" //
      },
      options: {
        // compression: [],
        // enable: [],
        // frequency: [],
        // depth: [],
        mainCompression: [],
        mainResolution: [],
        mainFps: [],
        mainSmartEncode: [],
        mainBitRateControl: [],
        mainBitRate: [],
        extraCompression: [],
        extraResolution: [],
        extraFps: [],
        extraSmartEncode: [],
        extraBitRateControl: [],
        extraBitRate: []
      }
    };
  },
  computed: {
    ...mapState([
      "channelOptions",
      "channelDisableOptions",
      "channelStatus",
      "channelToTitle"
    ])
  },
  watch: {
    //切换通道时保存数据，更新formData
    channel(val, oldVal) {
      this.watchChannel(val, oldVal);
    },
    channelOptions: {
      immediate: true,
      handler(channels) {
        channels.length > 0 && (this.channel = channels[0].value);
      }
    }
  },
  methods: {
    ...mapActions(["getChannels"]),
    channelResultHandle: channelResultHandle,
    async getData() {
      let res = await this.$axiosPost(this.getUrl);
      res = res.getParams();
      let data = (this.allChannelData = {});
      res.forEach(item => {
        if (!this.channelStatus[item.channel]) {
          return;
        }
        data[item.channel] = {
          channel: item.channel,
          // 音频配置
          // enable: item.audio.enable, // 音频流
          // compression: item.audio.compression, //编码类型
          // depth: item.audio.depth, // 位深
          // frequency: item.audio.frequency, // 采样率
          // 视频配置
          // 主码流
          mainBitRate: item.mainFormat.bitRate, //码率上限
          mainBitRateControl: item.mainFormat.bitRateControl, //码率类型
          mainCompression: item.mainFormat.compression, // 编码类型
          mainFps: item.mainFormat.fps, //帧率
          mainResolution: item.mainFormat.resolution, // 分辨率
          mainSmartEncode: item.mainFormat.smartEncode, //智能编码
          mainEnable: item.mainFormat.enable, //
          // 子码流
          extraBitRate: item.extraFormat.bitRate, //码率上限
          extraBitRateControl: item.extraFormat.bitRateControl, //码率类型
          extraCompression: item.extraFormat.compression, // 编码类型
          extraFps: item.extraFormat.fps, //帧率
          extraResolution: item.extraFormat.resolution, // 分辨率
          extraSmartEncode: item.extraFormat.smartEncode, //智能编码
          extraEnable: item.extraFormat.enable //
        };
      });

      this.watchChannel(this.channel);
      // this.getOptions();
    },

    //获取option数据
    async getOptions() {
      let { formData } = this;
      let res = await this.$axiosPost(this.getOptionUrl, {
        channel: this.channel,
        config: {
          mainFormat: {
            fps: formData.mainFps,
            compression: formData.mainCompression,
            resolution: formData.mainResolution
          },
          extraFormat: {
            fps: formData.extraFps,
            compression: formData.extraCompression,
            resolution: formData.extraResolution
          }
        }
      });
      this.getOtherOptions(res.getParams());
    },

    getOtherOptions(data) {
      let controlTypeMess = { CBR: _("Constant bitrate"), VBR: _("Variable") };
      let enableMess = { "0": _("Disable"), "1": _("Enable") };
      let res = {};
      data.forEach(item => {
        res[item.channel] = {
          // 音频
          // compression: arrayToOption(item.audio.compressionTypes),
          // enable: item.audio.enable,
          // frequency: arrayToOption(item.audio.frequencyTypes),
          // depth: arrayToOption(item.audio.depthTypes),
          // 主码流
          mainCompression: arrayToOption(item.mainFormat.compressionTypes),
          mainResolution: arrayToOption(item.mainFormat.resolutionTypes),
          mainFps: arrayToOption(item.mainFormat.fpsTypes),
          mainSmartEncode: arrayToOption(
            item.mainFormat.smartEncode,
            enableMess
          ),
          mainBitRateControl: arrayToOption(
            item.mainFormat.bitRateControlTypes,
            controlTypeMess
          ),
          mainBitRate: arrayToOption(item.mainFormat.bitRateList),
          // 子码流
          extraCompression: arrayToOption(item.extraFormat.compressionTypes),
          extraResolution: arrayToOption(item.extraFormat.resolutionTypes),
          extraFps: arrayToOption(item.extraFormat.fpsTypes),
          extraSmartEncode: arrayToOption(
            item.extraFormat.smartEncode,
            enableMess
          ),
          extraBitRateControl: arrayToOption(
            item.extraFormat.bitRateControlTypes,
            controlTypeMess
          ),
          extraBitRate: arrayToOption(item.extraFormat.bitRateList)
        };
      });
      this.allOptions = res;
      this.options = this.allOptions[this.channel] || {};
    },

    watchChannel(val, oldVal) {
      if (oldVal !== undefined && oldVal !== "") {
        this.allChannelData[oldVal] = this.formData;
      }
      if (this.allChannelData && this.allChannelData[val]) {
        this.formData = this.allChannelData[val];
      }
      this.getOptions();
      // if (this.allOptions[val]) {
      //   this.options = this.allOptions[val];
      // }
    },

    showSync() {
      this.channelDisableOptions.forEach(item => {
        item.disabled = item.value == this.channel;
      });
      this.syncChecked = [this.channel];
      this.showSyncDialog = true;
    },

    syncChannel() {
      let res = {};
      this.syncChecked.forEach(channel => {
        this.allChannelData[channel] = res[channel] = clone(this.formData);
        res[channel]["channel"] = channel;
      });

      this.submitData(this.formatSetData(res), true);
      this.showSyncDialog = false;
      this.syncChecked = [];
    },

    formatSetData(allData) {
      let res = [];
      allData = allData || this.allChannelData;

      for (let key in allData) {
        let item = allData[key];
        res.push({
          channel: key,
          name: "Encode",
          // audio: {
          //   compression: item.compression,
          //   // depth: item.depth,
          //   // frequency: item.frequency,
          //   // enable: item.enable
          // },
          extraFormat: {
            enable: item.extraEnable,
            bitRate: item.extraBitRate,
            bitRateControl: item.extraBitRateControl,
            compression: item.extraCompression,
            fps: item.extraFps,
            resolution: item.extraResolution,
            smartEncode: item.extraSmartEncode
          },
          mainFormat: {
            enable: item.mainEnable,
            bitRate: item.mainBitRate,
            bitRateControl: item.mainBitRateControl,
            compression: item.mainCompression,
            fps: item.mainFps,
            resolution: item.mainResolution,
            smartEncode: item.mainSmartEncode
          }
        });
      }
      return res;
    },

    async submitData(data, custom) {
      let res = await this.$axiosPost(
        this.setUrl,
        custom ? data : this.formatSetData()
      );

      this.channelResultHandle(res);

      // let channelToTitle = this.channelToTitle;

      // if (res.getResult() === true) {
      //   this.$message.success(_("Saved Successfully"));
      // } else {
      //   let channels = res.getParams();
      //   channels = channels.channel || [];
      //   let errorText = channels.map(item => channelToTitle[item]).join(", ");
      //   this.$message.error(errorText + _("Failed to save"));
      // }
    }
  },
  async created() {
    await this.getChannels();
    await this.getData();
  }
};
</script>

<style lang="scss">
.audio-video {
  h2 {
    font-size: 16px;
    font-weight: 500;
  }
  .form-descript {
    line-height: 32px;
    padding-left: 10px;
    font-weight: 500;
  }
}
</style>
