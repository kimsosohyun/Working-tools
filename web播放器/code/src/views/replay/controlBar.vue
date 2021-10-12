<template>
  <div class="re-control-bar">
    <div class="tool-left">
      <slot name="left"></slot>
    </div>
    <div class="tool-center">
      <slot></slot>
    </div>
    <div class="tool-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.re-control-bar {
  position: relative;
  border: 1px solid #ceced2;
  height: 40px;
  display: flex;
  justify-content: space-between;

  .icon-button-status {
    font-size: 24px;
    &.icon-replay-play,
    &.icon-replay-pause {
      font-size: 32px;
    }
    .icon-arrow-down {
      font-size: 8px;
    }
  }
  .tool-center {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .tool-left {
    display: inline-flex;
    align-items: center;
    height: 100%;
    position: relative;
    z-index: 9;

    & > * {
      margin-left: 16px;
    }
  }
  .tool-right {
    display: inline-flex;
    align-items: center;
    position: relative;
    z-index: 9;

    & > * {
      margin-right: 16px;
    }
  }
}
</style>
