<template>
  <div>
    <w-input v-model="date"></w-input>
    <h2>{{ panelDate | panelHeader }}</h2>
    <ul class="date-list">
      <li
        v-for="(item, index) in dateList"
        :key="index"
        :class="[item.month, { 'day-now': item.value === dateObj.day && dateMatch && item.month == 'now' }]"
        @click="chooseDate(item.value)"
      >
        {{ item.value }}
      </li>
    </ul>
    <w-button @click="pre" type="primary">
      《《
    </w-button>
    <w-button @click="next" type="primary">
      》》
    </w-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: this.formatDate(),
      panelDate: "2022-01"
    };
  },
  filters: {
    panelHeader(val) {
      return val.split("-").join("年") + "月";
    }
  },
  computed: {
    dateMatch() {
      return this.dateObj.month == this.panelDateObj.month && this.dateObj.year == this.panelDateObj.year;
    },
    dateObj() {
      return this.parseDate(this.date);
    },
    panelDateObj() {
      return this.parseDate(this.panelDate);
    },
    dateList() {
      const { year, month } = this.panelDateObj,
        startDay = new Date(year, month, 1).getDay() ? new Date(year, month, 1).getDay() : 7, //星期天为0
        allDay = new Date(year, month + 1, 0).getDate(), //day为0，则获取本月的总共天数，且month+1对应的才是本月的天数
        preAllDay = new Date(year, month, 0).getDate(),
        dateList = [];

      for (let i = 1; i <= 42; i++) {
        const panelDateObj = {};
        if (i < startDay) {
          panelDateObj.month = "pre";
          panelDateObj.value = preAllDay - startDay + 1 + i;
        } else if (i < allDay + startDay) {
          panelDateObj.month = "now";
          panelDateObj.value = i - startDay + 1;
        } else {
          panelDateObj.month = "next";
          panelDateObj.value = i - allDay - startDay + 1;
        }
        dateList.push(panelDateObj);
      }
      return dateList;
    }
  },
  methods: {
    pre() {
      let { year, month } = this.panelDateObj;
      if (month == 0) {
        year -= 1;
        month = 11;
      } else {
        month -= 1;
      }
      this.panelDate = this.formatDate(new Date(year, month), "YYYY-MM");
    },
    next() {
      let { year, month } = this.panelDateObj;
      if (month == 11) {
        year += 1;
        month = 0;
      } else {
        month += 1;
      }
      this.panelDate = this.formatDate(new Date(year, month), "YYYY-MM");
    },
    chooseDate(day) {
      const { year, month } = this.panelDateObj;

      this.date = this.formatDate(new Date(year, month, day));
    },
    //按格式把字符串转为对象
    parseDate(str, fmt) {
      fmt = fmt || "YYYY-MM-DD";
      let obj = { Y: 0, M: 1, D: 0, h: 0, m: 0, s: 0 };
      fmt.replace(/([^YMDhms]*?)(([YMDhms])\3*)([^YMDhms]*?)/g, function(m, $1, $2, $3, $4) {
        str = str.replace(new RegExp($1 + "(\\d{" + $2.length + "})" + $4), function(_m, _$1) {
          obj[$3] = parseInt(_$1, 10);
          return "";
        });
        return "";
      });
      obj.M--; // 月份是从0开始的，所以要减去1
      return {
        year: obj.Y,
        month: obj.M,
        day: obj.D,
        hour: obj.h,
        minute: obj.m,
        second: obj.s
      };
    },
    //按格式把new Date的数据转为字符串
    formatDate(date, fmt) {
      date = date == undefined ? new Date() : date;
      date = typeof date == "number" ? new Date(date) : date;
      fmt = fmt || "YYYY-MM-DD";

      var obj = {
        Y: date.getFullYear(), // 年份，注意必须用getFullYear
        M: date.getMonth() + 1, // 月份，注意是从0-11
        D: date.getDate(), // 日期
        h: date.getHours(), // 24小时制
        m: date.getMinutes(), // 分钟
        s: date.getSeconds() // 秒
      };

      for (var i in obj) {
        fmt = fmt.replace(new RegExp(i + "+", "g"), function(m) {
          var val = obj[i] + "";
          for (var j = 0, len = val.length; j < m.length - len; j++) val = "0" + val;
          return m.length == 1 ? val : val.substring(val.length - m.length);
        });
      }
      return fmt;
    }
  }
};
</script>

<style lang="scss">
.date-list {
  width: 700px;
  li {
    width: 96px;
    height: 96px;
    float: left;
    border: 1px solid black;
    margin: 2px;
    box-sizing: border-box;
    text-align: center;
    line-height: 96px;
  }
}
.pre,
.next {
  color: #d8d8d8;
}
.day-now {
  background: pink;
}
</style>
