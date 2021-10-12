<template>
  <div class="replay-player">
    <div ref="screenWrapper" class="screen-wrapper">
      <PlayScreen
        ref="playScreen"
        :active="$parent.activeWindowId"
        :count="numberPerPage"
        :ratio="allRatioValue"
        :index-list="windowIndexList"
        @click="changeActiveWindow"
        @dblclick="requestSingleFullscreen"
      />
      <ReplayTipsDialog
        :value="showError"
        @change="val => $emit('hide-error', val)"
      />
    </div>
    <!-- 时间线 -->
    <div class="replay-player-time">
      <div ref="timeBar" class="replay-player-time-bar">
        <TimeBar
          :active-channel="activeChannel"
          :barWidth="timeLineWidth"
          :current-time="currentTime"
          :date-format="dateFormat"
          :active-value="activeValue"
          :video-list="videoList"
          :cut-time-list="cutTimeList"
          @move="moveBar"
          @change-type="queryReplayVideo"
          :hours="hourType"
          :options="hourOptions"
        />
      </div>
      <v-select
        class="replay-player-time-select"
        :width="56"
        size="S"
        :value="hourType"
        :options="hourOptions"
        @change="queryReplayVideo"
      ></v-select>
    </div>

    <control-bar>
      <template #left>
        <Snapshot
          :window-id="$parent.activeWindowId"
          :channel-configs="channelConfigs"
        />
        <EditPlayer
          :disabled="!isReplayed"
          @cut-time="cutTime"
          @cut-video="cutVideo"
        />
        <Volume v-model="volumeNum" />
      </template>
      <!-- 播放按钮 -->
      <IconGroup
        :isReplayed="isReplayed"
        :play-speed="playSpeed"
        @click="replayHandler"
        @control-replay="controlReplay"
      />
      <template #right>
        <v-checkbox
          class="replay-player-success"
          v-model="videoCheckbox"
          @change="changeVideo"
          >{{ _("k#gYf#Normal") }}</v-checkbox
        >
        <v-checkbox
          class="replay-player-error"
          v-model="alertCheckbox"
          @change="changeAlert"
          >{{ _("V#zEY#Alarm") }}</v-checkbox
        >
        <i class="icon-full-screen icon-button-status" @click="fullScreen"></i>
      </template>
    </control-bar>
  </div>
</template>

<script>
// import { mapGetters, mapState } from "vuex";
import { getKeyById } from "@/utils/dicts";
import { on, off, parseDateToNum } from "@/utils/common.js";
import PlayScreen from "@/components/playScreen";
import ReplayTipsDialog from "./replayTipsDialog";
import ControlBar from "./controlBar";
import Snapshot from "./toolbar/snapshot";
import EditPlayer from "./toolbar/editPlayer";
import Volume from "@/views/preview/toolbar/volume";
import IconGroup from "./toolbar/iconGroup";
import TimeBar from "./toolbar/timeBar";
export default {
  name: "previewPlayer",
  components: {
    PlayScreen,
    ReplayTipsDialog,
    Snapshot,
    ControlBar,
    EditPlayer,
    Volume,
    IconGroup,
    TimeBar
  },
  inject: ["playAll", "stopAll", "pauseAll"],
  props: [
    "activeChannel",
    "channelConfigs",
    "showError",
    "currentTime",
    "videoList",
    "activeValue",
    "playSpeed",
    "hourType",
    "dateFormat"
  ],
  data() {
    return {
      currentPage: 1, // 当前分页
      allRatioValue: "full",
      videoCheckbox: true,
      alertCheckbox: true,
      timeLineWidth: 1160,
      volumeNum: 50,
      cutTimeList: [],
      hourOptions: [
        {
          value: 24,
          label: "24h"
        },
        {
          value: 12,
          label: "12h"
        },
        {
          value: 6,
          label: "6h"
        },
        {
          value: 1,
          label: "1h"
        }
      ]
    };
  },
  computed: {
    configsList() {
      return Object.values(this.channelConfigs);
    },
    movingTimeBar() {
      return this.$parent.movingTimeBar;
    },
    isReplayed() {
      return this.$parent.isReplayed;
    },
    onlineStatus() {
      return getKeyById("online", "status", "CHANNEL");
    },
    hostname() {
      return this.$store.state.hostname;
    },
    numberPerPage() {
      return this.activeChannel.length > 1 ? 4 : 1;
    },
    channelNumsSqrt() {
      return Math.sqrt(this.numberPerPage);
    },
    windowIndexList() {
      const list = [];

      for (
        let i = this.currentPage - 1, len = this.numberPerPage + i;
        i < len;
        i++
      ) {
        list.push(i);
      }
      return list;
    }
  },
  mounted() {
    this.$nextTick(() => this.setTimeBarWidth());
    on(window, "resize", this.setTimeBarWidth);
  },
  methods: {
    cutVideo(args) {
      this.$emit("cut-video", args);
    },
    cutTime(obj) {
      this.$set(this, "cutTimeList", [
        {
          recordType: 5,
          startTime:
            parseDateToNum(
              this.$parent.currentDate + " " + obj.startTime,
              "YYYY-MM-DD hh:mm:ss"
            ) / 1000,
          stopTime:
            parseDateToNum(
              this.$parent.currentDate + " " + obj.endTime,
              "YYYY-MM-DD hh:mm:ss"
            ) / 1000
        }
      ]);
    },
    moveBar(time) {
      //移动完成 播放
      this.$emit("change-time", time, true);
    },
    setTimeBarWidth() {
      this.$nextTick(() => {
        if (this.$refs.timeBar) {
          this.timeLineWidth = this.$refs.timeBar.offsetWidth - 60;
        }
      });
    },
    controlReplay(args) {
      //播放操作
      this.$parent.setCustomCfg(this.activeValue, args);
      this.$parent.setConfigTime(args);
    },
    //查询录像
    queryReplayVideo(hourType) {
      //当前时间
      // let currentTimeNum = parseDateToNum(this.currentTime) / 1000;
      // let halfTimeNum = (this.hourType * 60 * 60) / 2;

      let fileType = 0x0f; //全部录像

      if (!this.alertCheckbox) {
        //普通录像
        fileType = 0x01;
      } else if (!this.videoCheckbox) {
        //告警录像
        fileType = 0x04;
      }

      this.$emit("query-video", { fileType, hourType });
    },
    //修改声音
    changeVolume(val) {
      const playerVm = this.$parent.$players.find(
        ({ windowId }) => this.$parent.activeWindowId === windowId
      );

      this.volumeNum = val;
      playerVm.setVolume(val);
    },
    //修改视频类型
    changeVideo() {
      if (!this.videoCheckbox && !this.alertCheckbox) {
        this.alertCheckbox = true;
      }
      this.queryReplayVideo();
    },
    //修改视频类型
    changeAlert() {
      if (!this.videoCheckbox && !this.alertCheckbox) {
        this.videoCheckbox = true;
      }
      this.queryReplayVideo();
    },
    changeActiveWindow(id) {
      this.$parent.$players.forEach(vm => {
        if (this.$parent.activeWindowId === vm.windowId) {
          vm.setVolume(0);
        }
        if (id === vm.windowId) {
          vm.setVolume(this.volumeNum);
        }
      });
      this.$parent.activeWindowId = id;
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
    setAspectRatio(playerVm) {
      this.$refs.playScreen.setAspectRatio(playerVm, this.allRatioValue);
    },
    replayHandler() {
      if (this.activeChannel.length > 0) {
        this.isReplayed ? this.pauseAll() : this.playAll();
      }
    },

    /**
     * 单个窗口全屏
     */
    windowFullScreen(e) {
      const curWindow = e.target.parentNode;

      if (document.fullscreenElement === curWindow) {
        return document.exitFullscreen();
      }
      curWindow.requestFullscreen();
    },
    /**
     * 窗口容器全屏
     */
    fullScreen() {
      const {
        $refs: { screenWrapper }
      } = this;

      screenWrapper.requestFullscreen();
    }
  },
  beforeDestroy() {
    off(window, "resize", this.setTimeBarWidth);
  }
};
</script>

<style lang="scss">
.replay-player {
  display: flex;
  flex-direction: column;
  // padding-right: 12px;
  min-width: 1172px;
  .screen-wrapper {
    position: relative;
    flex: 1;
    font-size: 0;
    @include clearfix;
    .window-screen {
      float: left;
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #1b1d21;
      border: 1px solid $info-color;
      // cursor: zoom-in;

      .active-window-id {
        $border-width: 2px;
        position: absolute;
        top: -$border-width;
        right: -$border-width/2;
        bottom: -$border-width/2;
        left: -$border-width;
        border: $border-width solid $main-active-color;
      }
    }
  }
  &-time {
    position: relative;
    padding: 0 60px;
    border-left: 1px solid #ceced2;
    border-right: 1px solid #ceced2;
    &-bar {
      flex: 1 auto;
    }
    &-select {
      position: absolute;
      right: 6px;
      top: 12px;
    }
  }

  &-success {
    .v-checkbox__icon--active {
      background: $success-color;
      color: #fff;
    }
  }
  &-error {
    .v-checkbox__icon--active {
      background: $error-color;
      color: #fff;
    }
  }
  .control-bar {
    flex: 0 0 40px;
  }
}
</style>
