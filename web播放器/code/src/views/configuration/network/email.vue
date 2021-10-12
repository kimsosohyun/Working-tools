<template>
  <main-content class="network-email" :title="_('Email')">
    <better-form :rules="rules" :model="formData" @submit="submitData">
      <v-form-item :label="_('Email Alarm Service')" prop="isEmailServe">
        <v-switch v-model="formData.isEmailServe"></v-switch>
      </v-form-item>
      <v-form-item
        :label="_('SMTP Server')"
        prop="smtpServer"
        :disabled="isNotServe"
      >
        <v-input
          v-model="formData.smtpServer"
          :placeholder="_('IP address or domain name')"
        ></v-input>
      </v-form-item>
      <v-form-item
        :label="_('SMTP Port')"
        prop="smtpPort"
        :disabled="isNotServe"
      >
        <v-input
          v-model="formData.smtpPort"
          :allow="/\d/g"
          :placeholder="_('SMTP service port')"
        ></v-input>
      </v-form-item>
      <v-form-item
        :label="_('Anonymous')"
        prop="isAnonymous"
        :disabled="isNotServe"
      >
        <v-switch v-model="formData.isAnonymous"></v-switch>
      </v-form-item>
      <v-form-item
        :label="_('Sender')"
        prop="sender"
        :disabled="isNotServe || isAnon"
      >
        <v-input
          v-model="formData.sender"
          :placeholder="_('Sender name')"
        ></v-input>
      </v-form-item>
      <v-form-item
        :label="_('Sender Email')"
        prop="senderAddr"
        :disabled="isNotServe || isAnon"
      >
        <v-input
          v-model="formData.senderAddr"
          :placeholder="_('Sender Email address')"
        ></v-input>
      </v-form-item>
      <v-form-item
        :label="_('Password')"
        prop="password"
        :disabled="isNotServe || isAnon"
      >
        <v-input
          v-model="formData.password"
          type="password"
          show-password
          :placeholder="_('Sender Email Password')"
        ></v-input>
      </v-form-item>
      <v-form-item
        :label="_('Encryption Mode')"
        prop="type"
        :disabled="isNotServe"
      >
        <v-select
          v-model="formData.type"
          :options="encryptionOptions"
        ></v-select>
      </v-form-item>
      <v-form-item
        :label="_('Image Attachment')"
        prop="isImageAttach"
        :disabled="isNotServe"
      >
        <v-switch v-model="formData.isImageAttach"></v-switch>
      </v-form-item>
      <v-form-item
        :label="_('Recipient')"
        :disabled="isNotServe"
        :required="false"
      >
        <EmailRecipient
          ref="emailRecipient"
          :data="formData.recipient"
          :is-not-serve="isNotServe"
        />
      </v-form-item>
    </better-form>
  </main-content>
</template>

<script>
import { getEntriesByAttr } from "@/utils/dicts";
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import EmailRecipient from "./emailRecipient";

export default {
  name: "networkEmail",
  components: {
    MainContent,
    BetterForm,
    EmailRecipient
  },
  data() {
    this.encryptionAttr = "encryption";
    this.getUrl = "/RPC2:configManager.getConfig:Mail";
    this.setUrl = "/RPC2:configManager.setConfig:Mail";
    this.rules = {
      smtpServer: {
        // type: "ip"
      },
      smtpPort: {
        type: "num",
        args: [0, 65535]
      },
      sender: {},
      senderAddr: {
        type: "email",
        msg: _("Recipient email address is required")
      },
      password: {}
    };
    return {
      formData: {
        isEmailServe: false,
        smtpServer: "",
        smtpPort: "",
        isAnonymous: false,
        sender: "",
        senderAddr: "",
        password: "",
        type: "",
        isImageAttach: false,
        recipient: []
      }
    };
  },
  computed: {
    encryptionOptions() {
      // 端口连接状态映射
      const encryptionArr = getEntriesByAttr(this.encryptionAttr);

      return encryptionArr.map(({ key, value }) => ({
        value: key,
        label: value
      }));
    },
    isNotServe() {
      // 邮箱服务是否是关闭状态
      return !this.formData.isEmailServe;
    },
    isAnon() {
      // 是否是匿名
      return this.formData.isAnonymous;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$axiosPost(this.getUrl);

      // res = res.getParams();
      // res.recipient = res.recipient.map((item, idx) => ({
      //   ...item,
      //   idx: idx + 1
      // }));

      // this.formData = res;
      this.formData = res.getParams();
      // this.oldFormData = { ...this.formData };
      console.log(this.formData);
    },
    async submitData(data) {
      const tableVm = this.$refs.emailRecipient,
        checked = tableVm.checktableData();

      if (!checked) return;

      const { smtpPort, isEmailServe } = this.formData,
        tableData = tableVm.getTableData();

      if (isEmailServe && !tableData.find(({ address }) => address)) {
        this.$message.error(_("The Recipient email address is required"));
        return;
      }

      const res = await this.$axiosPost(this.setUrl, {
        ...data,
        smtpPort: parseInt(smtpPort),
        recipient: tableData
      });

      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
        this.getData();
      } else {
        this.$message.error(_("Failed to save"));
      }
    }
  }
};
</script>

<style lang="scss"></style>
