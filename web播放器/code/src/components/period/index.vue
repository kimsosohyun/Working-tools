<template>
  <section class="period">
    <!-- 事件栏和小时刻度轴部分 -->
    <div
      class="period-head"
      :style="{ paddingLeft: `${titleWidth - offsetX + 1}px` }"
    >
      <!-- 事件按钮列表 -->
      <div :style="{ width: `${barWidth + offsetX}px` }">
        <div class="period-btnbar-left" v-if="showEvent">
          <v-button
            :class="[
              'period-btn',
              item.type,
              item.value === event ? 'active' : ''
            ]"
            v-for="item in events"
            :key="item.value"
            type="info"
            size="M"
            @click="event = item.value"
          >
            <!-- <i class="icon icon-menu-alarm"></i> -->
            <i class="icon icon-dot"></i>
            <label class="text">{{ item.label }}</label>
          </v-button>
        </div>
        <div class="period-btnbar-right">
          <slot></slot>
        </div>
      </div>
      <!-- 24小时刻度轴 -->
      <svg
        ref="ruler"
        :width="`${barWidth + offsetX * 2 + 4}px`"
        :height="rulerHeight"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    </div>
    <!-- 时间段绘制区域 -->
    <div class="period-body">
      <!-- 每天时间段绘制区域 -->
      <day-bar
        v-for="day in weekday"
        :key="day.value"
        :title="day.label"
        :events="events"
        :offset="titleWidth"
        :event="event"
        :value="times[day.value]"
        :titleWidth="titleWidth"
        :barWidth="barWidth + 2"
        :max="max"
      >
        <!-- copy按钮 -->
        <i
          v-show="times[day.value] && times[day.value].length > 0"
          class="period-copy icon-sync"
          @click="clickCopy($event, day.value)"
        ></i>
      </day-bar>
    </div>
    <!-- 底部按钮栏 -->
    <div
      class="period-tool"
      :style="{
        width: `${titleWidth + barWidth}px`,
        paddingLeft: `${titleWidth}px`
      }"
    >
      <slot name="tool"></slot>
      <v-button
        type="info"
        class="period-tool-btn-right"
        size="S"
        @click="clear"
        >{{ _("Clear All") }}</v-button
      >
    </div>

    <copy-box
      v-model="showCopy"
      :ruleForm="ruleForm"
      :disabled="selected"
      @cancel="cancel"
      @submit="submit"
      @change="showCopy = $event.data"
      :style="{ left: `${copyStyle.left}px`, top: `${copyStyle.top}px` }"
    ></copy-box>
  </section>
</template>

<script>
import dayBar from "./dayBar.vue";
import copyBox from "./copyBox.vue";
import VButton from "../../plugins/reasy-ui-src/components/button/v-button.vue";

const DEFAULT_EVENT = 0;
export default {
  data() {
    // 偏移量，保证24小时轴中的文字显示完全
    this.offsetX = 4;
    this.rulerHeight = 40;
    this.weekday = [
      {
        label: _("Mon."),
        value: 0
      },
      {
        label: _("Tues."),
        value: 1
      },
      {
        label: _("Wed."),
        value: 2
      },
      {
        label: _("Thur."),
        value: 3
      },
      {
        label: _("Fri."),
        value: 4
      },
      {
        label: _("Sat."),
        value: 5
      },
      {
        label: _("Sun."),
        value: 6
      }
    ];

    return {
      event: this.events.length > 0 ? this.events[0].value || 0 : DEFAULT_EVENT,
      showCopy: false,
      selected: -1,
      ruleForm: {
        weekday: []
      },
      copyStyle: {
        left: 0,
        top: 0
      }
    };
  },
  props: {
    // 事件类型，不同事件对应不同颜色
    events: {
      type: Array,
      default() {
        return [{ label: "", type: "default", value: DEFAULT_EVENT }];
      }
    },
    // 选择的时间段
    value: {
      type: Array
    },
    titleWidth: {
      default: 54,
      type: [Number, String]
    },
    barWidth: {
      default: 768,
      type: [Number, String]
    },
    // 显示事件按钮
    showEvent: {
      default: true,
      type: Boolean
    },
    max: {
      default: 8,
      type: Number
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  computed: {
    times: {
      get() {
        let value = this.value.slice();
        if (value.length < 7) {
          for (let i = this.value.length; i < 7; i++) {
            value.push([]);
          }
          this.$emit("change", value);
        }
        return value;
      }
    }
  },
  components: {
    dayBar,
    copyBox,
    VButton
  },
  methods: {
    // 绘制24小时刻度
    renderRuler() {
      let rulerPath = "";
      let numPath = '<text font-size="12" fill="#565656" text-anchor="middle">';
      let offset = 4;
      //图像长度为768 = 24*8*4 可以取整
      let perDistance = this.barWidth / 24 / 8;
      // 长刻度Y轴起始位置
      let LongStartY = this.rulerHeight - 8;
      // 短刻度Y轴起始位置
      let shortStartY = this.rulerHeight - 4;
      for (let i = 0; i < 24; i++) {
        numPath += `<tspan x="${offset}" y="24">${i}</tspan>`;
        for (let j = 0; j < 8; j++) {
          if (j % 8 === 0) {
            rulerPath += `M${offset} ${LongStartY} L${offset} ${this.rulerHeight} `;
          } else if (j % 4 === 0) {
            rulerPath += `M${offset} ${LongStartY + 2} L${offset} ${
              this.rulerHeight
            } `;
          } else {
            rulerPath += `M${offset} ${shortStartY} L${offset} ${this.rulerHeight} `;
          }
          offset += perDistance;
        }
      }
      rulerPath += `M${offset} ${LongStartY} L${offset} ${this.rulerHeight} `;
      numPath += `<tspan x="${offset}" y="24">24</tspan>`;

      numPath += "</text>";
      this.$refs.ruler.innerHTML =
        numPath +
        `<path d="${rulerPath}" shape-rendering="crispEdges" stroke="#d9d9d9" stroke-width="1" fill="none" ></path>`;
    },
    clickCopy(e, i) {
      this.showCopy = true;
      this.copyStyle.left = e.target.offsetLeft;
      this.copyStyle.top = e.target.offsetParent.offsetTop;

      this.selected = i;
      this.ruleForm.weekday.splice(0);
      this.ruleForm.weekday.push(i);
    },
    cancel() {
      this.showCopy = false;
      this.selected = -1;
    },
    submit() {
      if (this.ruleForm.weekday.length > 1) {
        this.ruleForm.weekday.forEach(day => {
          if (day === this.selected) {
            return true;
          }
          this.value.splice(day, 1, this.copyData(this.value[this.selected]));
        });
      }
      this.showCopy = false;
    },
    copyData(array) {
      let res = [];
      array.forEach(item => {
        let { start, end, startTime, endTime, event } = item;
        res.push({
          start,
          startTime,
          end,
          endTime,
          event
        });
      });
      return res;
    },
    clear() {
      this.value.forEach(value => {
        value.splice(0);
      });
    },
    getData() {}
  },
  mounted() {
    this.renderRuler();
  }
};
</script>

<style lang="scss">
$colors: (
  primary: #17cc82,
  success: #ace06f,
  warning: #ffcd58,
  danger: #f7421e,
  default: #ff801f
);

.period {
  position: relative;
}

.period-btn {
  line-height: 0;
  cursor: pointer;
  .icon {
    font-size: 16px;
    vertical-align: middle;
    margin-right: 6px;
    cursor: pointer;
    &.icon-dot {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 50%;
    }
  }
  .text {
    vertical-align: middle;
    cursor: pointer;
    font-size: 14px;
  }
  @each $type, $color in $colors {
    &.#{$type} {
      .icon {
        background-color: $color;
      }
      &.active,
      &:hover {
        .icon {
          background-color: #fff;
        }
        background-color: $color;
        border-color: $color;
        color: #fff;
      }
    }
  }
}

.period-body {
  margin-top: 2px;
  @each $type, $color in $colors {
    .#{$type} {
      background-color: $color;
    }
  }

  .period-copy {
    line-height: 32px;
    padding: 0 8px;
    color: #ff801f;
    font-size: 16px;
    cursor: pointer;
  }
}

.period-btnbar-left {
  float: left;
}
.period-btnbar-right {
  text-align: right;
}

.period-tool {
  padding: 8px 0;
  .period-tool-btn-right {
    float: right;
  }
}
</style>
