<template>
  <div class="pic">
    <div class="pic-wrap">
      <ul class="pic-list" ref="list" @click="start">
        <li v-for="(item, key) in imgPath" :key="key" class="pic-list_item">
          <img :src="item" alt="" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const imgPath = [
  require("../../assets/img/match/members/1.png"),
  require("../../assets/img/match/members/2.png"),
  require("../../assets/img/match/members/3.png"),
  require("../../assets/img/match/members/4.png"),
  require("../../assets/img/match/members/5.png"),
  require("../../assets/img/match/members/6.png"),
  require("../../assets/img/match/members/7.png"),
  require("../../assets/img/match/members/8.png"),
  require("../../assets/img/match/members/9.png"),
  require("../../assets/img/match/members/10.png")
];
export default {
  props: {
    needDelete: Boolean
  },
  mounted() {
    const width = document.documentElement.clientWidth,
      style = document.styleSheets[4],
      param = -3180 + width - 48;

    if (this.needDelete) {
      style.deleteRule(0);
    } else {
      this.$emit("change-delete", true);
    }
    style.insertRule("@keyframes move {0% {left: 0px;}100% {left: " + param + "px;}}");
  },
  data() {
    return {
      imgPath: imgPath,
      status: "paused"
    };
  },
  methods: {
    start() {
      const list = this.$refs.list;
      if (this.status === "running") {
        this.status = "paused";
        list.style.animationPlayState = "paused";
      } else {
        this.status = "running";
        list.style.animationPlayState = "running";
      }
    }
  }
};
</script>

<style lang="scss">
.pic {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.pic-wrap {
  width: 100%;
  height: 100%;
}
.pic-list {
  position: absolute;
  animation: 10s move infinite linear alternate;
  animation-play-state: paused;
  top: calc(50% - 300px);
  left: 0px;
  white-space: nowrap;
  li {
    display: inline-block;
    transition: 0.2s;
    width: 300px;
    height: 500px;
    margin-left: 20px;
    cursor: pointer;
    img {
      width: 300px;
      height: 500px;
    }
  }
  li:hover {
    transform: scale(1.05);
  }
  li:first-child {
    margin-left: 0;
  }
}

// @keyframes move {
//   0% {
//     left: 0;
//   }
//   100% {
//     left: -2000px;
//   }
// }
</style>
