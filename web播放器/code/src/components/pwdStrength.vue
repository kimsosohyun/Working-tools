<template>
  <div
    class="pwdStrength"
    :class="className"
    v-show="checkStrong > 0 && checked"
  >
    <span class="pwdStrength-introduce">{{ _("Strength") }}</span>
    <ul class="pwdStrength-list">
      <li class="pwdStrength-list-item"></li>
      <li class="pwdStrength-list-item"></li>
      <li class="pwdStrength-list-item"></li>
    </ul>
    <span class="pwdStrength-text">
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    pwd: String,
    checked: Boolean //是否通过验证，没有通过验证不显示密码强度
  },
  computed: {
    checkStrong() {
      let modes = 0,
        { pwd } = this;
      // if (this.pwd.length < 6) return 0;
      if (/\d/.test(pwd)) modes++; //数字
      if (/[a-z]/.test(pwd)) modes++; //小写
      if (/[A-Z]/.test(pwd)) modes++; //大写
      if (/\W/.test(pwd)) modes++; //特殊字符
      // if (this.pwd.length > 12) return 4;
      return modes;
    },
    className() {
      if (this.checkStrong === 1) {
        return "pwdStrength-low";
      } else if (this.checkStrong === 2) {
        return "pwdStrength-middle";
      } else if (this.checkStrong >= 3) {
        return "pwdStrength-high";
      } else {
        return "";
      }
    },
    text() {
      if (this.checkStrong === 1) {
        return _("Weak");
      } else if (this.checkStrong === 2) {
        return _("Medium");
      } else if (this.checkStrong >= 3) {
        return _("Strong");
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pwdStrength {
  position: absolute;
  margin-top: 4px;
  line-height: 12px;
  height: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  .pwdStrength-introduce {
    color: $info-color;
  }
  .pwdStrength-list {
    margin-left: 4px;
    margin-right: 8px;
    display: inline-block;
    width: 120px;
    height: 8px;
    box-sizing: border-box;
    border-radius: 1px;
    padding: 1px;
    background: white;
    border: 1px solid #d8d8d8;
    .pwdStrength-list-item {
      float: left;
      margin-right: 1px;
      width: 38px;
      height: 4px;
      background: #d8d8d8;
    }
    .pwdStrength-list-item:last-child {
      margin-right: 0;
    }
  }
}
.pwdStrength-low {
  .pwdStrength-list .pwdStrength-list-item:first-child {
    background: $error-color;
  }
  .pwdStrength-text {
    color: $error-color;
  }
}
.pwdStrength-middle {
  .pwdStrength-list .pwdStrength-list-item:nth-child(1) {
    background: $warn-color;
  }
  .pwdStrength-list .pwdStrength-list-item:nth-child(2) {
    background: $warn-color;
  }
  .pwdStrength-text {
    color: $warn-color;
  }
}
.pwdStrength-high {
  .pwdStrength-list .pwdStrength-list-item {
    background: $success-color;
  }
  .pwdStrength-text {
    color: $success-color;
  }
}
</style>
