<template>
  <v-dialog v-model="show" :title="_('Edit the Camera')" @confirm="confirm">
    <div class="edit-camera">
      <v-form ref="form" :model="editForm" :rules="rules" @submit="editSubmit">
        <v-form-item :label="_('Auto Add')" prop="auto">
          <v-switch v-model="editForm.auto"></v-switch>
        </v-form-item>
        <v-form-item :label="_('IP Address')" prop="ip">
          <v-input-group
            type="ip"
            v-model="editForm.ip"
            :auto-correction="['1.0.0.1', '223.255.255.255']"
          ></v-input-group>
        </v-form-item>
        <v-form-item :label="_('Subnet Mask')" prop="mask">
          <v-input-group
            type="ip"
            v-model="editForm.mask"
            :auto-correction="['0.0.0.0', '255.255.255.255']"
          ></v-input-group>
        </v-form-item>
        <v-form-item :label="_('Default Gateway')" prop="gateway">
          <v-input-group
            type="ip"
            v-model="editForm.gateway"
            :auto-correction="['1.0.0.1', '223.255.255.255']"
          ></v-input-group>
        </v-form-item>
        <v-form-item :label="_('User Name')" prop="username">
          <v-input v-model="editForm.username"></v-input>
        </v-form-item>
        <v-form-item :label="_('Password')" prop="password">
          <v-input v-model="editForm.password" type="password"></v-input>
        </v-form-item>
      </v-form>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "editOnlineCamera",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    formData: Object,
    afterConfirm: {
      type: Function,
      default: () => () => {}
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      editUrl: "/RPC2:InlineCameraManager.modify",
      rules: {
        ip: { type: "ip" },
        mask: { type: "subnetMask" },
        gateway: { type: "ip", msg: _("Incorrect gateway format") }
      },
      editForm: {}
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  methods: {
    async editSubmit() {
      let submitForm = { ...this.editForm };
      submitForm.password = this.Base64.encode(submitForm.password); // 密码base64加密

      const res = await this.$axiosPost(this.editUrl, submitForm),
        result = res.getResult();

      if (result) {
        this.$message.success(_("Saved Successfully"));
        this.afterConfirm();
        this.show = false;
      } else {
        this.$message.error(_("Failed to save"));
      }
    },
    confirm() {
      this.$refs.form.submitForm();
    }
  },
  watch: {
    formData(newVal) {
      this.editForm = { ...newVal };
    }
  }
};
</script>
