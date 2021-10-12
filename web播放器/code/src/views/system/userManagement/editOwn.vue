<template>
  <v-dialog v-model="showEditOwn" :title="_('Edit')" @confirm="confirm">
    <div class="edit-own">
      <v-form
        ref="form"
        :model="editOwnForm"
        :rules="editOwnRules"
        @submit="editOwnSubmit"
      >
        <v-form-item :label="_('User Name')">
          <v-input v-model="editOwnForm.username" disabled></v-input>
        </v-form-item>
        <v-form-item :label="_('Old Password')">
          <v-input
            v-model="editOwnForm.oldPassword"
            type="password"
            show-password
            :maxlength="32"
            :placeholder="_('Current login password')"
          ></v-input>
        </v-form-item>
        <v-form-item :label="_('New Password')" prop="newPassword">
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
              :value="editOwnForm.newPassword"
              type="password"
              show-password
              :maxlength="32"
              :placeholder="_('8 to 32 characters')"
              @input="editOwnInput"
              @focus="showStrength"
              @blur="pwdCheck"
            ></v-input>
          </v-tooltip>
          <PwdStrength
            ref="pwdStrength"
            :pwd="editOwnForm.newPassword"
            :checked="showPwdStrength"
          />
        </v-form-item>
        <v-form-item :label="_('Confirm Password')" prop="confirmPassword">
          <v-input
            v-model="editOwnForm.confirmPassword"
            type="password"
            show-password
            :maxlength="32"
            :placeholder="_('Re-enter the login password')"
          ></v-input>
        </v-form-item>
      </v-form>
    </div>
  </v-dialog>
</template>

<script>
import { clone } from "@/utils/common.js";
import PwdStrength from "@/components/pwdStrength";
export default {
  components: {
    PwdStrength
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object
    },
    afterConfirm: {
      type: Function,
      default: () => () => {}
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  computed: {
    showEditOwn: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  watch: {
    formData(val) {
      this.editOwnForm = clone(val);
    }
  },
  data() {
    this.modifyOwnUrl = "/RPC2:userManager.modifyUserByGeneral";
    return {
      // showEditOwn: false,
      showTip: false,
      showPwdStrength: false,
      editOwnRules: {
        newPassword: { type: "pwd", args: [8, 32] },
        confirmPassword: { type: "pwd", args: [8, 32] }
        // newPassword: { type: "len", args: [8, 32] },
        // confirmPassword: val => {
        //   const msg = this.$valid.pwd.all(val, 8, 32);
        //   if (msg) {
        //     return msg;
        //   }
        //   if (val !== this.editOwnForm.newPassword) {
        //     return _("Password mismatch");
        //   }
        // },
        // newPassword: val => {
        //   const msg = this.$valid.pwd.all(val, 8, 32);
        //   if (msg) {
        //     this.showPwdStrength = false;
        //     return msg;
        //   }
        //   if (val === this.editOwnForm.oldPassword) {
        //     this.showPwdStrength = false;
        //     return _(
        //       "The new password and the old password cannot be the same"
        //     );
        //   }
        // }
      },
      editOwnForm: {
        username: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
    };
  },
  methods: {
    async editOwnSubmit() {
      const {
        username,
        oldPassword,
        newPassword,
        confirmPassword
      } = this.editOwnForm;

      if (oldPassword === newPassword) {
        this.$message.error(
          _("The new password and the old password cannot be the same")
        );
        return;
      } else if (newPassword !== confirmPassword) {
        this.$message.error(_("Password mismatch"));
        return;
      }
      const res = await this.$axiosPost(this.modifyOwnUrl, {
          username,
          oldPassword: this.Base64.encode(oldPassword),
          newPassword: this.Base64.encode(newPassword)
        }),
        // errCode = res.getErrCode(),
        result = res.getResult();

      if (result) {
        this.$message.success(_("Saved Successfully"));
        this.showEditOwn = false;
        this.afterConfirm();
      }
    },
    editOwnInput(value) {
      this.editOwnForm.newPassword = value;
    },
    showStrength() {
      this.showPwdStrength = true;
      this.showTip = true;
    },
    pwdCheck() {
      this.showTip = false;
      if (this.$valid.pwd.all(this.editOwnForm.newPassword, 8, 32)) {
        this.showPwdStrength = false;
      }
    },
    confirm() {
      this.$refs.form.submitForm();
    }
  }
};
</script>

<style></style>
