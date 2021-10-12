<template>
  <main-content class="setting-basic" :title="_('g#mQs#Basics')">
    <better-form :rules="rules" :model="formData" @submit="submitData">
      <v-form-item :label="_('Device Name')" prop="machineName">
        <v-input v-model="formData.machineName" :maxlength="32"></v-input>
      </v-form-item>
      <v-form-item :label="_('Output Resolution')" prop="resolution">
        <v-select
          v-model="formData.resolution"
          :options="resolutionOptions"
        ></v-select>
      </v-form-item>
    </better-form>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";

export default {
  name: "settingBasic",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    this.getUrl = "/RPC2:devVideoOutput.enumModes";
    this.getNameUrl = "/RPC2:configManager.getConfig:DeviceName";
    this.setUrl = "/RPC2:devVideoOutput.setAdapter";
    this.setNameUrl = "/RPC2:configManager.setConfig:DeviceName";
    return {
      resolutions: [],
      rules: {
        machineName: [{ type: "byteLen", args: [1, 32] }]
      },
      formData: {
        machineName: "",
        resolution: ""
      }
    };
  },
  computed: {
    resolutionOptions() {
      // 分辨率选项
      return this.resolutions.map(item => ({
        value: item,
        label: item
      }));
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await Promise.all([
        this.$axiosPost(this.getUrl),
        this.$axiosPost(this.getNameUrl)
      ]);

      let data = res[0].getParams();
      let deviceData = res[1].getParams();
      this.formData.resolution = data.resolution;
      this.formData.machineName = deviceData.machineName;
      this.resolutions = data.resolutions;
      this.oldFormData = { ...this.formData };
    },
    async submitData(data) {
      let res = await Promise.all([
        this.$axiosPost(this.setUrl, { resolution: data.resolution }),
        this.$axiosPost(this.setNameUrl, { machineName: data.machineName })
      ]);
      if (res[0].getResult() === true && res[1].getResult() === true) {
        this.$message.success(_("Saved Successfully"));
      } else {
        this.$message.error(_("Failed to save"));
      }
    }
  }
};
</script>
