<template>
  <div class="player">
    <!-- <canvas ref="canvas"></canvas> -->
    <canvas ref="canvas" :width="resolutionW" :height="resolutionH"></canvas>

    <div v-show="isRecording" class="recording-card">
      <span class="record-dot"></span>
      <span class="record-text">{{ recordText }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { isFunction } from "@/utils/common";
const { Player } = window;
const defaultWidth = 300;
const secPerHour = 1 * 60 * 60;
const STATUS = {
  pending: "pending",
  inited: "inited",
  playing: "playing",
  paused: "paused",
  error: "error"
};
export default {
  props: {
    windowId: Number,
    isMountedInitPlayer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      player: null,
      status: STATUS.pending,

      isInited: false, // 播放器是否已初始化
      isRecording: false, // 是否在录像
      isEnlarged: false, // 是否已放大，仅能放大一次
      isEnlargeEnabled: false, // 是否处于区域放大状态
      recordingTimer: null,
      recorder: null, // MediaRecorder实例
      recordSec: 0,

      resolutionW: defaultWidth,
      resolutionH: defaultWidth / 2,
      cfgs: {
        // id,  // 通道号
        // canvas,  // canvas元素
      }
    };
  },
  computed: {
    ...mapState({
      hostname: "hostname",
      WebSocketPort(state) {
        return state.MACRO_CONFIG.WebSocketPort || "9001";
      }
    }),
    recordText() {
      let minutes = Math.floor(this.recordSec / 60),
        seconds = this.recordSec - minutes * 60;

      minutes = minutes.toString().length > 1 ? minutes : `0${minutes}`;
      seconds = seconds.toString().length > 1 ? seconds : `0${seconds}`;

      return `${minutes}:${seconds}`;
    },
    wsAddr() {
      // 端口
      return `ws://${this.hostname}:${this.WebSocketPort}`;
    }
  },
  mounted() {
    if (this.isMountedInitPlayer) {
      this.initPlayer();
    }
    window.addEventListener("beforeunload", this.destoryHandle);
  },
  beforeDestroy() {
    this.destoryHandle();
  },
  methods: {
    destoryHandle() {
      this.clearRecordingTimeout(true);
      if (this.status === STATUS.inited || this.status === STATUS.playing) {
        this.stop(true);
      }
    },
    async initPlayer(cfgs) {
      this.cfgs = cfgs;
      this.player = new Player({
        ...cfgs,
        canvas: this.$refs.canvas,
        wsAddr: this.wsAddr,
        beforeVideoFrameRender: this.beforeVideoFrameRender
      });

      this.isInited = await this.player.init();

      if (this.isInited) {
        this.status = STATUS.inited;
      } else {
        this.status = STATUS.error;
        console.error("init player video or audio decoder failed");
      }
      console.log(this.player);

      return this.isInited;
    },
    async play(args) {
      if (this.isInited) {
        try {
          // this.status = "playing";

          const isConnected = await this.player.startConnect();

          if (isConnected) {
            this.status = STATUS.playing;
            this.player.sendWSMessage(args);
          }
        } catch (e) {
          // websocket建立连接失败
          this.status = STATUS.error;
          console.error("websocket connect failed");
        }
      } else {
        requestAnimationFrame(() => {
          console.log("video/audio decoder not ready");
          this.play(args);
        });
      }
    },
    stop(isClear) {
      const { inited, playing, paused, pending } = STATUS;

      if (this.status === playing || this.status === inited) {
        this.player.stopConnect();
      }
      // this.flushDecoder();
      this.status = paused;

      const { webglPlayer } = this.player || {};
      const gl = webglPlayer && webglPlayer.gl;
      if (isClear) {
        this.status = pending;
        if (gl) {
          // 如果传入true，则清空canvas内容
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }

      // pcmPlayer.close();

      if (this.isRecording) {
        // 停止播放时在录像，则停止录像并保存
        this.isRecording = false;
        this.recorder.stopThenDownload();
      }

      if (this.isEnlargeEnabled) {
        // 停止重置区域放大功能
        this.isEnlarged = false;
        this.isEnlargeEnabled = false;
        this.resetCanvasStyle();
      }
    },

    /**
     * 视频帧渲染前钩子函数
     * @param {Object} cfg - 视频配置数据，目前支持：分辨率（宽高）、pts、当前时间
     */
    beforeVideoFrameRender(cfg) {
      const { width, height } = cfg,
        {
          resolutionW,
          resolutionH,
          cfgs: { beforeFrameRender }
        } = this;

      if (resolutionW !== width || resolutionH !== height) {
        // 如果分辨率不同，则更新分标率
        this.resolutionW = width;
        this.resolutionH = height;
      }

      // 往外暴露每一帧的配置数据
      isFunction(beforeFrameRender) && beforeFrameRender(cfg);
    },

    setVolume(volume) {
      if (this.status !== STATUS.playing) {
        return;
      }

      console.log(volume);
      const { pcmPlayer } = this.player;

      if (pcmPlayer) {
        pcmPlayer.setVolume(volume);
      } else {
        this.player.volume = volume;
      }
    },
    increaseVolume() {
      const maxVolume = 100;
      let volume = this.player.pcmPlayer.getVolume();

      volume = volume >= maxVolume ? maxVolume : ++volume;
      this.setVolume(volume);
    },
    decreaseVolume() {
      const minVolume = 0;
      let volume = this.player.pcmPlayer.getVolume();

      volume = volume <= minVolume ? minVolume : --volume;
      this.setVolume(volume);
    },

    setRecordingTimeout() {
      this.recordingTimer = setTimeout(() => {
        if (this.recordSec > secPerHour - 1) {
          return this.clearRecordingTimeout(true);
        }

        this.recordSec++;
        this.clearRecordingTimeout();
        this.setRecordingTimeout();
      }, 1000);
    },
    clearRecordingTimeout(isReset) {
      if (isReset) {
        this.recordSec = 0;
      }

      clearTimeout(this.recordingTimer);
    },
    resetCanvasStyle() {
      const {
        $refs: {
          canvas: { style: canvasStyle }
        }
      } = this;

      canvasStyle.width = "100%";
      canvasStyle.height = "100%";
      canvasStyle.top = 0;
      canvasStyle.left = 0;
    }
  },
  watch: {
    isRecording(newVal) {
      if (newVal) {
        this.setRecordingTimeout();
      } else {
        this.clearRecordingTimeout(true);
      }
    }
  }
};
</script>

<style lang="scss">
.player {
  position: relative;
  // display: inline-flex;
  // justify-content: center;
  // align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;

  canvas {
    // todo delete
    width: 100%;
    height: 100%;
    // todo delete

    position: absolute;
    top: 0;
    left: 0;
  }

  .recording-card {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background-color: rgba(#000, 50%);
    border-radius: 12px;
    .record-dot {
      float: left;
      margin: 8px 6px 8px 8px;
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background-color: $main-active-color;
      animation: flashing 1s ease-in-out infinite;

      @keyframes flashing {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
    .record-text {
      display: inline-block;
      margin-right: 12px;
      line-height: 24px;
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
