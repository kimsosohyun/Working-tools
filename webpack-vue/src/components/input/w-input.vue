<template>
  <div :class="['input', { 'input--disabled': disabled }]" :style="{ width: inputWidth }">
    <div class="input-prefix" v-if="icon">
      <i :class="icon"></i>
    </div>
    <input
      ref="input"
      :placeholder="placeholder"
      :type="inputType"
      :class="['input-text', { 'has-icon': icon }]"
      :value="value"
      :name="name"
      :maxlength="maxlength"
      :minlength="minlength"
      :readonly="readonly"
      :disabled="disabled"
      @input="inputValue"
      @focus="inputFocus"
      @blur="inputBlur"
      @change="inputChange"
    />
    <div class="input-suffix" ref="suffix">
      <div class="input-suffix_icon">
        <i v-if="isClear && value" class="icon-error" @click="clearValue"></i>
        <i v-if="showPassword" class="icon-error" @click="showValue"></i>
        <i class="icon-suffix" v-if="suffixIcon" :class="suffixIcon" @click="suffixClick"></i>
      </div>
      <div class="input-suffix_word" v-if="showWordLimit && maxlength">
        <span>{{ this.value.length + "/" + this.maxlength }}</span>
      </div>
    </div>

    <span v-if="!isFocus" class="errText">{{errText}}</span>
  </div>
</template>

<script>
import { setCursorPos, transformWidth } from "../lib";
import validMixins from "../validMixins"
export default {
  name: "w-input",
  mixins: [validMixins],
  props: {
    value: {
      type: [String, Number],
      default: ""
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
    //输入框前面图标
    icon: String,
    //输入框后缀图标
    suffixIcon: String,
    //输入框允许输入字符正则
    allow: RegExp,
    valid: {
      type: Object,
      default: ()=>{
        return {
          require: true
        }
      }
    },
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

        if (this.unit && val && !this.isFocus) {
          //加在这里而不是mounted的原因:
          //外部改变v-model绑定值时也需要立刻为新值加上单位
          this.setInputValue(val + " " + this.unit);
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      passwordVisible: false,
      valueLen: 0,
      isFocus: false,
      isZh: false,
      errText: ""
    };
  },
  mounted() {
    const { input, suffix } = this.$refs;
    input.style.paddingRight = suffix.offsetWidth + "px";

    if (this.autofocus) {
      input.focus();
    }
    //当用户使用拼音输入法开始输入汉字时，这个事件就会被触发
    input.addEventListener(
      "compositionstart",
      () => {
        console.log("compositionstart");
        this.isZh = true;
      },
      false
    );
    input.addEventListener(
      "compositionend",
      (event) => {
        console.log("compositionend");
        this.isZh = false;
        //文本段落的组成完成或取消时，compositionend事件将被触发
        //compositionend在input事件之后才触发，需要手动去调input事件
        this.inputValue(event);
      },
      false
    );
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
      return transformWidth(this.width);
    },
    word() {
      return this.value.length + "/" + this.maxlength;
    }
  },
  methods: {
    inputValue(event) {
      console.log("input");
      //虚假输入不调用input回调，当compositionend输入内容确定之后再调用
      if (this.isZh) return;
      const inputVal = event.target.value;
      let val;
      if (this.allow) {
        const curOld = event.target.selectionStart,
          inputOldLength = inputVal.length;

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
      if (this.disabled) {
        return;
      }
      this.$emit("clear");
      this.$emit("input", "");
    },
    showValue() {
      this.passwordVisible = !this.passwordVisible;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    setInputValue(val) {
      this.$nextTick(() => {
        this.$refs.input.value = val;
      });
    },
    inputFocus(event) {
      this.$emit("focus", event);
      this.isFocus = true;
      if (this.value && this.unit) {
        //去掉单位
        this.setInputValue(this.value);
      }
    },
    inputBlur(event) {
      this.$emit("blur", event);
      this.isFocus = false;
      if (this.value && this.unit) {
        //加上单位
        this.setInputValue(this.value + " " + this.unit);
      }

      //失焦验证数据
      const result = this.checkData();
      if(result) {
        this.errText = result;
      }else {
        this.errText = "";
      }
    },
    inputChange(event) {
      this.$emit("change", event.target.value);
    },
    focus() {
      this.$refs.input.focus();
    },
    select() {
      this.$refs.input.select();
    },
    suffixClick() {
      this.$emit("suffixClick");
    }
  }
};
</script>

<style lang="scss">
.errText {
  color: red;
  line-height: 24px;
}
.input {
  position: relative;
  display: inline-block;
  width: 228px;
  font-size: 14px;
  vertical-align: middle;
  &:hover {
    .input-text {
      border-color: $main-active-color;
    }
  }
  &--disabled {
    cursor: not-allowed;
    &:hover {
      .input-text {
        border-color: #e9e9e9;
      }
    }
    .input-text {
      cursor: not-allowed;
      color: silver;
      background-color: #f5f5f5;
      border-color: #e9e9e9;
    }
    .input-suffix {
      .input-suffix_icon {
        i {
          cursor: not-allowed;
        }
        i:hover {
          color: #d8d8d8;
        }
      }
    }
  }
  &-text {
    height: 32px;
    outline: none;
    padding: 0 8px;
    //padding-left: 32px;
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
      vertical-align: middle;
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
      vertical-align: middle;
      color: #d8d8d8;
      line-height: 32px;
      display: inline-block;
    }
  }
  .has-icon {
    padding-left: 32px;
  }
}
</style>
