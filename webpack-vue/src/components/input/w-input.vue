<template>
  <div class="input" :style="{ width: inputWidth }">
    <div class="input-prefix" v-if="icon">
      <i :class="icon"></i>
    </div>
    <input
      ref="input"
      :placeholder="placeholder"
      :type="inputType"
      class="input-text"
      :value="value"
      :name="name"
      :maxlength="maxlength"
      :minlength="minlength"
      :readonly="readonly"
      @input="inputValue"
    />

    <div class="input-suffix">
      <div class="input-suffix_icon">
        <i v-if="isClear" class="icon-error" @click="clearValue"></i>
        <i v-if="showPassword" class="icon-error" @click="showValue"></i>
        <i class="icon-suffix" v-if="suffixIcon" :class="suffixIcon"></i>
      </div>
      <div class="input-suffix_word" v-if="showWordLimit && maxlength">
        <span>{{ this.value.length + "/" + this.maxlength }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { setCursorPos } from "../lib";
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
  watch: {
    value: {
      handler(val) {
        this.valueLen = val.length;
      },
      immediate: true
    }
  },
  data() {
    return {
      passwordVisible: false,
      valueLen: 0
    };
  },
  mounted() {
    if (this.autofocus) {
      this.$refs.input.focus();
    }
  },
  computed: {
    inputType() {
      if (this.type === "password") {
        if (this.passwordVisible) {
          return "text";
        } else {
          return "password";
        }
      } else {
        return "text";
      }
    },
    inputWidth() {
      const val = this.width;

      console.log(typeof val);
      if (val === "" || val === undefined || val === null) {
        return;
      }
      if (typeof val === "string") {
        if (/^\d*$/.test(val)) {
          //'70'变为'70px'
          return `${val}px`;
        }
        return val; //'70%'
      }

      return `${val}px`; // 70变为'70px'
    },
    word() {
      return this.value.length + "/" + this.maxlength;
    }
  },
  methods: {
    inputValue(event) {
      const inputVal = event.target.value;
      let val;
      if (this.allow) {
        const curOld = event.target.selectionStart,
          inputOldLength = inputVal.length;

          console.log(curOld)

        val = (inputVal.match(this.allow) || []).join("");
        event.target.value = val;
        if (inputOldLength !== val.length) {
          //代表新输入被过滤掉了，更新光标位置
          setCursorPos(event.target, curOld - 1);
        }
      } else {
        val = inputVal;
      }

      this.$emit("input", val);
    },
    clearValue() {
      this.$emit("input", "");
    },
    showValue() {
      this.passwordVisible = !this.passwordVisible;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
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
  &:hover {
    .input-text {
      border-color: $main-active-color;
    }
  }
  &-text {
    height: 32px;
    outline: none;
    padding: 0 8px;
    padding-left: 32px;
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
  &-prefix {
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 8px;
    i {
      color: #8d8d8d;
      display: inline-block;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
    }
  }
  &-suffix {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 8px;
    &_icon {
      display: inline-block;
      i {
        color: #d8d8d8;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        cursor: pointer;
      }
      i:hover {
        color: #8d8d8d;
      }
      .icon-suffix {
        cursor: auto;
        &:hover {
          color: #d8d8d8;
        }
      }
    }
    &_word {
      color: #d8d8d8;
      display: inline-block;
    }
  }
}
</style>
