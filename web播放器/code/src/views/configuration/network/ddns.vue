<template>
  <main-content class="network-ddns" title="DDNS">
    <better-form
      ref="betterFrom"
      :rules="rules"
      :model="formData"
      @submit="submitData"
    >
      <v-form-item label="DDNS" prop="isDDNS">
        <v-switch v-model="enable"></v-switch>
      </v-form-item>
      <v-form-item :label="_('Connection Status')" prop="status">
        <span
          :class="[
            'ddns-status',
            'v-form-item__label--medium',
            statusClassMap[formData.status]
          ]"
          >{{ statusMap[formData.status] }}</span
        >
      </v-form-item>
      <v-form-item
        :label="_('Service Provider')"
        prop="serverProvider"
        :disabled="!enable"
      >
        <v-select v-model="curProvider" :options="providerOptions"></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Server Address')"
        prop="serverAddr"
        :disabled="!enable"
      >
        <v-input v-model="formData.serverAddr"></v-input>
      </v-form-item>
      <v-form-item :label="_('Domain Name')" prop="domain" :disabled="!enable">
        <v-input
          v-model="formData.domain"
          :placeholder="_('Get domain name at service provider')"
        ></v-input>
      </v-form-item>
      <v-form-item :label="_('User Name')" prop="username" :disabled="!enable">
        <v-input
          v-model="formData.username"
          :placeholder="_('Registered user account at service provider')"
        ></v-input>
      </v-form-item>
      <v-form-item :label="_('Password')" prop="password" :disabled="!enable">
        <v-input
          v-model="formData.password"
          type="password"
          show-password
          :placeholder="_('Registered user password at service provider')"
        ></v-input>
      </v-form-item>
    </better-form>
  </main-content>
</template>

<script>
import { getEntriesByAttr } from "@/utils/dicts";
import { arrayToObject } from "@/utils/common";
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";

const defaultFormData = {
  status: 2,
  serverProvider: "",
  serverAddr: "",
  domain: "",
  username: "",
  password: ""
};
export default {
  name: "networkDDNS",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    this.MODULE = "CONFIG";
    this.statusAttr = "ddnsStatus";
    this.serverProviderAttr = "serverProvider";
    this.getUrl = "/RPC2:configManager.getConfig:DDNS";
    this.setUrl = "/RPC2:configManager.setConfig:DDNS";
    this.updateTimer = null;
    return {
      enable: false,
      curProvider: "",
      servers: [],
      rules: {
        domain: { type: "domain" },
        username: {},
        password: {}
      }
    };
  },
  computed: {
    formData() {
      return (
        this.servers.find(
          ({ serverProvider }) => this.curProvider === serverProvider
        ) || defaultFormData
      );
    },
    statusArr() {
      return getEntriesByAttr(this.statusAttr, this.MODULE);
    },
    statusMap() {
      // 端口连接状态映射
      return arrayToObject(this.statusArr);
    },
    statusClassMap() {
      // 端口连接状态类名映射
      return arrayToObject(this.statusArr, "key", "clazz");
    },
    providerArr() {
      // 服务提供商数据字典中的数据
      return getEntriesByAttr(this.serverProviderAttr, "CONFIG");
    },
    providerOptions() {
      // 服务提供商选择器选项
      return this.providerArr.map(({ key, value }) => ({
        value: key,
        label: value
      }));
    }
  },
  async created() {
    await this.getData();
    await this.updateStatus();
  },
  beforeDestroy() {
    clearTimeout(this.updateTimer);
  },
  methods: {
    async getData() {
      const res = await this.$axiosPost(this.getUrl);

      if (!res.getResult()) {
        return this.$message.error(_("Failed to obtain data"));
      }

      const { enable, curDDNSType, server } = res.getParams() || {};

      this.enable = enable;
      this.servers = [
        ...server,
        { ...defaultFormData, serverProvider: "custom" }
      ];
      this.curProvider = curDDNSType;
    },
    async submitData() {
      const res = await this.$axiosPost(this.setUrl, {
        enable: this.enable,
        curDDNSType: this.curProvider,
        server: this.servers
      });

      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
        this.getData();
      } else {
        this.$message.error(_("Failed to save"));
      }
    },
    updateStatus() {
      if (this._isDestroyed) {
        // 处理切换菜单过快导致定时器没清理
        return clearTimeout(this.updateTimer);
      }
      this.updateTimer = setTimeout(async () => {
        clearTimeout(this.updateTimer);
        const res = await this.$axiosPost(this.getUrl);

        if (res.getResult()) {
          const { server = [] } = res.getParams() || {};

          server.forEach(({ serverProvider: newProvider, status }) => {
            const idx = this.servers.findIndex(
              ({ serverProvider }) => serverProvider === newProvider
            );
            if (idx !== -1) {
              this.$set(this.servers, idx, { ...this.servers[idx], status });
            }
          });
        }

        this.updateStatus();
      }, 2000);
    }
  }
};
</script>

<style lang="scss">
.network-ddns {
  .ddns-status {
    &.connected {
      color: $success-color;
    }
    &.disconnected {
      color: $disabled-color;
    }
    &.connecting {
      color: $main-active-color;
    }
    &.network-anomaly,
    &.incorrect,
    &.link-anomaly,
    &.dns-anomaly {
      color: #f7421e;
    }
  }
}
</style>
