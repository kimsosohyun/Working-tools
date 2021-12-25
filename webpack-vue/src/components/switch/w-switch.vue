<template>
  <div :class="['w-switch', { 'w-switch--disabled': disabled }]">
    <span class="w-switch_item" @click="changeValue">
      <span :class="['w-switch_icon', { 'w-switch_icon--active': value === onValue }]"></span>
      <span :class="['w-switch_text', { 'w-switch_text--active': value === onValue }]" v-if="onText && offText">{{ value === onValue ? onText : offText }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "w-switch",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: [String, Number, Boolean],
    name: String,
    disabled: {
      type: Boolean,
      default: false
    },
    //启用值
    onValue: {
      type: [String, Number, Boolean],
      default: true
    },
    //关闭值
    offValue: {
      type: [String, Number, Boolean],
      default: false
    },
    //启用文字
    onText: String,
    //关闭时文字
    offText: String,
    //切换前事件，返回false时不会改变开关状态,参数为切换后的值
    beforeChange: {
      type: Function,
      default() {
        return true;
      }
    }
  },
  methods: {
    async changeValue() {
      if (this.disabled) return;
      const value = this.value === this.onValue ? this.offValue : this.onValue,
        result = await this.beforeChange(value);

      if (result === false) return;
      this.$emit("change", value);
    }
  }
};
</script>

<style lang="scss">
.w-switch {
  vertical-align: middle;
  cursor: pointer;
  display: inline-block;
  font-size: 0;
  .w-switch_item {
    display: inline-block;
    line-height: 24px;
    .w-switch_icon {
      vertical-align: middle;
      position: relative;
      display: inline-block;
      width: 36px;
      height: 20px;
      background: #c0c0c0;
      border-radius: 10px;
    }
    .w-switch_icon::after {
      transition: 0.3s;
      display: block;
      content: "";
      clear: both;
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
    }
    .w-switch_icon--active {
      background: #3cb371;
    }
    .w-switch_icon--active::after {
      left: 100%;
      margin-left: -18px; //16+2
    }
    .w-switch_text {
      vertical-align: middle;
      font-size: 12px;
      padding-left: 4px;
      color: #c0c0c0;
    }
    .w-switch_text--active {
      color: #3cb371;
    }
  }
}
.w-switch--disabled {
  cursor: not-allowed;
  color: #c0c0c0;
  .w-switch_item {
    .w-switch_icon {
      background: rgba(192, 192, 192, 0.4);
    }
    .w-switch_icon--active {
      background: rgba(60, 179, 113, 0.4);
    }
  }
}
</style>
