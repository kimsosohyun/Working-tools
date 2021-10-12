<template>
  <section class="activation">
    <div class="activation-bg">
      <img src="../assets/img/activation-bg.png" alt="" />
    </div>
    <slot></slot>
    <div class="activation-copyright">
      <span>{{
        _(
          "Copyright ©1999 - 2021 Shenzhen Tenda Technology Co., Ltd. All rights reserved."
        )
      }}</span>
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.activation {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 768px;
  min-width: 960px; //基于密码重置的内容区宽度制订
  display: flex;
  justify-content: center;
  align-items: center;
  .activation-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .activation-copyright {
    position: absolute;
    bottom: 24px;
    span {
      font-size: 12px;
      color: #8d8d8d;
      line-height: 1;
    }
  }
}
</style>
