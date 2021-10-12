<template>
  <div class="video-record">
    <i
      v-tooltip="{
        enterable: false,
        betweenSpace: 0,
        content: isRecording ? _('Stop recording') : _('Recording')
      }"
      :class="[
        'icon-snapshot',
        'icon-button-status',
        isRecording ? 'icon-record-stop' : 'icon-record',
        { disabled }
      ]"
      @click="handleRecord"
    ></i>
  </div>
</template>

<script>
import Recorder from "@/utils/recorder";
import { mapGetters } from "vuex";
export default {
  name: "videoRecord",
  props: {
    windowId: Number
  },
  data() {
    return {
      //   link: null
      lastRecordPlayer: null
    };
  },
  computed: {
    ...mapGetters({
      configsList: "channelCfgList"
    }),
    player() {
      const { $players } = this.$store.state;
      return $players.find(({ windowId }) => windowId === this.windowId) || {};
    },
    isRecording() {
      return this.player.isRecording;
    },
    disabled() {
      return (
        !this.configsList.some(item => item.windowId === this.windowId) ||
        this.player.status !== "playing"
      );
    }
  },
  methods: {
    // 处理点击事件
    handleRecord() {
      if (this.disabled) {
        return;
      }

      const { player, lastRecordPlayer } = this;
      if (!player.isRecording) {
        if (lastRecordPlayer !== null && lastRecordPlayer.isRecording) {
          // 停止上一个窗口/通道的录像
          this.stopRecord(lastRecordPlayer);
        }
        try {
          player.recorder = new Recorder(player.$refs.canvas);
          player.recorder.start();
          player.isRecording = true;
          this.lastRecordPlayer = player;
        } catch (e) {
          player.isRecording = false;
          console.log("record error", e);
        }
      } else {
        this.stopRecord(player);
      }
    },
    stopRecord(playerVm) {
      playerVm.recorder.stopThenDownload();
      playerVm.isRecording = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
