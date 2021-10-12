<template>
  <div class="control-bar">
    <div class="tool-left">
      <slot name="left"></slot>
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
.control-bar {
  position: relative;
  border: 1px solid #ceced2;

  .icon-button-status {
    font-size: 24px;
    .icon-arrow-down {
      font-size: 8px;
    }
  }

  .tool-left {
    display: inline-flex;
    align-items: center;
    height: 100%;

    & > * {
      margin-left: 16px;
    }
  }
  .tool-right {
    display: inline-flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;

    & > * {
      margin-right: 16px;
    }
  }
}
</style>
