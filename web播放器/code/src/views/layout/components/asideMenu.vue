<template>
  <div ref="asideMenu" class="aside-menu">
    <v-scroll ref="scroll" :height="scrollHeight">
      <div class="secondary-menu">
        <template v-for="secRoute in secondaryRoutes">
          <!-- 叶节点路由为三级菜单 start -->
          <template v-if="secRoute.children && secRoute.children.length">
            <v-collapse
              v-if="secRoute.meta && !secRoute.meta.hidden"
              :ref="secRoute.name"
              :actived="secRoute.name === currentRoute.matched[2].name"
              @change="() => collapseChange(secRoute.name)"
              :key="secRoute.name"
              @afterLeave="afterChange"
            >
              <template #title>
                <i :class="['menu-icon', secRoute.meta.icon]"></i>
                <span class="menu-title">{{ secRoute.meta.title }}</span>
              </template>
              <div class="tertiary-menu">
                <template v-for="terRoute in secRoute.children">
                  <router-link
                    :to="{ name: terRoute.name }"
                    :key="terRoute.name"
                  >
                    <div
                      v-if="terRoute.meta && !terRoute.meta.hidden"
                      class="menu-item"
                    >
                      {{ terRoute.meta.title }}
                    </div>
                  </router-link>
                </template>
              </div>
            </v-collapse>
          </template>
          <!-- 叶节点路由为三级菜单 end -->

          <!-- 叶节点路由为二级菜单 start -->
          <template v-else>
            <router-link
              :to="{ name: secRoute.name }"
              :key="secRoute.name"
              class="leaf-node-menu"
            >
              <v-collapse v-if="secRoute.meta && !secRoute.meta.hidden">
                <template #title>
                  <i :class="['menu-icon', secRoute.meta.icon]"></i>
                  <span class="menu-title">{{ secRoute.meta.title }}</span>
                </template>
              </v-collapse>
            </router-link>
          </template>
          <!-- 叶节点路由为二级菜单 end -->
        </template>
      </div>
    </v-scroll>
  </div>
</template>

<script>
import { debounce } from "@/utils/common";

export default {
  props: ["menuRoutes", "currentRoute"],
  data() {
    return {
      scrollHeight: 0
    };
  },
  computed: {
    secondaryRoutes() {
      const { name } = this.currentRoute.matched[1],
        primaryRoute = this.menuRoutes.find(route => route.name === name);

      return primaryRoute.children || [];
    }
  },
  mounted() {
    this.setScrollHeight();
    this.setScrollHeight = debounce(this.setScrollHeight, 300);
    window.addEventListener("resize", this.setScrollHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setScrollHeight);
  },
  methods: {
    collapseChange(name) {
      const secondaryRoute = this.currentRoute.matched[2];

      if (secondaryRoute.name === name) {
        this.$refs[name][0].isActive = true;
      } else {
        this.setScrollHeight();
      }
      this.$router.push({ name });
      // setTimeout(()=>{
      // this.$refs.scroll.update();
      // }, 500)
    },
    setScrollHeight() {
      const HEADER_HEIGHT = 64,
        // 顶部导航高度
        ASIDE_MENU_PT = 8; // 侧边导航padding-top
      this.scrollHeight = window.innerHeight - HEADER_HEIGHT - ASIDE_MENU_PT;
      // this.$refs.scroll.update();
    },
    afterChange() {
      this.$refs.scroll.update();
    }
  }
};
</script>

<style lang="scss">
.aside-menu {
  flex: 0 0 256px;
  box-shadow: 0px 4px 4px 0px rgba(0, 21, 41, 0.12);

  .secondary-menu {
    $sec-padding-left: 24px;
    $active-border-left-width: 4px;
    @mixin menu-height {
      height: 56px;
      line-height: 56px;
    }
    @mixin active-menu($padding-left) {
      padding-left: $padding-left - $active-border-left-width;
      color: $main-active-color;
      background-color: lighten($main-active-color, 40%);
      border-left: $active-border-left-width solid $main-active-color;
    }

    padding-top: 8px;
    .menu-icon {
      @include menu-height;
      margin-right: 14px;
      vertical-align: bottom;
      &::before {
        font-size: $font-size-l;
      }
    }
    .menu-title {
      font-weight: 400;
      color: $title-color;
    }
    .is-active {
      .menu-title {
        font-weight: 500;
      }
    }

    .leaf-node-menu {
      .v-collapse__arrow {
        display: none;
      }
      &.router-link-active {
        .v-collapse__header {
          @include active-menu($sec-padding-left);
          .menu-title {
            color: $main-active-color;
          }
        }
      }
    }

    .tertiary-menu {
      $ter-padding-left: 54px;
      .menu-item {
        padding-left: $ter-padding-left;
        height: 48px;
        line-height: 48px;
        color: $info-color;
      }
      .router-link-active {
        .menu-item {
          @include active-menu($ter-padding-left);
        }
      }
    }

    /* 重置v-collapse样式 start */
    .v-collapse {
      border: none;
      & + .v-collapse {
        margin: 0;
      }
      &__header {
        @include menu-height;
        padding: 0 $sec-padding-left;
      }
      &__arrow {
        @include menu-height;
      }
      &__item {
        padding: 0;
        border: none;
        background-color: #fff;
        &__content {
          padding: 0;
        }
      }
      .is-active {
        color: $title-color;
        background-color: #fff;
      }
    }
    /* 重置v-collapse样式 end */
  }
}
</style>
