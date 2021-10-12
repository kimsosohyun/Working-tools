<template>
  <main-content class="network-cloud" :title="_('Cloud Service')">
    <better-form :model="formData" @submit="handleSubmitClick">
      <v-form-item :label="_('Cloud Service')" prop="isCloudOpen">
        <v-switch v-model="formData.isCloudOpen"></v-switch>
      </v-form-item>
      <v-form-item :label="_('Cloud Status')" prop="status">
        <div class="cloud-status">
          <label
            :class="[
              'status-text',
              'v-form-item__label--medium',
              { online: isOnline }
            ]"
          >
            {{ statusMap[formData.status] }}
          </label>
          <v-popover
            v-if="!isOnline"
            class="cloud-status-help"
            width="auto"
            trigger="hover"
            position="right-top"
            :title="_('Please try the following solutions:')"
            :between-space="5"
          >
            <p>
              {{
                _(
                  "1. Ensure that the router connected to the device can access the internet, and the DHCP server function is enabled."
                )
              }}
            </p>
            <p>
              {{
                _(
                  "2. Ensure that the LAN port of the device is connected to the peer side (router or switch) correctly and securely."
                )
              }}
            </p>
            <p>
              {{
                _(
                  '3. Ensure that the device is set to obtain an IP address through "DHCP".'
                )
              }}
            </p>
            <template #reference>
              <i class="icon-help"></i>
            </template>
          </v-popover>
        </div>
      </v-form-item>
      <v-form-item label="" prop="deviceName">
        <div class="app-qrcode">
          <div class="add-qrcode-image" ref="appRef"></div>
          <span class="app-qrcode-desc">{{
            _("Scan to download the TDSEE App")
          }}</span>
        </div>
        <div v-show="isOnline" class="add-device">
          <div class="add-device-image" ref="addDevice"></div>
          <span class="add-device-desc">{{
            _("Scan with the TDSEE App to add the device")
          }}</span>
        </div>
      </v-form-item>
    </better-form>
    <v-dialog
      v-model="showConfirmDialog"
      :title="_('Reboot')"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      @confirm="submitData(formData.isCloudOpen, true)"
      >{{
        _("The device will reboot to enable the settings. Continue?")
      }}</v-dialog
    >
    <process v-model="showProcess" :text="_('Rebooting… Please wait')">
    </process>
  </main-content>
</template>

<script>
import { getKeyById, getEntriesByAttr } from "@/utils/dicts";
import { arrayToObject } from "@/utils/common";
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import Process from "@/components/process";
import QRCode from "qrcode2";

export default {
  name: "networkCloud",
  components: {
    MainContent,
    BetterForm,
    Process
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:CloudServer";
    this.setUrl = "/RPC2:configManager.setConfig:CloudServer";
    return {
      showConfirmDialog: false,
      showProcess: false,
      formData: {
        isCloudOpen: false,
        status: "",
        deviceName: "" // 二维码数据
      },
      oldFormData: {}
    };
  },
  computed: {
    appQRCode() {
      return this.$store.state.appQRCode;
    },
    statusMap() {
      // 状态映射
      const statusArr = getEntriesByAttr("status");

      return arrayToObject(statusArr);
    },
    isOnline() {
      // 云端状态
      return +this.formData.status === getKeyById("online", "status");
    }
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getData();
      this.renderQRCode();
    },
    async getData() {
      const res = await this.$axiosPost(this.getUrl);

      this.formData = res.getParams();
      this.oldFormData = { ...this.formData };
    },
    renderQRCode() {
      const {
        $refs: { appRef, addDevice },
        formData: { deviceName },
        appQRCode
      } = this;

      this.qrCodeGenerator(appRef, appQRCode);
      this.qrCodeGenerator(addDevice, deviceName);
    },
    qrCodeGenerator(dom, text, width = 120, height = width) {
      if (dom._qrcode) {
        return dom._qrcode.makeCode(text);
      }

      dom._qrcode = new QRCode(dom, {
        text,
        width,
        height,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H
      });
    },
    handleSubmitClick({ isCloudOpen }) {
      const { isCloudOpen: oldIsCloudOpen } = this.oldFormData;

      if (!isCloudOpen && oldIsCloudOpen) {
        return (this.showConfirmDialog = true);
      }

      this.submitData(isCloudOpen);
    },
    async submitData(isCloudOpen, isReboot) {
      let res = await this.$axiosPost(this.setUrl, { isCloudOpen });

      if (res.getResult() === true) {
        if (isReboot) {
          this.showConfirmDialog = false;
          this.showProcess = true;
        } else {
          this.$message.success(_("Saved Successfully"));
          this.init();
        }
      } else {
        this.$message.error(_("Failed to save"));
      }
    }
  }
};
</script>

<style lang="scss">
.network-cloud {
  @mixin qrcode-area {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 8px;
    &-image {
      width: 120px;
      height: 120px;
    }
    &-desc {
      margin-top: 22px;
      line-height: 1;
      color: $title-color;
    }
  }
  .cloud-status {
    display: inline-flex;
    align-items: center;
    .status-text {
      color: $error-color;
      &.online {
        color: $success-color;
      }
    }

    &-help {
      margin-left: 12px;
      // line-height: 16px;
      font-size: 0;
      cursor: pointer;
      .icon-help {
        vertical-align: middle;
        line-height: 32px;
        font-size: 16px;
        color: $light-color;
      }
    }
  }
  .app-qrcode {
    @include qrcode-area;
  }
  .add-device {
    margin-left: 148px;
    @include qrcode-area;
  }
}
</style>
