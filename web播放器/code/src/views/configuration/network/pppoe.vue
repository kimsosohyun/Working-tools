<template>
  <main-content class="network-pppoe" title="PPPoE">
    <better-form :rules="rules" :model="formData" @submit="submitData">
      <v-form-item label="PPPoE" prop="isPPPoE">
        <v-switch v-model="formData.isPPPoE"></v-switch>
      </v-form-item>
      <v-form-item :label="_('Connection Status')" prop="status">
        <span
          :class="[
            'pppoe-status',
            'v-form-item__label--medium',
            { connected: formData.status === connectedStatus }
          ]"
          >{{ statusMap[formData.status] }}</span
        >
      </v-form-item>
      <v-form-item
        :label="_('User Name')"
        prop="username"
        :disabled="!formData.isPPPoE"
      >
        <v-input
          v-model="formData.username"
          :placeholder="_('The user name provided by your ISP')"
        ></v-input>
      </v-form-item>
      <v-form-item
        :label="_('Password')"
        prop="password"
        :disabled="!formData.isPPPoE"
      >
        <v-input
          v-model="formData.password"
          type="password"
          show-password
          :placeholder="_('The password provided by your ISP')"
        ></v-input>
      </v-form-item>
      <v-form-item :label="_('IP Address')" prop="ip">
        <span class="pppoe-ip v-form-item__label--medium">
          {{ formData.ip }}
        </span>
      </v-form-item>
    </better-form>
  </main-content>
</template>

<script>
import { getKeyById, getEntriesByAttr } from "@/utils/dicts";
import { arrayToObject } from "@/utils/common";
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";

export default {
  name: "networkPPPoE",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    this.statusAttr = "connection";
    this.getUrl = "/RPC2:configManager.getConfig:PPPOE";
    this.setUrl = "/RPC2:configManager.setConfig:PPPOE";
    return {
      formData: {
        isPPPoE: "",
        status: "",
        username: "",
        password: "",
        ip: ""
      },
      rules: {
        username: {},
        password: {}
      }
    };
  },
  computed: {
    hostname() {
      return this.$store.state.hostname;
    },
    statusMap() {
      // 端口连接状态映射
      const statusArr = getEntriesByAttr(this.statusAttr);
      return arrayToObject(statusArr);
    },
    connectedStatus() {
      // poe端口在线状态的key，与后台数据对应
      return getKeyById("connected", this.statusAttr);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axiosPost(this.getUrl);

      this.formData = res.getParams();
    },
    async submitData(data) {
      const { status, ip } = this.formData;
      const res = await this.$axiosPost(this.setUrl, { ...data, status, ip });

      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
      } else {
        this.$message.error(_("Failed to save"));
      }
    }
  }
};
</script>

<style lang="scss">
.network-pppoe {
  .pppoe-status {
    color: $disabled-color;
    &.connected {
      color: $success-color;
    }
  }
  .pppoe-ip {
    color: $title-color;
  }
}
</style>
