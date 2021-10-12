<template>
  <main-content class="network-cloud" :title="_('Port Config')">
    <better-form :rules="rules" :model="formData" @submit="saveData">
      <v-form-item :label="_('HTTP Port')" prop="http">
        <v-input
          :allow="/\d/g"
          v-model="formData.http"
          :auto-correction="[1, 65535]"
        ></v-input>
      </v-form-item>
      <v-form-item :label="_('WebSocket Port')" prop="webSocket">
        <v-input
          :allow="/\d/g"
          v-model="formData.webSocket"
          :auto-correction="[1, 65535]"
        ></v-input>
      </v-form-item>
      <!-- <v-form-item :label="_('Service Port')" prop="server">
        <v-input :allow="/\d/g" v-model="formData.server"></v-input>
      </v-form-item>
      <v-form-item :label="_('RSTP Port')" prop="rtsp">
        <v-input :allow="/\d/g" v-model="formData.rtsp"></v-input>
      </v-form-item> -->
    </better-form>
    <v-dialog
      v-model="showChangeHttp"
      :title="_('Device Reboot')"
      :width="400"
      @confirm="submitData"
    >
      <div class="changeHttp">
        <span
          >{{
            _("o#coE#The device will reboot to enable the settings. Continue?")
          }}
        </span>
      </div>
    </v-dialog>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
// import { chkinput } from "@/utils/common.js";

export default {
  name: "networkPort",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    return {
      getUrl: "/RPC2:configManager.getConfig:PortCfg",
      setUrl: "/RPC2:configManager.setConfig:PortCfg",
      portConflictUrl: "/RPC2:magicBox.testPortConflict",
      formData: {
        http: "",
        server: "",
        rtsp: "",
        webSocket: ""
      },
      oldFormData: {},
      rules: {
        http: { type: "num", args: [1, 65535] },
        server: { type: "num", args: [1, 65535] },
        rtsp: { type: "num", args: [1, 65535] },
        webSocket: { type: "num", args: [1, 65535] }
      },
      showChangeHttp: false,
      submitDataObj: {}
    };
  },
  computed: {
    hostname() {
      return this.$store.state.hostname;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axiosPost(this.getUrl);

      this.formData = res.getParams();
      this.oldFormData = { ...this.formData };
    },
    async submitData() {
      this.showChangeHttp = false;
      const data = this.toNumber(this.submitDataObj),
        res = await this.$axiosPost(this.setUrl, data);

      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"), undefined, this.jumpTo);
      } else {
        this.$message.error(_("Failed to save"));
      }
    },
    jumpTo() {
      const { http, webSocket } = this.formData,
        oldHttp = this.oldFormData.http,
        oldWebSocket = this.oldFormData.webSocket;

      if (+http !== oldHttp || +webSocket !== oldWebSocket) {
        // 修改了http端口，跳转至新的端口url
        this.$dialog.loading(
          _(
            "The device will reboot and create connection through the new port... Please wait"
          ),
          2000,
          () => {
            window.location.href = `http://${this.hostname}:${http}`;
          }
        );
      } else {
        // 未更新不跳转，更新页面数据
        this.getData();
      }
    },

    toNumber(obj) {
      const keys = Object.keys(obj);

      for (let key of keys) {
        obj[key] = +obj[key];
      }

      return obj;
    },
    saveData(data) {
      const { http, webSocket } = this.formData,
        oldHttp = this.oldFormData.http,
        oldWebSocket = this.oldFormData.webSocket;

      this.submitDataObj = data;
      if (+http !== oldHttp || +webSocket !== oldWebSocket) {
        //代表修改端口
        this.testPortConflict();
      } else {
        //代表未修改端口,直接保存
        this.submitData();
      }
    },
    async testPortConflict() {
      const res = await this.$axiosPost(
        this.portConflictUrl,
        this.toNumber(this.submitDataObj)
      );

      if (res.getResult() === true) {
        this.showChangeHttp = true;
      }
    }
  }
};
</script>

<style lang="scss">
.changeHttp {
  span {
    font-size: 14px;
    color: $info-color;
    line-height: 22px;
  }
}
</style>
