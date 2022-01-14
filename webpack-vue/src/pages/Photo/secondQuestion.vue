<template>
  <div class="text">
    <div class="box">
      <div class="left" ref="left"></div>
      <div class="right" ref="right"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.setAnimation();
  },
  methods: {
    setAnimation() {
      const left = this.$refs.left,
        right = this.$refs.right;

      setTimeout(function() {
        left.style.top = "50%";
        right.style.top = "50%";
        left.style.height = "600px";
        right.style.height = "600px";
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  .box {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    position: relative;
  }
  .left {
    position: absolute;
    width: 440px;
    background: url("../../assets/img/match/statistics-1.png");
    background-size: 100%;
    top: 66%;
    left: 5%;
    margin-top: -300px;
    height: 0px;
    transition: all 0.8s ease 0s;
  }
  .right {
    position: absolute;
    width: 440px;
    background: url("../../assets/img/match/statistics-2.png");
    background-size: 100%;
    top: 66%;
    right: 5%;
    margin-top: -300px;
    height: 0px;
    transition: all 0.8s ease 0s;
  }
}
</style>
