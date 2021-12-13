<template>
  <div class="select">
    <div
      class="select-input"
      @click="showSelectList"
      ref="selectInput"
      :class="{ 'select-input--active': showList }"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      :style="{ width: selectWidth }"
    >
      <span v-if="activeLabel" class="select-input_value">{{ activeLabel }}</span>
      <span v-else class="select-input_placeholder">{{ placeholder}}</span>
      <div class="select-input_icon">
        <i v-if="hover && isClear && activeLabel" class="icon-error" @click.stop="clearSelect"></i>
        <i v-else class="icon-vertical-view select-input_icon--animation"></i>
      </div>
    </div>

    <transition name="el-zoom-in-top">
      <div
        class="select-list"
        ref="selectList"
        v-if="showList"
        v-click-outside="clickOutside"
      >
        <ul>
          <li
            :class="[
              'select-list_item',
              { 'select-list_item--active': item.value === value },
            ]"
            v-for="(item, index) in optionList"
            :key="index"
            @click="() => changeValue(item)"
          >
            <slot
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
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
  props: {
    value: {
      type: [String, Number, Array, Boolean],
      default: "",
    },
    name: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    //是否支持多选
    isMultiple: {
      type: Boolean,
      default: false,
    },
    //多选限制个数
    multipleLimit: {
      type: Number,
      default: 0,
    },
    //选项
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    //是否手动配置
    isManual: {
      type: Boolean,
      default: false,
    },
    //手动配置文字
    manualText: {
      type: String,
      default: "Custom",
    },
    //下拉选项位置
    position: {
      type: String,
      default: "auto",
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
      default: "Please select",
    },
    //是否支持清空
    isClear: {
      type: Boolean,
      default: false,
    },
    //是否只读
    readonly: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "M",
    },
    //后缀图标
    suffixIcon: String,
    //允许输入字符的正则表达式
    allow: RegExp,
    displayOptionsNumber: {
      type: Number,
      default: 5,
    },
    unit: {
      type: String,
      default: "",
    },
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
            disabled: false,
          });
        }
      });
      return list;
    },
    selectWidth() {
      return transformWidth(this.width);
    },
    activeLabel() {
      const activeOption = this.optionList.find(
        ({ value }) => value == this.value
      );
      if (activeOption) {
        return activeOption.label;
      } else {
        return this.value;
      }
    },
  },
  data() {
    return {
      showList: false,
      hover: false,
    };
  },
  methods: {
    clickOutside() {
      this.showList = false;
    },
    showSelectList() {
      this.showList = true;

      this.$nextTick(() => {
        const { selectInput, selectList } = this.$refs,
          width = selectInput.getBoundingClientRect().width,
          height = selectInput.getBoundingClientRect().height;

        const top = selectInput.offsetTop + height,
          left = selectInput.offsetLeft;

        selectList.style.top = top + "px";
        selectList.style.left = left + "px";
        selectList.style.zIndex = "999";
        selectList.style.minWidth = width + "px";
      });
    },
    changeValue(item) {
      const { value } = item;
      this.$emit("input", value);
      this.showList = false;
    },
    clearSelect() {
      this.$emit("input", "");
    },
  },
};
</script>

<style lang="scss">
.select {
  position: relative;
  width: 228px;
  &-input {
    width: 100%;
    height: 32px;
    position: relative;
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #d8d8d8;
    border-radius: 2px;
    padding: 0 8px;
    line-height: 32px;
    &:hover {
      border: 1px solid $main-active-color;
    }
    &_value {
      display: inline-block;
      width: 100%;
      color: #262626;
      overflow: hidden;
    }
    &_placeholder {
      color: #ccc; 
    }
    &_icon {
      i {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        font-size: 16px;
        padding: 0 8px;
        line-height: 32px;
        z-index: 3;
        cursor: pointer;
        color: #8d8d8d;
      }

      &--animation {
        transition: all 0.2s;
      }
      //transition: all 0.2s;
    }
  }
  &-input--active {
    border: 1px solid $main-active-color;
    .select-input_icon--animation {
      transform: rotate(180deg);
    }
  }
  &-list {
    z-index: 0;
    position: absolute;
    transform-origin: center top;
    margin-top: 4px;
    // top: 0;
    // left: 0;
    transition: 5s;
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
      &--active {
        color: $main-active-color;
      }
    }
    &_item:hover {
      background-color: rgba(60, 179, 113, 0.1);
      color: $main-active-color;
    }
  }
}

.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: $--md-fade-transition;
  transform-origin: center top;
}
.el-zoom-in-top-enter,
.el-zoom-in-top-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
