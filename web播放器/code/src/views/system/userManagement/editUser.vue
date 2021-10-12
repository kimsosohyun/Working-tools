<template>
  <v-dialog v-model="showEditUser" :title="_('Edit')" @confirm="confirm">
    <div class="edit-user">
      <v-form
        ref="form"
        :model="editUserForm"
        :rules="editUserRules"
        @submit="editUserSubmit"
      >
        <v-form-item :label="_('User Name')" prop="username">
          <v-input v-model="editUserForm.newName" :maxlength="32"></v-input>
        </v-form-item>
        <v-form-item :label="_('Change Password')">
          <v-switch v-model="editUserForm.changePwd"></v-switch>
        </v-form-item>
        <v-form-item
          :label="_('Administrator Password')"
          :disabled="!editUserForm.changePwd"
        >
          <v-input
            v-model="editUserForm.adminPassword"
            type="password"
            show-password
            :maxlength="32"
            :placeholder="_('Enter the administrator password')"
          ></v-input>
        </v-form-item>
        <v-form-item
          :label="_('New Password')"
          prop="newPassword"
          :disabled="!editUserForm.changePwd"
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
              :value="editUserForm.newPassword"
              type="password"
              show-password
              :maxlength="32"
              :placeholder="_('8 to 32 characters')"
              @input="editUserInput"
              @focus="showStrength"
              @blur="pwdCheck"
            ></v-input>
          </v-tooltip>
          <PwdStrength
            ref="pwdStrength"
            :pwd="editUserForm.newPassword"
            :checked="showPwdStrength"
          />
        </v-form-item>
        <v-form-item
          :label="_('Confirm Password')"
          prop="confirmPassword"
          :disabled="!editUserForm.changePwd"
        >
          <v-input
            v-model="editUserForm.confirmPassword"
            :maxlength="32"
            type="password"
            show-password
            :placeholder="_('Re-enter the login password')"
            :disabled="!editUserForm.changePwd"
          ></v-input>
        </v-form-item>
        <v-form-item :label="_('Permission')" :required="false">
          <Authority
            ref="authority"
            :authorityList="editUserForm.authorityList"
          />
        </v-form-item>
      </v-form>
    </div>
  </v-dialog>
</template>

<script>
import { clone } from "@/utils/common.js";
import PwdStrength from "@/components/pwdStrength";
import Authority from "./authority";
export default {
  components: {
    PwdStrength,
    Authority
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
    showEditUser: {
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
      this.editUserForm = clone(val);
    }
  },
  data() {
    this.modifyUserUrl = "/RPC2:userManager.modifyUser";
    return {
      // showEditUser: false,
      showTip: false,
      showPwdStrength: false,
      // username: "",
      editUserRules: {
        username: { type: "username" },
        newPassword: { type: "pwd", args: [8, 32] },
        confirmPassword: { type: "pwd", args: [8, 32] }
        // confirmPassword: val => {
        //   const msg = this.$valid.pwd.all(val, 8, 32);
        //   if (msg) {
        //     return msg;
        //   }
        //   if (val !== this.editUserForm.newPassword) {
        //     return _("Password mismatch");
        //   }
        // }
      },
      editUserForm: {
        newName: "",
        changePwd: false,
        adminPassword: "",
        newPassword: "",
        confirmPassword: "",
        authorityList: {}
      }
    };
  },
  methods: {
    async editUserSubmit() {
      this.editUserForm.authorityList = this.$refs.authority.getAuthorityList();
      const {
          newName,
          adminPassword,
          newPassword,
          confirmPassword,
          authorityList,
          changePwd
        } = this.editUserForm,
        username = this.formData.newName;
      let submitData = {};

      if (changePwd) {
        if (newPassword !== confirmPassword) {
          this.$message.error(_("Password mismatch"));
          return;
        }
        submitData = {
          username,
          newName,
          adminPassword: this.Base64.encode(adminPassword),
          newPassword: this.Base64.encode(newPassword),
          authorityList
        };
      } else {
        submitData = {
          username,
          newName,
          authorityList
        };
      }

      const res = await this.$axiosPost(this.modifyUserUrl, submitData),
        // errCode = res.getErrCode(),
        result = res.getResult();

      if (result) {
        this.$message.success(_("Saved Successfully"));
        this.showEditUser = false;
        this.afterConfirm();
      }
      // else {
      //   if (errCode == 1109) {
      //     this.$message.error("管理员密码错误");
      //   } else if (errCode == 1102) {
      //     this.$message.error("用户已存在");
      //   } else if (errCode == 1110) {
      //     this.$message.error("新密码与旧密码不能相同");
      //   } else {
      //     this.$message.error("保存失败");
      //   }
      // }
    },
    editUserInput(value) {
      this.editUserForm.newPassword = value;
    },
    showStrength() {
      this.showPwdStrength = true;
      this.showTip = true;
    },
    pwdCheck() {
      this.showTip = false;
      let valid = this.editUserForm.newPassword;

      if (this.$valid.pwd.all(valid, 8, 32)) {
        this.showPwdStrength = false;
      }
    },
    confirm() {
      this.$refs.form.submitForm();
    }
  }
};
</script>
