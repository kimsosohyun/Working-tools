<template>
  <v-dialog v-model="showEditAdmin" :title="_('Edit')" @confirm="confirm">
    <div class="edit-admin">
      <v-form
        ref="form"
        :model="editAdminForm"
        :rules="editAdminRules"
        @submit="editAdminSubmit"
      >
        <v-form-item :label="_('User Name')">
          <v-input v-model="editAdminForm.username" disabled></v-input>
        </v-form-item>
        <v-form-item :label="_('Change Password')">
          <v-switch v-model="editAdminForm.changePwd"></v-switch>
        </v-form-item>
        <v-form-item
          :label="_('Old Password')"
          :disabled="!editAdminForm.changePwd"
        >
          <v-input
            v-model="editAdminForm.oldPassword"
            type="password"
            show-password
            :maxlength="32"
            :placeholder="_('Current login password')"
          ></v-input>
        </v-form-item>
        <v-form-item
          :label="_('New Password')"
          prop="newPassword"
          :disabled="!editAdminForm.changePwd"
        >
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
              :value="editAdminForm.newPassword"
              type="password"
              show-password
              :maxlength="32"
              :placeholder="_('8 to 32 characters')"
              @input="editAdminInput"
              @focus="showStrength"
              @blur="pwdCheck"
            ></v-input>
          </v-tooltip>
          <PwdStrength
            ref="pwdStrength"
            :pwd="editAdminForm.newPassword"
            :checked="showPwdStrength"
          />
        </v-form-item>
        <v-form-item
          :label="_('Confirm Password')"
          prop="confirmPassword"
          :disabled="!editAdminForm.changePwd"
        >
          <v-input
            v-model="editAdminForm.confirmPassword"
            type="password"
            :maxlength="32"
            show-password
            :placeholder="_('Re-enter the login password')"
          ></v-input>
        </v-form-item>
        <!-- <v-form-item :label="_('Sync Password to Cameras')">
          <v-switch v-model="editAdminForm.isSync"></v-switch>
        </v-form-item> -->

        <v-form-item
          :label="_('Email Address')"
          prop="telephone"
          :required="false"
        >
          <v-input
            v-model="editAdminForm.telephone"
            :placeholder="_('Only for resetting the password')"
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
    showEditAdmin: {
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
      this.editAdminForm = clone(val);
    }
  },
  data() {
    this.modifyUserUrl = "/RPC2:userManager.modifyUser";
    return {
      // showEditAdmin: false,
      showTip: false,
      showPwdStrength: false,
      editAdminForm: {},
      editAdminRules: {
        newPassword: { type: "pwd", args: [8, 32] },
        confirmPassword: { type: "pwd", args: [8, 32] },
        // newPassword: val => {
        //   const msg = this.$valid.pwd.all(val, 8, 32);
        //   if (msg) {
        //     this.showPwdStrength = false;
        //     return msg;
        //   }
        //   if (val === this.editAdminForm.oldPassword) {
        //     this.showPwdStrength = false;
        //     return _(
        //       "The new password and the old password cannot be the same"
        //     );
        //   }
        // },
        // confirmPassword: val => {
        //   const msg = this.$valid.pwd.all(val, 8, 32);
        //   if (msg) {
        //     return msg;
        //   }
        //   if (val !== this.editAdminForm.newPassword) {
        //     return _("Password mismatch");
        //   }
        // },
        telephone: { type: "identity" }
      }
    };
  },
  methods: {
    async editAdminSubmit() {
      const {
        username,
        oldPassword,
        newPassword,
        confirmPassword,
        // isSync,
        telephone,
        changePwd
      } = this.editAdminForm;
      let submitData = {};

      if (changePwd) {
        if (oldPassword === newPassword) {
          this.$message.error(
            _("The new password and the old password cannot be the same")
          );
          return;
        } else if (newPassword !== confirmPassword) {
          this.$message.error(_("Password mismatch"));
          return;
        }

        submitData = {
          username,
          oldPassword: this.Base64.encode(oldPassword),
          newPassword: this.Base64.encode(newPassword),
          // isSync,
          telephone
        };
      } else {
        submitData = {
          username,
          // isSync,
          telephone
        };
      }

      const res = await this.$axiosPost(this.modifyUserUrl, submitData),
        result = res.getResult();

      if (result) {
        this.$message.success(_("Saved Successfully"));
        this.showEditAdmin = false;
        this.afterConfirm();
      }
    },
    editAdminInput(value) {
      this.editAdminForm.newPassword = value;
    },
    showStrength() {
      this.showPwdStrength = true;
      this.showTip = true;
    },
    pwdCheck() {
      this.showTip = false;
      if (this.$valid.pwd.all(this.editAdminForm.newPassword, 8, 32)) {
        this.showPwdStrength = false;
      }
    },
    confirm() {
      this.$refs.form.submitForm();
    }
  }
};
</script>
