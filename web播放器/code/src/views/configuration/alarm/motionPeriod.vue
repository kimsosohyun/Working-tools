<template>
  <div>
    <period :showEvent="false" @change="change" :value="value" :max="max">
      <template v-slot:tool>
        <label class="video-plan-tip">{{
          _("Tip: 8 periods are supported for one day at most")
        }}</label>
      </template>
    </period>
  </div>
</template>

<script>
import period from "@/components/period/index.vue";
// import { clone } from "@/utils/common.js";

const DEFAULT_PERIOD = "0 00:00:00-00:00:00";
export default {
  name: "motion-period",
  components: {
    period
  },
  props: {
    channel: {
      type: [Number, String]
    },
    value: {
      type: Array
    }
  },
  data() {
    // this.getUrl = "/RPC2:configManager.getConfig:Record";
    // this.getChannelUrl = "/RPC2:configManager.getConfig:RemoteDevice";
    // this.setUrl = "/RPC2:configManager.setConfig:Record";

    this.max = 8;
    return {};
  },
  methods: {
    change(val) {
      this.$emit("change", val);
    },
    formatGetData(data) {
      return data.map(weekday => {
        let dayItem = [];
        for (let i = 0; i < weekday.length; i++) {
          if (i !== 0 && weekday[i] === DEFAULT_PERIOD) {
            break;
          }
          let period = weekday[i];
          period = period.split(" ");
          if (period.length === 2) {
            let time = period[1].split("-");
            dayItem.push({
              startTime: time[0].replace(/:00$/, ""),
              endTime: time[1].replace(/:00$/, "")
            });
          }
        }
        return dayItem;
      });
    },
    formatSetData(data) {
      let timeSection = [];
      data.forEach(item => {
        let dayItem = [];
        for (let i = 0; i < this.max; i++) {
          let period = item[i];
          if (period === undefined) {
            dayItem.push(DEFAULT_PERIOD);
            continue;
          }
          dayItem.push(`0 ${period.startTime}:00-${period.endTime}:00`);
        }
        timeSection.push(dayItem);
      });
      return timeSection;
    }
  }
};
</script>

<style lang="scss">
.motion-period {
  .video-plan-tip {
    color: #8d8d8d;
    font-size: 12px;
  }
}
</style>
