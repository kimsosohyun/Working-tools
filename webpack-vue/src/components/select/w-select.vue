<template>
  <div class="select">
    <div class="select-input" @click="showSelectList" ref="selectInput">
      <span class="select-input_value">选项一</span>
      <i class="icon-vertical-view select-input_icon"></i>
    </div>

    <div class="select-list" ref="selectList">
      <ul>
        <li>234234</li>
        <li>234234</li>
        <li>234234</li>
        <li>234234</li>
        <li>234234</li>
        <li>234234</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "w-select",
  data() {
    return {};
  },
  methods: {
    showSelectList() {
      const {selectInput, selectList} = this.$refs;


      const top = selectInput.getBoundingClientRect().bottom + 2,
           left = selectInput.getBoundingClientRect().left;

           selectList.style.top = top + "px";
           selectList.style.left = left + "px";

    }
      
  }
};
</script>

<style lang="scss">
.select {
  &-input {
    margin: 150px;
    position: absolute;
    top: 20px;
    right: 20px;
    display: inline-block;
    vertical-align: top;
    width: 228px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #d8d8d8;
    &:hover {
      border: 1px solid $main-active-color;
    }
    &_value {
      color: #262626;
      padding-left: 8px;
      line-height: 32px;
      width: 100%;
      border-radius: 2px;
    }
    &_icon {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      font-size: 16px;
      padding: 0 8px;
      line-height: 32px;
      z-index: 3;
      cursor: pointer;
      color: #8d8d8d;
      transition: all 0.2s;
    }
  }
  &-input--active {
    border: 1px solid $main-active-color;
  }
  &-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 228px;
    background: pink;
  }
}
</style>
