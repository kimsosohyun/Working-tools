<template>
  <v-dialog
    v-model="showEditCamera"
    :title="_('Edit the Camera')"
    @confirm="confirm"
  >
    <div class="edit-camera">
      <v-form
        ref="form"
        :model="editCameraForm"
        :rules="editCameraRules"
        @submit="editCameraSubmit"
      >
        <v-form-item :label="_('Channel Name')" prop="title">
          <v-input v-model="editCameraForm.title" :disabled="true"></v-input>
        </v-form-item>
        <v-form-item :label="_('IP Address')" prop="ip">
          <v-input-group
            type="ip"
            v-model="editCameraForm.ip"
            :auto-correction="['1.0.0.1', '223.255.255.255']"
          ></v-input-group>
        </v-form-item>
        <v-form-item :label="_('Protocol')" prop="protocol">
          <v-select
            v-model="editCameraForm.protocol"
            :options="protocolOption"
            @change="protocolChange"
          ></v-select>
        </v-form-item>
        <v-form-item :label="_('Port')" prop="port">
          <v-input
            v-model="editCameraForm.port"
            :allow="/\d/g"
            :auto-correction="[1, 65535]"
          ></v-input>
        </v-form-item>
        <v-form-item :label="_('User Name')" prop="username">
          <v-input v-model="editCameraForm.username"></v-input>
        </v-form-item>
        <v-form-item :label="_('Password')" prop="password">
          <v-input v-model="editCameraForm.password" type="password"></v-input>
        </v-form-item>
      </v-form>
    </div>
  </v-dialog>
</template>

<script>
import { clone } from "@/utils/common.js";
import { getEntriesByAttr } from "@/utils/dicts.js";
export default {
  name: "editCamera",
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
    showEditCamera: {
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
      this.editCameraForm = clone(val);
    }
  },
  data() {
    return {
      editCameraUrl: "/RPC2:RemoteDeviceManager.modify",
      // showEditCamera: false,
      editCameraRules: {
        ip: { type: "ip" },
        port: { type: "num" }
      },
      protocolOption: getEntriesByAttr("cameraProtocol", "CONFIG"),
      editCameraForm: {}
    };
  },
  methods: {
    async editCameraSubmit() {
      const submitForm = clone(this.editCameraForm);

      submitForm.password = this.Base64.encode(submitForm.password);
      const res = await this.$axiosPost(this.editCameraUrl, submitForm),
        result = res.getResult();

      if (result) {
        this.$message.success(_("Saved Successfully"));
        this.showEditCamera = false;
        this.afterConfirm();
      } else {
        this.$message.error(_("Failed to save"));
      }
    },
    confirm() {
      this.$refs.form.submitForm();
    },
    protocolChange(val) {
      if (val === 1) {
        this.editCameraForm.port = 8000;
      } else {
        this.editCameraForm.port = 80;
      }
    }
  }
};
</script>
