<template>
  <div class="poe-power">
    <v-chart-percent
      :height="32"
      :value="usedPercent"
      :show-text="false"
      :padding="8"
      :colors="[mainActiveColor]"
      :back-color="[borderColor]"
      :stroke-width="8"
      type="line"
    ></v-chart-percent>
    <div class="power-tips">
      <div class="power-used">
        <span class="used-rect"></span>
        <span class="used-text">{{ _("Actual Power %sW", [used]) }}</span>
      </div>
      <div class="power-left">
        <span class="left-rect"></span>
        <span class="left-text">{{ _("Remaining Power %sW", [left]) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mainActiveColor, borderColor } from "@/assets/scss/vars.scss";
export default {
  name: "poePower",
  props: {
    left: String,
    used: String
  },
  computed: {
    usedPercent() {
      const total = Number(this.left) + Number(this.used);
      return Number(this.used) / total;
    }
  },
  data() {
    return {
      mainActiveColor,
      borderColor
    };
  }
};
</script>

<style lang="scss">
.poe-power {
  @mixin rect($color: $border-color) {
    display: inline-block;
    margin-right: 8px;
    width: 10px;
    height: 10px;
    background-color: $color;
  }
  padding-bottom: 7px;
  width: 360px;

  .power-tips {
    display: flex;
    margin-top: 4px;
    line-height: 1;
    .power-used {
      .used-rect {
        @include rect($main-active-color);
      }
      .used-text {
        color: $title-color;
      }
    }
    .power-left {
      margin-left: 32px;
      .left-rect {
        @include rect();
      }
      .left-text {
        color: $title-color;
      }
    }
  }
}
</style>
