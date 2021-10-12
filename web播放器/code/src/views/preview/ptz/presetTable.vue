<template>
  <simple-table
    :title="_('Preset')"
    :data="tableData"
    :actions="actions"
    @click="proxyActionClick"
    @scroll="handleScroll"
  ></simple-table>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import SimpleTable from "./simpleTable";
export default {
  name: "presetTable",
  components: {
    SimpleTable
  },
  inject: ["setStartUrl", "setStopUrl"],
  data() {
    this.getUrl = "/RPC2:ptz.getPresetsList";
    this.actions = [
      {
        id: "setting",
        icon: "setting",
        code: "SetPreset",
        title: _("Settings")
      },
      { id: "call", icon: "call", code: "GotoPreset", title: _("Call") },
      { id: "delete", icon: "delete", code: "ClearPreset", title: _("Delete") }
    ];
    this.popconfirmVm = null;
    return {
      setted: []
    };
  },
  computed: {
    ...mapState({
      activeChannel: "activeChannel"
    }),
    ...mapGetters({
      channelConfigs: "channelConfigs"
    }),
    ptzAuth() {
      const channelCfg = this.channelConfigs[this.activeChannel] || {};

      return channelCfg.ptzAuth;
    },
    tableData() {
      const { maxPresetCount } = this.$store.state.MACRO_CONFIG;
      let tableData = Array.from(Array(maxPresetCount), (item, idx) => ({
        id: idx,
        hasData: false
      }));
      this.setted.forEach(id => (tableData[id].hasData = true));

      return tableData;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.setted = [];

      if (!this.ptzAuth) {
        // 没有云台权限，不发请求
        return;
      }
      const res = await this.$axiosPost(this.getUrl, {
        channel: this.activeChannel
      });

      this.setted = res.getParams() || [];
      // this.setted = [0, 2, 4, 5, 6];
    },

    /**
     * 拦截“操作”点击事件，主要拦截“清除”事件
     * @param {Object} e 事件对象
     * @param {Object} action 关于操作按钮配置的对象
     * @param {Object} rowData 所点击的行数据
     */
    proxyActionClick(e, { id: action, code, title }, { id }) {
      if (action === "delete") {
        this.popconfirmVm = this.$popconfirm(
          e.target,
          {
            icon: "v-icon-remind-plane",
            title: _("Do you want to delete the content of this preset?"),
            position: "top-right",
            popupsOffset: 15,
            arrowOffset: 18,
            betweenSpace: 4,
            disabled: false
          },
          () => this.handleActionClick(code, title, id)
        );

        return;
      }
      this.handleActionClick(code, title, id);
    },
    async handleActionClick(code, title, id) {
      const reqData = {
        channel: this.activeChannel,
        code,
        arg1: id
      };
      const res = await this.$axiosPost(this.setStartUrl, reqData);

      if (!res.getResult()) {
        this.$message.error(_('Failed to set preset"%s"', title));
      } else {
        this.getData();
      }
    },
    handleScroll() {
      if (this.popconfirmVm) {
        this.popconfirmVm.hide();
        this.popconfirmVm = null;
      }
    }
  },
  watch: {
    activeChannel() {
      this.getData();
    }
  }
};
</script>

<style></style>
