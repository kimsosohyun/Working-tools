<template>
  <main-content class="maintain-service" :title="_('System Maintenance')">
    <better-form :model="formData" @submit="submitData">
      <v-form-item :label="_('SSH Debugging')" prop="SSHenable">
        <v-switch v-model="formData.SSHenable"></v-switch>
      </v-form-item>
    </better-form>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";

export default {
  name: "maintainService",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:SSH";
    this.setUrl = "/RPC2:configManager.setConfig:SSH";
    return {
      formData: {
        SSHenable: ""
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axiosPost(this.getUrl);
      let data = res.getParams();
      this.formData.SSHenable = data.SSHenable;
      this.oldFormData = { ...this.formData };
    },
    async submitData(data) {
      let res = await this.$axiosPost(this.setUrl, data);
      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
      } else {
        this.$message.error(_("Failed to save"));
      }
    }
  }
};
</script>
