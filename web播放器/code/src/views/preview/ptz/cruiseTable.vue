<template>
  <section class="cruise-table">
    <simple-table
      :title="_('Patrol')"
      :data="tableData"
      :actions="actions"
      @click="handleActionClick"
    ></simple-table>

    <EditCruiseDialog
      v-model="isDialogShow"
      :id="editCruiseId"
      :channel="activeChannel"
      @after-submit="afterDialogSubmit"
    />
  </section>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import SimpleTable from "./simpleTable";
import EditCruiseDialog from "./editCruiseDialog";
export default {
  name: "Preset",
  components: {
    SimpleTable,
    EditCruiseDialog
  },
  inject: ["setStartUrl", "setStopUrl"],
  data() {
    this.getUrl = "/RPC2:ptz.getTourList";
    this.actions = [
      { id: "setting", icon: "setting", code: "", title: _("Settings") },
      {
        id: "path-switch",
        icon: "path-start",
        code: "StartTour",
        title: _("Enable")
      },
      {
        id: "delete",
        icon: "path-stop",
        code: "StopTour",
        title: _("Stop")
        // { id: "delete", icon: "delete", code: "ClearPreset", title: "清除" }
      }
    ];
    return {
      setted: [],
      isDialogShow: false,
      editCruiseId: ""
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
      const { maxCruiseCount } = this.$store.state.MACRO_CONFIG;
      let tableData = Array.from(Array(maxCruiseCount), (item, idx) => ({
        id: idx,
        hasData: false
      }));
      this.setted.forEach(id => (tableData[id].hasData = true));

      return tableData;
    }
  },
  mounted() {
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

      this.setted = res.getParams();
      // this.setted = [0, 2, 4, 5, 6];
    },
    async handleActionClick(
      e, // 事件对象
      { code, title }, // 操作按钮配置
      {
        id // 巡航路径数据
      }
    ) {
      if (!code) {
        return this.editFormData(id);
      }

      const reqData = {
        channel: this.activeChannel,
        code,
        arg1: id
      };

      const res = await this.$axiosPost(this.setStartUrl, reqData);

      if (!res.getResult()) {
        this.$message.error(_('Failed to set patrol"%s"', title));
      }
    },
    async editFormData(cruiseId) {
      this.isDialogShow = true;
      this.editCruiseId = cruiseId;
    },
    afterDialogSubmit() {
      this.getData();
    }
  },
  watch: {
    activeChannel() {
      this.isDialogShow = false;
      this.getData();
    }
  }
};
</script>

<style></style>
