<template>
  <main-content class="image-wrapper" :title="_('Image')">
    <div class="image">
      <better-form :model="formData" @submit="submitData" class="left-form">
        <v-form-item :label="_('Channel')" prop="channel">
          <v-select
            v-model="currentChannel"
            :options="channelOptions"
          ></v-select>
        </v-form-item>
        <v-form-item>
          <h2 slot="label">{{ _("Image Parameters") }}</h2>
        </v-form-item>
        <v-form-item
          :label="_('Image Style')"
          prop="imageStyle"
          v-show="formData.protocol !== 2"
        >
          <v-select
            v-model="formData.imageStyle"
            :options="imageStyleOpts"
            @change="delayChange(0)"
          ></v-select>
        </v-form-item>
        <v-form-item :label="_('Brightness')" prop="brightness">
          <v-slider
            show-input
            :min="0"
            :max="100"
            v-model="formData.brightness"
            @moveHandle="val => this.sendProcessInfo('brightness', val)"
            @change="delayChange(true)"
            @clickHandle="delayChange"
          ></v-slider>
        </v-form-item>
        <v-form-item :label="_('Contrast')" prop="contrast">
          <v-slider
            show-input
            :min="0"
            :max="100"
            v-model="formData.contrast"
            @change="delayChange(true)"
            @clickHandle="delayChange"
            @moveHandle="val => this.sendProcessInfo('contrast', val)"
          ></v-slider>
        </v-form-item>
        <v-form-item :label="_('Saturation')" prop="saturation">
          <v-slider
            show-input
            :min="0"
            :max="100"
            v-model="formData.saturation"
            @change="delayChange(true)"
            @clickHandle="delayChange"
            @moveHandle="val => this.sendProcessInfo('saturation', val)"
          ></v-slider>
        </v-form-item>
        <v-form-item :label="_('Sharpness')" prop="sharpness">
          <v-slider
            show-input
            :min="0"
            :max="100"
            v-model="formData.sharpness"
            @change="delayChange(true)"
            @clickHandle="delayChange"
            @moveHandle="val => this.sendProcessInfo('sharpness', val)"
          ></v-slider>
        </v-form-item>
        <v-form-item
          :label="_('Mirror')"
          prop="imageMirror"
          v-show="formData.protocol !== 2"
        >
          <v-select
            v-model="formData.imageMirror"
            :options="imageMirrorOpts"
            @change="delayChange(0)"
          ></v-select>
        </v-form-item>

        <template v-slot:after-button>
          <v-button type="info" @click="showSync">{{ _("Sync to") }}</v-button>
        </template>
      </better-form>
      <div class="right-screen">
        <div class="container">
          <singlePlayer :currentChannel="currentChannel" />
        </div>
      </div>
    </div>
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
import { clone, throttle, channelResultHandle } from "@/utils/common.js";
import singlePlayer from "@/components/singlePlayer";
import { mapState, mapActions } from "vuex";

export default {
  name: "osdConfig",
  components: {
    MainContent,
    BetterForm,
    singlePlayer
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:VideoColor";
    this.setUrl = "/RPC2:configManager.setConfig:VideoColor";
    this.getDevInfoUrl = "/RPC2:configManager.getConfig:RemoteDevice";
    this.imageStyleOpts = [
      { label: _("Standard"), value: 1 },
      { label: _("Clarified"), value: 2 },
      { label: _("Soft"), value: 3 }
    ];
    this.imageMirrorOpts = [
      { label: _("Disable"), value: 1 },
      { label: _("Up-Down"), value: 2 },
      { label: _("Left-Right"), value: 3 },
      { label: _("Center"), value: 4 }
    ];
    this.time = 100;
    return {
      formData: {
        channel: "",
        imageStyle: "",
        brightness: 0,
        contrast: 0,
        saturation: 0,
        sharpness: 0,
        imageMirror: "",
        protocol: 2
      },
      channelList: [],
      currentChannel: "",
      showSyncDialog: false,
      checked: [],
      sendProcessInfo: "",
      originData: []
    };
  },
  watch: {
    channelOptions(newVal) {
      newVal.length > 0 && (this.currentChannel = this.channelOptions[0].value);
    },
    //切换通道时保存数据，更新formData
    currentChannel(newVal, oldVal) {
      this.changeChannel(newVal, oldVal);
    }
  },
  computed: {
    ...mapState(["channelOptions", "channelDisableOptions", "channelToTitle"])
  },
  methods: {
    ...mapActions(["getChannels"]),
    channelResultHandle: channelResultHandle,
    changeChannel(newVal, oldVal) {
      if (oldVal !== "" && oldVal != undefined) {
        this.channelList[oldVal] = this.formData;
      }

      if (newVal !== "" && this.channelList.length > 0) {
        this.formData = this.channelList[newVal];
      }
    },

    async getData() {
      let devInfos = await this.$axiosPost(this.getDevInfoUrl),
        res = await this.$axiosPost(this.getUrl);
      devInfos = devInfos.getParams() || [];
      res = res.getParams() || [];

      res.forEach(item => {
        item.name = "VideoColor";
        //保存原始数据备份
        this.originData[item.channel] = clone(item);

        devInfos.forEach(dev => {
          if (dev.channel === item.channel) {
            item.protocol = dev.protocol;
          }
        });
        this.channelList[item.channel] = item;
      });
      this.changeChannel(this.currentChannel);
    },

    showSync() {
      this.channelDisableOptions.forEach(item => {
        item.disabled = item.value == this.currentChannel;
      });
      this.checked = [this.currentChannel];
      this.showSyncDialog = true;
    },

    syncChannel() {
      let data = [];
      this.checked.forEach(i => {
        let channel = this.channelList[i].channel;
        this.channelList[i] = clone(this.formData);
        this.channelList[i].channel = channel;
        data.push(this.channelList[i]);
      });
      this.checked = [];
      this.showSyncDialog = false;
      this.submitData(data, true);
    },

    delayChange(val) {
      if (typeof val === "boolean") {
        //避免进度条最后一次延迟传的值覆盖最终的值
        setTimeout(() => {
          this.$axiosPost(this.setUrl, this.channelList);
        }, this.time);
      } else {
        this.$axiosPost(this.setUrl, this.channelList);
      }
    },

    async dragProcess(key, val) {
      let data = clone(this.channelList);
      data[this.currentChannel][key] = val;
      this.$axiosPost(this.setUrl, data);
    },

    async submitData(data, custom) {
      let postData = clone(custom ? data : this.channelList);
      postData.forEach(item => {
        delete item.protocol;
      });
      let res = await this.$axiosPost(this.setUrl, postData);
      if (res.getResult() === true) {
        this.originData = postData;
      } else {
        //若有通道数据保存失败，则只更新成功的通道数据的原始值
        let channels = res.getParams();
        channels = channels.channel || [];
        channels.forEach(channel => {
          postData[channel] = this.originData[channel];
        });
        this.originData = postData;
      }

      this.channelResultHandle(res);
    }
  },
  async created() {
    await this.getChannels();
    this.getData();
    //节流函数
    this.sendProcessInfo = throttle(this.dragProcess, this.time, false);

    window.onbeforeunload = () => {
      if ("sendBeacon" in navigator) {
        //兼容360安全、火狐、chrome、edge(偶），不兼容IE、360极速浏览器、QQ浏览器等
        let [prodUrl, method, name] = this.setUrl.split(":"),
          params = this.originData,
          data,
          url,
          blob;
        params.name = name;
        data = {
          method,
          params
        };
        url =
          (process.env.baseURL || process.env.apiUrl || "") +
          (process.env.NODE_ENV === "development" ? this.setUrl : prodUrl);
        blob = new Blob([JSON.stringify(data)], {
          type: "application/json"
        });
        navigator.sendBeacon(url, blob);
      }
      // else {
      //   event.preventDefault();
      //   event.returnValue = "确定刷新提示";
      //   this.$axiosPost(this.setUrl, this.originData);
      // }
    };
  },

  beforeDestroy() {
    this.$axiosPost(this.setUrl, this.originData);
  }
};
</script>

<style lang="scss">
.image {
  display: flex;
  flex-direction: row;
  .left-form {
    .v-select {
      width: 228px;
    }
    .v-slider {
      width: 300px;
    }
    .v-slider-line {
      margin-right: 72px !important;
    }
    .v-slider__number {
      width: 56px;
    }
    h2 {
      color: #262626;
      font-size: 16px;
    }
  }
  .right-screen {
    margin-left: 56px;
    margin-top: 128px;
    .container {
      width: 476px;
      height: 268px;
      position: relative;
      font-size: 13px;
    }
  }
}
</style>
