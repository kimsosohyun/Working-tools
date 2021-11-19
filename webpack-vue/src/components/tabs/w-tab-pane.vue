<template>
  <div class="w-tab-pane" v-if="active">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "w-tab-pane",
  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false
    },
    value: String
  },
  computed: {
    active() {
      return this.$parent.animate || this.$parent.value == this.value;
    }
  }
};
</script>

<style>
.w-tab-pane {
  width: 100%;
  flex-shrink: 0;
}
</style>
