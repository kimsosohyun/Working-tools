<template>
  <main-content :title="_('Device Info')" class="device-info">
    <ul>
      <li class="device-info-item">
        <span class="item-title">{{ _("Device Name") }}</span>
        <span class="item-content">{{ deviceInfo.machineName }}</span>
      </li>
      <li class="device-info-item">
        <span class="item-title">{{ _("Device Model") }}</span>
        <span class="item-content">{{ deviceInfo.machineModel }}</span>
      </li>
      <li class="device-info-item">
        <span class="item-title">{{ _("Device S/N") }}</span>
        <span class="item-content">{{ deviceInfo.machineSN }}</span>
      </li>
      <li class="device-info-item">
        <span class="item-title">{{ _("Version") }}</span>
        <span class="item-content">{{ deviceInfo.softVersion }}</span>
      </li>
      <li class="device-info-item">
        <span class="item-title">{{ _("Release Date") }}</span>
        <span class="item-content">{{ deviceInfo.publishTime }}</span>
      </li>
      <li class="device-info-item">
        <span class="item-title">{{ _("System Time") }}</span>
        <span class="item-content">{{ deviceInfo.systemTime }}</span>
      </li>
      <li class="device-info-item">
        <span class="item-title">{{ _("Uptime") }}</span>
        <span class="item-content">{{ deviceInfo.runningTime }}</span>
      </li>
    </ul>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
export default {
  name: "info",
  data() {
    this.getMachineInfoUrl = "/RPC2:configManager.getConfig:General";
    this.getDynamicInfoUrl = "/RPC2:magicBox.getDynamicInfo";
    return {
      timer: null,
      deviceInfo: {
        machineName: "",
        machineModel: "",
        machineSN: "",
        softVersion: "",
        publishTime: "",
        systemTime: "",
        runningTime: 0
      }
    };
  },
  mounted() {
    this.getMachineInfo();
    this.getDynamicInfo();
    this.timer = setInterval(() => {
      this.getDynamicInfo();
    }, 1000);
  },
  methods: {
    async getMachineInfo() {
      const res = await this.$axiosPost(this.getMachineInfoUrl),
        result = res.getResult(),
        {
          machineName,
          machineSN,
          machineModel,
          publishTime,
          softVersion
        } = res.getParams(),
        { deviceInfo } = this;

      if (result) {
        deviceInfo.machineName = machineName;
        deviceInfo.machineSN = machineSN;
        deviceInfo.machineModel = machineModel;
        deviceInfo.publishTime = publishTime;
        deviceInfo.softVersion = softVersion;
      }
    },
    async getDynamicInfo() {
      const res = await this.$axiosPost(this.getDynamicInfoUrl),
        result = res.getResult(),
        param = res.getParams(),
        { deviceInfo } = this;

      if (result) {
        deviceInfo.runningTime = this.formatMinutes(param.runningTime);
        deviceInfo.systemTime = param.systemTime;
      }
    },
    //分钟转为天、时、分
    formatMinutes(minutes) {
      const day = parseInt(Math.floor(minutes / 1440)),
        hour =
          day > 0
            ? Math.floor((minutes - day * 1440) / 60)
            : Math.floor(minutes / 60),
        minute =
          hour > 0 ? Math.floor(minutes - day * 1440 - hour * 60) : minutes;
      let time = "";

      if (day >= 0) time += day + _("day(s)");
      if (hour >= 0) time += hour + _("hour(s)");
      if (minute >= 0) time += minute + _("minute(s)");
      return time;
    }
  },
  components: {
    MainContent
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="scss">
.device-info-item {
  height: 14px;
  margin-bottom: 30px;
  position: relative;
  .item-title,
  .item-content {
    font-size: 14px;
    color: #262626;
    line-height: 14px;
  }
  .item-content {
    position: absolute;
    top: 0;
    left: 94px;
  }
}
</style>
