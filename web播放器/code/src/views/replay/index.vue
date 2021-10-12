<template>
  <div class="replay">
    <ChannelList
      :channel-configs="channelConfigs"
      :active-channel="activeChannel"
      :active-value="activeValue"
      :active-window-id="activeWindowId"
      @change-channel="changeChannel"
      @change-group="changeGroup"
    >
      <DatePannel
        :active-day-list="activeDayList"
        :current-date="currentDate"
        @change-date="changeDate"
        @change-header="changeHeader"
      />
    </ChannelList>

    <RePlayer
      ref="rePlayer"
      :channel-configs="channelConfigs"
      :active-channel="activeChannel"
      :active-value="activeValue"
      :current-time="currentTime"
      :date-format="dateFormat"
      :play-speed="playSpeed"
      :video-list="videoDateConfig"
      :show-error="showError"
      :hour-type="hourType"
      @hide-error="val => setErrorDialogVisible(val)"
      @change-time="changeTime"
      @query-video="changeVideoType"
      @cut-video="cutVideo"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getKeyById, getValueByKey } from "@/utils/dicts";
import { formatDateToString, parseDateToNum } from "@/utils/common.js";
import DateObjMixin from "./dateObjMixin";
import ChannelList from "./channelList";
import RePlayer from "./rePlayer";
import DatePannel from "./datePannel";

const defaultHourType = 24;
export default {
  name: "preveiw",
  components: {
    ChannelList,
    RePlayer,
    DatePannel
  },
  mixins: [DateObjMixin],
  provide() {
    return {
      timeFormat: this.timeFormat,
      maxSupportedChannelNum: this.maxSupportedChannelNum,
      maxSplitScreenCount: this.maxSplitScreenCount,
      playAll: this.playAll,
      stopAll: this.stopAll,
      pauseAll: this.pauseAll
    };
  },
  data() {
    this.channelListUrl = "/RPC2:configManager.getConfig:RemoteDevice";
    this.vaConfigsUrl = "/RPC2:configManager.getConfig:Encode";
    this.timeConfigsUrl = "/RPC2:global.getCurrentTime";
    this.dateReplayUrl = "/RPC2:magicBox.getPlayableDate"; //获取回放视频时间
    this.videoReplayUrl = "/RPC2:magicBox.getRecordFileList"; //获取视频片段历史记录
    this.cutUrl = "/media_downloadVideo.do";
    this.timeFormat = "YYYY-MM-DD hh:mm:ss";

    return {
      dateFormat: "",
      channelList: [], // 通道列表数据
      vaConfigs: [], // va: video & audio 通道音视频配置
      customConfigs: {}, // 自定义配置
      activeChannel: [],
      replayTimer: null,
      activeValue: "",
      activeWindowId: 0, // 聚焦窗口, 默认：0
      videoDateConfig: {}, //视频片段对象
      movingTimeBar: false,
      showError: false,
      hourType: defaultHourType,
      fileType: 0x0f,
      isPlayNowOn: false, // 是否从currentTime开始播放

      activeDayData: {}, //所有通道当前存在回放视频的时间日期
      searchDayData: {}, // 仅用于切换日期panel显示角标(未选中具体日期)
      playSpeed: 4 //播放速度
    };
  },
  computed: {
    ...mapState({
      hostname: "hostname",
      $players: "$players",
      MACRO_CONFIG: "MACRO_CONFIG",
      channelAuth: ({ authorityList: { monitor } }) => {
        return monitor;
      }
    }),
    // 设备最大支持通道数
    maxSupportedChannelNum() {
      return this.MACRO_CONFIG.VideoInputChannels;
      // return 16;
    },
    // 设备最大支持分屏数（播放数量）
    maxSplitScreenCount() {
      return this.MACRO_CONFIG.maxSplitScreenCount;
    },
    channelConfigs() {
      const {
        channelList,
        vaConfigs,
        customConfigs,
        channelAuth,
        listToObject
      } = this;
      const id = "channel";
      const channelObj = listToObject(channelList, id),
        configObj = listToObject(vaConfigs, id);

      const mixObj = {};
      Object.keys(channelObj).forEach(item => {
        if (!channelAuth.includes(+item)) {
          // 没有权限不填入数据
          return;
        }
        const custom = customConfigs[item] || {};
        mixObj[item] = {
          ...channelObj[item],
          ...configObj[item],
          ...custom
        };
      });
      return mixObj;
    },
    isReplayed() {
      // return false;
      return this.$players.some(player => player.status === "playing");
    },
    //当前存在回放视频的时间日期
    activeDayList() {
      const cfg =
        Object.values(this.channelConfigs).find(
          ({ windowId }) => windowId === this.activeWindowId
        ) || {};

      return this.searchDayData[cfg.channel] || [];
    },
    // 当前月所有“已打勾”通道回放日期
    activeDayListForMonth() {
      const { activeDayData, activeChannel } = this;
      let dates = [];

      for (const channel in activeDayData) {
        if (activeChannel.includes(+channel)) {
          dates = [...dates, ...activeDayData[channel]];
        }
      }

      return dates.sort((cur, next) => {
        cur = cur.slice(-2);
        next = next.slice(-2);

        return cur - next;
      });
    },
    // 所选日期存在回放片段
    hasClipsInSelectedDate() {
      return this.activeDayListForMonth.includes(this.currentDate);
    },
    onlineStatusKey() {
      // 状态连接正常的key
      return getKeyById("online", "status", "CHANNEL");
    }
  },
  async created() {
    await this.getChannelInfo();
    let dateStr = formatDateToString(
      new Date(this.systemTime),
      this.timeFormat
    );
    this.changeTime(dateStr, true);
  },
  methods: {
    //剪辑
    cutVideo(subObj) {
      function replaceTime(time) {
        return time.replace(/[-:\s]/g, "");
      }
      let beginTime = replaceTime(this.currentDate + " " + subObj.startTime),
        endTime = replaceTime(this.currentDate + " " + subObj.endTime),
        activeValue = this.activeValue;
      let url =
        this.cutUrl +
        "?begintime=" +
        beginTime +
        "&endtime=" +
        endTime +
        "&channelnum=" +
        activeValue;

      this.$axios({
        url: url,
        method: "post",
        responseType: "arraybuffer" // arraybuffer是js中提供处理二进制的接口
      }).then(res => {
        subObj.callback && subObj.callback();

        // 用返回二进制数据创建一个Blob实例
        let blob = new Blob([res.data], {
          type: "text/plain"
        });

        // 通过URL.createObjectURL生成文件路径
        let fileUrl = window.URL.createObjectURL(blob);
        // 创建a标签
        let ele = document.createElement("a");
        ele.style.display = "none";

        // 设置href属性为文件路径，download属性可以设置文件名称
        ele.href = fileUrl;
        //console.log(fileUrl);
        ele.download = `${activeValue}_${beginTime}_${endTime}.dav`;

        // 将a标签添加到页面并模拟点击
        document.querySelectorAll("body")[0].appendChild(ele);
        ele.click();

        // 移除a标签
        ele.remove();
      });
    },
    changeTime(time, isMovingBar) {
      this.currentTime = time;
      if (isMovingBar) {
        clearInterval(this.replayTimer);
        this.isPlayNowOn = true;
        this.changeDate(this.currentDate);
      }
    },
    async changeDate(date, next = true) {
      // todo: 切换日期与currentDate月份相同，不发送新请求
      this.searchDate = this.currentDate = date;

      if (next && this.activeChannel.length > 0) {
        this.stopAll(true);
        await this.getReplayDate();
        if (this.hasClipsInSelectedDate) {
          await this.getReplayClips();
          this.playAll();
        } else {
          this.checkDateVideo();
        }
      }
    },
    translateDate(dayStr) {
      let dayArr = Number(dayStr)
          .toString(2)
          .split("")
          .reverse(),
        dayList = [],
        year = this.searchYear,
        month = this.searchMonth;
      if (+month < 10) {
        month = "0" + month;
      }
      dayArr.forEach((item, index) => {
        if (+item === 1) {
          dayList.push(`${year}-${month}-${("00" + (index + 1)).slice(-2)}`);
        }
      });
      return dayList;
    },
    //获取时间日期存在回放视频
    async getReplayDate(isJustSearch = false) {
      const { searchYear, searchMonth, activeChannel } = this;

      if (activeChannel.length === 0) {
        this.searchDayData = {};
        this.activeDayData = {};
        return;
      }

      const axiosArr = [];
      activeChannel.forEach(channel => {
        axiosArr.push(
          this.$axiosPost(this.dateReplayUrl, {
            year: searchYear,
            month: searchMonth,
            channel
          })
        );
      });
      const resArr = await this.$axiosAll(axiosArr);
      resArr.forEach((res, idx) => {
        res = res.getParams();
        res = this.translateDate(res.bitmap);

        this.$set(this.searchDayData, activeChannel[idx], res);
        if (!isJustSearch) {
          this.$set(this.activeDayData, activeChannel[idx], res);
        }
      });
    },
    //获取当前时间回放记录
    async getReplayClips() {
      const { activeChannel: channels, currentTime: time, fileType } = this;

      if (!this.hasClipsInSelectedDate || channels.length === 0) {
        return;
      }

      const timeNum = defaultHourType * 1.5 * 60 * 60;
      const startTime = parseDateToNum(time, this.timeFormat) / 1000 - timeNum;
      const endTime = startTime + timeNum * 2;
      const config = {
        playType: "replay",
        startTime,
        endTime,
        control: "query",
        fileCount: null,
        fileType
      };

      const axiosArr = channels.map(channel =>
        this.$axiosPost(this.videoReplayUrl, { ...config, channel })
      );

      const resArr = await this.$axiosAll(axiosArr);
      resArr.forEach((res, idx) =>
        this.$set(
          this.videoDateConfig,
          this.activeChannel[idx],
          res.getParams() || []
        )
      );
    },
    changeChannel(channel, isChangeGroup) {
      let oldChannels = [...this.activeChannel],
        newChannels = [...channel],
        activeWinId = channel.length - 1;
      const newLen = newChannels.length,
        isPlayNowOn = !isChangeGroup && oldChannels.length && newLen; // 未传入值，change之前在播放，change之后也要播放，则从currentTime开始播放

      const isJumpToCurrent = this.searchDate !== this.currentDate && newLen;
      if (isJumpToCurrent) {
        this.changeDate(this.getTheDate(this.currentDate), false);
      }
      this.stopAll(true);
      this.activeChannel = channel;

      this.$nextTick(async () => {
        isJumpToCurrent &&
          this.changeDate(this.getTheDate(this.currentDate, "PREV"), false);

        oldChannels.forEach(old => {
          this.setCustomCfg(old, { windowId: null, playerVm: null });
        });

        channel.forEach((chl, idx) => {
          this.setCustomCfg(chl, {
            windowId: idx,
            playerVm: this.$players.find(({ windowId }) => idx === windowId)
          });
        });

        for (let i = oldChannels.length - 1; i >= 0; i--) {
          const idx = newChannels.indexOf(oldChannels[i]);

          if (idx !== -1) {
            oldChannels.splice(i, 1);
            newChannels.splice(idx, 1);
          }
        }

        if (!isChangeGroup) {
          // 未修改分组
          let idx = channel.indexOf(this.activeValue);
          if (oldChannels.length > 0 && channel.length > 0) {
            // 去掉了某些通道的勾选
            activeWinId = idx > -1 ? idx : 0;
          }
          if (newChannels.length > 0) {
            // 添加了某些通道的勾选
            const lastChannel = newChannels[newChannels.length - 1],
              cfg = this.channelConfigs[lastChannel];
            activeWinId = cfg.windowId;
          }
        }

        if (channel.length > 0) {
          const cur = Object.values(this.channelConfigs).find(
            ({ windowId }) => windowId === activeWinId
          );
          this.activeValue = cur.channel;
          this.activeWindowId = activeWinId;
          await this.getReplayDate();
          if (this.hasClipsInSelectedDate) {
            await this.getReplayClips();
            this.isPlayNowOn = isPlayNowOn;
            this.playAll();
          } else {
            this.checkDateVideo();
          }
        }
      });
    },
    changeHeader({ year, month }) {
      this.searchYear = year;
      this.searchMonth = month;
      if (this.activeChannel.length > 0) {
        this.getReplayDate(true);
      }
    },
    checkDateVideo() {
      const {
        systemDate,
        systemTime,
        activeDayListForMonth,
        currentDate,
        year,
        month,
        systemYear,
        systemMonth,
        searchMonth,
        searchYear
      } = this;
      const len = activeDayListForMonth.length;
      const isSameAsSystem = year === systemYear && month === systemMonth;

      if (month !== searchMonth) {
        // 搜索的月份不是选中日期的月份，不校验
        return;
      }

      if (new Date(currentDate) >= new Date(systemDate)) {
        // if (len > 0 && activeDayListForMonth.includes(currentDate)) {
        //   return true;
        // }
        this.setErrorDialogVisible();
      } else if (len > 0) {
        // 选中日期的月份存在数据
        const date = activeDayListForMonth.find(
          active => parseDateToNum(active) >= parseDateToNum(currentDate)
        );
        this.changeTime(`${date || systemDate} 00:00:00`, true);
      } else if (isSameAsSystem && activeDayListForMonth.length === 0) {
        // 找到与系统时间的月份相同，没有录像日期，设置系统时间日期为选中日期
        this.changeTime(systemTime);
        this.stopAll(true);
      } else {
        // 往下一个月1号开始找
        // 设置searchMonth时从0开始，取searchMonth会自动加1
        if (searchMonth === 12) {
          // 跨年处理
          this.searchMonth = 0;
          this.searchYear = searchYear + 1;
        } else {
          this.searchMonth = searchMonth;
        }

        this.searchDay = 1;
        this.changeDate(this.searchDate);
      }
    },
    // 检查每个通道在当前时间是否有回放片段，有就播放，没有就停止
    checkTimeClips() {
      this.activeChannel.forEach(channel => {
        const videoDays = this.activeDayData[channel],
          videoClips = this.videoDateConfig[channel] || [];
        const timeNum =
          parseDateToNum(this.currentTime, this.timeFormat) / 1000;
        const { playerVm } = this.channelConfigs[channel],
          isPlaying = playerVm.status === "playing";

        if (
          !videoDays ||
          !videoDays.includes(this.currentDate) ||
          !videoClips.some(
            ({ startTime, stopTime }) =>
              timeNum >= startTime && timeNum <= stopTime
          )
        ) {
          // 该通道在选中日期内没有视频回放片段，不播放
          this.replayStop(channel, true);
          return;
        }

        if (isPlaying) return;
        this.replayPlay(channel);
      });
    },
    /**
     * 重置时间
     */
    resetTime() {
      const curTime = this.isPlayNowOn
        ? this.currentTime
        : `${this.currentDate} 00:00:00`;
      let newTime = curTime;
      // let timeValue = (this.hourType / 2) * 60 * 60;
      let timeNum = parseDateToNum(curTime, this.timeFormat) / 1000;
      let timeList = [];

      //合并所有选中的通道的时间组
      let startTimeArr = [];
      let stopTimeArr = [];
      this.activeChannel.forEach(channel => {
        let channelTimeList = this.videoDateConfig[channel] || [];
        if (channelTimeList.length > 0) {
          startTimeArr.push(channelTimeList[0].startTime);
          stopTimeArr.push(
            channelTimeList[channelTimeList.length - 1].stopTime
          );
        }

        timeList = timeList.concat(channelTimeList);
      });

      startTimeArr = startTimeArr.sort((a, b) => a - b);
      stopTimeArr = stopTimeArr.sort((a, b) => a - b);

      //判断当前时间是否有视频
      const isInsideVideo = timeList.some(
        item => item.startTime <= timeNum && item.stopTime >= timeNum
      );

      if (!isInsideVideo) {
        timeList = timeList.sort((a, b) => a.startTime - b.startTime);
        const timeItem = timeList.find(({ startTime }) => startTime >= timeNum);

        if (timeItem) {
          newTime = formatDateToString(
            timeItem.startTime * 1000,
            this.timeFormat
          );
        }
      }

      let maxTime = stopTimeArr.slice(-1)[0] || timeNum;
      if (timeNum >= maxTime) {
        const cur = new Date(this.currentDate),
          sys = new Date(this.systemDate);

        this.stopAll(true);
        if (cur >= sys) {
          //超过最大值时，将最大值赋给当前时间，并停止所有通道回放
          newTime = formatDateToString(maxTime * 1000, this.timeFormat);
        } else {
          const nextDate = this.getTheDate(this.currentDate);
          this.changeDate(nextDate);
          return;
        }
      }
      this.changeTime(newTime);
    },
    setTimeBarInterval() {
      clearInterval(this.replayTimer);
      let speed = 1 / Math.pow(2, this.playSpeed - 4);
      this.replayTimer = setInterval(() => {
        let timeNum = parseDateToNum(this.currentTime, this.timeFormat);
        const time = formatDateToString(timeNum + 1000, this.timeFormat);
        this.changeTime(time);

        if (!this.movingTimeBar) {
          this.checkTimeClips();
          this.isPlayNowOn = true;
          this.resetTime();
          this.isPlayNowOn = false;
          this.isReplayed && this.checkTimeClips();
        }
      }, 1000 * speed);
    },

    setErrorDialogVisible(vislble = true) {
      this.showError = vislble;
    },

    //设置信道个数
    changeGroup() {
      this.stopAll(true);
    },
    // 修改回放文件类型
    async changeVideoType({ fileType, hourType }) {
      this.fileType = fileType;
      if (hourType) {
        this.hourType = hourType;
      }
      // await this.getReplayClips();

      if (!hourType) {
        await this.getReplayClips();
        if (this.isReplayed) {
          // 在播放时切换文件类型
          this.isPlayNowOn = true;
          this.stopAll(true);
        }

        if (this.hasClipsInSelectedDate) {
          this.playAll();
        }
      }
    },

    listToObject(list, key) {
      const obj = {};
      list.forEach(item => {
        obj[item[key]] = item;
      });

      return obj;
    },
    async getChannelInfo() {
      const getChannelList = this.$axiosPost(this.channelListUrl);
      const getTimeConfigs = this.$axiosPost(this.timeConfigsUrl);
      const getVideoAudioConfigs = this.$axiosPost(this.vaConfigsUrl);
      let [channelList, configs, timeConfigs] = await this.$axiosAll([
        getChannelList,
        getVideoAudioConfigs,
        getTimeConfigs
      ]);
      if (channelList.status !== 200 || configs.status !== 200) {
        return;
      }
      this.channelList = this.formatChannelList(channelList.getParams());
      this.activeChannel = [];
      this.vaConfigs = configs.getParams() || [];

      timeConfigs = timeConfigs.getParams();

      if (timeConfigs) {
        this.dateFormat = getValueByKey(
          timeConfigs.timeFormat,
          "timeFormat",
          "CONFIG"
        );
        this.systemTime = timeConfigs.time;
      }

      this.setDefaultCustomConfigs(this.channelList);
    },
    /**
     * 列表数量根据设备支持通道数显示
     */
    formatChannelList(list = []) {
      if (list.length === 0) {
        return list;
      }

      const defaultList = [],
        len = this.maxSupportedChannelNum;
      for (let i = 0; i < len; i++) {
        let item = list.find(({ channel }) => channel === i);

        if (item) {
          item = { ...item, title: `D${item.channel + 1} ${item.title}` };
        } else {
          item = {
            channel: i,
            title: `D${i + 1}`
          };
        }

        defaultList.push(item);
      }

      return defaultList;
    },
    // 设置自定义配置的默认值
    setDefaultCustomConfigs(list = []) {
      const len = list.length;
      for (let i = 0; i < len; i++) {
        const { channel } = list[i];
        this.customConfigs[channel] = {
          playerVm: null, // 播放器实例
          streamType: "extra", // 设置默认码流
          windowId: null // 通道绑定的窗口id
        };
      }
    },
    setCustomCfg(channel, cfgs) {
      const curCfg = this.customConfigs[channel];

      this.customConfigs[channel] = { ...curCfg, ...cfgs };
      this.customConfigs = { ...this.customConfigs };
    },

    beforeFrameRender() {
      //console.log(cfg);
    },
    async replayPlay(channel) {
      const previewPlayerVm = this.$refs.rePlayer;
      const { windowId, streamType, playerVm } = this.channelConfigs[channel],
        cfgs = { id: channel };
      const inited = await playerVm.initPlayer(cfgs);

      if (!inited) {
        this.$message.error(_("Failed to live view"));
        this.replayStop(channel, true);
        return;
      }
      const vol =
        windowId === this.activeWindowId ? previewPlayerVm.volumeNum : 0;

      let time = parseDateToNum(this.currentTime, this.timeFormat) / 1000;
      const args = {
        playType: "replay",
        control: "start",
        time,
        channel,
        streamType
      };
      this.playSpeed = 4;

      await playerVm.play(args);
      // previewPlayerVm.setAspectRatio(playerVm);
      playerVm.setVolume(vol);
    },
    replayStop(channel, isClear) {
      const { playerVm } = this.channelConfigs[channel] || {};

      playerVm && playerVm.stop(isClear);
    },
    playAll() {
      this.resetTime();
      this.isPlayNowOn = false;
      this.checkTimeClips();
    },
    pauseAll() {
      this.isPlayNowOn = true;
      this.stopAll();
    },
    stopAll(isClear = false) {
      const channels = this.activeChannel;
      clearInterval(this.replayTimer);
      channels.forEach(channel => {
        this.replayStop(channel, isClear || !this.isPlayNowOn);
      });
    },

    //快进 快退
    setConfigTime(obj) {
      //回退30s
      let timeNum = parseDateToNum(this.currentTime, this.timeFormat);

      if (obj.control === "back") {
        timeNum -= 30 * 1000;
      } else if (obj.control === "forward") {
        timeNum += 30 * 1000;
      } else if (obj.control === "speed") {
        //倍数

        this.playSpeed = obj.num;

        this.setTimeBarInterval();
      }
      //TODO
      //发送数据
      const { windowId } = this.channelConfigs[this.activeValue];
      const playerVm = this.$players.find(vm => windowId === vm.windowId);

      //let time = parseDateToNum(this.currentTime, this.timeFormat) / 1000;
      const args = {
        playType: "replay",
        //control: "start",
        // time: time,
        channel: this.activeValue
        //streamType
      };
      playerVm && playerVm.player.sendWSMessage(Object.assign(args, obj));

      this.currentTime = formatDateToString(timeNum, this.timeFormat);
    }
  },
  watch: {
    isReplayed(val) {
      if (val) {
        this.setTimeBarInterval();
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.replayTimer);
  }
};
</script>

<style lang="scss">
.replay {
  $bottom: 48px;
  $left-side-width: 256px;
  // display: flex;
  position: relative;
  padding-bottom: $bottom;
  height: 100%;
  .re-channel-list {
    width: $left-side-width;
  }
  .replay-player {
    // flex: 1;
    // height: 100%;
    position: absolute;
    top: 0;
    right: 12px;
    bottom: $bottom;
    left: $left-side-width;
  }
}
</style>
