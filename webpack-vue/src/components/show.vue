<template>
  <div class="position">
    <w-dialog
      v-model="showDialog1"
      title="哈哈哈"
      :show-title="true"
      :modal="true"
      :close-on-click-modal="true"
      :show-close="false"
      :align-center="true"
      @after-close="close"
    >
      <!-- <template v-slot:title>
        <p>Here's some contact info111</p>
      </template> -->
      <div>
        <w-select v-model="select1" :options="selectOption" width="160" is-clear unit="kb/s"></w-select>
        <w-input></w-input>
        <w-switch></w-switch>
      </div>
    </w-dialog>
    <v-dialog
      v-model="showDialog2"
      title="哈哈哈"
      :show-title="true"
      :close-on-click-modal="true"
      :show-close="false"
      :align-center="true"
    >
      <!-- <template v-slot:title>
        <p>Here's some contact info</p>
      </template> -->
      <div>
        <v-select v-model="select1" :options="selectOption" width="160" is-clear unit="kb/s"></v-select>
        <v-input></v-input>
        <v-switch></v-switch>
      </div>
    </v-dialog>
    <button @click="showDialog1 = true">click1</button>
    <button @click="showDialog2 = true">click2</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog1: false,
      showDialog2: false,
      select1: "1",
      selectOption: [
        {
          value: "1",
          label: "选项一"
        },
        {
          value: "2",
          label: "选项二",
          disabled: true
        },
        {
          value: "3",
          label: "选项三"
        },
        {
          value: "4",
          label: "选项四"
        }
      ]
    };
  },
  methods: {
    close() {
      alert(1)
    }
  }
};
</script>

<style>
.position {
  height: 3000px;
}
</style>
