<template>
  <main-content class="abnormal" :title="_('Exception Detection')">
    <better-form :rules="rules" :model="formData" @submit="submitData">
      <v-form-item :label="_('Exception Type')" prop="type">
        <v-select
          v-model="formData.type"
          @change="getData"
          :options="typeOptions"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Select Channel')"
        prop="recordChannel"
        v-if="formData.type === 'AbnormalChannel'"
      >
        <v-checkbox-group
          is-select-all
          v-model="formData.recordChannel"
          :options="channelOptions"
        ></v-checkbox-group>
      </v-form-item>
      <v-form-item :label="_('Linkage Action')">
        <v-checkbox v-model="formData.tipEnable">{{
          _("Monitor pop-up window")
        }}</v-checkbox>
        <v-form-item
          :is-inline="true"
          :is-no-label="true"
          prop="mailEnable"
          class="ab-gap"
          v-if="mailShow"
        >
          <v-checkbox v-model="formData.mailEnable">{{
            _("Send Email")
          }}</v-checkbox>
        </v-form-item>
        <v-form-item
          :is-inline="true"
          :is-no-label="true"
          v-if="cloudShow"
          prop="cloudPushEnabled"
        >
          <v-checkbox v-model="formData.cloudPushEnabled">{{
            _("Message Notification")
          }}</v-checkbox>
        </v-form-item>
      </v-form-item>
    </better-form>
    <div></div>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";

export default {
  name: "abnormal",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:";
    this.getChannelUrl = "/RPC2:configManager.getConfig:RemoteDevice";
    this.setUrl = "/RPC2:configManager.setConfig:";
    this.typeOptions = [
      { label: _("No HDD"), value: "StorageNotExist" },
      { label: _("HDD error"), value: "StorageFailure" },
      { label: _("HDD space is not enough"), value: "StorageLowSpace" },
      { label: _("Channel error"), value: "AbnormalChannel" },
      { label: _("Disconnected from the internet"), value: "NetAbort" },
      { label: _("IP address conflict"), value: "IPConflict" },
      { label: _("Unauthorized access"), value: "IllegalAccess" }
    ];

    return {
      channelOptions: [],
      formData: {
        isCyclicWrite: true,
        type: "StorageNotExist",
        recordChannel: [],
        tipEnable: true,
        mailEnable: true,
        cloudPushEnabled: true
      },
      rules: {}
    };
  },
  computed: {
    mailShow() {
      return (
        [
          "StorageNotExist",
          "StorageFailure",
          "StorageLowSpace",
          "AbnormalChannel",
          "IllegalAccess"
        ].indexOf(this.formData.type) > -1
      );
    },
    cloudShow() {
      return (
        [
          "StorageNotExist",
          "StorageFailure",
          "StorageLowSpace",
          "AbnormalChannel",
          "IllegalAccess"
        ].indexOf(this.formData.type) > -1
      );
    }
  },
  methods: {
    async getData() {
      let res = await this.$axiosPost(this.getUrl + this.formData.type);
      res = res.getParams();

      this.formData.tipEnable = !!res.tipEnable;
      this.formData.mailEnable = !!res.mailEnable;
      this.formData.cloudPushEnabled = !!res.cloudPushEnabled;
      this.formData.recordChannel = res.recordChannel || [];
      this.oldFormData = { ...this.formData };
    },
    async getChannel() {
      let res = await this.$axiosPost(this.getChannelUrl);
      res = res.getParams();
      let channels = [];
      res.forEach(({ channel }) => {
        channels.push({
          label: `D${channel + 1}`,
          value: channel
        });
      });
      this.channelOptions.splice(0, this.channelOptions.length, ...channels);
    },
    async submitData() {
      let data = {
        tipEnable: this.formData.tipEnable
      };
      if (this.formData.type === "AbnormalChannel") {
        data.recordChannel = this.formData.recordChannel.sort((a, b) => a - b);
      }
      if (this.mailShow) {
        data.mailEnable = this.formData.mailEnable;
      }
      if (this.cloudShow) {
        data.cloudPushEnabled = this.formData.cloudPushEnabled;
      }
      let res = await this.$axiosPost(this.setUrl + this.formData.type, data);
      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
      } else {
        this.$message.error(_("Failed to save"));
      }
    }
  },
  created() {
    this.getData();
    this.getChannel();
  }
};
</script>

<style lang="scss">
.abnormal {
  .ab-gap {
    margin: 0 24px;
  }
}
</style>
