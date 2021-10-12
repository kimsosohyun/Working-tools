<template>
  <simple-table
    :title="_('Track')"
    :data="tableData"
    :actions="actions"
    @click="handleActionClick"
  ></simple-table>
</template>

<script>
import SimpleTable from "./simpleTable";
export default {
  name: "trackTable",
  components: {
    SimpleTable
  },
  props: ["activeChannel"],
  inject: ["setStartUrl", "setStopUrl"],
  data() {
    this.getUrl = "/RPC2:ptz.getTraceList";
    this.actions = [
      {
        id: "track-record",
        icon: "track-record",
        iconArr: ["track-record", "track-save"],
        code: "",
        codeArr: ["SetPatternEnd", "SetPatternBegin"],
        title: _("Settings")
      },
      {
        id: "path-start",
        icon: "path-start",
        code: "StartPattern",
        title: _("Enable")
      },
      {
        id: "delete",
        icon: "path-stop",
        code: "StopPattern",
        title: _("Stop")
        // { id: "delete", icon: "delete", code: "ClearPreset", title: "清除" }
      }
    ];
    return {
      setted: [],
      isRecordingArr: []
    };
  },
  computed: {
    tableData() {
      const { maxTrackCount } = this.$store.state.MACRO_CONFIG;
      const tableData = Array.from(Array(maxTrackCount), (item, idx) => ({
        id: idx,
        hasData: this.setted.includes(idx),
        isRecording: this.isRecordingArr.includes(idx)
      }));

      return tableData;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axiosPost(this.getUrl, {
        channel: this.activeChannel
      });

      this.setted = res.getParams();
      // this.setted = [0, 2, 4, 5, 6];
    },
    async handleActionClick(action, { id, isRecording }) {
      let { code, codeArr, iconArr, title } = action;
      if (!code) {
        // 点击的是录制按钮
        const totalIdx = +!isRecording;
        if (isRecording) {
          // 当前在录制状态，则停止录制
          this.isRecordingArr.splice(id, 1);
        } else {
          // 当前在停止录制状态，则开始录制
          this.isRecordingArr.push(id);
        }

        // 开始录制的code值索引为1，结束录制索引为0
        code = codeArr[totalIdx];

        // 图标修改，索引与code相反
        this.actions.splice(0, 1, { ...action, icon: iconArr[totalIdx] });
      }

      const reqData = {
        channel: this.activeChannel,
        code,
        arg1: id
      };
      const res = await this.$axiosPost(this.setStartUrl, reqData);

      if (!res.getResult()) {
        this.$message.error(_('Failed to set preset"%s"', title));
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
