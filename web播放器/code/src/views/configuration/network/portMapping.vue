<template>
  <main-content class="network-port-mapping" title="UPnP">
    <better-form :model="formData" @submit="submitData">
      <v-form-item label="Upnp" prop="upnp">
        <v-switch v-model="formData.upnp"></v-switch>
      </v-form-item>
      <v-form-item :label="_('Mode')" prop="mode">
        <v-select
          v-model="formData.mode"
          :options="modeOptions"
          :disabled="!formData.upnp"
          @change="modeChange"
        ></v-select>
      </v-form-item>
      <PortMappingTable
        v-model="formData.list"
        :edit-disabled="!formData.upnp || editDisabled"
      />
    </better-form>
  </main-content>
</template>

<script>
import { getEntriesByAttr, getKeyById } from "@/utils/dicts";
// import { arrayToObject } from "@/utils/common";
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import PortMappingTable from "./portMappingTable";

export default {
  name: "networkPortMapping",
  components: {
    MainContent,
    BetterForm,
    PortMappingTable
  },
  data() {
    this.modeAttr = "upnpMode";
    this.MODULE = "CONFIG";
    this.getUrl = "/RPC2:configManager.getConfig:PortMapping";
    this.setUrl = "/RPC2:configManager.setConfig:PortMapping";
    this.updateTimer = null;
    return {
      formData: {
        upnp: false,
        mode: 1,
        list: []
      },
      editDisabled: false // 表格操作是否可用
    };
  },
  computed: {
    modeArr() {
      // 数据字典中upnp数组数据
      return getEntriesByAttr(this.modeAttr, this.MODULE);
    },
    modeOptions() {
      // mode选择器选项
      return this.modeArr.map(({ key, value }) => ({
        value: key,
        label: value
      }));
    },
    defaultMode() {
      // 模式为mode的key
      return getKeyById("default", this.modeAttr, this.MODULE);
    }
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    clearTimeout(this.updateTimer);
  },
  methods: {
    async init() {
      await this.getData();
      this.modeChange(this.formData.mode);
      this.updateStatus();
    },
    async getData() {
      const res = await this.$axiosPost(this.getUrl);

      this.formData = res.getParams() || {};
    },
    async submitData(data) {
      const list = this.formData.list.map(({ id, descript, outerPort }) => ({
          id,
          descript,
          outerPort
        })),
        res = await this.$axiosPost(this.setUrl, { ...data, list });

      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
        // todo 提示信息关闭后再刷新数据
        this.getData();
      } else {
        this.$message.error(_("Failed to save"));
      }
    },
    modeChange(val) {
      // 模式切换，修改表格“编辑”操作权限
      this.editDisabled = val === this.defaultMode;
    },
    updateStatus() {
      if (this._isDestroyed) {
        // 处理切换菜单过快导致定时器没清理
        return clearTimeout(this.updateTimer);
      }
      this.updateTimer = setTimeout(async () => {
        clearTimeout(this.updateTimer);

        const res = await this.$axiosPost(this.getUrl);
        const { list } = res.getParams() || [];
        let { list: curList } = this.formData;

        curList = curList.map((item, idx) => {
          const { status } = list[idx];

          return { ...item, status };
        });
        this.$set(this.formData, "list", curList);

        this.updateStatus();
      }, 2000);
    }
  }
};
</script>

<style lang="scss">
.network-port-mapping {
  .better-form-toolbar {
    .v-form-item__content {
      margin: 0 !important;
    }
  }
  // .ddns-status {
  //   color: $disabled-color;
  //   &.connected {
  //     color: $success-color;
  //   }
  // }
}
</style>
