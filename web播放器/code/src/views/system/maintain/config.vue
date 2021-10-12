<template>
  <main-content class="mainain-config" :title="_('Configuration Mgmt')">
    <div class="config-row">
      <v-button type="info" @click="showDialog(1)">{{
        _("Restore Default Settings")
      }}</v-button>
      <label class="config-text">{{
        _(
          "Except for network and user settings, other settings will be restored to the factory status"
        )
      }}</label>
    </div>
    <div class="config-row">
      <v-button type="info" @click="showDialog(2)">{{
        _("Restore Factory Settings")
      }}</v-button>
      <label class="config-text">{{
        _("All settings will be restored to the factory status")
      }}</label>
    </div>
    <v-dialog
      v-model="showConfirmDialog"
      :title="confirmTitle"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      @confirm="handleConfirm"
    >
      {{ comfirmText }}
    </v-dialog>
    <process
      v-model="showProcess"
      @error="error"
      :duration="50"
      :text="processText"
      :defaultIp="type === 1 ? '' : defaultIp"
      :redirectPage="type === 1 ? 'login' : 'activate'"
    >
      <div v-if="showError" class="reset-status">
        <i class="icon-full-error"></i>
        <div class="reset-error-text">
          <p>
            {{ _("Failed to connect to the device.") }}
          </p>
          <p>
            {{
              _(
                "Please ensure that Ethernet cable between the computer and the device is connected properly, and the IP address of the computer is belonging to the same network segment as the default IP address(%s) of the device.",
                this.defaultIp
              )
            }}
          </p>
        </div>
      </div>
    </process>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import Process from "@/components/process";

export default {
  name: "maintainConfig",
  components: {
    MainContent,
    Process
  },
  data() {
    this.rebootUrl = "/RPC2:configManager.restoreExcept";
    this.resetUrl = "/RPC2:configManager.restore";
    return {
      showConfirmDialog: false,
      showProcess: false,
      defaultIp: "192.168.0.254",
      showError: false,
      type: 1
    };
  },
  computed: {
    comfirmText() {
      return this.type == 1
        ? _(
            "After restored to default settings, the device will reboot. Continue?"
          )
        : _(
            "After restored to factory settings, the device will reboot. Continue?"
          );
    },
    confirmTitle() {
      return this.type == 1
        ? _("Restore Default Settings")
        : _("Restore Factory Settings");
    },
    processText() {
      return this.type == 1
        ? _("Restoring default settings. The device will reboot…")
        : _("Restoring factory settings. The device will reboot…");
    }
  },
  methods: {
    showDialog(type) {
      this.type = type;
      this.showConfirmDialog = true;
    },
    error() {
      this.showError = true;
    },
    async handleConfirm() {
      let url = this.type == 1 ? this.rebootUrl : this.resetUrl;
      let res = await this.$axiosPost(url);
      if (res.getResult() === true) {
        // 重启
        this.showProcess = true;
      } else {
        this.$message.error(_("System error"));
      }

      this.showConfirmDialog = false;
    }
  }
};
</script>

<style lang="scss">
.config-row {
  margin-bottom: 24px;
}

.config-text {
  padding-left: 16px;
}

.reset-status {
  font-size: 16px;
  display: flex;
  align-items: center;
  i {
    font-size: 38px;
    vertical-align: middle;
    margin-right: 8px;
  }
  .icon-full-error {
    color: $error-color;
  }

  .reset-error-text {
    line-height: 24px;
  }
}
</style>
