<template>
  <div>
    <v-input
      ref="input"
      @change="change"
      @blur="blur"
      v-model="input2"
      width="180"
      suffixIcon="icon-view"
      icon="icon-view"
      show-word-limit
      :maxlength="100"
      :allow="/\d/g"
      unit="KB/s"
      isClear
    ></v-input>
    <w-input
      ref="input1"
      @change="change"
      @blur="blur"
      v-model="input1"
      :width="180"
      suffixIcon="icon-view"
      icon="icon-view"
      :valid="valid"
    ></w-input>
    <w-input v-model="input3" :width="180"></w-input>
    {{ input1 }}
    <button @click="click">click</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input1: "",
      input2: "",
      input3: "",
      valid: {
        require: false,
        prop: [
          {
            type: "num"
          },
          {
            type: "test",
            args: [3, 6],
            msg: "被我逮住了"
          },
          {
            type: "test1",
            args: [4, 5]
          },
          function() {
            console.log(this);
          }
        ]
      }
    };
  },
  methods: {
    click() {
      this.$refs.input.select();
      this.$refs.input1.select();
    },
    clear() {
      alert("clear");
    },
    change(ev) {
      console.log(ev, "cjhange");
    },
    blur(ev) {
      console.log(ev, "blur");
    }
  }
};
</script>

<style></style>
