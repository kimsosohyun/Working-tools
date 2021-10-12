<template>
  <section class="login-outer">
    <activation v-if="!showPwdReset">
      <div class="login">
        <div class="login-logo">
          <img src="../../assets/img/n6p.png" alt="" />
        </div>
        <div class="login-content">
          <div class="login-content-logo">
            <i class="icon-logo"></i>
          </div>
          <div class="login-content-form">
            <v-form ref="form" :model="loginForm" @submit="submit">
              <v-form-item :required="false">
                <v-input
                  icon="icon-user"
                  v-model="loginForm.username"
                  :width="280"
                  size="L"
                  :placeholder="_('Login User Name')"
                ></v-input>
              </v-form-item>
              <v-form-item :required="false">
                <v-input
                  icon="icon-password"
                  v-model="loginForm.password"
                  :width="280"
                  size="L"
                  type="password"
                  show-password
                  :placeholder="_('Login Password')"
                ></v-input>
              </v-form-item>
              <v-form-item>
                <v-button type="primary" size="L" @click="login">{{
                  _("Login")
                }}</v-button>
              </v-form-item>
            </v-form>
            <div>
              <span class="forget-password" @click="toForgetPwd">{{
                _("Forgot password?")
              }}</span>
              <v-select
                v-model="languageSelect"
                :options="languageOptions"
                @change="changeLang"
              ></v-select>
              <!-- <v-dropdown
                :label="languageSelect"
                :options="languageOptions"
                @click-item="clickItem"
              ></v-dropdown> -->
            </div>
          </div>
        </div>
      </div>
    </activation>

    <PwdReset v-else />
  </section>
</template>

<script>
import { getEntriesByAttr } from "@/utils/dicts.js";
import Activation from "@/components/activation.vue";
import PwdReset from "./pwdReset";
import {
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
  clone
} from "@/utils/common";
export default {
  components: {
    PwdReset,
    Activation
  },
  data() {
    this.loginUrl = "/RPC2:global.login";
    this.pwdResetSearch = "?to=pwdReset";
    return {
      languageOptions: getEntriesByAttr("language"),
      languageSelect: B.getLang(),
      loginForm: {
        username: "",
        password: ""
      },
      showPwdReset: false
    };
  },
  methods: {
    toForgetPwd() {
      window.location.href += this.pwdResetSearch;
      // this.showPwdReset = true;
    },
    keyupEnter(e) {
      if (e.keyCode === 13 && !this.showPwdReset) {
        this.$refs.form.submitForm();
      }
    },
    login() {
      this.$refs.form.submitForm();
    },
    async submit() {
      const { username, password } = this.loginForm;
      if (!username || !password) {
        this.$message.error(_("User name and password are required"));
        return;
      }
      const res = await this.$axiosPost(this.loginUrl, {
          username,
          password: this.Base64.encode(password)
        }),
        result = res.getResult();
      // param = res.getParams(),
      // errCode = res.getErrCode();

      if (result) {
        //页面刷新，状态值保存不下来，改为获取当前用户权限时再存
        //this.$store.dispatch("setUsername", username)

        window.location.href = "/";
      }
      // else {
      //   const { remainLoginTimes, lockTime } = param;
      //   if (errCode == 1105) {
      //     this.$message.error(`用户已被锁定，请${lockTime}分钟后再试`);
      //   } else {
      //     this.$message.error(`密码错误，您还可以尝试${remainLoginTimes}次`);
      //   }
      // }
    },
    changeLang(value) {
      setSessionStorage("loginForm", JSON.stringify(this.loginForm));
      B.setLang(value);
      window.location.reload();
    }
    // closePwdReset() {
    // this.showPwdReset = false;
    // this.loginForm = {
    //   username: "",
    //   password: ""
    // };
    // }
  },
  mounted() {
    if (window.location.search === this.pwdResetSearch) {
      this.showPwdReset = true;
    }
    window.addEventListener("keyup", this.keyupEnter);

    const loginForm = JSON.parse(getSessionStorage("loginForm"));
    if (loginForm) {
      this.loginForm = clone(loginForm);
      removeSessionStorage("loginForm");
    }
  },
  destroyed() {
    window.removeEventListener("keyup", this.keyupEnter);
  }
};
</script>

<style lang="scss">
.login-outer {
  width: 100%;
  height: 100%;
}
.login {
  width: 920px;
  height: 520px;
  background: #ffffff;
  box-shadow: 0px 80px 230px -45px rgba(109, 114, 120, 0.16);
  border-radius: 4px;
  .login-logo {
    width: 430px;
    height: 304px;
    margin: 101px 85px 0 22px;
    float: left;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .login-content {
    width: 280px;
    float: left;
    margin-top: 101px;
    .login-content-logo {
      width: 120px;
      height: 27px;
      margin: 0 auto 56px;
      i {
        font-size: 27px;
        color: $main-active-color;
      }
    }
    .login-content-form {
      .v-form-item {
        margin-bottom: 24px;
      }
      .v-form-item:last-child {
        margin-bottom: 14px;
      }
      .v-button--large {
        width: 280px;
      }
      .v-select {
        float: right;
        width: 88px;
        height: 22px;
        .is-focus {
          box-shadow: none;
          color: $main-active-color;
        }
        .v-select__icon--active::before {
          color: $main-active-color;
        }
        .input-text {
          height: 22px;
          line-height: 22px;
          display: inline-block;
          padding-right: 24px;
          border: none;
        }
        .v-select__icon {
          height: 22px;
          line-height: 22px;
          padding: 0;
          font-size: 16px;
        }
      }
      .forget-password {
        cursor: pointer;
        font-size: 14px;
        color: $info-color;
        line-height: 22px;
      }
    }
  }
  // .v-input__icon--prefix {
  //   margin-left: 4px !important;
  // }
  // .v-input--prefix .input-text {
  //   padding-left: 36px;
  // }
  // .v-input__icon--suffix {
  //   margin-right: 8px;
  // }
}
</style>
