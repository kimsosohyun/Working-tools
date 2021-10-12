<template>
  <svg>
    <!-- 灰色线 -->
    <text font-size="12" fill="#565656" dominant-baseline="middle" x="0" :y="y">
      {{ channelName === "" ? "" : "D" + (channelName + 1) }}
    </text>
    <path
      v-if="bgPath"
      :d="'M' + x + ' ' + y + ' L' + (x + width) + ' ' + y"
      stroke="#e9e9e9"
      stroke-width="6px"
      fill="none"
    ></path>
    <!-- 颜色线 -->
    <path
      v-for="(point, index) in timeList"
      :key="index"
      :opacity="bgPath ? 1 : 0.5"
      :d="getPath(point)"
      :stroke="getStrokeColor(point)"
      stroke-width="6px"
      fill="none"
    ></path>
  </svg>
</template>

<script>
import { getTime, parseDateToNum } from "@/utils/common.js";
export default {
  props: {
    x: Number,
    y: Number,
    width: Number, //总长度
    currentTime: String,
    timeFormat: String,
    perSecondPx: Number,
    hours: Number,
    bgPath: {
      type: Boolean,
      default: true
    },
    channelName: [String, Number],
    videoList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    startTimeNum() {
      //当前时间戳
      let perPxSecond = 1 / this.perSecondPx;
      let timeNum = parseDateToNum(this.currentTime, this.timeFormat) / 1000;
      //每隔1px 移动一次
      timeNum = ~~(~~(timeNum / perPxSecond) * perPxSecond);
      let halfTimeNum = getTime("" + this.hours / 2);
      return timeNum - halfTimeNum;
    },
    endTimeNum() {
      //当前时间戳
      let perPxSecond = 1 / this.perSecondPx;
      let timeNum = parseDateToNum(this.currentTime, this.timeFormat) / 1000;
      //每隔1px 移动一次
      timeNum = ~~(~~(timeNum / perPxSecond) * perPxSecond);
      let halfTimeNum = getTime("" + this.hours / 2);
      return timeNum + halfTimeNum;
    },
    timeList() {
      let list = [];
      this.videoList.forEach(item => {
        //时间切片
        let startNum = +item.startTime,
          endNum = +item.stopTime;

        //时间小于最小时间时
        if (startNum < this.startTimeNum) {
          startNum = this.startTimeNum;
        }
        //时间大于最大时间时取最大时间
        if (endNum > this.endTimeNum) {
          endNum = this.endTimeNum;
        }

        //时间组开始小于结束时
        if (startNum < endNum) {
          //起始坐标  开始时间 - 时间线的起始时间 * 每秒的px数
          let x1 = ~~((startNum - this.startTimeNum) * this.perSecondPx);
          //结束坐标
          let x2 = ~~((endNum - this.startTimeNum) * this.perSecondPx);

          if (x1 < x2) {
            list.push({
              recordType: item.recordType,
              x1: this.x + x1,
              x2: this.x + x2
            });
          }
        }
      });

      return list;
    }
  },
  data() {
    return {};
  },
  methods: {
    getPath(point) {
      return `M ${point.x1} ${this.y} L${point.x2} ${this.y}`;
    },
    getStrokeColor(point) {
      let colorObj = {
        0: "#17cc82",
        1: "#fe0000",
        2: "#c6c6c6",
        5: "#FF801F"
      };
      return colorObj[point.recordType] || colorObj[2];
    }
  }
};
</script>
