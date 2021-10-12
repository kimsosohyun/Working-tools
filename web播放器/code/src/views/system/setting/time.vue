<template>
  <main-content class="setting-time" :title="_('U#CPA#Time')">
    <better-form :rules="rules" :model="formData" @submit="submitData">
      <v-form-item :label="_('System Time')">
        <label class="v-form-item__label--medium">{{
          formData.time | formatDate(timeValueToFormat[formData.timeFormat])
        }}</label>
      </v-form-item>
      <v-form-item :label="_('Time Zone')" prop="timeZone">
        <v-select
          v-model="formData.timeZone"
          :options="timeZoneOptions"
          @change="syncTime(formData.time)"
        ></v-select>
      </v-form-item>
      <v-form-item :label="_('Date Format')" prop="timeFormat">
        <v-select
          v-model="formData.timeFormat"
          :options="timeFormats"
          @change="syncTime(formData.time)"
        ></v-select>
      </v-form-item>
      <v-form-item :label="_('Time Synchronization')" prop="correctTimeType">
        <v-radio
          v-model="formData.correctTimeType"
          :options="correctTimeType"
        ></v-radio>
      </v-form-item>
      <v-form-item
        v-if="formData.correctTimeType == 1"
        :label="_('Date & Time')"
        prop="date"
      >
        <v-datepicker
          v-model="formData.date"
          :format="dateFormat"
        ></v-datepicker>
        <v-form-item :is-inline="true" :is-no-label="true" prop="datetime">
          <v-timepicker
            class="gap"
            format="hh:mm:ss"
            v-model="formData.datetime"
          ></v-timepicker>
        </v-form-item>
        <v-button class="gap" @click="syncTime" type="secondary">{{
          _("Sync with computer time")
        }}</v-button>
      </v-form-item>
      <p v-else>
        <v-form-item :label="_('Server Address')" prop="address">
          <v-input v-model="formData.address"></v-input>
        </v-form-item>
        <v-form-item :label="_('Port')" prop="port">
          <v-input-number
            v-model="formData.port"
            :precision="0"
            :is-controls="false"
          ></v-input-number>
        </v-form-item>
        <v-form-item :label="_('Interval')" prop="updatePeriod">
          <v-input-number
            v-model="formData.updatePeriod"
            :precision="0"
            :is-controls="false"
          ></v-input-number>
          <label class="gap-min">{{ _("minute(s) (range: 1 - 10080)") }}</label>
        </v-form-item>
      </p>
      <!-- <v-form-item label="时间" prop="security"></v-form-item> -->
      <v-form-item key="DSTEnable" :label="_('DST')" prop="DSTEnable">
        <v-switch v-model="formData.DSTEnable"></v-switch>
      </v-form-item>
      <v-form-item
        key="DSTType"
        :label="_('Type')"
        prop="DSTType"
        :disabled="!formData.DSTEnable"
      >
        <v-radio v-model="formData.DSTType" :options="summerType"></v-radio>
      </v-form-item>
      <div v-if="formData.DSTType == 1">
        <v-form-item
          :label="_('Start Time')"
          prop="DSTStartMonthForDate"
          :disabled="!formData.DSTEnable"
        >
          <v-select
            width="110px"
            :options="monthOptions"
            v-model="formData.DSTStartMonthForDate"
            @change="val => changeDateMonth(val, 'DSTStartDay')"
          ></v-select>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTStartDay"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="startDayOptions"
              v-model="formData.DSTStartDay"
            ></v-select>
          </v-form-item>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTStartTimeForDate"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="hourOptions"
              v-model="formData.DSTStartTimeForDate"
            ></v-select>
          </v-form-item>
        </v-form-item>
        <v-form-item
          :label="_('End Time')"
          prop="DSTEndMonthForDate"
          :disabled="!formData.DSTEnable"
        >
          <v-select
            width="110px"
            :options="monthOptions"
            v-model="formData.DSTEndMonthForDate"
            @change="val => changeDateMonth(val, 'DSTEndDay')"
          ></v-select>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTEndDay"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="endDayOptions"
              v-model="formData.DSTEndDay"
            ></v-select>
          </v-form-item>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTEndTimeForDate"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="hourOptions"
              v-model="formData.DSTEndTimeForDate"
            ></v-select>
          </v-form-item>
        </v-form-item>
      </div>
      <p v-else>
        <v-form-item
          :label="_('Start Time')"
          prop="DSTStartMonthForWeek"
          :disabled="!formData.DSTEnable"
        >
          <v-select
            width="110px"
            :options="monthOptions"
            v-model="formData.DSTStartMonthForWeek"
          ></v-select>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTStartWeek"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="orderOptions"
              v-model="formData.DSTStartWeek"
            ></v-select>
          </v-form-item>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTStartWeekDay"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="weekdayOptions"
              v-model="formData.DSTStartWeekDay"
            ></v-select>
          </v-form-item>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTStartTimeForWeek"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="hourOptions"
              v-model="formData.DSTStartTimeForWeek"
            ></v-select>
          </v-form-item>
        </v-form-item>
        <v-form-item
          :label="_('End Time')"
          prop="DSTEndMonthForWeek"
          :disabled="!formData.DSTEnable"
        >
          <v-select
            width="110px"
            :options="monthOptions"
            v-model="formData.DSTEndMonthForWeek"
          ></v-select>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTEndWeek"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="orderOptions"
              v-model="formData.DSTEndWeek"
            ></v-select>
          </v-form-item>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTEndWeekDay"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="weekdayOptions"
              v-model="formData.DSTEndWeekDay"
            ></v-select>
          </v-form-item>
          <v-form-item
            :is-inline="true"
            :is-no-label="true"
            prop="DSTEndTimeForWeek"
            :disabled="!formData.DSTEnable"
          >
            <v-select
              width="110px"
              class="gap-min"
              :options="hourOptions"
              v-model="formData.DSTEndTimeForWeek"
            ></v-select>
          </v-form-item>
        </v-form-item>
      </p>
      <v-form-item
        :label="_('Offset Time')"
        prop="offset"
        :disabled="!formData.DSTEnable"
      >
        <v-select v-model="formData.offset" :options="offsetOptions"></v-select>
        <label
          class="gap-min lh-32"
          :class="{ 'disabledd-unit': !formData.DSTEnable }"
          >{{ _("minute(s)") }}</label
        >
      </v-form-item>
    </better-form>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import { getEntriesByAttr } from "@/utils/dicts.js";
import { formatDate, getTimeByZone } from "@/utils/common.js";

const BIG_MONTH = [1, 3, 5, 7, 8, 10, 12],
  SMALL_MONTH = [4, 6, 9, 11];

function getOptions(start, end, text, arr) {
  let res = [];
  if (arr) {
    end = start + arr.length - 1;
  }

  for (let i = start, j = 0; i <= end; i++, j++) {
    res.push({
      label: text.replace("%s", arr ? arr[j] : i),
      value: i
    });
  }
  return res;
}
function getDayOptions(month) {
  let daysPerMonth = 0;

  if (BIG_MONTH.includes(month)) {
    daysPerMonth = 31;
  } else if (SMALL_MONTH.includes(month)) {
    daysPerMonth = 30;
  } else {
    daysPerMonth = 28;
  }

  return getOptions(1, daysPerMonth, "%s");
}

export default {
  name: "settingTime",
  components: {
    MainContent,
    BetterForm
  },
  data() {
    this.getNtpUrl = "/RPC2:configManager.getConfig:NTP";
    this.getDstUrl = "/RPC2:configManager.getConfig:DST";
    this.getTimeUrl = "/RPC2:global.getCurrentTime";
    this.setNtpUrl = "/RPC2:configManager.setConfig:NTP";
    this.setDstUrl = "/RPC2:configManager.setConfig:DST";
    this.setTimeUrl = "/RPC2:global.setCurrentTime";

    this.getOptions();

    return {
      rules: {
        port: [{ type: "num", args: [0, 65535] }],
        updatePeriod: [{ type: "num", args: [1, 10080] }]
      },
      formData: {
        time: "2021-04-22 10:34:45", // 系统时间
        timeZone: 1, // 时区
        timeFormat: "", // 日期格式
        correctTimeType: 1, // 时间类型
        date: "", // 日期时间-日期
        datetime: "", // 日期时间-时间
        address: "", // 服务器地址
        port: "", // 端口
        updatePeriod: "", // 校时周期
        offset: 60, // 偏移时间
        DSTEnable: true, // 夏令时
        DSTType: 1, // 类型

        /* 类型：日期 start */
        DSTStartMonthForDate: 1, // 开始时间-月
        DSTStartDay: 1, // 开始时间-日
        DSTStartTimeForDate: 0, // 开始时间-时间
        DSTEndMonthForDate: 1, // 结束时间-月
        DSTEndDay: 1, // 结束时间-天
        DSTEndTimeForDate: 0, // 结束时间-时间
        /* 类型：日期 end */

        /* 类型：星期 start */
        DSTStartMonthForWeek: 1, // 开始时间-月
        DSTStartWeek: 1, // 开始时间-第几个星期
        DSTStartWeekDay: 0, // 开始时间-星期几
        DSTStartTimeForWeek: 0, // 开始时间-时间
        DSTEndMonthForWeek: 1, // 结束时间-月
        DSTEndWeek: 1, // 结束时间-第几个星期
        DSTEndWeekDay: 0, // 结束时间-星期几
        DSTEndTimeForWeek: 0 // 结束时间-时间
        /* 类型：星期 end */
      }
    };
  },
  filters: {
    formatDate
  },
  computed: {
    dateFormat() {
      const str = this.timeValueToFormat[this.formData.timeFormat];
      return str && str.split(" ")[0];
    },
    startDayOptions() {
      return getDayOptions(this.formData.DSTStartMonthForDate);
    },
    endDayOptions() {
      return getDayOptions(this.formData.DSTEndMonthForDate);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    intervalTime() {
      if (this.timer) {
        clearInterval(this.timer);
      }

      this.timer = setInterval(() => {
        this.timeSeconds += 1000;
        this.formData.time = new Date(this.timeSeconds);
      }, 1000);
    },
    syncTime(time) {
      const format = this.timeValueToFormat[this.formData.timeFormat];
      let oldTimeZone, timeZone;

      if (!time) {
        // 同步当前电脑时间
        oldTimeZone = timeZone = new Date().getTimezoneOffset() / -60;
        const timeZoneObj = this.timeZoneArr.find(
          ({ utc }) => utc === timeZone
        );
        this.formData.timeZone = timeZoneObj.value;
      } else {
        // 更改时区、时间格式触发
        oldTimeZone = this.timeZoneUTCs[this.oldFormData.timeZone];
        timeZone = this.timeZoneUTCs[this.formData.timeZone];
      }
      let date = getTimeByZone(time, oldTimeZone, timeZone, format);

      date = date.split(" ");
      this.formData.datetime = date[1];
      this.formData.date = date[0];
    },
    getOptions() {
      this.timeFormats = [];
      this.timeValueToFormat = {};
      let timeFormatText = {
        1: _("Y#YMD#"),
        2: _("M#DYY#"),
        3: _("D#MYY#")
      };
      getEntriesByAttr("timeFormat", "CONFIG").forEach(item => {
        this.timeFormats.push({
          label: item.value + " " + timeFormatText[item.key],
          value: item.key
        });
        this.timeValueToFormat[item.key] = item.value + " hh:mm:ss";
      });

      this.correctTimeType = [
        {
          label: _("Manual"),
          value: 1
        },
        {
          label: _("Internet"),
          value: 2
        }
      ];

      this.summerType = [
        {
          label: _("Date"),
          value: 1
        },
        {
          label: _("Week"),
          value: 2
        }
      ];

      this.monthOptions = getOptions(1, 12, _("%s"), [
        _("January"),
        _("February"),
        _("March"),
        _("April"),
        _("May"),
        _("June"),
        _("July"),
        _("August"),
        _("September"),
        _("October"),
        _("November"),
        _("December")
      ]);

      this.orderOptions = getOptions(1, 4, _("%s"), [
        _("First"),
        _("Second"),
        _("Third"),
        _("Fourth")
      ]);
      this.orderOptions.push({
        label: _("Last"),
        value: -1
      });
      this.weekdayOptions = getOptions(0, 6, "%s", [
        _("Sun."),
        _("Mon."),
        _("Tues."),
        _("Wed."),
        _("Thur."),
        _("Fri."),
        _("Sat.")
      ]);
      this.hourOptions = getOptions(0, 23, "%s:00");

      this.timeZoneArr = getEntriesByAttr("timeZone", "SYSTEM");
      this.timeZoneOptions = [];
      this.timeZoneUTCs = {};
      this.timeZoneArr.forEach(({ utc, value, label }) => {
        this.timeZoneOptions.push({
          label,
          value
        });
        this.timeZoneUTCs[value] = utc;
      });

      this.offsetOptions = [
        {
          label: 30,
          value: 30
        },
        {
          label: 45,
          value: 45
        },
        {
          label: 60,
          value: 60
        },
        {
          label: 90,
          value: 90
        },
        {
          label: 120,
          value: 120
        }
      ];
    },
    formatData(res) {
      const ntp = res[0].getParams();
      this.formData.updatePeriod = ntp.updatePeriod;
      this.formData.timeZone = ntp.timeZone;
      this.formData.address = ntp.address;
      this.formData.port = ntp.port;
      this.formData.correctTimeType = ntp.enable ? 2 : 1;

      const { DSTStart, DSTEnd, DSTEnable, offset } = res[1].getParams();
      if (DSTStart.week === 0) {
        this.formData.DSTType = 1;
        this.formData.DSTStartMonthForDate = DSTStart.month;
        this.formData.DSTStartDay = DSTStart.day;
        this.formData.DSTStartTimeForDate = DSTStart.hour;
        this.formData.DSTEndMonthForDate = DSTEnd.month;
        this.formData.DSTEndDay = DSTEnd.day;
        this.formData.DSTEndTimeForDate = DSTEnd.hour;
      } else {
        this.formData.DSTType = 2;
        this.formData.DSTStartMonthForWeek = DSTStart.month;
        this.formData.DSTStartWeek = DSTStart.week;
        this.formData.DSTStartWeekDay = DSTStart.weekDay;
        this.formData.DSTStartTimeForWeek = DSTStart.hour;
        this.formData.DSTEndMonthForWeek = DSTEnd.month;
        this.formData.DSTEndWeek = DSTEnd.week;
        this.formData.DSTEndWeekDay = DSTEnd.weekDay;
        this.formData.DSTEndTimeForWeek = DSTEnd.hour;
      }
      this.formData.DSTEnable = DSTEnable;
      this.formData.offset = offset;

      let time = res[2].getParams();
      this.formData.time = time.time;
      this.timeSeconds = new Date(time.time).getTime();
      this.formData.timeFormat = time.timeFormat;
    },
    async getData() {
      const res = await Promise.all([
        this.$axiosPost(this.getNtpUrl),
        this.$axiosPost(this.getDstUrl),
        this.$axiosPost(this.getTimeUrl)
      ]);

      this.formatData(res);
      this.intervalTime();

      this.oldFormData = { ...this.formData };
      this.syncTime(this.formData.time);
    },
    formatSubmitData() {
      let data = this.formData;
      let dstData = { DSTStart: {}, DSTEnd: {} };
      let res;

      if (data.DSTType == 1) {
        for (const key in dstData) {
          dstData[key] = {
            day: data[`${key}Day`],
            hour: data[`${key}TimeForDate`],
            minute: 0,
            month: data[`${key}MonthForDate`],
            week: 0,
            weekDay: 0,
            year: null
          };
        }
      } else {
        for (const key in dstData) {
          dstData[key] = {
            day: data[`${key}Day`],
            hour: data[`${key}TimeForWeek`],
            minute: 0,
            month: data[`${key}MonthForWeek`],
            week: data[`${key}Week`],
            weekDay: data[`${key}WeekDay`],
            year: null
          };
        }
      }
      res = {
        dst: {
          DSTEnable: data.DSTEnable,
          offset: data.offset,
          ...dstData
        },
        ntp: {
          address: data.address,
          enable: data.correctTimeType === 2,
          port: data.port,
          timeZone: data.timeZone,
          updatePeriod: data.updatePeriod
        },
        time: {
          timeFormat: data.timeFormat,
          time: data.date + " " + data.datetime
        }
      };

      return res;
    },
    async submitData(data) {
      data = this.formatSubmitData(data);
      const res = await Promise.all([
        this.$axiosPost(this.setNtpUrl, data.ntp),
        this.$axiosPost(this.setDstUrl, data.dst),
        this.$axiosPost(this.setTimeUrl, data.time)
      ]);
      if (res[0].getResult() && res[1].getResult() && res[2].getResult()) {
        this.$message.success(_("Saved Successfully"));
        this.getData();
      } else {
        this.$message.error(_("Failed to save"));
      }
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    changeDateMonth(month, dayField) {
      const formData = this.formData;
      if (SMALL_MONTH.includes(month) && formData[dayField] > 30) {
        formData[dayField] = 30;
      } else if (month === 2 && formData[dayField] > 28) {
        formData[dayField] = 28;
      }
    }
  }
};
</script>

<style lang="scss">
.setting-time {
  .gap {
    margin-left: 16px;
  }
  .gap-min {
    margin-left: 8px;
  }

  .lh-32 {
    line-height: 32px;
  }
}
</style>
