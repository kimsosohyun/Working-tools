<template>
  <div class="select">
    <div
      class="select-input"
      ref="selectInput"
      :class="[
        { 'select-input--active': showList },
        { 'select-input--clear': isClear },
        { 'select-input--disabled': disabled }
      ]"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      :style="{ width: selectWidth }"
    >
      <div v-if="showInput">
        <w-input
          ref="input"
          :width="width"
          v-model="inputValue"
          :placeholder="placeholder"
          @blur="inputBlur"
          @clear="inputClear"
          @input="input"
          @focus="inputFocus"
          :disabled="disabled"
          :unit="unit"
          :maxlength="maxlength"
          :minlength="minlength"
          :readonly="readonly"
          :allow="allow"
          :isClear="isClear && activeLabel != ''"
        ></w-input>
      </div>

      <div v-else class="select-input_content" @click="showSelectList">
        <span v-if="activeLabel" class="content_value">{{ activeLabel }}</span>
        <span v-else class="content_placeholder">{{ placeholder }}</span>
      </div>

      <div class="select-input_icon">
        <!-- 用v-show而不是v-if的原因：
        箭头图标需要动画，清除图标不需要
        display:none 不触发动画效果
        重载触发动画效果 -->
        <i v-show="hasClear" class="icon-error" @click.stop="clearSelect"></i>
        <i v-show="!hasClear" class="icon-vertical-view select-input_icon--animation" @click="showSelectList"></i>
      </div>
    </div>

    <transition name="el-zoom-in-top">
      <div class="select-list" ref="selectList" v-if="showList" v-click-outside="clickOutside">
        <ul>
          <li
            ref="selectListItem"
            :class="[
              'select-list_item',
              { 'select-list_item--active': item.value == value },
              { 'select-list_item--disabled': item.disabled }
            ]"
            v-for="(item, index) in optionList"
            :key="index"
            @click="() => changeValue(item)"
          >
            <slot :label="item.label" :value="item.value" :disabled="item.disabled">
              <!-- 后备内容 -->
              {{ item.label }}
            </slot>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { transformWidth } from "../lib";
export default {
  name: "w-select",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: [String, Number, Array, Boolean],
      default: ""
    },
    name: String,
    disabled: {
      type: Boolean,
      default: false
    },
    //选项
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    //是否手动配置
    isManual: {
      type: Boolean,
      default: false
    },
    //手动配置文字
    manualText: {
      type: String,
      default: "Custom"
    },
    //下拉选项位置
    position: {
      type: String,
      default: "auto"
    },
    //最大输入长度
    maxlength: Number,
    //最小输入长度
    minlength: Number,
    //宽度
    width: [String, Number],
    //占位符
    placeholder: {
      type: String,
      default: "Please select"
    },
    //是否支持清空
    isClear: {
      type: Boolean,
      default: false
    },
    //是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    //允许输入字符的正则表达式
    allow: RegExp,
    displayOptionsNumber: {
      type: Number,
      default: 5
    },
    unit: {
      type: String,
      default: ""
    }
  },
  computed: {
    optionList() {
      let list = [];
      this.options.forEach((item) => {
        if (typeof item === "object") {
          list.push(item);
        } else {
          list.push({
            label: String(item),
            value: item,
            disabled: false
          });
        }
      });
      if (this.isManual) {
        list.unshift({
          label: this.manualText,
          isManual: true
        });
      }
      return list;
    },
    selectWidth() {
      return transformWidth(this.width);
    },
    activeLabel() {
      const activeOption = this.optionList.find((option, index) => {
        if (option.value == this.value) {
          this.activeIndex = index;
          return option;
        }
      });
      if (activeOption) {
        return activeOption.label;
      } else {
        this.activeIndex = 0;
        return this.value;
      }
    },
    hasClear() {
      return this.hover && this.isClear && this.activeLabel && !this.showInput;
    }
  },
  mounted() {
    window.addEventListener("scroll", () => {
      if (this.showList) {
        this.setPosition();
      }
    });
    window.addEventListener("resize", () => {
      if (this.showList) {
        this.setPosition();
      }
    });
  },
  data() {
    return {
      showList: false,
      hover: false,
      showInput: this.isManual,
      inputValue: "",
      activeIndex: 0
    };
  },
  methods: {
    clickOutside() {
      if (this.showInput && this.$refs.input.isFocus) {
        //列表展开的情况下，聚焦输入框
        return;
      }
      this.showList = false;
      this.$emit("visible-change", false);
    },
    showSelectList() {
      if (this.disabled) return;
      this.showList = true;
      this.$emit("visible-change", true);

      this.$nextTick(() => {
        this.setPosition();
        const { selectList } = this.$refs;
        if (this.activeIndex) {
          //代表有选中值 滑动滚动条
          const activeNode = selectList.children[0].children[this.activeIndex],
            top = activeNode.offsetTop;

          selectList.scrollTop = top;
        }
      });
    },
    setPosition() {
      const { selectInput, selectList, selectListItem } = this.$refs,
        width = selectInput.getBoundingClientRect().width,
        height = selectInput.getBoundingClientRect().height,
        clientTop = selectInput.getBoundingClientRect().top + height, //列表距可视区的高度
        liHeight = selectListItem[0].offsetHeight;

      let top, //列表距最近有定位父级（.select）的高度
        left = selectInput.offsetLeft;

      selectList.style.height = this.displayOptionsNumber * liHeight + "px";

      if (this.position == "auto") {
        if (clientTop + selectList.offsetHeight > document.body.clientHeight) {
          selectList.style.transformOrigin = "center bottom";
          top = selectInput.offsetTop - selectList.offsetHeight;
        } else {
          top = selectInput.offsetTop + height;
        }
      } else if (this.position == "top") {
        top = selectInput.offsetTop + height;
      } else {
        selectList.style.transformOrigin = "center bottom";
        top = selectInput.offsetTop - selectList.offsetHeight;
      }

      selectList.style.top = top + "px";
      selectList.style.left = left + "px";
      selectList.style.zIndex = "999";
      selectList.style.minWidth = width + "px";
    },
    changeValue(item) {
      const { value, isManual } = item;
      if (item.disabled) return;

      if (isManual) {
        // this.activeIndex = 0;
        this.inputValue = "";
        this.showInput = true;
        this.$emit("change", "");
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      } else {
        this.showInput = false;
        this.$emit("change", value);
      }
      this.showList = false;
      this.$emit("visible-change", false);
    },
    clearSelect() {
      this.showList = false;
      this.$emit("visible-change", false);
      if (this.isManual) {
        this.inputValue = "";
        this.showInput = true;
      }
      this.$emit("change", "");
      this.$emit("clear");
    },
    inputBlur(ev) {
      this.$emit("change", this.inputValue);
      this.$emit("blur", ev);

      this.hover = false; //防止clear图标即时显示，点击箭头变为clear被点击
      this.$nextTick(() => {
        if (this.activeIndex) {
          //代表输入值选项中有值和它对应上了
          this.showInput = false;
        }
      });
    },
    inputClear() {
      this.$emit("clear");
      this.$emit("change", "");
    },
    input(val) {
      this.$emit("input", val);
    },
    inputFocus(ev) {
      this.$emit("focus", ev);
    }
  }
};
</script>

<style lang="scss">
.select {
  position: relative;
  vertical-align: middle;
  display: inline-block;
  &-input {
    width: 100%;
    height: 32px;
    position: relative;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    cursor: pointer;
    line-height: 32px;
    &:hover {
      .select-input_content,
      .input-text {
        border: 1px solid $main-active-color;
      }
    }
    &_content {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid #d8d8d8;
      border-radius: 2px;
      padding: 0 8px;
      .content_value {
        display: inline-block;
        width: 100%;
        color: #262626;
        overflow: hidden;
      }
      .content_placeholder {
        color: #ccc;
      }
    }
    &_icon {
      position: absolute;
      right: 0;
      top: 0;
      height: 32px;
      i {
        display: inline-block;
        height: 100%;
        font-size: 16px;
        padding: 0 8px;
        line-height: 32px;
        z-index: 3;
        color: #8d8d8d;
      }
      &--animation {
        transition: all 0.2s;
      }
    }
    .input-text {
      padding-right: 30px !important;
    }
    &--clear {
      .input-text {
        padding-right: 60px !important;
      }
      .input-suffix {
        right: 30px;
      }
    }
    &--disabled {
      cursor: not-allowed;
      &:hover {
        .select-input_content,
        .input-text {
          border-color: #d8d8d8;
        }
      }
      .select-input_content {
        color: silver;
        background-color: #f5f5f5;
      }
    }
  }
  &-input--active {
    .select-input_content,
    .input-text {
      border: 1px solid $main-active-color;
      box-shadow: 0px 0px 4px 0px rgb(60 179 113/ 50%);
    }
    .select-input_icon--animation {
      transform: rotate(180deg);
    }
  }
  &-list {
    z-index: 0;
    position: absolute;
    transform-origin: center top;
    // top: 0;
    // left: 0;
    // width: 228px;
    background: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);

    height: 200px;
    overflow: auto;
    &_item {
      font-size: 14px;
      height: 32px;
      line-height: 30px;
      padding: 0 8px;
      cursor: pointer;
      white-space: nowrap;
      &:hover {
        background-color: rgba(60, 179, 113, 0.1);
        color: $main-active-color;
      }
      &--active {
        color: $main-active-color;
      }
      &--disabled {
        color: #c0c0c0;
        cursor: not-allowed;
      }
      &--disabled:hover {
        color: #c0c0c0;
        background-color: #eee;
      }
    }
  }
}

.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: $--md-fade-transition;
  // transform-origin: center bottom;
}
.el-zoom-in-top-enter,
.el-zoom-in-top-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
