<template>
  <div class="input">
    <input type="text" class="input-text" :value="value" @change="changeValue" />
  </div>
</template>

<script>
export default {
  name: "w-input",
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    name: String,
    maxlength: Number,
    minlength: Number,
    disabled: {
      type: Boolean,
      default: false
    },
    width: [String, Number],
    placeholder: String,
    //是否是搜索
    isSearch: {
      type: Boolean,
      default: false
    },
    isClear: {
      type: Boolean,
      default: false
    },
    //是否有密码切换
    showPassword: {
      type: Boolean,
      default: false
    },
    //显示输入框文字长度限制
    showWordLimit: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    //自动聚焦
    autofocus: {
      type: Boolean,
      default: false
    },
    autoCorrection: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: "M"
    },
    //输入框前面图标
    icon: String,
    //输入框后缀图标
    suffixIcon: String,
    rows: {
      type: Number,
      default: 2
    },
    //输入框允许输入字符正则
    allow: RegExp,
    valid: [Array, Object],
    //单位
    unit: {
      type: String,
      default: ""
    }
  },
  methods: {
    changeValue(event) {
      this.$emit("input", event.target.value)
    }
  }
};
</script>

<style lang="scss">
.input {
  position: relative;
  display: inline-block;
  width: 228px;
  font-size: 14px;
  &-text {
    // resize: vertical;
    height: 32px;
    width: 100%;
    outline: none;
    padding: 0 8px;
    border: 1px solid #d8d8d8;
    border-radius: 2px;
    color: #262626;
    &:focus {
      border-color: $main-active-color;
      box-shadow: 0px 0px 4px 0px rgb(60 179 113/ 50%);
    }
    &:hover {
      border-color: $main-active-color;
    }
  }
}
</style>
