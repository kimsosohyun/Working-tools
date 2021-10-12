<template>
  <div class="preview">
    <ChannelList
      @emit-active-window-change="
        windowId => $refs.previewPlayer.changeActiveWindow(windowId)
      "
    />
    <PreviewPlayer ref="previewPlayer" />
    <PtzController />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { getKeyById } from "@/utils/dicts";
import ChannelList from "./channelList";
import PreviewPlayer from "./previewPlayer";
import PtzController from "./ptz/index";

export default {
  name: "preveiw",
  components: {
    ChannelList,
    PreviewPlayer,
    PtzController
  },
  provide() {
    return {
      maxSupportedChannelNum: this.maxSupportedChannelNum,
      maxSplitScreenCount: this.maxSplitScreenCount,
      liveStop: this.liveStop,
      livePlay: this.livePlay,
      switchStream: this.switchStream
    };
  },
  data() {
    this.channelListUrl = "/RPC2:configManager.getConfig:RemoteDevice";
    this.ptzAuthUrl = "/RPC2:ptz.getPTZAbility";
    return {
      // activeWindowId: 0 // 聚焦窗口, 默认：0
    };
  },
  computed: {
    ...mapState({
      activeChannel: "activeChannel",
      activeWindowId: "activeWindowId",
      $players: "$players",
      MACRO_CONFIG: "MACRO_CONFIG",
      channelAuth: ({ authorityList: { monitor } }) => {
        return monitor;
      }
    }),
    ...mapGetters({
      channelConfigs: "channelConfigs"
    }),
    // 设备最大支持通道数
    maxSupportedChannelNum() {
      return this.MACRO_CONFIG.VideoInputChannels;
      // return 16;
    },
    // 设备最大支持分屏数（播放数量）
    maxSplitScreenCount() {
      return this.MACRO_CONFIG.maxSplitScreenCount;
      // return 16;
    },
    onlineStatusKey() {
      // 状态连接正常的key
      return getKeyById("online", "status", "CHANNEL");
    }
  },
  created() {
    this.getChannelInfo();
  },
  methods: {
    ...mapMutations(["setActiveChannel", "setChannelData", "setCustomConfigs"]),
    listToObject(list, key) {
      const obj = {};
      list.forEach(item => {
        obj[item[key]] = item;
      });

      return obj;
    },
    /**
     * 获取通道相关信息
     */
    getChannelInfo() {
      const getChannelList = this.$axiosPost(this.channelListUrl),
        getChannelPtzAuth = this.$axiosPost(this.ptzAuthUrl);

      this.$axiosAll([getChannelList, getChannelPtzAuth]).then(
        this.$axiosSpread((channelList, channelPtzAuth) => {
          if (!channelList.getResult() || !channelPtzAuth.getResult()) {
            return;
          }
          channelList = channelList.getParams() || [];
          channelPtzAuth = channelPtzAuth.getParams() || {};

          this.setMergeChannelList(channelList, channelPtzAuth);
          this.initCustomConfigs(channelList);
        })
      );
    },
    /**
     * 合并已添加摄像头列表通道数据与通道音视频配置
     * @param {Array} list 已添加摄像头列表通道数据
     * @param {Array} vaCfgs 音视频配置
     */
    setMergeChannelList(list, channelPtzAuth) {
      const { channelAuth, listToObject } = this;
      const id = "channel";
      const channelObj = listToObject(list, id);

      const mixObj = {};

      channelPtzAuth = channelPtzAuth.channels || [];
      Object.keys(channelObj).forEach(channel => {
        channel = +channel;
        if (!channelAuth.includes(channel)) {
          // 没有权限，不填入数据
          return;
        }

        if (
          this.activeChannel === null &&
          channelObj[channel].status === this.onlineStatusKey
        ) {
          // 当前通道未选中时，默认选中第一个状态为在线状态的通道
          this.setActiveChannel(channel);
        }

        mixObj[channel] = {
          ...channelObj[channel],
          ptzAuth: channelPtzAuth.includes(channel)
        };
      });

      this.setChannelData(mixObj);
    },
    /**
     * 根据已添加摄像头列表通道数据初始化自定义配置
     * @param {Array} list 已添加摄像头列表通道数据
     */
    initCustomConfigs(list = []) {
      const len = list.length,
        customConfigs = {};
      for (let i = 0; i < len; i++) {
        const { channel } = list[i];
        customConfigs[channel] = {
          streamType: "extra", // 设置默认码流
          windowId: null, // 通道绑定的窗口id
          is3dOn: false // ptz-3d功能开启
        };
      }

      this.setCustomConfigs({
        channel: -1,
        configs: customConfigs
      });
    },
    async livePlay(channel) {
      const previewPlayerVm = this.$refs.previewPlayer,
        { windowId, streamType } = this.channelConfigs[channel],
        cfgs = {
          id: channel,
          beforeFrameRender() {
            // 仅执行一次该钩子函数，主要用于首次播放设置画面比例
            previewPlayerVm.setAspectRatio(playerVm);
            cfgs.beforeFrameRender = undefined;
          }
        };

      const playerVm = this.$players.find(vm => windowId === vm.windowId);
      const inited = await playerVm.initPlayer(cfgs);

      if (!inited) {
        this.$message.error(_("Failed to live view"));
        this.liveStop(channel);
        return;
      }

      const vol =
        windowId === this.activeWindowId ? previewPlayerVm.volumeNum : 0;

      const args = {
        playType: "live",
        control: "start",
        channel,
        streamType
      };

      await playerVm.play(args);
      playerVm.setVolume(vol);
    },
    liveStop(channel) {
      const channelCfg = this.channelConfigs[channel] || {},
        playerVm = this.$players.find(
          vm => channelCfg.windowId === vm.windowId
        );

      this.setCustomConfigs({
        channel,
        configs: { is3dOn: false }
      });

      playerVm && playerVm.stop(true);
    },
    switchStream(channel, streamType) {
      const { windowId } = this.channelConfigs[channel],
        { windowIndexList } = this.$refs["previewPlayer"];
      this.setCustomConfigs({
        channel,
        configs: { streamType }
      });

      if (windowId !== null && windowIndexList.includes(windowId)) {
        // const args = {
        //   playType: "live",
        //   control: "switch",
        //   channel,
        //   streamType
        // };
        // const playerVm = this.$players.find(vm => windowId === vm.windowId);
        // playerVm.player.sendWSMessage(args);
        // 播放当前分页与通道关联的窗口
        this.liveStop(channel);
        this.livePlay(channel);
      }
    }
  }
};
</script>

<style lang="scss">
.preview {
  display: flex;
  padding-bottom: 48px;
  height: 100%;
  .channel-list {
    flex: 0 0 256px;
  }
  .preview-player {
    flex: 1;
    height: 100%;
  }
  .ptz-control {
    $collapse-btn-width: 12px;
    flex: 0 0 256px + $collapse-btn-width;
    height: 100%;
  }
}
</style>
