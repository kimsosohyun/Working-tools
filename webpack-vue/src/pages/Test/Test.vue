<template>
  <div>
    <v-input ref="input" disabled v-model="input2" width="180" suffixIcon="icon-view" icon="icon-view" show-word-limit :maxlength="100" :allow="/\d/g" unit="KB/s" ></v-input>
    <w-input ref="input1" disabled v-model="input1" :width="180"  suffixIcon="icon-view" icon="icon-view" :allow="/\d/g" unit="KB/s"  show-word-limit :maxlength="100"></w-input>
    {{input1}}
    <button @click="click">click</button>


    
  </div>
</template>

<script>
export default {
  data() {
    return {
      input1: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
      input2: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
    }
  },
  methods: {
    click() {
      this.$refs.input.select();
        this.$refs.input1.select();
      
    },
    clear() {
      alert("clear")
    }
   
  }
}
</script>

<style>

</style>