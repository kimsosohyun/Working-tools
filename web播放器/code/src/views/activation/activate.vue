<template>
  <activation>
    <div class="activate">
      <h1 class="activate-title">{{ _("Device Activation") }}</h1>
      <div class="activate-form">
        <v-form
          ref="form"
          :model="activateForm"
          :rules="rules"
          @submit="submit"
        >
          <v-form-item :label="_('User Name')">
            <v-input
              v-model="activateForm.username"
              :width="280"
              size="L"
              disabled
            ></v-input>
          </v-form-item>
          <v-form-item :label="_('Password')" prop="password">
            <v-tooltip
              position="right-center"
              v-model="showTip"
              :max-width="222"
              trigger="manual"
              :content="
                _(
                  'A combination of at least two types among numbers, uppercase and lowercase letters and special characters'
                )
              "
            >
              <v-input
                :value="activateForm.password"
                :width="280"
                :maxlength="32"
                size="L"
                type="password"
                show-password
                :placeholder="_('8 to 32 characters')"
                @input="pwdInput"
                @focus="showStrength"
                @blur="pwdCheck"
              ></v-input>
            </v-tooltip>
            <PwdStrength
              ref="pwdStrength"
              :pwd="activateForm.password"
              :checked="showPwdStrength"
            />
          </v-form-item>
          <v-form-item :label="_('Confirm Password')" prop="confirmPassword">
            <v-input
              v-model="activateForm.confirmPassword"
              :width="280"
              size="L"
              :maxlength="32"
              type="password"
              show-password
              :placeholder="_('Re-enter the login password')"
            ></v-input>
          </v-form-item>
          <v-form-item
            :label="_('Email Address')"
            prop="phoneNumber"
            :required="false"
          >
            <v-input
              v-model="activateForm.phoneNumber"
              :width="280"
              size="L"
              :placeholder="_('Only for resetting the password')"
            ></v-input>
          </v-form-item>
          <v-form-item>
            <v-button
              type="primary"
              size="L"
              :disabled="!canActivate"
              @click="activate"
              >{{ _("Activate") }}</v-button
            >
          </v-form-item>
        </v-form>
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
  </activation>
</template>

<script>
import Activation from "@/components/activation.vue";
import PwdStrength from "@/components/pwdStrength.vue";
import { getEntriesByAttr } from "@/utils/dicts.js";
import {
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
  clone
} from "@/utils/common";

export default {
  components: {
    PwdStrength,
    Activation
  },
  data() {
    this.activeUrl = "/RPC2:global.active";
    return {
      languageSelect: B.getLang(),
      languageOptions: getEntriesByAttr("language"),
      activateForm: {
        username: "admin",
        password: "",
        confirmPassword: "",
        phoneNumber: ""
      },
      rules: {
        password: { type: "pwd", args: [8, 32] },
        confirmPassword: { type: "pwd", args: [8, 32] },
        // confirmPassword: val => {
        //   const msg = this.$valid.pwd.all(val, 8, 32);
        //   if (msg) {
        //     return msg;
        //   }
        //   if (val !== this.activateForm.password) {
        //     return _("Password mismatch");
        //   }
        // },
        phoneNumber: { type: "identity" }
      },
      showPwdStrength: false,
      showTip: false
    };
  },
  computed: {
    canActivate() {
      const { password, confirmPassword } = this.activateForm;

      if (password.length > 0 && confirmPassword.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    activate() {
      this.$refs.form.submitForm();
    },
    pwdInput(value) {
      this.activateForm.password = value;
    },
    showStrength() {
      this.showPwdStrength = true;
      this.showTip = true;
    },
    pwdCheck() {
      this.showTip = false;
      if (this.$valid.pwd.all(this.activateForm.password, 8, 32)) {
        this.showPwdStrength = false;
      }
    },
    async submit() {
      const {
        username,
        password,
        phoneNumber,
        confirmPassword
      } = this.activateForm;

      if (password !== confirmPassword) {
        this.$message.error(_("Password mismatch"));
        return;
      }
      const res = await this.$axiosPost(this.activeUrl, {
          username,
          password: this.Base64.encode(password),
          phoneNumber
        }),
        result = res.getResult();

      if (result) {
        const { ip } = res.getParams();

        window.location.href = "https://" + ip;
      } else {
        this.$message.error(_("Failed to activate"));
      }
    },
    keyupEnter(e) {
      if (this.canActivate && e.keyCode === 13) {
        this.$refs.form.submitForm();
      }
    },
    changeLang(value) {
      setSessionStorage("activateForm", JSON.stringify(this.activateForm));
      B.setLang(value);
      window.location.reload();
    }
  },
  mounted() {
    window.addEventListener("keyup", this.keyupEnter);
    const activateForm = JSON.parse(getSessionStorage("activateForm"));
    if (activateForm) {
      this.activateForm = clone(activateForm);
      removeSessionStorage("activateForm");
    }
  },
  destroyed() {
    window.removeEventListener("keyup", this.keyupEnter);
  }
};
</script>

<style lang="scss">
.activate {
  width: 920px;
  height: 520px;
  text-align: center;
  background: #ffffff;
  box-shadow: 0px 80px 230px -45px rgba(109, 114, 120, 0.16);
  border-radius: 4px;
  .activate-title {
    margin: 66px 0 32px;
    font-size: 22px;
    font-weight: bold;
    color: #262626;
    line-height: 22px;
    margin-bottom: 32px;
  }
  .activate-form {
    display: inline-block;
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
  }
  .v-form-item__content__msg {
    text-align: left;
  }
}
</style>
