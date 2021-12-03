<template>
  <div>
    <v-input v-model="input2" width="180" suffixIcon="icon-view" :allow="/\d/g" ></v-input>
    <w-input v-model="input1" :width="180" suffixIcon="icon-view" :allow="/\d/g" autofocus></w-input>
    {{input1}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      input1: "3242",
      input2: "234324"
    }
  }
}
</script>

<style>

</style>