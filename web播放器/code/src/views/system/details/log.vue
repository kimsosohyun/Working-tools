<template>
  <main-content :title="_('Device Log')" class="device-log">
    <div class="device-log-content">
      <div class="log-form">
        <v-form
          ref="form"
          :model="logForm"
          @submit="
            () => {
              query(logForm.type, logForm.date[0], logForm.date[1]);
            }
          "
        >
          <v-form-item :label="_('Type')" prop="type">
            <v-select
              v-model="logForm.type"
              :options="typeOption"
              :displayOptionsNumber="6"
            ></v-select>
          </v-form-item>
          <v-form-item :label="_('Time')" class="form-date">
            <v-datepicker
              :format="timeFormat"
              :min="minDate"
              :max="maxDate"
              width="376px"
              is-range
              type="datetime"
              v-model="logForm.date"
            ></v-datepicker>
          </v-form-item>
          <v-button class="query-button" type="primary" @click="queryLog">{{
            _("Search")
          }}</v-button>
        </v-form>
      </div>
      <div class="export-button">
        <v-button
          type="primary"
          :disabled="!logTable.length"
          @click="exportLog"
          >{{ _("Export Log") }}</v-button
        >
      </div>
      <div class="log-table">
        <v-table
          :show-page-border="true"
          ref="logTable"
          :data="logTable"
          is-pagination
          is-change-size
          is-input-page
          :is-loading="tableLoading"
        >
          <v-table-col
            type="index"
            :label="_('No.')"
            width="88px"
          ></v-table-col>
          <v-table-col
            prop="time"
            :label="_('Time')"
            width="248px"
          ></v-table-col>
          <v-table-col
            prop="type"
            :label="_('Type')"
            width="176px"
          ></v-table-col>
          <v-table-col
            prop="detail"
            :label="_('Detail')"
            width="560px"
          ></v-table-col>
        </v-table>
      </div>
    </div>
  </main-content>
</template>

<script>
import MainContent from "@/views/layout/components/mainContent";
import { formatDate } from "@/utils/common.js";
import { getValueByKey, getEntriesByAttr } from "@/utils/dicts.js";
export default {
  name: "log",
  data() {
    this.logQueryUrl = "/RPC2:log.query";
    this.downloadLogUrl = "/media_downloadLog.do";
    this.getTimeUrl = "/RPC2:global.getCurrentTime";
    return {
      tableLoading: false,
      startTime: "",
      endTime: "",
      logForm: {
        type: 0,
        date: []
      },
      typeOption: getEntriesByAttr("typeOption", "SYSTEM"),
      logTable: [],
      timeFormat: "YYYY-MM-DD hh:mm:ss",
      minDate: "2000-01-01",
      maxDate: "2037-12-31"
    };
  },
  mounted() {
    this.getTimeFormat();
  },
  methods: {
    getNowDate() {
      const nowDate = new Date(),
        year = nowDate.getFullYear(),
        month =
          nowDate.getMonth() + 1 < 10
            ? "0" + (nowDate.getMonth() + 1)
            : nowDate.getMonth() + 1,
        day =
          nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate(),
        dateStr = year + "-" + month + "-" + day;

      return dateStr;
    },
    queryLog() {
      this.$refs.form.submitForm();
    },
    async query(type, startDate, endDate) {
      this.tableLoading = true;
      if (startDate && endDate) {
        this.startTime = startDate;
        this.endTime = endDate;
      }
      const { startTime, endTime } = this,
        res = await this.$axiosPost(this.logQueryUrl, {
          type,
          startTime,
          endTime
        }),
        result = res.getResult(),
        params = res.getParams();

      if (result) {
        this.tableLoading = false;
        this.logTable = params.items;
        this.$refs.logTable.page = 1;
      }
    },
    exportLog() {
      const begintime = this.startTime.replace(/[^0-9]/gi, ""),
        endtime = this.endTime.replace(/[^0-9]/gi, "");

      window.location =
        this.downloadLogUrl +
        "?&begintime=" +
        begintime +
        "&endtime=" +
        endtime +
        "&type=" +
        this.logForm.type;
    },
    async getTimeFormat() {
      const res = await this.$axiosPost(this.getTimeUrl),
        result = res.getResult(),
        params = res.getParams();

      if (result) {
        this.timeFormat =
          getValueByKey(params.timeFormat, "timeFormat", "CONFIG") +
          " hh:mm:ss";
        this.minDate = formatDate(this.minDate, this.timeFormat);
        this.maxDate = formatDate(this.maxDate, this.timeFormat);

        const nowDate = this.getNowDate(),
          type = 0;

        this.startTime = formatDate(nowDate + " 00:00:00", this.timeFormat);
        this.endTime = formatDate(nowDate + " 23:59:59", this.timeFormat);

        this.logForm.date = [this.startTime, this.endTime];
        this.query(type);
      }
    }
  },
  components: {
    MainContent
  }
};
</script>

<style lang="scss" scoped>
.device-log {
  .device-log-content {
    .v-form-item {
      float: left;
    }
    .form-date {
      margin-left: 24px;
      margin-right: 16px;
    }
    .query-button {
      float: left;
    }
    .log-form {
      display: inline-block;
    }
    .export-button {
      float: right;
    }
  }
}
</style>
