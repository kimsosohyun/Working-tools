<template>
  <main-content class="maintain-reboot" :title="_('Reboot Settings')">
    <better-form :rules="rules" :model="formData" @submit="submitData">
      <v-form-item :label="_('Scheduled Reboot')" prop="autoRebootEnable">
        <v-switch v-model="formData.autoRebootEnable"></v-switch>
      </v-form-item>
      <v-form-item
        :label="_('In')"
        prop="repeat"
        :disabled="!formData.autoRebootEnable"
      >
        <v-checkbox-group
          is-select-all
          v-model="formData.repeat"
          :options="repeatOptions"
        ></v-checkbox-group>
      </v-form-item>
      <v-form-item
        :label="_('Reboot Time')"
        prop="repeatTime"
        :disabled="!formData.autoRebootEnable"
      >
        <v-timepicker
          format="hh:mm:ss"
          is-clear
          v-model="formData.repeatTime"
        ></v-timepicker>
      </v-form-item>
      <template v-slot:after-button>
        <v-button type="info" @click="reboot">{{ _("Reboot Now") }}</v-button>
      </template>
    </better-form>
    <v-dialog
      v-model="showConfirmDialog"
      :title="_('Reboot')"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      @confirm="handleConfirm"
      >{{ _("Do you want to reboot the device?") }}</v-dialog
    >
    <process v-model="showProcess" :text="_('Rebooting… Please wait')">
    </process>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import Process from "@/components/process";

export default {
  name: "maintainReboot",
  components: {
    MainContent,
    BetterForm,
    Process
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:AutoMaintain";
    this.setUrl = "/RPC2:configManager.setConfig:AutoMaintain";
    this.rebootUrl = "/RPC2:magicBox.reboot";

    this.repeatOptions = [
      {
        label: _("Mon."),
        value: 6
      },
      {
        label: _("Tues."),
        value: 5
      },
      {
        label: _("Wed."),
        value: 4
      },
      {
        label: _("Thur."),
        value: 3
      },
      {
        label: _("Fri."),
        value: 2
      },
      {
        label: _("Sat."),
        value: 1
      },
      {
        label: _("Sun."),
        value: 0
      }
    ];
    return {
      showConfirmDialog: false,
      showProcess: false,
      rules: {
        // deviceName: [{ type: "ip" }]
      },
      formData: {
        autoRebootEnable: false,
        repeatTime: "",
        repeat: []
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    reboot() {
      this.showConfirmDialog = true;
    },
    async getData() {
      const res = await this.$axiosPost(this.getUrl);
      let {
          autoRebootDay,
          autoRebootEnable,
          autoRebootHour,
          autoRebootMinute,
          autoRebootSecond
        } = res.getParams(),
        selectDay = [];
      autoRebootDay = autoRebootDay.toString(2);
      for (var i = 7 - autoRebootDay.length, j = 0; i < 7; i++, j++) {
        if (autoRebootDay[j] == "1") {
          selectDay.push(i);
        }
      }
      this.formData.repeat.splice(0, this.formData.repeat.length, ...selectDay);
      this.formData.autoRebootEnable = autoRebootEnable;
      this.formData.repeatTime = `${autoRebootHour}:${autoRebootMinute}:${autoRebootSecond}`;
      this.oldFormData = { ...this.formData };
    },
    async submitData(data) {
      let time = data.repeatTime.split(":");
      let res = {
        autoRebootEnable: data.autoRebootEnable,
        autoRebootHour: +time[0],
        autoRebootMinute: +time[1],
        autoRebootSecond: +time[2]
      };
      let autoRebootDay = [0, 0, 0, 0, 0, 0, 0];
      data.repeat.forEach(item => {
        autoRebootDay[item] = 1;
      });
      res.autoRebootDay = parseInt(autoRebootDay.join(""), 2);
      res = await this.$axiosPost(this.setUrl, res);
      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
      } else {
        this.$message.error(_("Failed to save"));
      }
    },
    async handleConfirm() {
      let res = await this.$axiosPost(this.rebootUrl);
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
