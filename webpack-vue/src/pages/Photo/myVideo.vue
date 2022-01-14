<template>
  <div class="video">
    <!-- <wei-video
      style="width: 600px; height: 400px"
      videoUrl.sync="./myvideo.mp4"
    >
    </wei-video> -->
    <video class="media cyberpunk" controls>
      <source src="../../assets/video/myvideo.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
.video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  // border: 5px solid orange;
  // border-radius: 5px;
  width: 600px;
  height: 342px;
  .media {
    width: 100%;
    height: 100%;
  }
}
</style>
