<template>
  <div>
    <transition name="dialog-inner-fade">
      <div v-if="value" class="page" :class="['page', { allPage: isAll }, { bg: isBg }]">
        <div class="page-content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    isAll: {
      type: Boolean,
      default: false
    },
    isBg: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  width: 80vw;
  height: 80vh;
  position: fixed;
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 10;
  min-width: 1200px;
  .page-content {
    padding: 24px;
    height: 100%;
  }
}
.bg {
  background: url("../../assets/img/bg.png");
}
.allPage {
  width: 100vw;
  height: 100vh;
  min-width: 0px;
}
</style>
