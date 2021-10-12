<template>
  <v-dialog
    v-model="showProcess"
    :close-on-click-modal="false"
    :show-title="false"
    :show-close="false"
    :show-confirm="false"
    :show-cancel="false"
    :modal="true"
    :width="480"
  >
    <div class="process-wrap">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else>
        <div class="process-text">{{ text }}</div>
        <v-progress :height="40" :value="percent" type="line"></v-progress>
      </template>
    </div>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "process",
  data() {
    this.checking = false;
    this.perStep = 0.01;
    this.done = false;
    this.disConnected = false;
    return {
      percent: this.value
    };
  },
  props: {
    showProcess: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    },
    duration: {
      type: Number,
      default: 60
    },
    value: {
      type: Number,
      default: 0
    },
    redirect: {
      type: Boolean,
      default: true
    },
    defaultIp: {
      type: String,
      default: ""
    },
    redirectPage: {
      //默认重定向到登录页面
      type: String,
      default: "login"
    }
  },
  computed: {
    autoProcess() {
      return this.duration > 0;
    },
    perTime() {
      return (this.duration / 100) * 1000;
    }
  },
  model: {
    prop: "showProcess",
    event: "change"
  },
  watch: {
    value(val) {
      this.percent = val;
    },
    showProcess(val) {
      if (val) {
        this.startProcess();
      } else {
        this.percent = this.value;
      }
    }
  },
  methods: {
    restart() {
      this.percent = 0;
      this.done = false;
      this.disConnected = false;
      this.checking = false;
      this.startProcess();
    },
    startProcess() {
      if (this.autoProcess) {
        setTimeout(this.processing.bind(this), this.perTime);
      }
    },
    processing() {
      if (this.disConnected) {
        return;
      }
      if (this.percent >= 1) {
        // stop
        this.$emit("change", false);
        this.$emit("done");
        if (this.redirect) {
          location.href = this.defaultIp
            ? `http://${this.defaultIp}/${this.redirectPage}.html`
            : `${this.redirectPage}.html`;
        }
        return;
      }
      if (!this.done) {
        if (this.percent > 0.7 && this.checking === false) {
          this.checkStatus();
        }

        if (this.percent > 0.8) {
          this.perStep = 0.005;
        }
        this.checkLine();
      }
      let percent = this.percent;
      percent += this.perStep;
      if (percent >= 0.99) {
        percent = this.done ? 1 : 0.99;
      }
      this.percent = percent;
      this.startProcess();
    },
    checkStatus() {
      this.checking = true;

      //在点击恢复出厂设置后，不需要请求接口，直接跳转到默认IP
      if (this.redirectPage === "activate") {
        this.done = true;
        return;
      }
      let url = (this.defaultIp ? `http://${this.defaultIp}` : "") + "/RPC2";
      Promise.race([
        axios
          .post(url, {
            method: "userManager.getQRcode"
          })
          .then(() => {
            // 重启完成，加快进度axios
            this.done = true;
            this.perStep = 0.05;
          }),
        // this.$axiosPost(url).then(() => {
        //   // 重启完成，加快进度axios
        //   this.done = true;
        //   this.perStep = 0.05;
        // }),
        new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 8000);
        })
      ]).then(() => {
        this.checking = false;
      });
    },
    // 一分钟超时，恢复出厂设置后，一分钟后还无响应显示超时信息
    checkLine() {
      if (!this.timeout && this.defaultIp) {
        this.timeout = setTimeout(() => {
          this.disConnected = true;
          this.$emit("error");
        }, 60000);
      }
    }
  },
  beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
};
</script>

<style lang="scss">
.process-text {
  text-align: center;
  line-height: 30px;
  font-size: 16px;
}

.process-wrap {
  padding: 35px 0px;
}
</style>
