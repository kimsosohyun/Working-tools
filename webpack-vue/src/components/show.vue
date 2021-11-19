<template>
  <div>
    <!-- <w-tabs v-model="acitve" :beforeLeave="beforeLeave" @tab-click="tabClick" :animate="true">
      <w-tab-pane label="标签1" value="1">标签1内容</w-tab-pane>
      <w-tab-pane label="标签2" value="2" disabled>标签2内容</w-tab-pane>
      <w-tab-pane label="标签3" value="3">标签3内容</w-tab-pane>
    </w-tabs> -->
    <w-select />
  </div>
</template>

<script>
export default {
  data() {
    return {
      acitve: ""
    };
  },
  methods: {
    beforeLeave(activeValue, oldActiveValue) {
      console.log(activeValue, oldActiveValue)
  
    },
    tabClick(node) {
      console.log(node)
    }
  }
};
</script>

<style></style>
