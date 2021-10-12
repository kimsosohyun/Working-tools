<template>
  <main-content class="osd-wrapper" :title="_('OSD')">
    <div class="osd">
      <better-form
        :model="formData"
        :rules="rules"
        @submit="submitData"
        :btns="['submit', 'sync']"
        class="left-form"
        @sync="showSync"
        ref="form"
      >
        <v-form-item :label="_('Channel')" prop="channel">
          <v-select
            v-model="currentChannel"
            :options="channelOptions"
            @change="setTextPosition"
          ></v-select>
        </v-form-item>
        <v-form-item :label="_('Display Name')" prop="showName">
          <v-switch v-model="formData.channelTitle.enable"></v-switch>
        </v-form-item>
        <div v-show="formData.channelTitle.enable">
          <v-form-item
            ref="title"
            :label="_('Channel Name')"
            prop="title"
            :required="false"
          >
            <v-input
              :maxlength="31"
              v-model="formData.channelTitle.title"
              @input="changeTitle"
            ></v-input>
          </v-form-item>
        </div>
        <v-form-item :label="_('Display Time')" prop="showTime">
          <v-switch v-model="formData.timeTitle.enable"></v-switch>
        </v-form-item>
        <div v-show="formData.timeTitle.enable">
          <v-form-item :label="_('Date Format')" prop="timeFormat">
            <v-select
              v-model="formData.timeTitle.timeFormat"
              :options="getTimeFormatTypes"
            ></v-select>
          </v-form-item>
        </div>
        <!-- <template v-slot:after-button>
          <v-button type="info" @click="showSync">{{ _("Sync to") }}</v-button>
        </template> -->
      </better-form>
      <div class="right-screen">
        <div class="container">
          <div class="screen-mask" ref="mask">
            <span
              ref="titleText"
              v-show="formData.channelTitle.enable"
              class="text-container"
              @mouseover="$refs.titleText.style.cursor = 'pointer'"
              @mousedown="move($event, 'title')"
              >{{ formData.channelTitle.title }}</span
            >
            <span
              ref="timeText"
              v-show="formData.timeTitle.enable"
              class="text-container"
              @mouseover="$refs.timeText.style.cursor = 'pointer'"
              @mousedown="move($event, 'time')"
              >{{ formatDate(formData.timeTitle.timeFormat) }}</span
            >
          </div>
          <singlePlayer :currentChannel="currentChannel" />
        </div>
      </div>
    </div>

    <v-dialog
      v-model="showSyncDialog"
      :title="_('Sync to')"
      :close-on-click-modal="false"
      :modal="true"
      :width="400"
      @confirm="syncChannel"
      :confirm-button-text="_('Sync')"
      class="channel-sync"
    >
      <v-checkbox-group
        is-select-all
        v-model="checked"
        class="check-group"
        :options="channelDisableOptions"
      ></v-checkbox-group>
    </v-dialog>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import { clone, channelResultHandle } from "@/utils/common.js";
import { getEntriesByAttr } from "@/utils/dicts.js";
import { mapState, mapActions } from "vuex";
import singlePlayer from "@/components/singlePlayer";
export default {
  name: "osdConfig",
  components: {
    MainContent,
    BetterForm,
    singlePlayer
  },
  data() {
    this.channelListUrl = "/RPC2:configManager.getConfig:RemoteDevice";
    this.getUrl = "/RPC2:configManager.getConfig:VideoWidget";
    this.setUrl = "/RPC2:configManager.setConfig";
    this.vaConfigsUrl = "/RPC2:configManager.getConfig:Encode";
    this.rules = {
      title: { type: "byteLen", args: [0, 31] }
    };

    this.timeFormatText = {
      1: _("Y#YMD#"),
      2: _("M#DYY#"),
      3: _("D#MYY#")
    };
    return {
      modelName: "CONFIG",
      timeFormatOpts: [],
      formData: {
        channel: "",
        channelTitle: {
          enable: "",
          title: "",
          titlePosition: ""
        },
        timeTitle: {
          enable: "",
          timePosition: "",
          timeFormat: 1,
          timeFormatTypes: ""
        }
      },
      channelList: [],
      currentChannel: "",
      showSyncDialog: false,
      checked: []
    };
  },
  filters: {},

  computed: {
    ...mapState(["channelOptions", "channelDisableOptions", "channelToTitle"]),

    getTimeFormatTypes() {
      return this.timeFormatOpts.filter(
        item =>
          this.formData.timeTitle.timeFormatTypes.indexOf(item.value) !== -1
      );
    }
  },
  watch: {
    channelOptions(newVal) {
      newVal.length > 0 &&
        this.currentChannel == "" &&
        (this.currentChannel = this.channelOptions[0].value);
    },
    //切换通道时保存数据，更新formData
    currentChannel(newVal, oldVal) {
      this.changeChannel(newVal, oldVal);
      this.setTextPosition();
    }
  },
  methods: {
    ...mapActions(["getChannels"]),
    channelResultHandle: channelResultHandle,
    changeChannel(newVal, oldVal) {
      if (oldVal !== "" && oldVal != undefined) {
        this.channelList[oldVal] = this.formData;
      }

      if (newVal !== "" && this.channelList.length > 0) {
        this.formData = this.channelList[newVal];
        if (this.formData.channelTitle.title == "") {
          this.formData.channelTitle.title = this.channelOptions[
            this.currentChannel
          ].label;
        }
      }
    },

    async getData() {
      let res = await this.$axiosPost(this.getUrl);
      res = res.getParams() || [];
      res.forEach(item => {
        this.channelList[item.channel] = item;
      });
      this.changeChannel(this.currentChannel);
      this.setTextPosition();
    },

    showSync() {
      if (!this.$refs.form.$children[0].checkValidate()) {
        this.$message.error(_("Please check the error message"));
        return;
      }
      this.channelDisableOptions.forEach(item => {
        item.disabled = item.value == this.currentChannel;
      });
      this.checked = [this.currentChannel];
      this.showSyncDialog = true;
    },

    setTextPosition() {
      this.$nextTick(() => {
        if (this.$refs.titleText && this.$refs.timeText) {
          let maskWidth = this.$refs.mask.offsetWidth,
            maskHeight = this.$refs.mask.offsetHeight,
            titleWidth = this.$refs.titleText.offsetWidth,
            timeWidth = this.$refs.timeText.offsetWidth,
            [titleX, titleY] = this.formData.channelTitle.titlePosition.split(
              ","
            ),
            [timeX, timeY] = this.formData.timeTitle.timePosition.split(","),
            leftTitle = this.getLeft(titleX, titleWidth, maskWidth),
            leftTime = this.getLeft(timeX, timeWidth, maskWidth);

          this.$refs.titleText.style.left = leftTitle + "px";
          this.$refs.timeText.style.left = leftTime + "px";
          this.$refs.titleText.style.top = maskHeight * titleY + "px";
          this.$refs.timeText.style.top = maskHeight * timeY + "px";

          //更新left坐标
          this.formData.channelTitle.titlePosition =
            (leftTitle / maskWidth).toFixed(2) + "," + titleY;
          this.formData.timeTitle.timePosition =
            (leftTime / maskWidth).toFixed(2) + "," + timeY;
        }
      });
    },

    //处理x轴上可能存在由于同步通道导致的文字溢出的情况
    getLeft(positionX, textWidth, maskWidth) {
      let left = maskWidth * positionX;
      return left + textWidth > maskWidth ? maskWidth - textWidth : left;
    },

    syncChannel() {
      let data = [];
      this.checked.forEach(i => {
        let channel = this.channelList[i].channel;
        let title = this.channelList[i].channelTitle.title;
        this.channelList[i] = clone(this.formData);
        this.channelList[i].channel = channel;
        this.channelList[i].channelTitle.title = title;
        data.push(this.channelList[i]);
      });
      this.checked = [];
      this.showSyncDialog = false;
      this.submitData(data, true);
    },

    changeTitle(str) {
      let oldWidth, oldLeft, index, newWidth;
      oldWidth = this.$refs.titleText.offsetWidth;
      index = this.$refs.titleText.style.left.indexOf("px");
      oldLeft =
        index > 0
          ? parseInt(this.$refs.titleText.style.left.substring(0, index))
          : 0;
      this.formData.channelTitle.title = str;
      //dom更新后重新计算文本位置
      this.$nextTick(() => {
        newWidth = this.$refs.titleText.offsetWidth;
        if (oldLeft + newWidth > this.$refs.mask.offsetWidth) {
          this.$refs.titleText.style.left =
            oldLeft - newWidth + oldWidth + "px";
        }
      });
    },

    move(e, type) {
      //不允许鼠标选中页面元素
      document.body.classList.add("no-select");

      let odiv = e.target; //获取目标元素

      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      //鼠标按下并移动的事件
      document.onmousemove = e => {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        //移动当前元素
        let limitLeft = this.$refs.mask.offsetWidth - odiv.offsetWidth;
        let limitTop = this.$refs.mask.offsetHeight - odiv.offsetHeight;

        left = left >= 0 && left <= limitLeft ? left : left < 0 ? 0 : limitLeft;
        top = top >= 0 && top <= limitTop ? top : top < 0 ? 0 : limitTop;

        odiv.style.left = left + "px";
        odiv.style.top = top + "px";

        let leftPercent = (left / this.$refs.mask.offsetWidth).toFixed(2);
        let topPercent = (top / this.$refs.mask.offsetHeight).toFixed(2);

        type === "title"
          ? (this.formData.channelTitle.titlePosition =
              leftPercent + "," + topPercent)
          : (this.formData.timeTitle.timePosition =
              leftPercent + "," + topPercent);
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        document.body.classList.remove("no-select");
      };
    },

    formatDate(fmt) {
      let format,
        date = new Date(),
        obj = {
          Y: date.getFullYear(), // 年份，注意必须用getFullYear
          M: date.getMonth() + 1, // 月份，注意是从0-11
          D: date.getDate(), // 日期
          h: date.getHours(), // 24小时制
          m: date.getMinutes(), // 分钟
          s: date.getSeconds() // 秒
        };
      for (let i in this.timeFormatOpts) {
        if (this.timeFormatOpts[i].value == fmt) {
          format = this.timeFormatOpts[i].label;
          break;
        }
      }
      for (let i in obj) {
        format = format.replace(new RegExp(i + "+", "g"), function(m) {
          let val = obj[i] + "";
          for (let j = 0, len = val.length; j < m.length - len; j++)
            val = "0" + val;
          return m.length == 1 ? val : val.substring(val.length - m.length);
        });
      }
      return format;
    },

    async submitData(allData, custom) {
      let data = [];
      allData = custom ? allData : this.channelList;
      for (let key in allData) {
        allData[key].name = "VideoWidget";
        data.push(allData[key]);
      }
      let res = await this.$axiosPost(this.setUrl, data);
      this.getChannels();
      this.channelResultHandle(res);
    }
  },
  async created() {
    //获取日期格式字典
    getEntriesByAttr("timeFormat", this.modelName).forEach(item => {
      this.timeFormatOpts.push({
        label: item.value + this.timeFormatText[item.key],
        value: item.key
      });
    });

    await this.getChannels();
    this.getData();
  }
};
</script>

<style lang="scss">
.osd {
  display: flex;
  flex-direction: row;

  .left-form {
    .v-select,
    .v-input {
      width: 228px;
    }
  }
  .right-screen {
    margin-left: 154px;
    .container {
      width: 476px;
      height: 268px;
      position: relative;
      font-size: 13px;
      .screen-mask {
        position: absolute;
        width: 460px;
        height: 252px;
        margin-top: 8px;
        margin-left: 8px;
        z-index: 999;
        color: #ff801f;
        .text-container {
          height: 20px;
          line-height: 18px;
          border: 1px solid #ff801f;
          padding: 0 8px;
          position: absolute;
          white-space: nowrap;
        }
      }
      .loading-box {
        height: 160px;
        border-radius: 2px;
        border: 1px solid #f0f0f0;
        position: relative;
        color: #000;
      }
    }
  }
}
</style>
