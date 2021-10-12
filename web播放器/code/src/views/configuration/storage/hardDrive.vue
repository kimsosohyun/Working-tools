<template>
  <main-content class="hard-drive" :title="_('HDD')">
    <better-form :model="formData" :btns="[]">
      <v-form-item :label="_('Overwrite')" prop="isCyclicWrite">
        <v-switch
          v-model="formData.isCyclicWrite"
          @change="submitData"
        ></v-switch>
      </v-form-item>
    </better-form>
    <v-table :data="hardDriveList">
      <v-table-col type="index" :label="_('X#cyi#No.')"> </v-table-col>
      <v-table-col prop="type" :label="_('Type')">
        <template v-slot="slotProps"> {{ slotProps.type | type }} </template>
      </v-table-col>
      <v-table-col prop="property" :label="_('Property')">
        <template v-slot="slotProps">
          {{ slotProps.property | prop }}
        </template>
      </v-table-col>
      <v-table-col prop="capacity" :label="_('Total')">
        <template v-slot="slotProps">
          {{ slotProps.capacity | size }}
        </template>
      </v-table-col>
      <v-table-col prop="leftCapacity" :label="_('Available')">
        <template v-slot="slotProps">
          {{ slotProps.leftCapacity | size }}
        </template>
      </v-table-col>
      <v-table-col prop="status" :label="_('Status')">
        <template v-slot="slotProps">
          <label class="drive-status" v-if="slotProps.status == 1">{{
            _("M#XyJ#Connected")
          }}</label>
          <label class="drive-status warning" v-else>{{
            _("Exception")
          }}</label>
        </template>
      </v-table-col>
      <v-table-col :label="_('Operation')" prop="xxx">
        <template v-slot="slotProps">
          <i
            v-tooltip="{
              enterable: false,
              betweenSpace: 8,
              content: _('格式化')
            }"
            class="icon-clear icon-button-status"
            @click="confirm(slotProps)"
          ></i>
        </template>
      </v-table-col>
    </v-table>
    <v-dialog
      v-model="showConfirmDialog"
      :title="_('Format')"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      @confirm="format"
      >{{
        _(
          "By formatting the HDD, all data will be clear and cannot be restored. The device will reboot automatically. Continue?"
        )
      }}</v-dialog
    >
    <process
      v-model="showProcess"
      :text="_('Formatting the HDD. Please wait…')"
    ></process>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import Process from "@/components/process";

export default {
  name: "hardDrive",
  components: {
    MainContent,
    BetterForm,
    Process
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:StorageGroup";
    this.setUrl = "/RPC2:configManager.setConfig:StorageGroup";
    this.getTableUrl = "/RPC2:devStorage.getDeviceInfo";
    this.formatUrl = "/RPC2:storage.format";
    // this.rebootItem = null;
    return {
      hardDriveList: [],
      showConfirmDialog: false,
      showProcess: false,
      formData: {
        isCyclicWrite: true
      }
    };
  },
  filters: {
    type(val) {
      return val == 1 ? _("Local") : _("Other");
    },
    size(val) {
      if (val < 1024) {
        return `${val}MB`;
      }
      return `${(val / 1024).toFixed(2)}GB`;
    },
    prop(val) {
      let obj = {
        ReadWrite: _("Read/Write"),
        ReadOnly: _("Read Only"),
        Backup: "事件驱动",
        Redundant: "冗余驱动",
        Snapshot: "快找驱动",
        Unknown: "未知属性"
      };
      return obj[val];
    }
  },
  methods: {
    async getData() {
      const res = await Promise.all([
        this.$axiosPost(this.getUrl),
        this.$axiosPost(this.getTableUrl)
      ]);
      let { isCyclicWrite } = res[0].getParams();
      this.formData.isCyclicWrite = isCyclicWrite;
      this.oldFormData = { ...this.formData };
      this.hardDriveList = res[1].getParams();
    },
    async submitData() {
      let res = await this.$axiosPost(this.setUrl, {
        isCyclicWrite: this.formData.isCyclicWrite
      });
      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
      } else {
        this.$message.error(_("Failed to save"));
      }
    },
    confirm() {
      this.showConfirmDialog = true;
    },
    async format() {
      let res = await this.$axiosPost(this.formatUrl);
      if (res.getResult() === true) {
        // 重启
        this.showProcess = true;
      } else {
        this.$message.error(_("System error"));
      }

      this.showConfirmDialog = false;
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss">
.hard-drive {
  .drive-status {
    position: relative;
    display: block;
    padding-left: 12px;

    &:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 6px;
      height: 6px;
      background-color: #17cc82;
      border-radius: 50%;
      transform: translateY(-50%);
    }
    &.warning {
      &:before {
        background-color: #f4b71e;
      }
    }
  }
}
</style>
