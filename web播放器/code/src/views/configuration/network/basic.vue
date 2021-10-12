<template>
  <main-content class="network-basic" :title="_('Basics')">
    <better-form :rules="rules" :model="formData" @submit="submitData">
      <v-form-item :label="_('DHCP')" prop="enable">
        <v-switch
          v-model="formData.enable"
          @change="dhcpEnableChange"
        ></v-switch>
      </v-form-item>
      <v-form-item
        :label="_('IP Address')"
        prop="ip"
        :disabled="formData.enable"
      >
        <v-input-group
          type="ip"
          v-model="formData.ip"
          :auto-correction="['1.0.0.1', '223.255.255.255']"
        ></v-input-group>
      </v-form-item>
      <v-form-item
        :label="_('Subnet Mask')"
        prop="mask"
        :disabled="formData.enable"
      >
        <v-input-group
          type="ip"
          v-model="formData.mask"
          :auto-correction="['0.0.0.0', '255.255.255.255']"
        ></v-input-group>
      </v-form-item>
      <v-form-item
        :label="_('Default Gateway')"
        prop="gateway"
        :disabled="formData.enable"
      >
        <v-input-group
          type="ip"
          v-model="formData.gateway"
          :auto-correction="['1.0.0.1', '223.255.255.255']"
        ></v-input-group>
      </v-form-item>
      <v-form-item
        :label="_('自动获取DNS')"
        prop="dnsEnable"
        :disabled="!formData.enable"
      >
        <v-switch
          v-model="formData.dnsEnable"
          @change="dnsEnableChange"
        ></v-switch>
      </v-form-item>
      <v-form-item
        :label="_('Primary DNS')"
        prop="preferredDNS"
        :disabled="formData.dnsEnable"
      >
        <v-input-group
          type="ip"
          v-model="formData.preferredDNS"
          :auto-correction="['1.0.0.1', '223.255.255.255']"
        ></v-input-group>
      </v-form-item>
      <v-form-item
        :label="_('Secondary DNS')"
        prop="alternativeDNS"
        :required="false"
        :disabled="formData.dnsEnable"
      >
        <v-input-group
          type="ip"
          v-model="formData.alternativeDNS"
          :auto-correction="['1.0.0.1', '223.255.255.255']"
        ></v-input-group>
      </v-form-item>
      <v-form-item label="MTU" prop="mtu">
        <v-input
          :allow="/\d/g"
          v-model="formData.mtu"
          :auto-correction="[576, 1500]"
        ></v-input>
      </v-form-item>
      <v-form-item :label="_('MAC Address')" prop="mac">
        <span class="v-form-item__label--medium">{{ formData.mac }}</span>
      </v-form-item>
    </better-form>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import { isSameNet } from "@/utils/common";

const defaultData = {
  preferredDNS: "8.8.8.8",
  alternativeDNS: "114.114.114.114"
};
export default {
  name: "networkBasic",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    this.getUrl = "/RPC2:configManager.getConfig:Network";
    this.setUrl = "/RPC2:configManager.setConfig:Network";
    this.rules = {
      ip: [{ type: "ip" }],
      mask: { type: "subnetMask" },
      gateway: { type: "ip", msg: _("Incorrect gateway format") },
      preferredDNS: { type: "ipAll", msg: _("Incorrect DNS address format") },
      alternativeDNS: {
        type: "ipAll",
        msg: _("Incorrect DNS address format")
      },
      mtu: { type: "num", args: [128, 1500] }
    };
    this.dialogLoadingVm = null;
    return {
      formData: {
        enable: false,
        ip: "",
        mask: "",
        gateway: "",
        dnsEnable: false,
        preferredDNS: "",
        alternativeDNS: "",
        mtu: "",
        mac: ""
      },
      oldFormData: {
        // 主要用于判断IP是否修改
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axiosPost(this.getUrl);

      this.formData = res.getParams();
      this.oldFormData = { ...this.formData };
    },
    async submitData(data) {
      if (data.enable) {
        this.submitDataForDHCP(data);
      } else {
        this.submitDataForNormal(data);
      }
    },
    /**
     * dhcp使能提交数据函数
     * @param {Object} data 页面配置数据
     */
    async submitDataForDHCP(data) {
      const $dialogLoading = (this.dialogLoadingVm = this.$dialog.loading(
        _("Obtaining IP address… Please wait")
      ));
      const oldTime = new Date().getTime();
      const oldIp = window.location.hostname;
      const res = await this.saveConfigs(data);
      const wait = 2000 - (new Date().getTime() - oldTime);

      if (wait > 0) {
        // loading显示不够两秒，延长至两秒
        await this.sleep(wait);
      }

      if (res.getResult() === true) {
        // 配置保存成功
        const { ip: newIp } = res.getParams();

        if (oldIp === newIp) {
          // ip相同，提示“保存成功”并获取最新数据
          $dialogLoading.hide();
          this.$message.success(_("Saved Successfully"));
          this.getData();
        } else if (!newIp) {
          // 不返回ip地址，获取ip地址失败
          $dialogLoading.hide();
          this.$dialog.error(
            _(
              "Failed to obtain the IP address. Please ensure that the router in network has enabled DHCP server function"
            ),
            2000
          );
        } else {
          // 返回新的ip地址，且与旧ip地址不同，跳转至新ip地址页面
          $dialogLoading.text = _(
            "Trying to redirect to a new IP address… Please wait"
          );
          this.jumpTo(newIp);
        }
      } else {
        // 配置保存失败
        $dialogLoading.hide();
        this.$message.error(_("Failed to save"));
      }
    },
    /**
     * dhcp不使能提交数据函数
     * @param {Object} data 页面配置数据
     */
    async submitDataForNormal(data) {
      const { ip: newIp, mask, gateway } = data;

      if (!isSameNet(newIp, gateway, mask, mask)) {
        this.$message.error(_("IP地址与默认网关地址必须在同一网段"));
        return;
      }
      const oldIp = window.location.hostname;
      const res = await this.saveConfigs(data);

      if (res.getResult() === true) {
        // 配置保存成功
        if (oldIp !== newIp) {
          // 手动配置的ip地址与地址栏ip不同，跳转至新ip地址
          this.$dialog.loading(
            _("Trying to redirect to a new IP address… Please wait")
          );
          this.jumpTo(newIp);
        } else {
          // ip地址没改变，提示“保存成功”并获取最新数据
          this.$message.success(_("Saved Successfully"));
          this.getData();
        }
      } else {
        // 配置保存失败
        this.$message.error(_("Failed to save"));
      }
    },
    /**
     * 保存配置
     * @param {Object} data 页面配置数据
     */
    async saveConfigs(data) {
      data = { ...data, mac: this.formData.mac, mtu: +data.mtu };
      return await this.$axiosPost(this.setUrl, data);
    },
    /**
     * 跳转至某个ip
     * @param {String} ip ip地址
     */
    jumpTo(ip) {
      const port = window.location.port || 80;

      window.location.href = `http://${ip}:${port}`;
    },
    sleep(sec) {
      return new Promise(resolve => setTimeout(() => resolve(), sec));
    },
    dhcpEnableChange(val) {
      this.formData.dnsEnable = val;
      this.dnsEnableChange(val);
    },
    dnsEnableChange(val) {
      if (!val) {
        // 只要dns使能关闭，DNS设置为默认值
        this.formData.preferredDNS = defaultData.preferredDNS;
        this.formData.alternativeDNS = defaultData.alternativeDNS;
      }
    }
  }
};
</script>

<style lang="scss"></style>
