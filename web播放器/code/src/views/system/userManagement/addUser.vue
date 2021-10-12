<template>
  <v-dialog v-model="showAddUser" :title="_('c#RaY#Add')" @confirm="confirm">
    <div class="add-user">
      <v-form
        ref="form"
        :model="addUserForm"
        :rules="addUserRules"
        @submit="addUserSubmit"
      >
        <v-form-item :label="_('User Name')" prop="username">
          <v-input v-model="addUserForm.username" :maxlength="32"></v-input>
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
              :value="addUserForm.password"
              type="password"
              show-password
              :maxlength="32"
              :placeholder="_('8 to 32 characters')"
              @input="addUserInput"
              @focus="showStrength"
              @blur="pwdCheck"
            ></v-input>
          </v-tooltip>
          <PwdStrength
            ref="pwdStrength"
            :pwd="addUserForm.password"
            :checked="showPwdStrength"
          />
        </v-form-item>
        <v-form-item :label="_('Confirm Password')" prop="confirmPassword">
          <v-input
            v-model="addUserForm.confirmPassword"
            type="password"
            show-password
            :maxlength="32"
            :placeholder="_('Re-enter the login password')"
          ></v-input>
        </v-form-item>
        <v-form-item :label="_('Permission')" :required="false">
          <Authority
            ref="authority"
            :authorityList="addUserForm.authorityList"
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
    showAddUser: {
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
      this.addUserForm = clone(val);
    }
  },
  data() {
    this.addUserUrl = "/RPC2:userManager.addUser";
    return {
      // showAddUser: false,
      showTip: false,
      showPwdStrength: false,
      addUserRules: {
        username: { type: "username" },
        password: { type: "pwd", args: [8, 32] },
        confirmPassword: { type: "pwd", args: [8, 32] }
        // confirmPassword: val => {
        //   const msg = this.$valid.pwd.all(val, 8, 32);
        //   if (msg) {
        //     return msg;
        //   }
        //   if (val !== this.addUserForm.password) {
        //     return _("Password mismatch");
        //   }
        // }
      },
      addUserForm: {
        username: "",
        password: "",
        confirmPassword: "",
        authorityList: {}
      }
    };
  },
  methods: {
    async addUserSubmit() {
      this.addUserForm.authorityList = this.$refs.authority.getAuthorityList();
      const {
        username,
        password,
        authorityList,
        confirmPassword
      } = this.addUserForm;

      if (password !== confirmPassword) {
        this.$message.error(_("Password mismatch"));
        return;
      }
      const res = await this.$axiosPost(this.addUserUrl, {
          username,
          password: this.Base64.encode(password),
          authorityList
        }),
        // errCode = res.getErrCode(),
        result = res.getResult();

      if (result) {
        this.$message.success(_("Succeeded"));
        this.showAddUser = false;
        this.afterConfirm();
      }
      // else {
      // if (errCode == 1102) {
      // this.$message.error("用户已存在");
      // } else {
      //   this.$message.error("Failed to add");
      // }
      // }
    },
    addUserInput(value) {
      this.addUserForm.password = value;
    },
    showStrength() {
      this.showPwdStrength = true;
      this.showTip = true;
    },
    pwdCheck() {
      this.showTip = false;
      const valid = this.addUserForm.password;
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
