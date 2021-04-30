<template>
<div class="dialogTransition" :class="{dialogShow:tr}">
  <div class="dialog" :style="dialogOption.style"  v-click-outside="clickOutside">
    <div class="dialog-title">
      <h3>{{dialogOption.name}}</h3>
      <div class="close">
        <i class="iconfont icon-guanbi" @click="close"></i>
      </div>
    </div>

    <div class="dialog-content">
      <div class="line" v-for="(value, key) in dialogOption.info" :key="key">
        <p class="line-title" :style="value[0].color">{{key}}</p>
        <ul>
          <li v-for="(item, index) in value" :key="index">
            <p class="line-left">
              <span>开往</span>
              <strong>{{item.name}}</strong>
            </p>
            <div class="line-right">
              <span>{{"首 "+item.ft}}</span>
              <span>{{"末 "+item.lt}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
  
</template>

<script>
export default {
  name: "dialog",
  props:{
    dialogOption:{
      type: Object
    }
  },
  data() {
    return {};
  },
  computed:{
    tr(){
      return this.dialogOption.show
    }
  },
  methods:{
    close(){
      this.dialogOption.show = false;
    },
    clickOutside(el) {

      // if(this.dialogOption.show){
      //    this.dialogOption.show = false;
      // }else {
      //   console.log(2)
      // }
    
    }
  }
};
</script>

<style lang="scss">
.dialogTransition {
  transition: .2s;
  opacity: 0;
}
.dialogShow {
  opacity: 1;
}

.dialog {
  position: absolute;
  border-radius: 10px;
  top: 0;
  // visibility: hidden;
  left: 0;
  width: 300px;
  background-color: #3cb371;
}

.dialog-title {
  height: 30px;
  line-height: 30px;

  h3 {
    margin-left: 10px;
    font-size: 14px;
    float: left;
    color: white;
  }
  .close {
    width: 30px;
    height: 30px;
    float: right;
    text-align: center;
    margin-right: 2px;
    cursor: pointer;
    i {
      color: white;
      line-height: 30px;
      font-size: 18px;
    }
  }

  // padding: 10px;
}
.dialog-content {
  width: 284px;
  background-color: white;
  // min-height: 150px;
  margin-left: 8px;
  margin-bottom: 8px;
  padding: 8px;
  .line {
    font-size: 12px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0px;
    }
    .line-title {
      font-size: 12px;
      font-weight: bold;
      padding-bottom: 6px;
    }
    ul {
      li {
        line-height: 18px;
        height: 18px;
        margin-bottom: 4px;
        &:last-child {
          margin-bottom: 0px;
        }
        .line-left {
          float: left;
          strong {
            margin-left: 2px;
          }
        }
        .line-right {
          float: right;
          span {
            display: inline-block;
            width: 70px;
            text-align: center;
            height: 18px;
            color: white;
          }
          span:nth-of-type(1) {
            background-color: #ef5d42;
          }
          span:nth-of-type(2) {
            margin-left: -4px;
            background-color: #80b142;
          }
        }
      }
    }
  }
}
</style>
