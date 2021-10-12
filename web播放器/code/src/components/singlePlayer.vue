<template>
  <div class="player">
    <play-screen :active="1" :count="1" />
    <v-loading :visible="!isPlaying"></v-loading>
    <div class="fail-mask" v-show="playFailed">
      <div class="content">
        <span class="v-icon-remind-line"></span>
        <span>{{ _("Failed to live view") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import PlayScreen from "@/components/playScreen";
import { mapState } from "vuex";

export default {
  name: "singlePlayer",
  components: {
    PlayScreen
  },
  props: ["currentChannel"],
  data() {
    return {
      activeWindowId: 0,
      isPlaying: false,
      streamType: "extra",
      playerVm: null,
      isDestroyed: false,
      playFailed: false
    };
  },
  computed: {
    ...mapState(["$players"])
  },

  watch: {
    currentChannel(val) {
      val >= 0 && this.play();
      this.streamType = "extra";
      this.playFailed = false;
    }
  },

  methods: {
    //若辅码流请求失败，继续请求主码流
    streamFailedHandle() {
      if (this.isDestroyed) {
        return;
      }

      if (this.streamType == "extra") {
        this.streamType = "main";
        this.play();
      } else {
        this.playFailed = true;
      }
    },

    liveStop() {
      this.playerVm && this.playerVm.stop(true);
    },

    async livePlay() {
      //若在播放之前退出此页面，则结束执行
      if (this.isDestroyed) {
        return;
      }
      this.playerVm = this.$players.find(
        vm => this.activeWindowId === vm.windowId
      );

      const cfgs = {
        id: this.currentChannel,
        isEnableAudio: false,
        afterPullStreamFailed: this.streamFailedHandle
      };

      this.isPlaying = await this.playerVm.initPlayer(cfgs);

      const args = {
        playType: "live",
        control: "start",
        channel: this.currentChannel,
        streamType: this.streamType
      };
      !this.isDestroyed && (await this.playerVm.play(args));
    },

    play() {
      this.isPlaying && this.liveStop();
      this.livePlay();
    }
  },

  beforeDestroy() {
    this.isDestroyed = true;
    this.isPlaying && this.liveStop();
  }
};
</script>
<style scoped lang="scss">
.player {
  width: 100%;
  height: 100%;

  .fail-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: table;
    background-color: hsla(0, 0%, 100%, 0.3);
    color: #fff;
    font-size: 14px;
    .content {
      vertical-align: middle;
      display: table-cell;
      text-align: center;
    }
    .v-icon-remind-line {
      margin-right: 8px;
    }
  }
}
</style>
