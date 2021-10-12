<template>
  <v-dialog
    ref="dialogMsg"
    class="dialog-tips"
    :value="visible"
    :width="480"
    :show-title="false"
    :show-confirm="false"
    :show-cancel="false"
    @after-close="handleAfterClose"
  >
    <template v-if="type === 'loading'">
      <v-loading :visible="true" :background="bg">
        <div v-if="dangerouslyUseHTMLString" v-html="text"></div>
        <div v-else class="tips-text loading-text">{{ text }}</div>
      </v-loading>
    </template>
    <template v-else>
      <div class="dialog-tips-center" v-if="type === 'timeout'">
        <div class="tips-close" @click="toLogin">
          <i class="icon-close-dialog"></i>
        </div>
        <div class="tips-content">
          <i class="tips-icon icon-timeout"></i>
          <span class="tips-text">{{ text }}</span>
        </div>
      </div>
      <div v-else class="dialog-tips-wrapper">
        <i :class="['tips-icon', `icon-full-${type}`]"></i>
        <span class="tips-text">{{ text }}</span>
      </div>
    </template>
  </v-dialog>
</template>

<script>
import { mainActiveColor } from "@/assets/scss/vars.scss";
export default {
  name: "loading",
  data() {
    return {
      visible: false,
      type: "",
      text: "",
      wait: 2000,
      bg: mainActiveColor,
      dangerouslyUseHTMLString: false
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    hideAfterWait() {
      if (this.wait > 0) {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
          this.hide();
        }, this.wait);
      } else {
        this.hide();
      }
    },
    handleAfterClose() {
      this.closeCallback();
      document.body.removeChild(this.$refs.dialogMsg.$el);
    },
    toLogin() {
      window.location = "/login.html";
    },
    closeCallback() {}
  }
};
</script>

<style lang="scss">
.dialog-tips {
  $padding-lr: 24px;
  // padding: 0 $padding-lr;
  .v-dialog {
    height: 190px;
    &__main {
      width: 100%;
      height: 100%;
    }
  }
  .tips-text {
    color: $title-color;
    font-size: $font-size-l;
  }
  .loading-text {
    width: 480px - $padding-lr;
  }

  &-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .tips-icon {
      margin-right: 8px;
      font-size: 40px;
      &.icon-full-error {
        color: $error-color;
      }
      &.icon-full-success {
        color: $success-color;
      }
    }
  }
  &-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .tips-content {
      text-align: center;
    }
    .tips-icon {
      display: block;
      font-size: 40px;
      margin-bottom: 16px;
      color: #99999f;
    }
    .tips-text {
      display: block;
    }
  }
  .tips-close {
    position: absolute;
    top: 14px;
    right: 22px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    i {
      color: $title-color;
      padding: 2px;
      font-size: 16px;
    }
  }
}
</style>
