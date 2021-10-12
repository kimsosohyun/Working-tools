<template>
  <div class="daybar">
    <label class="daybar-title" :style="{ width: `${titleWidth}px` }">
      {{ title }}
    </label>
    <div
      ref="drag"
      data-tag="bg"
      class="daybar-bg"
      :style="{ width: `${barWidth}px` }"
    >
      <!-- 新增时间段时拖动过程中显示的时间块 -->
      <label
        data-tag="slider"
        :style="getPeriodStyle(start, end)"
        :class="['daybar-drag', eventToType[event]]"
      >
        <!-- 左侧拉伸滑块 -->
        <i class="daybar-drag-slider daybar-slider-left"></i>
        <!-- 右侧拉伸滑块 -->
        <i class="daybar-drag-slider daybar-slider-right"></i>
      </label>
      <label
        @click="click($event, i)"
        v-for="(item, i) in value"
        :key="i"
        :style="getPeriodStyle(item.start, item.end)"
        :class="['daybar-drag', eventToType[item.event]]"
      >
        <!-- 时间快内容，包括tip信息 -->
        <label
          data-tag="drag"
          :data-index="i"
          :class="['daybar-drag-mask', { active: moveIndex === i }]"
        >
          <time-tip>{{ item.startTime }}-{{ item.endTime }}</time-tip>
        </label>
        <!-- 左侧拉伸滑块 -->
        <i
          data-tag="slider"
          class="daybar-drag-slider daybar-slider-left"
          :class="{ active: direction === 'left' }"
          :data-index="i"
          :data-left="true"
        >
        </i>
        <!-- 右侧拉伸滑块 -->
        <i
          data-tag="slider"
          class="daybar-drag-slider daybar-slider-right"
          :class="{ active: direction === 'right' }"
          :data-index="i"
        >
        </i>
      </label>
      <!-- <transition name="fade"> -->
      <time-tip class="active" v-show="sliderIndex >= 0" :style="tipData.style">
        {{ tipData.text }}
      </time-tip>
      <!-- </transition> -->
    </div>
    <slot></slot>
    <!-- 时间调整弹窗 -->
    <time-box
      data-tag="timebox"
      v-model="showBox"
      :events="events"
      :ruleForm="ruleForm"
      :style="timeBoxStyle"
      @change="showBox = $event.data"
      @cancel="deleteItem"
      @submit="submit"
    ></time-box>
  </div>
</template>

<script>
import timeTip from "./timeTip";
import timeBox from "./timeBox";

let DRAG_BAR_WIDTH;
let HOUR_WIDTH;
function positionToTime(num) {
  let hour = Math.floor(num / HOUR_WIDTH);
  let minute = Math.round(((num % HOUR_WIDTH) / HOUR_WIDTH) * 60);
  if (hour === 24) {
    return "24:00";
  }
  return `${hour >= 10 ? hour : "0" + hour}:${
    minute >= 10 ? minute : "0" + minute
  }`;
}

function timeToPosition(time) {
  time = time.split(":");
  let hours = parseInt(time[0] || 0) + parseInt(time[1] || 0) / 60;
  return HOUR_WIDTH * hours;
}

export default {
  data() {
    DRAG_BAR_WIDTH = this.barWidth;
    HOUR_WIDTH = DRAG_BAR_WIDTH / 24;

    return {
      start: 0,
      end: 0,
      direction: "",
      showBox: false,
      moveIndex: -1,
      sliderIndex: -1,
      clickIndex: -1,
      ruleForm: {
        event: 1,
        time: []
      }
    };
  },
  props: {
    title: {
      type: String
    },
    events: {
      type: Array,
      required: true
    },
    event: {
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    barWidth: {
      default: 768,
      type: [Number, String]
    },
    titleWidth: {
      type: [String, Number]
    },
    max: {
      type: Number
    },
    offset: {
      type: Number
    }
  },
  computed: {
    eventToType() {
      let res = {};
      this.events.forEach(event => {
        res[event.value] = event.type;
      });
      return res;
    },
    tipData() {
      let res = { style: {}, text: "" };
      if (this.sliderIndex < 0) {
        return res;
      }
      let item = this.value[this.sliderIndex];
      if (this.direction === "left") {
        res.style.left = `${(item.start / DRAG_BAR_WIDTH) * 100}%`;
        res.text = item.startTime;
      } else {
        res.style.left = `${(item.end / DRAG_BAR_WIDTH) * 100}%`;
        res.text = item.endTime;
      }
      return res;
    },
    timeBoxStyle() {
      if (this.clickIndex === -1 || this.value.length === 0) {
        return { left: "0px" };
      }
      let { value, clickIndex } = this;
      return {
        left: `${(value[clickIndex].end + value[clickIndex].start) / 2 +
          this.offset}px`
      };
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        for (let i = 0; i < val.length; i++) {
          let item = val[i];
          if (item) {
            let start = timeToPosition(item.startTime);
            let end = timeToPosition(item.endTime);
            if (start > end) {
              end = start;
            }
            if (item.start === undefined) {
              this.$set(item, "start", start);
            }
            if (item.end === undefined) {
              this.$set(item, "end", end);
            }
            if (item.event === undefined) {
              this.$set(item, "event", this.event);
            }
          }
        }
        this.clickIndex = -1;
        this.showBox = false;
      }
    }
  },
  methods: {
    // 根据起始结束位置获取时间段样式
    getPeriodStyle(start, end, color) {
      if (start > end) {
        [start, end] = [end, start];
      }

      return {
        right: `${DRAG_BAR_WIDTH - end}px`,
        left: `${start}px`,
        backgroundColor: color
      };
    },
    bindEvent() {
      let $drag = this.$refs.drag;

      $drag.addEventListener("mousedown", this.dragInTimeArea.bind(this));
    },
    // 在时间轴上拖动
    dragInTimeArea(e) {
      e.preventDefault();
      this.isMove = false;
      this.showBox = false;
      let tag = e.target.getAttribute("data-tag");
      switch (tag) {
        // 拖动左右滑块
        case "slider":
          this.dragSliderEvent(e);
          break;
        // 整个时间段拖动
        case "drag":
          this.dragItemEvent(e);
          break;
        // 在时间轴上拖动新建
        case "bg":
          if (this.value.length >= this.max) {
            return;
          }
          this.dragInTimeAreaEvent(e);
          break;
      }
    },
    // 在时间轴上拖动新建，新建可以将左滑块拖动到右滑块的右边，反向同理
    dragInTimeAreaEvent(e) {
      let self = this;
      let targetStart = e.clientX - e.offsetX;
      let start = (this.start = this.end = e.clientX - targetStart);
      let range = this.getSliderRange(this.start);

      function mousemove(e) {
        let end = e.clientX - targetStart;
        // 向右拖动是否在范围内
        if (start < end && (start < range.min || end > range.max)) {
          self.end = range.max;
          return;
        }
        // 向左拖动是否在范围内
        if (start > end && (end < range.min || start > range.max)) {
          self.end = range.min;
          return;
        }
        self.end = end;
      }

      function mouseup() {
        let { start, end, event } = self;
        if (start > end) {
          [start, end] = [end, start];
        }
        if (end - start > 1) {
          self.value.splice(range.index, 0, {
            start,
            startTime: positionToTime(start),
            end,
            endTime: positionToTime(end),
            event
          });
        }
        self.$nextTick(() => {
          self.start = 0;
          self.end = 0;
        });

        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      }
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    },
    // 整个时间段拖动
    dragItemEvent(e) {
      let self = this;
      let start = e.clientX;
      let index = +e.target.getAttribute("data-index");
      let item = self.value[index];
      let oldStart = item.start;
      let oldEnd = item.end;
      let width = oldEnd - oldStart;
      let { min, max } = this.getItemDragRange(index);
      let bodyClass = document.body.className;
      document.body.className = bodyClass + " no-hover";
      this.moveIndex = index;

      function mousemove(e) {
        this.showBox = false;
        let offset = e.clientX - start;
        if (Math.abs(offset) > 2) {
          self.isMove = true;
        }
        item.start = oldStart + offset;
        item.end = oldEnd + offset;
        // 向左拖动
        if (offset < 0) {
          if (item.start < min) {
            item.start = min;
            item.end = min + width;
          }
        } else {
          // 向右拖动
          if (item.end > max) {
            item.start = max - width;
            item.end = max;
          }
        }
        item.startTime = positionToTime(item.start);
        item.endTime = positionToTime(item.end);
      }

      function mouseup(e) {
        e.stopPropagation();

        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        self.moveIndex = -1;

        document.body.className = bodyClass;

        if (index === self.clickIndex) {
          self.setRuleForm();
        }
      }
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    },
    // 拖动左右滑块
    dragSliderEvent(e) {
      let self = this;
      let start = e.clientX;
      let index = +e.target.getAttribute("data-index");
      let isLeft = !!e.target.getAttribute("data-left");
      let targetItem = self.value[index];
      let oldStart = targetItem.start;
      let oldEnd = targetItem.end;
      let min = index > 0 ? this.value[index - 1].end : 0;
      let max =
        index < this.value.length - 1
          ? this.value[index + 1].start
          : DRAG_BAR_WIDTH;
      this.direction = isLeft ? "left" : "right";
      this.sliderIndex = index;
      let bodyClass = document.body.className;
      document.body.className = bodyClass + " no-hover";

      function mousemove(e) {
        this.showBox = false;
        // 数据校验
        let offset = e.clientX - start;
        if (isLeft) {
          offset = oldStart + offset;
          if (offset < min) {
            targetItem.start = min;
          } else if (offset > oldEnd - 1) {
            targetItem.start = oldEnd - 1;
          } else {
            targetItem.start = offset;
          }
        } else {
          offset = oldEnd + offset;
          if (offset < oldStart + 1) {
            targetItem.end = oldStart + 1;
          } else if (offset > max) {
            targetItem.end = max;
          } else {
            targetItem.end = offset;
          }
        }
        targetItem.startTime = positionToTime(targetItem.start);
        targetItem.endTime = positionToTime(targetItem.end);
      }

      function mouseup() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);

        self.direction = "";
        self.sliderIndex = -1;
        document.body.className = bodyClass;

        if (index === self.clickIndex) {
          self.setRuleForm();
        }
      }
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    },
    click(e, index) {
      this.target = e.target;
      if (e.target.getAttribute("data-tag") !== "drag" || this.isMove) {
        return;
      }

      this.target = e.target;
      this.clickIndex = index;
      this.showBox = true;
      this.setRuleForm();
    },
    setRuleForm() {
      if (this.showBox) {
        let index = this.clickIndex;
        this.ruleForm.event = this.value[index].event;
        this.ruleForm.time = [
          this.value[index].startTime,
          this.value[index].endTime
        ];
      }
    },
    deleteItem() {
      this.showBox = false;
      this.value.splice(this.clickIndex, 1);
    },
    submit() {
      let { min, max } = this.getItemDragRange(this.clickIndex);
      let start = this.ruleForm.time[0].split(":");
      start = (parseInt(start[0]) + start[1] / 60) * HOUR_WIDTH;
      let end = this.ruleForm.time[1].split(":");
      end = (parseInt(end[0]) + end[1] / 60) * HOUR_WIDTH;
      if (start < min || end > max) {
        this.$message(
          _(
            "The arming time period cannot overlap with the current time period"
          )
        );
        return;
      }
      let item = this.value[this.clickIndex];
      item.event = this.ruleForm.event;
      item.start = start;
      item.startTime = this.ruleForm.time[0];
      item.end = end;
      item.endTime = this.ruleForm.time[1];
      this.showBox = false;
    },
    // 获取当前时间段可拖动范围
    getItemDragRange(index) {
      return {
        min: index > 0 ? this.value[index - 1].end : 0,
        max:
          index < this.value.length - 1
            ? this.value[index + 1].start
            : DRAG_BAR_WIDTH
      };
    },
    // 获取当前时间段左/右滑块可拖动的范围
    getSliderRange(start) {
      let list = this.value,
        i;

      for (i = 0; i < list.length; i++) {
        let item = list[i];
        if (start > item.start) {
          continue;
        }
        break;
      }
      return {
        index: i,
        min: i > 0 ? list[i - 1].end : 0,
        max: i < list.length ? list[i].start : DRAG_BAR_WIDTH
      };
    }
  },
  components: {
    timeTip,
    timeBox
  },
  mounted() {
    this.bindEvent();
    this._click = e => {
      if (e.target === this.target) {
        return;
      }
      let className = e.target.className;
      if (
        className.indexOf("v-select") > -1 ||
        className.indexOf("v-timepicker") > -1 ||
        className.indexOf("v-scroll__bar") > -1 ||
        className.indexOf("v-button") > -1
      ) {
        return;
      }
      this.showBox = false;
    };
    window.addEventListener("click", this._click);
  },
  beforeDestroy() {
    window.removeEventListener("click", this._click);
  }
};
</script>

<style lang="scss">
.daybar {
  margin-top: 4px;
  display: flex;
  position: relative;
  &-title {
    font-weight: 400;
    color: #262626;
    line-height: 32px;
    text-align: left;
    padding-right: 10px;
  }
  &-bg {
    width: 768px;
    height: 32px;
    background: #f5f5f5;
    border-radius: 2px;
    position: relative;
  }

  .daybar-drag {
    position: absolute;
    top: 0;
    height: 100%;
    border-radius: 2px;
    cursor: move;

    &-slider {
      position: absolute;
      z-index: 1;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.2s, visibility 0.2s;
      cursor: ew-resize;
      width: 3px;
      height: 100%;
      background: transparent;
      left: 0;
      top: 0;
      transform: translate(-50%, 0);
      &.daybar-slider-right {
        left: 100%;
      }

      &:after {
        content: "";
        position: absolute;
        width: 3px;
        height: 16px;
        background: #ffffff;
        box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        border: 0px solid #666666;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
      }
      &.active {
        visibility: visible;
        opacity: 1;
        .timetip-text {
          visibility: visible;
          opacity: 1;
        }
      }
    }

    &:hover {
      .daybar-drag-slider {
        visibility: visible;
        opacity: 1;
      }
    }

    &-mask {
      display: block;
      height: 100%;
      cursor: move;

      &:hover,
      &.active {
        background-color: rgba(255, 255, 255, 0.1);
        .timetip-text {
          visibility: visible;
          opacity: 1;
        }
      }
    }
  }
}

.no-hover .daybar-drag-mask:hover {
  .timetip-text {
    opacity: 0;
  }
}
.no-hover .daybar-drag-mask.active {
  .timetip-text {
    opacity: 1;
  }
}

.timetip-text.active {
  visibility: visible;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
