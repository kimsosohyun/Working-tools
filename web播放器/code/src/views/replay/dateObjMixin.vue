<script>
import {
  parseDateToObj,
  formatDateToString,
  parseDateToNum
} from "@/utils/common";
const dateObj = {
  year: null,
  month: null,
  day: null,
  hour: null,
  minute: null,
  second: null
};
export default {
  name: "dateObjMixin",
  data() {
    return {
      system: {
        ...dateObj
      },
      date: {
        ...dateObj
      },
      search: {
        ...dateObj
      }
    };
  },
  computed: {
    /* 当前回放文件播放时间 */
    year: {
      get() {
        return this.date.year;
      },
      set(val) {
        this.$set(this.date, "year", val);
      }
    },
    month: {
      get() {
        return this.date.month + 1;
      },
      set(val) {
        this.$set(this.date, "month", val);
      }
    },
    currentDay: {
      get() {
        return this.date.day;
      },
      set(val) {
        this.date.day = val;
      }
    },
    currentTime: {
      get() {
        const dateValues = Object.values(this.date);
        const date = new Date(...dateValues);

        return formatDateToString(date, this.timeFormat);
      },
      set(val) {
        this.date = parseDateToObj(val, this.timeFormat);
      }
    },
    currentDate: {
      get() {
        // 初始化，当前日期没设置，返回空
        if (this.date.year === null) return;

        const dateValues = Object.values(this.date);
        const date = new Date(...dateValues);

        return formatDateToString(date);
      },
      set(val) {
        const { year, month, day } = parseDateToObj(val);

        this.date = { ...this.date, year, month, day };
      }
    },
    /* 当前回放文件播放时间 */

    /* 系统时间，用于设置默认值、判断日期跳转临界值 */
    systemTime: {
      get() {
        const systemValues = Object.values(this.system);
        const date = new Date(...systemValues);

        return formatDateToString(date, this.timeFormat);
      },
      set(val) {
        this.system = parseDateToObj(val, this.timeFormat);
      }
    },
    systemDate: {
      get() {
        const dateValues = Object.values(this.system);
        const date = new Date(...dateValues);

        return formatDateToString(date);
      },
      set(val) {
        const { year, month, day } = parseDateToObj(val);

        this.system = { ...this.system, year, month, day };
      }
    },
    systemYear: {
      get() {
        return this.system.year;
      }
    },
    systemMonth: {
      get() {
        return this.system.month + 1;
      }
    },
    /* 系统时间 */

    /* 搜索日期相关，用于显示日期表盘存在回放文件角标 */
    searchDate: {
      get() {
        const searchValues = Object.values(this.search);
        const date = new Date(...searchValues);

        return formatDateToString(date);
      },
      set(val) {
        const obj = parseDateToObj(val);

        this.search = { ...this.search, ...obj };
      }
    },
    searchYear: {
      get() {
        return this.search.year;
      },
      set(val) {
        this.search.year = val;
      }
    },
    searchMonth: {
      get() {
        return this.search.month + 1;
      },
      set(val) {
        this.search.month = val;
      }
    },
    searchDay: {
      get() {
        return this.search.day;
      },
      set(val) {
        this.search.day = val;
      }
    }
    /* 搜索日期相关 */
  },
  methods: {
    /**
     * 获取日期
     * @param {String|Object} date - 日期
     * @param {String} type - 类型，next/prev，获取日期的上/下一天
     */
    getTheDate(date, type = "NEXT") {
      let oneDayTime = 86400000; // 1天毫秒数
      oneDayTime = type === "PREV" ? -oneDayTime : oneDayTime;

      date = parseDateToNum(date);
      date += oneDayTime;
      date = formatDateToString(date);

      return date;
    }
  },
  watch: {
    // date(newVal, { month: oldMonth }) {
    //   if (newVal.month !== oldMonth) {
    //     this.search = { ...newVal };
    //   }
    // }
  }
};
</script>
