<template>
  <transition name="dialog-fade">
    <div v-show="value">
      <transition name="dialog-fade">
        <div class="modal" v-if="modal" @click="closeDialog"></div>
      </transition>
      <transition name="dialog-inner-fade">
        <div class="dialog" v-if="value" :style="{ width: width ? width + 'px' : 'auto' }">
          <div class="dialog-header" v-if="showTitle">
            <slot name="title">
              <div class="dialog-header_title" :class="{ 'dialog-header_title--center': alignCenter }">
                <h5>{{ title }}</h5>
              </div>
              <i v-if="showClose" class="icon-error dialog-header_close" @click="clickClose"></i>
            </slot>
          </div>
          <div class="dialog-content">
            <slot></slot>
          </div>
          <div class="dialog-footer">
            <slot name="footer">
              <div class="dialog-footer_btns" :class="{ 'dialog-footer_btns--center': alignCenter }">
                <button v-if="showCancel" @click="cancel">{{ cancelButtonText }}</button>
                <button v-if="showConfirm" @click="confirm">{{ confirmButtonText }}</button>
              </div>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "w-dialog",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    title: String,
    width: Number,
    modal: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    confirmButtonText: {
      type: String,
      default: "OK"
    },
    cancelButtonText: {
      type: String,
      default: "Cancel"
    },
    confirmButtonType: {
      type: String,
      default: "primary"
    },
    cancelButtonType: {
      type: String,
      default: ""
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    alignCenter: {
      type: Boolean,
      default: false
    },
    rendered: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          console.log("open");
          this.$emit("open");
        } else {
          console.log("close");
          this.$emit("after-close");
        }
      },
      immediate: false //防止初始化时value为false，调用父组件的after-close事件
    }
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      if (this.closeOnClickModal) {
        this.$emit("input", false);
      }
    },
    clickClose() {
      this.$emit("input", false);
    },
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
      this.clickClose();
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.dialog {
  position: fixed;
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  max-width: 100%;
  min-width: 400px;
  min-height: 160px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0px 6px 16px 0px rgb(0 0 0 / 12%), 0px 4px 12px -8px rgb(0 0 0 / 9%);
  z-index: 1001;
  &-header {
    position: relative;
    &_title {
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      color: #262626;
      line-height: 24px;
      box-shadow: 0px 1px 0px 0px #f5f5f5;
      &--center {
        text-align: center;
      }
      h5 {
        font-weight: bold;
      }
    }
    &_close {
      position: absolute;
      top: 50%;
      right: 16px;
      margin-top: -10px;
      font-size: 16px;
      cursor: pointer;
      padding: 2px;
      color: #d8d8d8;
    }
    &_close:hover {
      color: #8d8d8d;
    }
  }
  &-content {
    padding: 24px;
    // white-space: nowrap;
    // overflow: auto;
    line-height: 24px;
  }
  &-footer {
    padding: 0 24px 24px;
    margin-top: -4px;
    &_btns {
      text-align: right;
      &--center {
        text-align: center;
      }
    }
  }
}

.dialog-fade-enter-active {
  animation: pop-fade-in 0.3s;
}
.dialog-fade-leave-active {
  animation: pop-fade-out 0.3s;
}
@keyframes pop-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
@keyframes pop-fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
.dialog-inner-fade-enter-active {
  animation: dialog-inner-fade-in 0.3s;
}
.dialog-inner-fade-leave-active {
  animation: dialog-out-fade-out 0.3s;
}
@keyframes dialog-inner-fade-in {
  0% {
    transform: translate3d(-60%, -50%, 0);
  }

  100% {
    transform: translate3d(-50%, -50%, 0);
  }
}
@keyframes dialog-out-fade-out {
  0% {
    transform: translate3d(-50%, -50%, 0);
  }

  100% {
    transform: translate3d(-60%, -50%, 0);
  }
}
</style>
