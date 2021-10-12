<template>
  <div class="icon-select">
    <v-popups
      ref="popups"
      :show-arrow="false"
      :between-space="popupsSpace"
      custom-class="select-panel"
      :custom-style="{
        boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.2)'
      }"
      :position="position"
      @visible-change="showPanel"
    >
      <template #reference>
        <v-tooltip
          trigger="manual"
          v-model="buttonTooltipShow"
          :between-space="iconSpace"
          :enterable="false"
          :content="selectedOption.title"
        >
          <span
            class="icon-button-status icon-button-wrapper"
            @mouseenter="showBottonTooltip(true)"
            @mouseleave="showBottonTooltip(false)"
          >
            <i :class="[selectedOption.icon]"></i>
            <i v-if="showAfter" class="icon-arrow-down"></i>
          </span>
        </v-tooltip>
      </template>
      <section class="select-panel-inner">
        <template v-for="item in options">
          <i
            :key="item.key"
            :class="['icon-button-status', item.icon]"
            @click="changeOption(item.key)"
            v-tooltip="{
              betweenSpace: innerIconSpace,
              enterable: false,
              content: item.title
            }"
          ></i>
        </template>
      </section>
    </v-popups>
  </div>
</template>

<script>
export default {
  props: {
    customClass: String,
    iconSpace: {
      // 外部icon按钮与tooltip的距离
      type: Number,
      default: 0
    },
    popupsSpace: {
      // 外部icon按钮与popups弹出框选项的距离
      type: Number,
      default: 8
    },
    innerIconSpace: {
      // 内部icon按钮与tooltip的距离
      type: Number,
      default: 2
    },
    value: {},
    position: {
      type: String,
      default: "top-center"
    },
    showAfter: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => [
        // e.g.
        // {
        //   key: "demo",
        //   icon: "icon-demo",
        //   tittle: "tooltip title"
        // }
      ]
    },
    beforeChange: {
      type: Function,
      default: () => () => true
    },
    afterChange: {
      type: Function,
      default: () => () => true
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      selected: "",

      panelShow: false,
      isMouseEnter: false,
      buttonTooltipShow: false
    };
  },
  computed: {
    selectedOption() {
      return this.options.find(({ key }) => key === this.selected) || {};
    }
  },
  created() {
    this.setDefaultValue();
  },
  methods: {
    setDefaultValue() {
      this.selected = this.value || this.options[0].key;
    },
    showPanel(visible) {
      this.panelShow = visible;

      if (visible) {
        this.buttonTooltipShow = !visible;
      } else {
        this.showBottonTooltip(this.isMouseEnter);
      }
    },
    hidePanel() {
      this.$refs.popups.hide();
    },
    showBottonTooltip(show) {
      this.isMouseEnter = show;
      this.buttonTooltipShow = !this.panelShow && show;
    },
    async changeOption(key) {
      const oldVal = this.selected;

      if (key === oldVal) {
        // 值没改变不触发事件
        return this.hidePanel();
      }

      let result = await this.beforeChange(key, oldVal);

      if (result) {
        this.selected = key;
        this.$emit("change", key);

        result = await this.afterChange(key, oldVal);
        result && this.hidePanel();
      }
    }
  },
  watch: {
    value(newVal) {
      this.selected = newVal;
    }
  }
};
</script>

<style lang="scss">
.icon-select {
  display: inline-block;
}

.select-panel {
  &-inner {
    display: flex;
    justify-content: space-between;
    // width: 80px;
    height: 32px;
    line-height: 32px;
    border-radius: 1px;
    .icon-button-status {
      margin: 4px 8px;
      font-size: 24px;
    }
  }
}

.icon-button-wrapper {
  display: inline-flex;
  align-items: center;
}
</style>
