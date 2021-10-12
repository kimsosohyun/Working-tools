<template>
  <div class="time-bar">
    <div class="time-bar-tooltip">
      <span class="time-bar-text">{{ timeText }}</span>
      <div class="time-bar-time icon-arrow-down">
        <div
          class="time-bar-time-line"
          :style="{ height: rurlerHeight + 6 + 'px' }"
        ></div>
      </div>
    </div>
    <svg
      class="time-bar-svg"
      @mousedown="mousedown"
      @wheel="mousewheel"
      :width="`${barWidth + offsetX * 2}px`"
      :height="rurlerHeight"
      xmlns="http://www.w3.org/2000/svg"
    >
      <template v-for="(item, index) in textList">
        <!-- 时间点  在时间线范围内时-->
        <template v-if="isRangeLine(item.x)">
          <path
            :key="index"
            :d="getPointer(item.x - 1)"
            stroke="#565656"
            stroke-width="3px"
          ></path>
          <!-- 时间文字 -->
          <text
            font-size="12"
            fill="#565656"
            text-anchor="middle"
            :key="index + 'text'"
            :x="item.x + leftX"
            :y="pointerY + 12"
          >
            {{ item.text }}
          </text>
        </template>
      </template>
      <!-- 时间线 -->
      <TimeLine
        v-for="(item, index) in channelList"
        :key="'' + item + index + 'time'"
        :channel-name="item"
        :current-time="time"
        :time-format="timeFormat"
        :video-list="videoList[item] || []"
        :hours="hours"
        :per-second-px="perSecondPx"
        :x="offsetX"
        :y="pointerY + 20 + index * 12"
        :width="barWidth"
      />
      <TimeLine
        :current-time="time"
        channel-name=""
        v-if="editIndex > -1"
        :time-format="timeFormat"
        :video-list="cutTimeList || []"
        :bg-path="false"
        :hours="hours"
        :per-second-px="perSecondPx"
        :x="offsetX"
        :y="getActiveY()"
        :width="barWidth"
      />
    </svg>
  </div>
</template>

<script>
import TimeLine from "./timeLine";
import {
  getTime,
  formatDateToString,
  parseDateToNum,
  formatDate
} from "@/utils/common.js";
export default {
  components: {
    TimeLine
  },
  inject: ["timeFormat"],
  props: {
    activeChannel: [String, Array, Number],
    activeValue: [String, Number],
    hours: {
      type: Number,
      default: 24
    },
    options: Array,
    barWidth: Number,
    //时间数组
    videoList: {
      type: Object,
      default() {
        return {};
      }
    },
    cutTimeList: Array,
    currentTime: String,
    dateFormat: String
  },
  computed: {
    editIndex() {
      let index = this.channelList.indexOf(this.activeValue);
      return index;
    },
    rurlerHeight() {
      return this.pointerY + 12 + this.channelList.length * 12;
    },
    channelList() {
      const list = [].concat(this.activeChannel),
        repeatArr = ["", "", "", ""];

      let len = list.length || 1;
      len = len > 1 ? 4 : len;
      list.push(...repeatArr);

      return list.slice(0, len);
    },
    hourTypes() {
      // [1, 6, 12, 24]
      return this.options.map(({ value }) => value).reverse();
    },
    leftX() {
      //计算偏移量
      let timeNum = getTime(this.time.split(" ")[1]),
        centerTime = this.timeList[~~(this.timeList.length / 2)],
        centerTimeNum = getTime("" + centerTime);
      return ~~((centerTimeNum - timeNum) * this.perSecondPx);
    },
    // 时间点列表
    timeList() {
      return this.getTimeList();
    },
    perDistance() {
      return this.barWidth / (this.timeList.length - 1);
    },
    textList() {
      let list = [];
      let len = this.timeList.length;

      for (let i = 0; i < len; i++) {
        list.push({
          x: this.offsetX + ~~(this.perDistance * i),
          text: this.timeList[i]
        });
      }
      return list;
    },
    perSecondPx() {
      let timeNum = this.hours * 60 * 60;
      return this.barWidth / timeNum;
    },
    timeText() {
      const hmsStr = this.timeFormat.split(" ")[1];
      return formatDate(this.time, `${this.dateFormat} ${hmsStr}`);
    }
  },
  data() {
    return {
      pointerY: 4,
      offsetX: 30,
      timer: null,
      startX: 0,
      moveX: 0,
      time: this.currentTime,
      mousedownTime: "", // 记录mousedown触发时this.currentTime的值
      mousedownTimestamp: "", // 记录按住鼠标的时间戳(new Date())
      isDragging: false
    };
  },
  methods: {
    getActiveY() {
      return this.pointerY + 20 + this.editIndex * 12;
    },
    getTimeList() {
      let time = this.time.split(" ")[1],
        currentHour = +time.split(":")[0],
        list = [],
        hour = "",
        minute = "";

      //24小时 分24格
      if (this.hours === 24) {
        minute = "00";
        for (let i = 0; i <= 24; i++) {
          hour = this.paddingHourZero(i, currentHour);
          list.push(`${hour}:${minute}`);
        }
      } else if (this.hours === 12) {
        //12小时 分12格
        minute = "00";
        for (let i = 0; i <= 12; i++) {
          hour = this.paddingHourZero(i, currentHour);
          list.push(`${hour}:${minute}`);
        }
      } else if (this.hours === 6) {
        //6小时分12格
        let index = +time.split(":")[1] > 0 ? 1 : 0;
        for (let i = 0; i <= 12; i++) {
          hour = this.paddingHourZero(~~((index + i) / 2), currentHour);
          minute = (index + i) % 2 === 0 ? "00" : "30";
          list.push(`${hour}:${minute}`);
        }
      } else if (this.hours === 1) {
        //1小时分 12格  每格5分钟
        let currentMinute = +time.split(":")[1];
        let index = Math.ceil(currentMinute / 5);

        for (let i = 0; i <= 12; i++) {
          minute = (index - 6 + i) * 5;
          if (minute < 0) {
            //小于 0 时
            if (currentHour === 0) {
              hour = 23;
            } else {
              hour = currentHour - 1;
            }
            minute += 60;
          } else if (minute >= 60) {
            //大于60时
            if (currentHour == 23) {
              hour = 0;
            } else {
              hour = currentHour + 1;
            }
            minute -= 60;
          } else {
            hour = currentHour;
          }

          hour = this.paddingZero(hour);
          minute = this.paddingZero(minute);
          list.push(`${hour}:${minute}`);
        }
      }
      return list;
    },
    //时间点是否在时间轴上
    isRangeLine(x) {
      return (
        x + this.leftX >= this.offsetX - 2 &&
        x + this.leftX <= this.offsetX + this.barWidth + 2
      );
    },
    //处理小时，返回小时
    paddingHourZero(index, hour) {
      return (((index + hour - this.hours / 2 + 24) % 24) + 100 + "").slice(-2);
    },
    paddingZero(index) {
      return (index + 100 + "").slice(-2);
    },
    getPointer(x) {
      return `M ${x + this.leftX} ${this.pointerY} L ${x + 2 + this.leftX} ${
        this.pointerY
      }`;
    },
    setPerCondPx(val) {
      this.perSecondPx = val;
    },
    mousedown(event) {
      this.moveX = 0;
      this.startX = event.clientX;
      this.isDragging = true;
      this.mousedownTime = this.currentTime;
      this.mousedownTimestamp = new Date().getTime();
      document.body.classList.add("no-select");
      window.addEventListener("mousemove", this.mousemove);
      window.addEventListener("mouseup", this.mouseup);
    },
    mousemove(event) {
      let moveX = this.startX - event.clientX;
      this.moveX = moveX;
      let moveTime = ~~((moveX / this.perSecondPx) * 1000);
      let timeNum = parseDateToNum(this.time, this.timeFormat);
      let endTime = timeNum + moveTime;
      this.time = formatDateToString(new Date(endTime), this.timeFormat);
      this.startX = event.clientX;
    },
    mouseup() {
      this.isDragging = false;
      document.body.classList.remove("no-select");
      window.removeEventListener("mousemove", this.mousemove);
      window.removeEventListener("mouseup", this.mouseup);
      //误差时间
      const mousedownTime = parseDateToNum(this.mousedownTime, this.timeFormat),
        mouseupTime = parseDateToNum(this.time, this.timeFormat),
        dropTimestamp = new Date().getTime(),
        timeError = 1000,
        timestampError = 100;
      if (
        dropTimestamp - this.mousedownTimestamp >
          timestampError /* 按住鼠标时间 >100ms，认定为拖拽事件(执行)，否则为点击事件(不执行) */ ||
        mouseupTime - mousedownTime >
          timeError /* 鼠标拖拽的距离对应的时间 >1s */
      ) {
        this.$emit("move", this.time);
      }
    },
    mousewheel(e) {
      const hourTypes = this.hourTypes,
        len = hourTypes.length;

      let curHours = this.hours,
        newHours = curHours;

      const idx = hourTypes.findIndex(hourType => hourType === curHours);
      if (e.wheelDelta > 0) {
        //当滑轮向上滚动时
        if (curHours !== hourTypes[0]) {
          // 当前时间颗粒度不是最小值即1时，则降低一个颗粒度
          newHours = hourTypes[idx - 1];
        }
      } else {
        //当滑轮向下滚动时
        if (curHours !== hourTypes[len - 1]) {
          // 当前时间颗粒度不是最大值即24时，则提高一个颗粒度
          newHours = hourTypes[idx + 1];
        }
      }
      this.$emit("change-type", newHours);
    }
  },
  watch: {
    currentTime(newVal) {
      if (!this.isDragging) {
        this.time = newVal;
      }
    }
  }
};
</script>

<style lang="scss">
.time-bar {
  position: relative;
  overflow: hidden;
  text-align: center;
  &-tooltip {
    text-align: center;
    color: $main-active-color;
    font-size: 12px;
  }
  &-text {
    display: inline-block;
    height: 16px;
  }
  .time-bar-time {
    position: absolute;
    left: 50%;
    top: 8px;
    transform: translateX(-50%);
    font-size: 16px;
    color: $main-active-color;
    &-line {
      position: absolute;
      left: 50%;
      top: 8px;
      height: 40px;
      z-index: 5;
      width: 2px;
      margin-left: -1px;
      transform: scaleX(0.5);
      border: 1px solid $main-active-color;
    }
  }
  &-svg {
    cursor: move;
    margin: 3px 0;
  }
}
</style>
