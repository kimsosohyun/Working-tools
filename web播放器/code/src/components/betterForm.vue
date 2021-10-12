<template>
  <v-form
    ref="form"
    class="better-form"
    :disabled="disabled"
    :is-label-right="isLabelRight"
    :model="formData"
    :rules="rules"
    :beforeSubmit="beforeSubmitHandler"
    @submit="submit"
  >
    <slot></slot>
    <v-form-item
      v-if="
        (btns && btns.length) ||
          $slots['before-button'] ||
          $slots['after-button']
      "
      class="better-form-toolbar"
    >
      <slot name="before-button"></slot>
      <v-button
        v-if="btns.includes('submit')"
        :disabled="disableBtns.includes('submit')"
        type="primary"
        @click="submitForm"
        >{{ _("Save") }}</v-button
      >
      <v-button
        v-if="btns.includes('sync')"
        :disabled="disableBtns.includes('sync')"
        @click="sync"
        >{{ _("Sync to") }}</v-button
      >
      <slot name="after-button"></slot>
    </v-form-item>
  </v-form>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isLabelRight: Boolean,
    formData: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    beforeSubmit: {
      type: Function,
      default: () => () => true
    },
    btns: {
      type: Array,
      default: () => ["submit"]
    },
    disableBtns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  // beforeCreate() {
  //   this.$slots.default[1].componentOptions.propsData.disabled = ""
  // },
  methods: {
    submitForm() {
      this.$refs.form.submitForm();
    },
    beforeSubmitHandler(data) {
      const auth = this.getAcountAuth();

      if (!auth) {
        this.$message.warn("No permission to operate");
        return false;
      }

      if (!this.beforeSubmit(data)) {
        return false;
      }

      return true;
    },
    submit(data) {
      this.$emit("submit", data);

      //   this.$message.success("验证成功");
      //   console.log("submit data", data);
    },
    sync() {
      this.$emit("sync", this.$refs.form.getSubmitData());
    },
    getAcountAuth() {
      // 预留拦截函数，判断用户权限；返回true有权限  false没有权限
      return true;
    }
  }
};
</script>

<style lang="scss">
.better-form-toolbar {
  margin-top: 32px;
}
</style>
