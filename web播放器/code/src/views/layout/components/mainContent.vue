<template>
  <div class="main-content">
    <div class="main-content-title">
      <i class="title-left-border"></i>
      <label>{{ title }}</label>
    </div>
    <template v-if="showMainContentLoading">
      <v-loading :visible="true"></v-loading>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "mainContent",
  props: {
    title: String
  },
  computed: {
    ...mapState({
      showMainContentLoading: "showMainContentLoading"
    })
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  position: relative;
  padding: 32px 32px 48px;
  &-title {
    margin-bottom: 32px;

    .title-left-border {
      width: 4px;
      height: 20px;
      background: $main-active-color;
      margin-right: 12px;
      display: inline-block;
      vertical-align: middle;
    }
    label {
      font-size: 20px;
      font-weight: 500;
      color: #262626;
      vertical-align: middle;
    }
  }
}
</style>
