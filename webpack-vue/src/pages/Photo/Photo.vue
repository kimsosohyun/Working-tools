<template>
  <div>
    <wei-photo class="weiPhoto" v-wei-photo:photo720="options" :panorama.sync="panorama">
      <wei-markers :config="markerPng">
        <div class="markerPng" @click="markerClick('png')"></div>
      </wei-markers>
      <wei-markers :config="markerText1">
        <div class="markerText1" @click="markerClick('text1')"></div>
      </wei-markers>
      <wei-markers :config="markerText2">
        <div class="markerText2" @click="markerClick('text2')"></div>
      </wei-markers>
      <wei-markers :config="markerVideo">
        <div class="markerVideo" @click="markerClick('video')"></div>
      </wei-markers>
    </wei-photo>

    <page v-model="showPng" :isAll="true">
      <myPic :needDelete="needDelete" @change-delete="changeNeedDelete"></myPic>
    </page>

    <page v-model="showText1">
      <firstQuestion></firstQuestion>
    </page>

    <page v-model="showText2" :isBg="true">
      <secondQuestion></secondQuestion>
    </page>

    <page v-model="showVideo">
      <myVideo></myVideo>
    </page>
  </div>
</template>

<script>
import png from "@/assets/img/kim.png";
import page from "./page.vue";
import myPic from "./myPic.vue";
import myVideo from "./myVideo.vue";
import firstQuestion from "./firstQuestion.vue";
import secondQuestion from "./secondQuestion.vue";

export default {
  data() {
    return {
      panorama: png,
      options: {
        captureCursor: false
      },
      showPng: false,
      showVideo: false,
      showText1: false,
      showText2: false,
      markerPng: { latitude: -0.11865559223302458, longitude: 0.8090653686047459 },
      markerText1: { latitude: 0.3406929576677753, longitude: 6.012296314332698 },
      markerText2: { latitude: 0.5923788855759556, longitude: 1.2972661932264902 },
      markerVideo: { latitude: 0.32235928863495267, longitude: 1.504703240253582 },
      needDelete: false
    };
  },
  components: {
    page,
    myPic,
    myVideo,
    firstQuestion,
    secondQuestion
  },
  mounted() {
    //人物出现
      const dollShow = document.getElementById("waifu-toggle");
       
      dollShow && dollShow.click();
      const doll = document.getElementById("waifu");

      //只能在外部关闭，不能在page内部关闭，当使用多个page组件时，当人物被点击时找不到对应page的this实例
      doll.onclick = () => {
        this.showPng = false;
        this.showVideo = false;
        this.showText1 = false;
        this.showText2 = false;
      };
  },
  methods: {
    markerClick(type) {
      switch (type) {
        case "png":
          this.showPng = true;
          break;
        case "text1":
          this.showText1 = true;
          break;
        case "text2":
          this.showText2 = true;
          break;
        case "video":
          this.showVideo = true;
          break;
      }
    },
    // viewChange(position) {
    //   console.log(position, "position");
    // },
    changeNeedDelete(val) {
      this.needDelete = val;
    }
  }
};
</script>

<style lang="scss">
.weiPhoto {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.markerPng {
  cursor: pointer;
  position: relative;
  top: -3px;
  left: 10px;
  width: 380px;
  height: 85px;
  background: rgba(211, 211, 211, 0.5);
  opacity: 0;
}
.markerText1 {
  cursor: pointer;
  position: relative;
  top: 60px;
  left: 0;
  width: 83px;
  height: 335px;
  background: rgba(211, 211, 211, 0.5);
  opacity: 0;
}
.markerText2 {
  cursor: pointer;
  position: relative;
  top: 42px;
  left: 0;
  width: 96px;
  height: 330px;
  background: rgba(211, 211, 211, 0.5);
  opacity: 0;
}
.markerVideo {
  cursor: pointer;
  position: relative;
  top: 39px;
  left: 246px;
  width: 620px;
  height: 88px;
  background: rgba(211, 211, 211, 0.5);
  opacity: 0;
}
</style>
