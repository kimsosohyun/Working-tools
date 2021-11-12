<template>
  <div v-if="!lazy" v-show="active" class="v-tab-pane">
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>