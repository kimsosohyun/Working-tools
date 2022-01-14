<template>
  <div class="pic" @mouseenter="showBtn = true" @mouseleave="showBtn = false">
    <ul class="pic-list" ref="picList">
      <li v-for="(item, key) in imgPath" :key="key" class="pic-list_item">
        <img :src="item" alt="" />
      </li>
    </ul>
    <div v-show="showBtn && inited" class="btn left" @click="prePic" ref="preBtn"></div>
    <div v-show="showBtn && inited" class="btn right" @click="nextPic" ref="nextBtn"></div>
  </div>
</template>

<script>
const imgPath = [
  require("../../assets/img/index.jpg"),
  require("../../assets/img/metro.jpg"),
  require("../../assets/img/metro1.jpg"),
  require("../../assets/img/test.jpg")
];
export default {
  mounted() {
    this.setLiStyle();
  },
  data() {
    return {
      imgPath: imgPath,
      lis: [],
      showBtn: false,
      inited: false,
      ithis: 0,
      idex: 0,
      clickPre: false,
      clickNext: false
    };
  },
  methods: {
    setLiStyle() {
      this.lis = this.$refs.picList.children;
      this.idex = this.lis.length;
      const { lis } = this;

      for (var i = 0; i < lis.length; i++) {
        lis[i].deg = (Math.random() * 100) % 14;
        lis[i].style.WebkitTransform = "rotate(" + lis[i].deg + "deg) scale(1.8)";
        lis[i].style.zIndex = lis.length - i;

        lis[i].style.transition = ".3s " + (lis.length - i) * 400 + "ms";
        setTimeout(function() {
          for (var j = 0; j < lis.length; j++) {
            lis[j].style.opacity = "1";
            lis[j].style.WebkitTransform = "rotate(" + lis[j].deg + "deg)";
          }
        }, 100);
      }
      setTimeout(() => {
        this.inited = true;
      }, 2000);
    },
    prePic() {
      if (!this.clickPre) {
        this.clickPre = true;
        this.ithis--;
        this.idex++;
        if (this.ithis < 0) {
          this.ithis = this.lis.length - 1;
        }
        const { ithis, idex, lis } = this,
          vm = this;

        lis[ithis].style.transition = ".5s";
        lis[ithis].style.left = "-100%";
        lis[ithis].style.opacity = "0";
        lis[ithis].addEventListener("webkitTransitionEnd", end);
        this.$refs.preBtn.style.zIndex = idex + 1;
        this.$refs.nextBtn.style.zIndex = idex + 1;
        function end() {
          lis[ithis].removeEventListener("webkitTransitionEnd", end);
          lis[ithis].style.transition = "0s";
          lis[ithis].style.WebkitTransform = "scale(1.4)";
          lis[ithis].style.zIndex = idex;
          setTimeout(function() {
            lis[ithis].style.transition = ".5s";
            lis[ithis].style.WebkitTransform = "scale(1)";
            lis[ithis].style.opacity = "1";
            lis[ithis].style.left = "0";
            lis[ithis].style.WebkitTransform = "rotate(" + lis[ithis].deg + "deg)";
            lis[ithis].addEventListener("webkitTransitionEnd", over);
            function over() {
              lis[ithis].removeEventListener("webkitTransitionEnd", over);
              vm.clickPre = false;
            }
          }, 100);
        }
      }
    },
    nextPic() {
      if (!this.clickNext) {
        this.clickNext = true;
        this.ithis++;
        this.idex++;
        if (this.ithis == this.lis.length) {
          this.ithis = 0;
        }
        const { ithis, idex, lis } = this,
          vm = this;

        lis[ithis].style.transition = ".5s";
        lis[ithis].style.left = "100%";
        lis[ithis].style.opacity = "0";
        lis[ithis].addEventListener("webkitTransitionEnd", end);
        this.$refs.preBtn.style.zIndex = idex + 1;
        this.$refs.nextBtn.style.zIndex = idex + 1;
        function end() {
          lis[ithis].removeEventListener("webkitTransitionEnd", end);
          lis[ithis].style.transition = "0s";
          lis[ithis].style.WebkitTransform = "scale(1.4)";
          lis[ithis].style.zIndex = idex;
          setTimeout(function() {
            lis[ithis].style.transition = ".5s";
            lis[ithis].style.WebkitTransform = "scale(1)";
            lis[ithis].style.opacity = "1";
            lis[ithis].style.left = "0";
            lis[ithis].style.WebkitTransform = "rotate(" + lis[ithis].deg + "deg)";
            lis[ithis].addEventListener("webkitTransitionEnd", over);
            function over() {
              lis[ithis].removeEventListener("webkitTransitionEnd", over);
              vm.clickNext = false;
            }
          }, 100);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pic {
  position: relative;
  width: 500px;
  height: 300px;
  position: absolute;
  top: calc(50% - 150px);
  left: calc(50% - 250px);
  &-list {
    &_item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 5px solid orange;
      border-radius: 2px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.8), inset 0 0 5px rgba(0, 0, 0, 0.4);
      opacity: 0;
      img {
        vertical-align: top;
        width: 100%;
        height: 100%;
      }
    }
  }
  .btn {
    z-index: 5;
    transition: 0.3s transform opacity;
    width: 40px;
    height: 40px;
    position: absolute;
    background: black;
    top: 130px;
  }

  .left {
    left: 5px;
    background-position: left bottom;
  }

  .right {
    right: 5px;
    background-position: right bottom;
  }

  .left:hover {
    left: 4px;
    -webkit-transform: scale(1.2);
    background-position: left top;
  }

  .right:hover {
    right: 4px;
    -webkit-transform: scale(1.2);
    background-position: right top;
  }
}
</style>
