<template>
  <v-checkbox
    :disabled="disabled"
    v-model="checkbox"
    :tooltip="{
      effect: 'light',
      position: 'bottom-left',
      showOnlyEllipsis: true,
      enterable: false,
      betweenSpace: 0,
      content: label
    }"
    class="channel-checkbox"
  >
    {{ label }}
  </v-checkbox>
</template>

<script>
export default {
  props: {
    value: Boolean,
    label: String,
    disabled: Boolean
  },
  computed: {
    checkbox: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("click", val);
      }
    }
  }
};
</script>

<style lang="scss">
.channel-checkbox {
  display: block;
  // &--active {
  //   background: #f5f5f5;
  // }
}
</style>
