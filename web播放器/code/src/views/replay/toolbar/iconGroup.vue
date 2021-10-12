<template>
  <div class="re-icons">
    <!-- 第一期不做 -->
    <template v-if="false">
      <i
        class="re-icons-item icon-button-status icon-slow-forward"
        :class="{ disabled: speed <= 1 }"
        @click="minusSpeed"
      ></i>
      <span class="re-icons-item re-icons-input">
        {{ "X " + speedMap[speed] }}
      </span>
      <i
        class="re-icons-item icon-button-status icon-fast-forward"
        :class="{ disabled: speed >= 7 }"
        @click="addSpeed"
      ></i>
    </template>

    <i
      class="re-icons-item icon-button-status"
      :class="[isReplayed ? 'icon-replay-pause' : 'icon-replay-play']"
      @click="replayHandler"
    ></i>
    <template v-if="false">
      <i
        class="re-icons-item icon-button-status icon-goback30s"
        @click="goBack"
      ></i>
      <i
        class="re-icons-item icon-button-status icon-forward30s"
        @click="goForward"
      ></i>
    </template>
  </div>
</template>

<script>
let speedMap = {
  1: "1/8",
  2: "1/4",
  3: "1/2",
  4: "1",
  5: "2",
  6: "4",
  7: "8"
};
export default {
  props: {
    isReplayed: Boolean,
    playSpeed: Number
  },
  data() {
    return {
      speedMap,
      speed: 4
    };
  },
  methods: {
    minusSpeed() {
      if (this.speed <= 1) {
        return;
      }
      this.speed--;
    },
    addSpeed() {
      if (this.speed >= 7) {
        return;
      }
      this.speed++;
    },
    //播放或暂停
    replayHandler() {
      this.$emit("click");
    },
    //回退
    goBack() {
      this.$emit("control-replay", { control: "back" });
    },
    //前进
    goForward() {
      this.$emit("control-replay", { control: "forward" });
    }
  },
  watch: {
    //速度修改
    speed(val) {
      this.$emit("control-replay", { control: "speed", num: val });
    },
    playSpeed(val) {
      this.speed = val;
    }
  }
};
</script>

<style lang="scss">
.re-icons {
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  &-item {
    display: inline-block;
    // margin-left: 16px;
  }
  &-input {
    border-radius: 1px;
    font-size: 12px;
    padding: 4px 0;
    width: 48px;
    text-align: center;
    border: 1px solid $border-color;
  }
}
</style>
