<template>
  <activation>
    <div class="pwd-reset">
      <div class="pwd-reset-title">
        <h1>{{ _("Reset Password") }}</h1>
        <div class="pwd-reset-close" @click="close">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="reset-code" v-if="!showResetForm">
        <div
          :class="[{ 'reset-code-right': phone }, { 'reset-code-top': !phone }]"
        >
          <div class="qrcode-right" id="qrcode-right"></div>
          <div class="reset-code-group">
            <v-input
              type="text"
              v-model="code"
              size="L"
              :width="280"
              :placeholder="_('Enter the verification code')"
              :maxlength="6"
            ></v-input>
            <p>
              {{
                _(
                  "Do not close this page before entering the verification code. Otherwise, the code could become invalid."
                )
              }}
            </p>
            <v-button type="primary" size="L" @click="toReset">{{
              _("Reset")
            }}</v-button>
          </div>
        </div>
        <div
          :class="[
            { 'reset-code-left': phone },
            { 'reset-code-bottom': !phone }
          ]"
        >
          <h3 class="pwd-reset-ways">
            <!-- 密码重置的2种方法： -->
          </h3>
          <div class="pwd-reset-way1" v-if="phone">
            <strong>{{ _("Method 1: Use the TDSEE App") }}</strong>
            <p>
              {{
                _(
                  "1. Optional. Scan the QR code on the right, download and install the TDSEE App."
                )
              }}
            </p>
            <p>
              {{
                _(
                  "2. Run the TDSEE App, register and log in with the reserved Email address %s. Navigate to Me > General Tools > Reset Device Password, and scan the QR code on the right. The verification code will be shown in the TDSEE App.",
                  [phone]
                )
              }}
            </p>
            <p>
              {{
                _(
                  "3. Enter the verification code in the text field on the right, and click Reset."
                )
              }}
            </p>
          </div>
          <div class="pwd-reset-way2">
            <strong>{{
              phone
                ? _("Method 2: Contact Tenda technical support")
                : _("Contact Tenda technical support")
            }}</strong>
            <p>
              {{
                phone
                  ? _(
                      "1. Scan the QR code on the right to get the security code, or take a photo of the QR code."
                    )
                  : _(
                      "1. Scan the QR code on the top to get the security code, or take a photo of the QR code."
                    )
              }}
            </p>
            <p :class="{ 'inline-p': !phone }">
              {{
                _(
                  "2. Send the security code or the photo of the QR code to Tenda technical support"
                )
              }}
            </p>
            <p :class="{ 'inline-p': !phone }">
              {{
                _(
                  "(Email: support@tenda.com.cn). Tenda technical support will send you the verification code."
                )
              }}
            </p>
            <p>
              {{
                phone
                  ? _(
                      "3. Enter the verification code in the text field on the right, and click Reset."
                    )
                  : _(
                      "3. Enter the verification code in the text field on the top, and click Reset."
                    )
              }}
            </p>
          </div>
          <div class="pwd-reset-qrcode" v-if="phone">
            <div class="qrcode-left" id="qrcode-left"></div>
            <span class="app-download">{{ _("Download the TDSEE App") }}</span>
          </div>
        </div>
      </div>
      <div class="reset-form" v-else>
        <div class="reset-form-group">
          <v-form
            ref="form"
            :model="pwdResetForm"
            :rules="rules"
            @submit="submit"
          >
            <v-form-item :label="_('User Name')" prop="username">
              <v-input
                v-model="pwdResetForm.username"
                :width="280"
                size="L"
                disabled
              ></v-input>
            </v-form-item>
            <v-form-item :label="_('New Password')" prop="password">
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
                  :value="pwdResetForm.password"
                  :width="280"
                  size="L"
                  type="password"
                  show-password
                  :maxlength="32"
                  :placeholder="_('8 to 32 characters')"
                  @input="pwdInput"
                  @focus="showStrength"
                  @blur="pwdCheck"
                ></v-input>
              </v-tooltip>
              <PwdStrength
                ref="pwdStrength"
                :pwd="pwdResetForm.password"
                :checked="showPwdStrength"
              />
            </v-form-item>
            <v-form-item :label="_('Confirm Password')" prop="confirmPassword">
              <v-input
                v-model="pwdResetForm.confirmPassword"
                :width="280"
                size="L"
                type="password"
                :maxlength="32"
                show-password
                :placeholder="_('Re-enter the login password')"
              ></v-input>
            </v-form-item>
            <v-form-item class="enable" :label="_('Sync Password to Cameras')">
              <v-switch v-model="pwdResetForm.synFlag"></v-switch>
            </v-form-item>
            <v-form-item>
              <v-button type="primary" size="L" @click="save">{{
                _("Save")
              }}</v-button>
            </v-form-item>
          </v-form>
        </div>
      </div>
    </div>
  </activation>
</template>

<script>
import QRCode from "qrcode2";
import PwdStrength from "@/components/pwdStrength.vue";
import Activation from "@/components/activation.vue";
export default {
  data() {
    this.getQRcodeUrl = "/RPC2:userManager.getQRcode";
    this.checkcodeUrl = "/RPC2:userManager.checkcode";
    this.resetPasswordUrl = "/RPC2:global.resetPassword";
    return {
      showResetForm: false,
      code: "",
      phone: "",
      pwdResetForm: {
        username: "admin",
        password: "",
        confirmPassword: "",
        synFlag: true
      },
      showPwdStrength: false,
      showTip: false,
      rules: {
        password: { type: "pwd", args: [8, 32] },
        confirmPassword: { type: "pwd", args: [8, 32] }
        // confirmPassword: val => {
        //   const msg = this.$valid.pwd.all(val, 8, 32);
        //   if (msg) {
        //     return msg;
        //   }
        //   if (val !== this.pwdResetForm.password) {
        //     return _("Password mismatch");
        //   }
        // }
      }
    };
  },
  components: {
    PwdStrength,
    Activation
  },
  computed: {
    appQRCode() {
      return this.$store.state.appQRCode;
    }
  },
  mounted() {
    window.addEventListener("keyup", this.keyupEnter);
    this.getQrcode();
    // this.createQrcode(this.appQRCode, "qrcode-left", 71);
  },
  methods: {
    async getQrcode() {
      const res = await this.$axiosPost(this.getQRcodeUrl),
        { QRcode, contact } = res.getParams();

      this.phone = contact;
      if (this.phone) {
        this.$nextTick(() => {
          this.createQrcode(this.appQRCode, "qrcode-left", 71);
        });
      }
      this.createQrcode(QRcode, "qrcode-right", 120);
    },
    async toReset() {
      const res = await this.$axiosPost(this.checkcodeUrl, {
          verifyCode: this.code
        }),
        { result } = res.data;

      if (result) {
        this.showResetForm = true;
      } else {
        this.$message.error(_("Incorrect verification code"));
      }
    },
    createQrcode(text, id, width) {
      new QRCode(document.getElementById(id), {
        text,
        width,
        height: width,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H
      });
    },
    pwdInput(value) {
      this.pwdResetForm.password = value;
    },
    showStrength() {
      this.showPwdStrength = true;
      this.showTip = true;
    },
    pwdCheck() {
      this.showTip = false;
      if (this.$valid.pwd.all(this.pwdResetForm.password, 8, 32)) {
        this.showPwdStrength = false;
      }
    },
    save() {
      this.$refs.form.submitForm();
    },
    async submit() {
      const {
        username,
        password,
        synFlag,
        confirmPassword
      } = this.pwdResetForm;

      if (password !== confirmPassword) {
        this.$message.error(_("Password mismatch"));
        return;
      }
      const res = await this.$axiosPost(this.resetPasswordUrl, {
          username,
          password: this.Base64.encode(password),
          synFlag
        }),
        result = res.getResult();

      if (result) {
        this.$message.success(_("Resetting password succeeded"));
        this.close();
      } else {
        this.$message.error(_("Failed to reset password"));
        // window.location.reload();
        Object.assign(this.$data, this.$options.data.call(this));
        this.getQrcode();
      }
    },
    keyupEnter(e) {
      if (e.keyCode === 13) {
        if (this.showResetForm) {
          this.$refs.form.submitForm();
        } else {
          this.toReset();
        }
      }
    },
    close() {
      // this.$emit("closePwdReset");
      window.location.href = "/login.html";
    }
  },
  destroyed() {
    window.removeEventListener("keyup", this.keyupEnter);
  }
};
</script>

<style lang="scss">
.pwd-reset {
  width: 960px;
  height: 576px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  .pwd-reset-title {
    height: 64px;
    border-bottom: 1px solid #f5f5f5;
    line-height: 64px;
    h1 {
      margin-left: 24px;
      font-size: 20px;
      font-weight: bold;
      color: #262626;
      float: left;
    }
    .pwd-reset-close {
      margin-top: 19px;
      width: 26px;
      height: 26px;
      float: right;
      margin-right: 19px;
      line-height: 26px;
      cursor: pointer;
      i {
        padding: 5px;
        color: $light-color;
        font-size: 16px;
      }
    }
  }
  .reset-code {
    .reset-code-left {
      margin-left: 60px;
      width: 507px;
      float: left;
      position: relative;
      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 1px;
        height: 400px;
        background: #e9e9e9;
        left: 507px;
        top: 36px;
      }
      .qrcode-left {
        position: absolute;
        top: 120px;
        right: 48px;
        width: 71px;
        height: 71px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .app-download {
        position: absolute;
        top: 190px;
        right: 35px;
        font-size: 12px;
        color: #99999f;
        line-height: 22px;
      }
      .pwd-reset-ways {
        margin-top: 48px;
        margin-bottom: 28px;
        font-size: 14px;
        color: #262626;
        line-height: 1;
      }
      strong {
        font-size: 16px;
        font-weight: bold;
        color: $main-active-color;
        line-height: 22px;
      }
      p {
        font-size: 14px;
        color: #262626;
        line-height: 22px;
      }
      .pwd-reset-way1 {
        p:nth-of-type(1) {
          margin-top: 8px;
        }
        p {
          width: 356px;
        }
      }
      .pwd-reset-way2 {
        margin-top: 44px;
        p:nth-of-type(1) {
          margin-top: 8px;
        }
        p {
          width: 482px;
        }
      }
    }
    .reset-code-bottom {
      margin: 0 60px;
      strong {
        font-size: 16px;
        font-weight: bold;
        color: $main-active-color;
        line-height: 22px;
      }
      p {
        font-size: 14px;
        color: #262626;
        line-height: 22px;
      }
      .inline-p {
        display: inline;
      }
      .pwd-reset-way2 {
        p:nth-of-type(1) {
          margin-top: 8px;
        }
      }
    }
    .reset-code-right,
    .reset-code-top {
      width: 392px;
      .qrcode-right {
        margin: 0 auto 24px;
        width: 120px;
        height: 120px;
      }
      .reset-code-group {
        width: 280px;
        margin: 0 auto;
        .v-button--large {
          width: 280px;
        }
        p {
          margin: 8px auto;
          font-size: 14px;
          color: #8d8d8d;
          line-height: 22px;
        }
      }
    }
    .reset-code-right {
      float: right;
      margin-top: 96px;
    }
    .reset-code-top {
      margin: 32px auto 30px;
    }
  }
  .reset-form {
    width: 100%;
    text-align: center;
    .reset-form-group {
      display: inline-block;
      margin: 56px 0;
    }
    .v-form-item__content {
      text-align: left;
    }
    .v-form-item {
      margin-bottom: 24px;
    }
    .v-form-item:last-child {
      margin-bottom: 14px;
    }
    .v-button--large {
      width: 280px;
    }
  }
  .enable {
    .v-form-item__label {
      font-size: 16px;
      line-height: 40px;
      color: #262626;
    }

    .v-switch__item {
      line-height: 40px;
    }
  }
}
</style>
