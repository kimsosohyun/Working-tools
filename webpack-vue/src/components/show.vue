<template>
  <div>
    <div>
      <w-button
      @click="test"
        type="primary"
        icon="icon-topo-router"
        suffix-icon="icon-topo-switch"
        >111</w-button
      >
      <w-button
         @click="test"
        type="primary"
        icon="icon-topo-router"
        suffix-icon="icon-topo-switch"
        :is-loading="true"
        :disabled='true'
        >111</w-button
      >
      <w-button
         @click="test"
      
        icon="icon-topo-router"
        suffix-icon="icon-topo-switch"
        type="info"
        >111</w-button
      >

      <w-button
         @click="test"
       :disabled='true'
        icon="icon-topo-router"
        suffix-icon="icon-topo-switch"
        type="text"
        >111</w-button
      >
    </div>

    <div style="margin-top: 10px">
      <v-button
         @click="test"
        type="primary"
        icon="icon-topo-router"
        suffix-icon="icon-topo-switch"
        >111</v-button
      >
      <v-button disabled type="primary" icon="icon-topo-router" :is-loading="true"
        >111</v-button
      >
      <v-button
         @click="test"
    
        icon="icon-topo-router"
        suffix-icon="icon-topo-switch"
        type="info"
        >111</v-button
      >

      <v-button
         @click="test"
       :disabled='true'
        icon="icon-topo-router"
        suffix-icon="icon-topo-switch"
        type="text"
        >111</v-button
      >
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.getElementsByClassName("fa-times")[0].click();
  },
    methods: {
        test() {
          this.$router.push("/photo")
        }
    }
};
</script>

<style>
</style>