<template>
  <v-dialog
    v-model="showUpgradeCamera"
    :title="_('Camera Firmware Upgrade')"
    :width="showConfirm ? 400 : 480"
    :class="{ fileUpload: !showConfirm }"
    @confirm="confirm"
    @after-close="close"
  >
    <section v-show="!showConfirm" class="upgrade-file">
      <v-form ref="form">
        <v-form-item :label="_('Upgrade file')">
          <v-upload
            action="/RPC2_UpgradeIPC"
            ref="upload"
            :accept="acceptType"
            :show-file-list="true"
            :on-change="change"
            :on-success="success"
          ></v-upload>
          <span v-show="showTips" class="upgrade-file-tips">{{ tips }}</span>
        </v-form-item>
      </v-form>
    </section>
    <section v-show="showConfirm" class="upgrade-confirm">
      {{ _("The device will reboot after the upgrade completes. Continue?") }}
      <div>
        {{
          _(
            "During the upgrade, please do not cut off power supply or internet connection."
          )
        }}
      </div>
    </section>
    <v-loading text="" :visible="showLoading"></v-loading>
  </v-dialog>
</template>

<script>
export default {
  name: "upgradeCamera",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    afterConfirm: {
      type: Function,
      default: () => () => {}
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  computed: {
    showUpgradeCamera: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  data() {
    return {
      // channel: 0,
      // showUpgradeCamera: false,
      showConfirm: false,
      showTips: false,
      showLoading: false,
      acceptType: ".bin",
      tips: ""
    };
  },
  methods: {
    change() {
      // this.hasFile = true;
      this.showTips = false;
    },
    success(data) {
      this.showLoading = false;
      if (data.result) {
        this.$emit("upload-success");
      } else {
        // 未经过axios，所以未经过errCode拦截
        if (data.errorCode == 1301) {
          this.$message.error(_("Failed to verify the upgrading file"));
        } else if (data.errorCode == 1302) {
          this.$message.error(_("Upgrading failed"));
        }
      }
      this.close();
    },
    confirm() {
      const { showConfirm } = this;
      if (showConfirm) {
        this.$refs.upload.submit();
        this.showLoading = true;
        // this.$emit("upload-success");
        // this.close();
      } else {
        const { fileName } = this.$refs.upload;

        if (fileName && fileName.includes(this.acceptType)) {
          this.showConfirm = true;
        } else {
          this.tips = fileName
            ? _("Upgrade file error")
            : _("Please upload file");
          this.showTips = true;
        }
      }
    },
    close() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.showUpgradeCamera = false;
    }
  }
};
</script>

<style lang="scss">
.upgrade-file-tips {
  position: absolute;
  font-size: 12px;
  line-height: 20px;
  color: $error-color;
  bottom: -20px;
  left: 0;
}
.fileUpload {
  .v-dialog__main {
    height: 110px;
    overflow: hidden;
  }
}
</style>
