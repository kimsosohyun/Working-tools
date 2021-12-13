<template>
  <div>
    <!-- <w-tabs v-model="acitve" :beforeLeave="beforeLeave" @tab-click="tabClick" :animate="true">
      <w-tab-pane label="标签1" value="1">标签1内容</w-tab-pane>
      <w-tab-pane label="标签2" value="2" disabled>标签2内容</w-tab-pane>
      <w-tab-pane label="标签3" value="3">标签3内容</w-tab-pane>
    </w-tabs> -->
    <div class="position">
      <!-- <w-select v-model="select1" :options="selectOption" />   -->
      <w-select v-model="select1" :options="selectOption" width="160" is-clear :placeholder="2345345">
        <template #default="slotProps">
          <div>
            <i class="icon-view"></i>
            <span>{{ slotProps.label }}</span>
          </div>
        </template>
      </w-select>

      <v-select v-model="select1" :options="selectOption" width="160" is-clear :placeholder="2345345"></v-select>
    </div>
  </div>
</template>
s<script>
export default {
  data() {
    return {
      select1: "",
      // selectOption: [
      //   {
      //     value: "1",
      //     label: "选项一",
      //   },
      //   {
      //     value: "2",
      //     label: "选项二",
      //   },
      //   {
      //     value: "3",
      //     label: "选项三",
      //   },
      //   {
      //     value: "4",
      //     label: "选项四",
      //   },
      // ],
      selectOption: [16788686786786867867867876, 3, 4, 5, 6, 78, 2],
      input: 23423423,
    };
  },
  methods: {
    beforeLeave(activeValue, oldActiveValue) {
      console.log(activeValue, oldActiveValue);
    },
    tabClick(node) {
      console.log(node);
    },
  },
};
</script>

<style>
.position {
  position: relative;
  margin: 100px 200px;
}
</style>
