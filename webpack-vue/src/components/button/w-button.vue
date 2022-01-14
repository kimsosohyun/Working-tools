<template>
  <div class="button" :class="{ disabled: disabled }" @click="buttonClick">
    <button
      ref="button"
      :class="[
        { 'button--primary': type == 'primary' },
        { 'button--info': type == 'info' },
        { 'button--danger': type == 'danger' },
        { 'button--text': type == 'text' },
      ]"
    >
      <div v-if="!isLoading">
        <div class="button-prefix" v-if="icon">
          <i :class="icon"></i>
        </div>
        <slot></slot>
        <div class="button-suffix" v-if="suffixIcon">
          <i :class="suffixIcon"></i>
        </div>
      </div>

      <div class="icon-rotate" v-else>
        <i class="icon-tool"></i>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: "w-button",
  props: {
    type: {
      type: String,
      default: "info",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    //是否在加载中
    isLoading: {
      type: Boolean,
      default: false,
    },
    //前缀图标
    icon: String,
    //后缀图标
    suffixIcon: String,
  },
  methods: {
    buttonClick() {
      if (this.isLoading || this.disabled) {
        return;
      }
      this.$emit("click");
      this.$refs.button.blur();
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: inline-block;
  vertical-align: middle;
  button {
    border-radius: 2px;
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    min-width: 60px;
    font-size: 14px;
    background: #fff;
    outline: none;
    border: none;
    cursor: pointer;
  }
  .button--primary {
    background-color: $main-active-color;
    color: #fff;
    &:hover {
      background-color: lighten($main-active-color, 15%);
    }
    &:focus {
      box-shadow: 0 0 2px 2px scale-color($main-active-color, $alpha: -60%);
    }
    &:active {
      background-color: darken($main-active-color, 10%);
    }
  }
  .button--info {
    background-color: #fff;
    color: #595959;
    border: 1px solid #d8d8d8;
    &:hover {
      background-color: #fff;
      color: $main-active-color;
      border-color: $main-active-color;
    }
    &:focus {
      border-color: $main-active-color;
      box-shadow: 0 0 2px 2px scale-color($main-active-color, $alpha: -60%);
      background-color: scale-color($main-active-color, $alpha: -90%);
    }
    &:active {
      background-color: scale-color($main-active-color, $alpha: -90%);
    }
  }
  .button--danger {
    background-color: #f7421e;
    color: #fff;
    &:hover {
      background-color: lighten(#f7421e, 15%);
    }
    &:focus {
      background-color: lighten(#f7421e, 10%);
      box-shadow: 0 0 2px 2px scale-color(#f7421e, $alpha: -60%);
    }
    &:active {
      box-shadow: none;
      background-color: darken(#f7421e, 10%);
    }
  }
  .button--text {
    width: auto;
    color: $main-active-color;
    background-color: transparent;
    padding: 1px 2px;
    line-height: 22px;
    height: auto;
    &:hover {
      color: lighten($main-active-color, 15%);
    }
    &:focus {
      background-color: #fff;
      border-color: scale-color($main-active-color, $alpha: -60%);
    }
    &:active {
      color: darken($main-active-color, 10%);
      border-color: transparent;
    }
  }
  .icon-rotate {
    animation: rotate 1.6s linear infinite;
  }
  &-prefix,
  &-suffix {
    display: inline-block;
    vertical-align: middle;
  }
  &-prefix {
    margin-right: 8px;
  }
  &-suffix {
    margin-left: 8px;
  }
}

.disabled {
  .button--primary {
    background: scale-color($main-active-color, $alpha: -60%) !important;
    cursor: not-allowed;
    box-shadow: none !important;
  }
  .button--info {
    background: #f5f5f5 !important;
    color: silver !important;
    border-color: #e9e9e9 !important;
    box-shadow: none !important;
    cursor: not-allowed;
  }
  .button--danger {
    background: scale-color(#f7421e, $alpha: -60%) !important;
    box-shadow: none !important;
    cursor: not-allowed;
  }
  .button--text {
    color: silver !important;
    cursor: not-allowed;
    border-color: transparent !important;
  }
}
</style>