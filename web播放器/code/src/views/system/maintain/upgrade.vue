<template>
  <main-content class="maintain-upgrade" :title="_('Firmware Upgrade')">
    <v-form>
      <v-form-item :label="_('Current Version')">
        <label class="v-form-item__label--medium">{{ version }}</label>
      </v-form-item>
      <v-form-item :label="_('Local Upgrade')">
        <v-upload
          action="/RPC2_UpgradeNVR"
          ref="upload"
          :accept="acceptType"
          :show-file-list="true"
          :on-change="change"
          :on-success="success"
        ></v-upload>
        <span v-show="showTips" class="upgrade-file-tips">{{ tips }}</span>
        <label class="upgrade-btns">
          <v-button type="primary" class="upgrade-btn" @click="showConfirm">{{
            _("Local Upgrade")
          }}</v-button>
          <label class="v-form-item__label--medium upgrade-tip"
            >{{ _("You can download the upgrade file from")
            }}<a
              class="upgrade-link"
              :href="
                isCn
                  ? 'https://www.tenda.com.cn/download/default.html'
                  : 'https://www.tendacn.com/download/default.html'
              "
              target="tenda"
              >{{ _(" Tenda Download Center ") }}</a
            >{{ _("at our official website.") }}</label
          >
        </label>
      </v-form-item>
    </v-form>
    <v-dialog
      v-model="showConfirmDialog"
      :title="_('Firmware Upgrade')"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      @confirm="upgrade"
      >{{ _("The device will reboot after the upgrade completes. Continue?") }}
      <div>
        {{
          _(
            "During the upgrade, please do not cut off power supply or internet connection."
          )
        }}
      </div>
    </v-dialog>
    <process
      v-model="showProcess"
      :duration="duration"
      ref="progress"
      :value="percent"
      :text="_('Upgrading the device. Please wait…')"
    >
      <div v-if="isSuccess" class="upgrade-status">
        <i class="icon-full-success"></i
        >{{ _("Upgrading succeeded. Please wait for the device to reboot…") }}
      </div>
      <div v-else-if="isError" class="upgrade-status">
        <i class="icon-full-error"></i>
        {{ error }}
      </div>
    </process>
    <v-loading text="" :visible="showLoading"></v-loading>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import Process from "@/components/process";

export default {
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:General";
    this.getProgressUrl = "/RPC2:getUpdateProgressNVR";
    this.isCn = window.B.getLang() === "cn";
    return {
      version: "",
      showConfirmDialog: false,
      showProcess: false,
      showLoading: false,
      percent: 0, // 升级进度/重启进度
      duration: 0,
      isSuccess: false,
      isError: false,
      showTips: true,
      acceptType: ".bin",
      tips: ""
    };
  },
  components: {
    MainContent,
    Process
  },
  watch: {
    isError(val) {
      if (val) {
        setTimeout(() => {
          this.showProcess = false;
        }, 3000);
      }
    },
    isSuccess(val) {
      if (val) {
        this.duration = 60;
        this.$nextTick(() => {
          this.$refs.progress.restart();
        });
      }
    },
    showProcess(val) {
      if (!val) {
        this.percent = 0;
        this.isError = false;
      }
    }
  },
  methods: {
    upgrade() {
      this.$refs.upload.submit();
      this.showLoading = true;
      // //
      // this.showConfirmDialog = false;
      // this.showProcess = true;
      // this.getUpgradeProgress();
    },
    change() {
      this.showTips = false;
    },
    success(data) {
      this.showConfirmDialog = false;
      this.showLoading = false;
      if (data.result) {
        // 显示升级进度
        this.showProcess = true;
        this.getUpgradeProgress();
      }
      // else {
      //   switch (data.errCode) {
      //     case 1301:
      //       this.error = "升级失败，升级文件异常。";
      //       break;
      //     case 1302:
      //     default:
      //       this.error = "升级失败，未知错误。";
      //   }
      // }
    },
    showConfirm() {
      const { fileName } = this.$refs.upload;

      if (fileName && fileName.includes(this.acceptType)) {
        this.showConfirmDialog = true;
      } else {
        this.tips = fileName
          ? _("Upgrade file error")
          : _("Please upload file");
        this.showTips = true;
      }
    },
    async getMachineInfo() {
      const res = await this.$axiosPost(this.getUrl);
      let data = res.getParams();
      this.version = data.softVersion;
    },
    async getUpgradeProgress() {
      const res = await this.$axiosPost(this.getProgressUrl);
      let data = res.getParams();
      if (data.progress === -1) {
        this.isError = true;
      } else {
        this.percent = data.progress / 100;
        if (data.progress === 100) {
          this.isSuccess = true;
        } else {
          setTimeout(() => {
            this.getUpgradeProgress();
          }, 200);
        }
      }
    }
  },
  mounted() {
    this.getMachineInfo();
  }
};
</script>

<style lang="scss">
.upgrade-btn {
  margin: 0 16px 0 19px;
}
.upgrade-btns {
  vertical-align: top;
}
.upgrade-tip {
  font-size: 12px;
  color: #8d8d8d;
  .upgrade-link {
    color: #ff801f;
    cursor: pointer;
  }
}

.upgrade-status {
  font-size: 16px;
  line-height: 70px;
  text-align: center;
  i {
    font-size: 38px;
    vertical-align: middle;
    margin-right: 8px;
  }
  .icon-full-success {
    color: $success-color;
  }
  .icon-full-error {
    color: $error-color;
  }
}
.upgrade-file-tips {
  position: absolute;
  font-size: 12px;
  line-height: 20px;
  color: $error-color;
  bottom: -20px;
  left: 0;
}
</style>
