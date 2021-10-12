<template>
  <div class="authority">
    <v-tabs v-model="authority" type="card" @tab-click="initHeight">
      <v-tab-pane :label="_('GUI')" value="local">
        <div ref="tabItem" class="authority-innner local">
          <v-checkbox-group
            is-select-all
            v-model="local"
            :options="localOptions"
          ></v-checkbox-group>
        </div>
      </v-tab-pane>
      <v-tab-pane :label="_('Remote')" value="remote">
        <div ref="tabItem" class="authority-innner remote">
          <v-checkbox-group
            is-select-all
            v-model="remote"
            :options="remoteOptions"
          ></v-checkbox-group>
        </div>
      </v-tab-pane>
      <v-tab-pane :label="_('N#GZd#Channel')" value="passageway">
        <div ref="tabItem" class="authority-innner passageway">
          <v-select
            v-model="passagewaySelect"
            :options="selectOption"
            @change="passagewayChange"
          ></v-select>
          <v-checkbox-group
            v-if="passagewaySelect === 'Monitor'"
            is-select-all
            v-model="monitor"
            :options="monitorOptions"
            @change="monitorChange"
          ></v-checkbox-group>
          <v-checkbox-group
            v-if="passagewaySelect === 'Replay'"
            is-select-all
            v-model="replay"
            :options="replayOptions"
          ></v-checkbox-group>
          <v-checkbox-group
            :disabled="ptzConfigDisabled"
            v-if="passagewaySelect === 'PtzConfig'"
            is-select-all
            v-model="ptzConfig"
            :options="ptzConfigOptions"
          ></v-checkbox-group>
        </div>
      </v-tab-pane>
    </v-tabs>
  </div>
</template>

<script>
export default {
  props: {
    authorityList: Object
  },
  computed: {
    maxSupportedChannelNum() {
      return this.$store.state.MACRO_CONFIG.VideoInputChannels;
    }
  },
  mounted() {
    this.initOption();
    this.initHeight();
  },
  data() {
    return {
      authority: "local",
      local: this.authorityList.local || [],
      localOptions: [
        {
          label: _("Config"),
          value: "LocalConfig"
        },
        {
          label: _("System Management"),
          value: "LocalMaintain"
        },
        // {
        //   label: _("Exception Fix"),
        //   value: "LocalAlarmConf"
        // },
        {
          label: _("Shut down/Reboot"),
          value: "ShutDown"
        }
      ],
      remote: this.authorityList.remote || [],
      remoteOptions: [
        {
          label: _("Config"),
          value: "RemoteConf"
        },
        {
          label: _("System Management"),
          value: "RemoteSysMgt"
        }
      ],
      passagewaySelect: "Monitor",
      selectOption: [
        {
          label: _("Live View"),
          value: "Monitor"
        },
        {
          label: _("Playback"),
          value: "Replay"
        },
        {
          label: _("PTZ Control"),
          value: "PtzConfig"
        }
      ],
      monitor: this.authorityList.monitor || [],
      replay: this.authorityList.replay || [],
      ptzConfig: this.authorityList.ptzConfig || [],
      monitorOptions: [],
      replayOptions: [],
      ptzConfigOptions: [],
      ptzConfigDisabled: false
    };
  },
  methods: {
    /**
     * 基于8个通道的选项卡样式，进行超出8个通道样式初始化
     */
    initHeight() {
      this.$nextTick(() => {
        const channelNum = this.maxSupportedChannelNum,
          element = this.$refs.tabItem,
          overChannel = this.maxSupportedChannelNum - 8, //超出设计稿8个通道的数量
          lineHeight = 34, //一行4个通道需要增加的高度
          originalHeight = 144; //8个通道时选项卡的高度

        if (channelNum > 8) {
          element.style.height =
            Math.ceil(overChannel / 4) * lineHeight + originalHeight + "px";
        }
      });
    },
    /**
     * 预览未选择的通道，在切换到选择框到云台控制时需要被禁用
     */
    passagewayChange() {
      if (this.monitor.length === 0) {
        //无可选项时直接禁用复选框组
        this.ptzConfigDisabled = true;
        this.ptzConfigOptions.forEach(item => {
          item.disabled = false;
        });
      } else {
        //有可选项时才禁用子选项框
        this.ptzConfigDisabled = false;
        this.ptzConfigOptions.forEach(item => {
          item.disabled = true;
        });
        this.monitor.forEach(item => {
          this.ptzConfigOptions[item].disabled = false;
        });
      }
    },
    /**
     * 当预览的通道被取消选中时，云台控制也需要同步取消选中这个通道
     */
    monitorChange(value) {
      let { ptzConfig } = this,
        len = ptzConfig.length,
        i = len - 1;
      for (; i > -1; i--) {
        if (value.indexOf(ptzConfig[i]) === -1) {
          ptzConfig.splice(i, 1);
        }
      }
    },
    getAuthorityList() {
      const { local, remote, monitor, replay, ptzConfig } = this;
      return { local, remote, monitor, replay, ptzConfig };
    },
    /**
     * 根据通道数初始化 预览 回放 云台控制 可选项
     */
    initOption() {
      const maxNum = this.maxSupportedChannelNum,
        { monitorOptions, replayOptions, ptzConfigOptions } = this;
      let i = 0;
      for (; i < maxNum; i++) {
        let obj = {};
        obj.label = "D" + (i + 1);
        obj.value = i;
        let disabledObj = { ...obj };
        disabledObj.disabled = true; //云台控制选项在初始化时全部禁用
        monitorOptions.push(obj);
        replayOptions.push(obj);
        ptzConfigOptions.push(disabledObj);
      }
    }
  }
};
</script>

<style lang="scss">
.authority {
  width: 400px;
  .tab-nav {
    margin-bottom: 0;
  }
  .tab-nav-item {
    width: 106px;
    text-align: center;
  }
  .authority-innner {
    width: 100%;
    box-sizing: border-box;
    min-height: 144px;
    border: 1px solid #d8d8d8;
    border-top: none;
  }
  .v-checkbox-group {
    line-height: 0;
  }
  .local,
  .remote {
    position: relative;
    .v-checkbox {
      position: absolute;
    }
    .v-checkbox:nth-child(1) {
      top: 12px;
      left: 24px;
    }
    .v-checkbox:nth-child(2) {
      top: 46px;
      left: 24px;
    }
    .v-checkbox:nth-child(4) {
      top: 80px;
      left: 24px;
    }
    .v-checkbox:nth-child(3) {
      top: 46px;
      left: 176px;
    }
    .v-checkbox:nth-child(5) {
      top: 80px;
      left: 176px;
    }
  }
  // .remote {
  //   .v-checkbox:first-child {
  //     margin-top: 12px;
  //     display: block;
  //   }
  //   .v-checkbox {
  //     margin-top: 2px;
  //     margin-left: 24px;
  //     margin-right: 76px;
  //   }
  // }
  .passageway {
    padding-left: 24px;
    position: relative;
    .v-select {
      margin-top: 17px;
      margin-bottom: 10px;
    }
    .v-checkbox__item {
      margin-right: 0;
    }
    .v-checkbox {
      display: inline-block;
      margin: 1px 0;
      width: 72px;
    }
    .v-checkbox:nth-child(4n + 1) {
      width: auto;
    }
    .v-checkbox:nth-child(4n + 2) {
      margin-left: 84px;
    }
    .v-checkbox:nth-child(1) {
      width: 84px;
    }
    .v-checkbox:nth-child(2) {
      margin-left: 0;
    }
  }
}
</style>
