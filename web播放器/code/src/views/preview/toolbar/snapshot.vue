<template>
  <div class="snapshot">
    <i
      v-tooltip="{ enterable: false, betweenSpace: 0, content: _('Capture') }"
      :class="['icon-snapshot', 'icon-button-status', { disabled }]"
      @click="handleSnapshot"
    ></i>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "snapshot",
  props: {
    windowId: Number
  },
  data() {
    return {
      link: null
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
    disabled() {
      console.log(this.player.status);
      return (
        !this.configsList.some(item => item.windowId === this.windowId) ||
        this.player.status !== "playing"
      );
    }
  },
  methods: {
    // 处理点击事件
    handleSnapshot() {
      if (!this.disabled) {
        const { player } = this,
          canvas = player && player.$refs.canvas;

        canvas.toBlob(blob => {
          this.downloadImage(blob);
        });
      }
    },
    /**
     * 下载图片
     * @param {Blob} - blob格式的图片数据
     */
    downloadImage(blob) {
      if (!this.link) {
        // 只创建一次a标签
        this.link = document.createElement("a");
      }

      const { link } = this,
        url = URL.createObjectURL(blob);

      // todo 文件名称待提供规格
      link.download = `preview-snapshot-${new Date().getTime()}.png`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    }
  }
};
</script>

<style lang="scss" scoped></style>
