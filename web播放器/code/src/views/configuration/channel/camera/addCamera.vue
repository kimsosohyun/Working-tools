<template>
  <v-dialog v-model="showAddCamera" :title="_('Add Camera')" @confirm="confirm">
    <div class="add-camera">
      <v-form
        ref="form"
        :model="addCameraForm"
        :rules="addCameraRules"
        @submit="addCameraSubmit"
      >
        <v-form-item :label="_('IP Address')" prop="ip">
          <v-input-group
            type="ip"
            v-model="addCameraForm.ip"
            :auto-correction="['1.0.0.1', '223.255.255.255']"
          ></v-input-group>
        </v-form-item>
        <v-form-item :label="_('Protocol')" prop="protocol">
          <v-select
            v-model="addCameraForm.protocol"
            :options="protocolOption"
            @change="protocolChange"
          ></v-select>
        </v-form-item>
        <v-form-item :label="_('Port')" prop="port">
          <v-input
            v-model="addCameraForm.port"
            :allow="/\d/g"
            :auto-correction="[1, 65535]"
          ></v-input>
        </v-form-item>
        <v-form-item :label="_('User Name')" prop="username">
          <v-input v-model="addCameraForm.username"></v-input>
        </v-form-item>
        <v-form-item :label="_('Password')" prop="password">
          <v-input v-model="addCameraForm.password" type="password"></v-input>
        </v-form-item>
      </v-form>
    </div>
  </v-dialog>
</template>

<script>
import { clone } from "@/utils/common.js";
import { getEntriesByAttr } from "@/utils/dicts.js";
export default {
  name: "addCamera",
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
    showAddCamera: {
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
      this.addCameraForm = clone(val);
    }
  },
  data() {
    this.addCameraUrl = "/RPC2:RemoteDeviceManager.insert";
    return {
      // showAddCamera: false,
      addCameraRules: {
        ip: { type: "ip" },
        port: { type: "num" }
      },
      protocolOption: getEntriesByAttr("cameraProtocol", "CONFIG"),
      addCameraForm: {
        // ip: "",
        // protocol: 1,
        // port: 8000,
        // username: "admin",
        // password: ""
      }
    };
  },
  methods: {
    async addCameraSubmit() {
      const submitForm = clone(this.addCameraForm);

      submitForm.password = this.Base64.encode(submitForm.password);
      const res = await this.$axiosPost(this.addCameraUrl, submitForm),
        result = res.getResult();

      if (result) {
        this.$message.success(_("Succeeded"));
        this.showAddCamera = false;
        this.afterConfirm();
      } else {
        this.$message.error(_("Failed to add"));
      }
    },
    confirm() {
      this.$refs.form.submitForm();
    },
    protocolChange(val) {
      if (val === 1) {
        this.addCameraForm.port = 8000;
      } else {
        this.addCameraForm.port = 80;
      }
    }
  }
};
</script>
