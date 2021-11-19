<template>
  <div class="w-tabs">
    <div :class="['tab-nav', { 'tab-nav--disabled': disabled }]">
      <div class="tab-nav_link">
        <span
          v-for="item in navCfgs"
          :key="item.value"
          ref="tabNavItem"
          :class="[
            'tab-nav_item',
            { 'tab-nav_item--active': value === item.value },
            { 'tab-nav_item--disabled': item.disabled }
          ]"
          @click="() => changeValue(item)"
        >
          {{ item.label }}
        </span>
        <!-- <span class="tab-nav_item tab-nav_item--active">标签1</span>
        <span class="tab-nav_item">标签2</span>
        <span class="tab-nav_item">标签3</span> -->
      </div>
      <div class="tab-nav_border" ref="tabNavBorder"></div>
    </div>
    <div class="tab-content" ref="tabContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "w-tabs",
  props: {
    value: String,
    animate: {
      value: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeLeave: {
      type: Function,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      panes: [],
      navCfgs: []
    };
  },
  mounted() {
    this.getPaneInstance();
  },
  methods: {
    getPaneInstance() {
      //过滤掉文本空节点
      const paneSlots = this.$slots.default.filter((item) => {
        return item.componentOptions && item.componentOptions.Ctor.options.name === "w-tab-pane";
      });

      //返回slot子节点Vue实例（this）
      this.panes = paneSlots.map(({ componentInstance }) => componentInstance);

      // this.panes.forEach((item) => {
      //   const { label, disabled, value } = item,
      //     obj = {};

      //   obj.label = label;
      //   obj.disabled = disabled;
      //   obj.value = value;
      //   this.navCfgs.push(obj);
      // });

      //map yyds!!! 看看forEach多傻
      //map 返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
      this.navCfgs = this.panes.map(({ label, disabled, value }) => ({
        label,
        disabled,
        value
      }));

      //待标签dom渲染之后
      if (this.panes.length) {
        this.$nextTick(() => {
          const val = this.value ? this.value : this.navCfgs[0].value;

          if(!this.value) {
            this.$emit("input", val); //没有绑定值，我给他赋值
          }
          this.setBorderStyle();
          if (this.animate) {
            this.setContentStyle(this.val);
          }
        });
      }
    },
    async changeValue(item) {
      if (this.disabled) return;
      if (item.disabled) return;

      const oldActiveValue = this.value,
        activeValue = item.value;

      if (oldActiveValue === activeValue) return;

      const result = await this.beforeLeave(activeValue, oldActiveValue),
        tabVNode = this.panes.find((pane) => pane.value === activeValue);

      if (result === false) return;

      // if (result && result.then) { //返回Promise且被reject，则阻止切换
      //     result.then(
      //       () => {
      //         changeCurrentValue();
      //       },
      //       () => {}
      //     );
      //   }
      this.$emit("input", activeValue);
      this.setBorderStyle();
      if (this.animate) {
        this.setContentStyle(activeValue);
      }
      this.$emit("tab-click", tabVNode);
    },
    setBorderStyle() {
      const navs = this.$refs.tabNavItem,
        border = this.$refs.tabNavBorder;

      //切换后
      this.$nextTick(() => {
        const activeNav = navs.find(({ className }) => className.includes("active"));
        border.style.left = activeNav.offsetLeft + "px";
        border.style.width = activeNav.getBoundingClientRect().width + "px";
      });
    },
    setContentStyle(val) {
      let idx;
      this.navCfgs.forEach((item, index) => {
        if (val === item.value) {
          idx = index;
        }
      });

      const precent = -idx * 100 + "%";
      this.$refs.tabContent.style.transform = "translateX(" + precent + ") translateZ(0px)";
    }
  },
  watch: {
    // navCfgs() {
    // }
  }
};
</script>

<style lang="scss">
.w-tabs {
  overflow: hidden;
}
.tab-nav {
  margin-bottom: 12px;
  position: relative;
  &--disabled {
    .tab-nav_item {
      color: #c0c0c0;
      cursor: not-allowed;
    }
    .tab-nav_border {
      background: rgba(60, 179, 113, 0.4);
    }
    .tab-nav_item:hover {
      color: #c0c0c0;
    }
  }
  &_link {
    display: inline-block;
  }
  &_item {
    cursor: pointer;
    display: inline-block;
    line-height: 22px;
    font-size: 14px;
    padding: 0 16px;
    margin-bottom: 8px;
    position: relative;
    &--active {
      color: $main-active-color;
    }
    &--disabled {
      color: #c0c0c0;
      cursor: not-allowed;
    }
  }
  &_item:hover {
    color: $main-active-color;
  }
  &_item--disabled:hover {
    color: #c0c0c0;
  }
  //伪类无法做切换过渡样式
  // &_item--active::after {
  //   content: "";
  //   position: absolute;
  //   left: 0;
  //   bottom: -7px;
  //   width: 100%;
  //   height: 2px;
  //   background: $main-active-color;
  // }
  &_border {
    position: absolute;
    height: 2px;
    background: $main-active-color;
    bottom: -1px;
    left: 0;
    transition: all 0.2s ease-in-out;
  }
}
.tab-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  transition: 0.3s;
  /* transform: translateX(-100%); */
  transform: translateZ(0);
}
</style>
