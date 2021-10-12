<template>
  <div class="preview-player" @contextmenu="contextmenuHandler">
    <PlayScreen
      ref="playScreen"
      :active="activeWindowId"
      :count="numberPerPage"
      :ratio="allRatioValue"
      :index-list="windowIndexList"
      @click="changeActiveWindow"
      @dblclick="requestSingleFullscreen"
    />
    <control-bar>
      <template #left>
        <Snapshot :window-id="activeWindowId" />
        <VideoRecord :window-id="activeWindowId" />
        <!-- <span class="taking icon-button-status">
        <i class="icon-nvr-talk"></i>
        <i class="icon-arrow-down"></i>
      </span> -->
        <Volume v-model="volumeNum" @change="changeVolume" />
        <StreamSwitch
          v-model="allStreamType"
          position="top-center"
          :show-after="true"
          @change="switchStreamToAll"
        />
        <AspectRatio v-model="allRatioValue" />
        <AreaEnlarge :window-id="activeWindowId" :ratio="allRatioValue" />
      </template>

      <template #right>
        <i
          v-tooltip="{
            enterable: false,
            betweenSpace: 0,
            content: isPreviewed ? _('Stop Live View') : _('Live View All')
          }"
          :class="[
            isPreviewed ? 'icon-pause' : 'icon-play',
            'icon-button-status'
          ]"
          @click="previewHandler"
        ></i>
        <Pagination
          :channel-num="configsList.length"
          :current-page="currentPage"
          :per-page="numberPerPage"
          @cur-page-change="curPageChange"
          @per-page-change="perPageChange"
        />
        <i
          v-tooltip="{
            enterable: false,
            betweenSpace: 0,
            content: _('Fullscreen')
          }"
          class="icon-full-screen icon-button-status"
          @click="requestAllFullscreen"
        ></i>
      </template>
    </control-bar>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import { getKeyById } from "@/utils/dicts";
import PlayScreen from "@/components/playScreen";
import ControlBar from "./controlBar";
import Snapshot from "./toolbar/snapshot";
import VideoRecord from "./toolbar/videoRecord";
import Volume from "./toolbar/volume";
import StreamSwitch from "./toolbar/streamSwitch";
import AspectRatio from "./toolbar/aspectRatio";
import AreaEnlarge from "./toolbar/areaEnlarge";
import Pagination from "./toolbar/pagination";
export default {
  name: "previewPlayer",
  components: {
    PlayScreen,
    ControlBar,
    Snapshot,
    VideoRecord,
    Volume,
    StreamSwitch,
    AspectRatio,
    AreaEnlarge,
    Pagination
  },
  inject: ["maxSupportedChannelNum", "liveStop", "livePlay", "switchStream"],
  data() {
    this.timer = null;
    this.fpsTickId;
    this.loopEndTime;
    this.loopBeginTime;
    this.count = 0;
    this.worker = null;
    return {
      currentPage: 1, // 当前分页
      numberPerPage: 4, // 当前分屏数
      // maxSupportedChannelNum: 16, // 测试使用
      // isAllRecorded: false,
      volumeNum: 50,

      allStreamType: "extra",
      allRatioValue: "full"
    };
  },
  computed: {
    ...mapState({
      $players: "$players",
      activeChannel: "activeChannel",
      activeWindowId: "activeWindowId"
    }),
    ...mapGetters({
      channelConfigs: "channelConfigs",
      configsList: "channelCfgList"
    }),
    isPreviewed() {
      return Object.values(this.channelConfigs).some(
        ({ windowId }) => windowId !== null
      );
    },
    onlineStatus() {
      return getKeyById("online", "status", "CHANNEL");
    },
    hostname() {
      return this.$store.state.hostname;
    },
    // channelNumsSqrt() {
    //   return Math.sqrt(this.numberPerPage);
    // },
    windowIndexList() {
      const list = [];

      for (
        let i = (this.currentPage - 1) * this.numberPerPage,
          len = this.numberPerPage + i;
        i < len;
        i++
      ) {
        list.push(i);
      }
      console.log("screen list change", list);
      return list;
    }
  },
  beforeDestroy() {
    this.stopAll();
  },
  methods: {
    ...mapMutations([
      "setActiveChannel",
      "setActiveWindowId",
      "setCustomConfigs"
    ]),
    contextmenuHandler(e) {
      return e.preventDefault();
    },
    changeVolume(val) {
      const playerVm = this.$players.find(
        ({ windowId }) => this.activeWindowId === windowId
      );

      this.volumeNum = val;
      playerVm.setVolume(val);
    },
    changeActiveWindow(id) {
      const { channel } =
        this.configsList.find(({ windowId }) => windowId === id) || {};
      this.$players.forEach(vm => {
        if (this.activeWindowId === vm.windowId) {
          vm.setVolume(0);
        }
        if (id === vm.windowId) {
          vm.setVolume(this.volumeNum);
        }
      });

      if (channel !== undefined && channel !== this.activeChannel) {
        // 聚焦窗口处于预览状态，与之绑定的通道设置为当前选中通道
        this.setActiveChannel(channel);
      }

      if (this.windowIndexList.includes(id)) {
        // 需要修改的窗口id必须在当前分页，否则不修改
        this.setActiveWindowId(id);
      }
    },
    /**
     * 切换所有通道码流
     * @param {String} streamType 码流类型
     */
    switchStreamToAll(streamType) {
      const channels = Object.keys(this.channelConfigs); // 通道号列表

      channels.forEach(channel => this.switchStream(channel, streamType));
    },
    setAspectRatio(playerVm) {
      this.$refs.playScreen.setAspectRatio(playerVm, this.allRatioValue);
    },
    /**
     * 预览全部通道视频画面
     * 通道&窗口id的绑定 与分页无关
     */
    playAll() {
      let windowId = 0; // 窗口id，从0开始
      this.configsList.forEach(({ channel, status }) => {
        if (status === this.onlineStatus) {
          this.setCustomConfigs({
            channel,
            configs: { windowId }
          });

          if (this.windowIndexList.includes(windowId)) {
            this.$nextTick(() => {
              this.livePlay(channel);
            });
          }

          windowId++;
        }
      });
    },
    /**
     * 停止预览全部通道视频画面
     */
    stopAll() {
      this.configsList.forEach(({ channel }) => {
        this.liveStop(channel);
        this.setCustomConfigs({
          channel,
          configs: { windowId: null }
        });
      });
    },
    /**
     * 获取该通道的分辨率
     * @param {Number} channel 通道号
     */
    getResolution(channel) {
      const config = this.channelConfigs[channel];
      const { width, height } = config[`${config.streamType}Format`];

      return [width, height];
    },

    previewHandler() {
      this.isPreviewed ? this.stopAll() : this.playAll();
    },

    /**
     * 翻页事件触发
     * @param {Number} val 将要跳转的分页
     * @param {Boolean} isSetDefault 分页跳转后是否设置“聚焦窗口”默认值，默认值为当前分页的第1个
     */
    curPageChange(val, isSetDefault = true) {
      this.paginationLiveControl("liveStop");

      this.currentPage = val;
      isSetDefault && this.changeActiveWindow((val - 1) * this.numberPerPage);

      this.$nextTick(() => {
        this.paginationLiveControl("livePlay");
      });
    },
    perPageChange(val) {
      console.log("per page change", val);
      this.numberPerPage = val;
    },
    paginationLiveControl(action) {
      this.windowIndexList.forEach(windowId => {
        const cfg = this.configsList.find(cfg => cfg.windowId === windowId);

        if (cfg) {
          this[action](cfg.channel);
        }
      });
    },

    /**
     * 单个窗口全屏
     */
    requestSingleFullscreen(e) {
      const curWindow = e.target.parentNode;

      if (document.fullscreenElement === curWindow) {
        return document.exitFullscreen();
      }
      curWindow.requestFullscreen();
    },
    /**
     * 视频窗口容器全屏
     */
    requestAllFullscreen() {
      const {
        $refs: { playScreen }
      } = this;

      playScreen.$el.requestFullscreen();
    },
    setGetFPSInterval(clearNum) {
      if (clearNum === -1) return; // 已开始执行setTimout传入的函数，还在等待fpsTick执行完成时清除定时器

      this.timer = setTimeout(async () => {
        clearTimeout(this.timer);
        this.count = 0;
        this.loopBeginTime = new Date().getTime();
        await this.fpsTick();
        this.setGetFPSInterval(this.timer);
      });
    },
    clearGetFPSInterval() {
      clearTimeout(this.timer);
      this.timer = -1;
    },
    fpsTick() {
      return new Promise(resolve => {
        this.fpsTickId = requestAnimationFrame(() => {
          this.loopEndTime = new Date().getTime();
          this.count++;
          cancelAnimationFrame(this.fpsTickId);
          if (
            this.loopEndTime - this.loopBeginTime >= 5000 &&
            this.timer !== -1
          ) {
            console.log(
              parseInt(
                (1000 * this.count) / (this.loopEndTime - this.loopBeginTime)
              )
            );
            return resolve(true);
          }
          resolve(this.fpsTick());
        });
      });
    },

    loopGetFPS() {
      if (this.worker === null) {
        this.worker = new Worker();
        this.count = 0;
        this.loopBeginTime = new Date().getTime();
        this.worker.addEventListener("message", e => {
          const fps = e.data;
          if (typeof fps === "number") {
            console.log('fps', fps)
            this.loopGetFPS();
          }
        });
      }

      this.worker.postMessage("loop");
    },
    cancelLoop() {
      if (this.worker === null) return;

      this.worker.terminate();
      this.worker = null;
    }
  },
  watch: {
    isPreviewed(val) {
      if (val) {
        this.setGetFPSInterval(0);
        // this.loopGetFPS();
      } else {
        this.clearGetFPSInterval();
        // this.cancelLoop();
      }
    },
    // 主要用于：双击已播放通道跳转回该通道绑定的窗口及分页
    activeWindowId(newVal) {
      const { windowIndexList: idxList, numberPerPage: perPage } = this;

      if (!idxList.includes(newVal)) {
        // 聚焦窗口不在当前页
        const cur =
          perPage === 1 ? newVal + 1 : Math.floor(newVal / perPage) + 1;

        this.curPageChange(cur, false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-player {
  display: flex;
  flex-direction: column;
  .screen-wrapper {
    flex: 1;
  }
  .control-bar {
    flex: 0 0 40px;
  }
}
</style>
