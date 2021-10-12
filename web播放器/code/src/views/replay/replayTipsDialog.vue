<template>
  <section v-if="value" class="tips-dialog">
    <div class="tips-dialog-modal"></div>
    <div class="tips-dialog-main">
      <header class="tips-dialog-header">
        <div class="tips-dialog-title bold">{{ _("Tips") }}</div>
        <i class="v-icon-close" @click="close"></i>
      </header>
      <div class="tips-dialog-text">
        {{ _("No matching recording file found") }}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "replayTipsDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timer: null
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  methods: {
    close() {
      this.clearTimeout();
      this.$emit("change", false);
    },
    clearTimeout() {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.clearTimeout();
        this.timer = setTimeout(() => {
          this.close();
        }, 1500);
      }
    }
  }
};
</script>

<style lang="scss">
.tips-dialog {
  $z-index: 1000;
  &-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: $z-index;
  }
  &-main {
    $width: 400px;
    $height: 120px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -$height/2;
    margin-left: -$width/2;
    padding: 16px 24px;
    width: $width;
    height: $height;
    z-index: $z-index + 1;

    background: #ffffff;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.12),
      0px 4px 12px -8px rgba(0, 0, 0, 0.09);
    border-radius: 2px;
  }
  &-header {
    position: relative;
    .v-icon-close {
      $font-size: 16px;
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -$font-size/2;
      font-size: $font-size;
      color: #434343;
      cursor: pointer;
    }
  }
  &-title {
    height: 24px;
    font-size: 16px;
    font-weight: 500;
    color: $title-color;
    line-height: 24px;
  }
  &-text {
    margin-top: 16px;
    height: 22px;
    font-size: 14px;
    color: $info-color;
    line-height: 22px;
  }
}
</style>
