<template>
  <div class="primary-menu">
    <div class="primary-menu-wrapper">
      <div ref="primaryMemuItems" class="primary-menu-items">
        <template v-for="route in menuRoutes">
          <router-link
            ref="refNavItems"
            :to="{ name: route.name }"
            :key="route.name"
          >
            <span
              v-if="route.meta && !route.meta.hidden"
              class="primary-menu-title"
            >
              {{ route.meta.title }}
            </span>
          </router-link>
        </template>
      </div>
      <div
        ref="menuActiveBorder"
        class="menu-active-border menu-active-border--transition"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["menuRoutes", "currentRoute"],
  mounted() {
    this.setActiveBorder();
  },
  methods: {
    /**
     * 设置当前选中的border
     */
    setActiveBorder() {
      // primaryMemuItems: 标签页父级ref
      // menuActiveBorder: 标签页底部border样式，只针对type为'link'
      const { primaryMemuItems, menuActiveBorder, refNavItems } = this.$refs;

      if (refNavItems === undefined) return;

      this.$nextTick(() => {
        const active = refNavItems.find(item =>
            item.$el.className.includes("router-link-active")
          ),
          // document.querySelector(".router-link-active")
          {
            left: activeLeft,
            width: activeWidth
          } = active.$el.getBoundingClientRect(),
          { left: tabNavLeft } = primaryMemuItems.getBoundingClientRect();

        menuActiveBorder.style.width = `${activeWidth}px`;
        menuActiveBorder.style.left = `${activeLeft - tabNavLeft}px`;
      });
    }
  },
  watch: {
    currentRoute() {
      this.setActiveBorder();
    }
  }
};
</script>

<style lang="scss">
.primary-menu {
  width: 100%;
  text-align: center;
  &-wrapper {
    position: relative;
    display: inline-block;
    .primary-menu-title {
      display: inline-block;
      width: 120px;
      height: $header-height;
      line-height: $header-height;
      font-size: 16px;
      font-weight: 400;
      color: $title-color;
      cursor: pointer;
      &:hover {
        color: $main-active-color;
      }
    }
    .router-link-active {
      .primary-menu-title {
        color: $main-active-color;
      }
    }

    .menu-active-border {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 2px;
      background-color: $main-active-color;
      &.menu-active-border--transition {
        transition: all 0.2s ease-out 0.1s;
      }
    }
  }
}
</style>
