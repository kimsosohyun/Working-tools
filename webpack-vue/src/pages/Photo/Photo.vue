<template>
  <div>
    <wei-photo 
      class="weiPhoto" 
      v-wei-photo:photo720="options"
      :panorama.sync="panorama"
    >
       <wei-markers :config="marker1" >
        <button @click="markerClick('标记1')">标记1</button>
      </wei-markers>
    </wei-photo>

    <div class="test" v-if="show">
      <img src="../../assets/img/index.jpg" alt="">
    </div>

  
   
  </div>
</template>

<script> 
import png from '@/assets/img/kim.png'
export default {
  data() {
    return {
      panorama: png,
      options:{
        captureCursor: false
      },
      show: false,
      marker1: { latitude: -0.30982956564043707, longitude: 5.358887010483433 }
    };
  },
  mounted(){
    console.log(this.photo720)
    //this.photo720 为组件自定义指令的变量,针对全景组件的操作通过这个变量进行，可以随意命名，
    //当需要在一个.vue文件里展示两个全景组件的时候，两个组件的变量名称不可以重复
    //它将会将实例化后对象赋值到你当前的组件作用域里
  },
  methods: {
    markerClick() {
      alert("点击了");
      this.show = true;
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
.test {
  width: 100vw;
  height: 100vh;
  background: transparent;
 
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  img {
    position: absolute;
    top: 100px;
    left: 100px;
    width: 100px;
    height: 100px;
  }
}

</style>