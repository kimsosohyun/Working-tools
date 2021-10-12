<template>
  <div class="home" v-if="isInited" :class="{ 'camera-home': isCamera }">
    <section class="header">
      <div class="logo icon-logo"></div>
      <Menu :menu-routes="menuRoutes" :current-route="currentRoute" />
      <div class="user-info">
        <!-- <div class="local-album">
          <span class="local-album-text">本地相册</span>
        </div> -->
        <div class="user-actions">
          <v-dropdown
            ref="dropdown"
            class="dropdown-item"
            panel-class="logout-panel"
            :label="username"
            :options="logoutOption"
            @click-item="showDialog"
          ></v-dropdown>
        </div>
      </div>
    </section>
    <section class="main">
      <asideMenu
        v-if="hasSecondary"
        :menu-routes="menuRoutes"
        :current-route="currentRoute"
      />
      <div :class="['main-content', { 'blow-secondary': hasSecondary }]">
        <router-view v-if="hasSecondary" class="sub-page"></router-view>
        <router-view v-else></router-view>
      </div>
    </section>
    <!-- 退出登录 -->
    <v-dialog
      v-model="showLogout"
      :title="_('Log out')"
      :width="400"
      @confirm="setLogout"
    >
      <div>
        <span>{{ _("Do you want to log out?") }}</span>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Menu from "@/views/layout/components/menu";
import asideMenu from "@/views/layout/components/asideMenu";
import router from "@/router";

/*
 * todo: asideMenu及其对用内容的滚动
 */

export default {
  name: "Home",
  components: {
    Menu,
    asideMenu
  },
  data() {
    return {
      logoutUrl: "/RPC2:global.logout",
      userInfoUrl: "/RPC2:userManager.getUserInfo",
      keepAliveUrl: "/RPC2:global.keepAlive",
      isInited: false,
      showLogout: false,
      queryTimer: null,
      countDownTimer: null,
      logoutOption: [
        {
          text: _("Log out"),
          value: "logout",
          icon: "icon-exit"
        }
      ],
      timeoutStatus: false
    };
  },
  created() {
    if (!this.queryTimer) {
      //每隔30s查询一次是否超时
      this.queryTimer = setInterval(() => {
        this.queryTimeout();
      }, 30000);
    }
    this.bindVisibilityChange();
    this.initData();
  },
  computed: {
    ...mapState({
      menuRoutes: "menuRoutes",
      currentRoute: "currentRoute",
      username: "username"
    }),
    //camera表格超出1440最小宽度
    isCamera() {
      return this.currentRoute.name === "Camera";
    },
    // 是否有二级菜单
    hasSecondary() {
      return this.currentRoute.matched.length >= 3;
    }
  },
  methods: {
    ...mapMutations(["setCapability", "setUsername", "setAuthorityList"]),
    // 获取初始化数据
    async initData() {
      await this.getUserInfo();
      await this.getCapability();

      // 用户权限、NVR能力获取成功后才能渲染home页面
      this.isInited = true;
    },
    // 获取NVR能力，同其他产品的“宏”功能
    async getCapability() {
      let capability = await this.$axiosPost(
        "/RPC2:magicBox.getProductDefinition",
        { name: "All" }
      );

      capability = capability.getParams();
      this.setCapability(capability);
    },
    showDialog() {
      this.showLogout = true;
    },
    async setLogout() {
      const { username } = this,
        res = await this.$axiosPost(this.logoutUrl, {
          username
        }),
        { result } = res.data;

      if (result) {
        window.location.href = "/login.html";
      } else {
        this.$message.error(_("Failed to log out"));
      }
    },
    async getUserInfo() {
      const res = await this.$axiosPost(this.userInfoUrl),
        param = res.getParams(),
        result = res.getResult();

      if (result) {
        this.setUsername(param.username);
        this.setAuthorityList(param.authorityList);

        const firstRouteName = this.$route.matched[1].name,
          { remote } = param.authorityList;

        //请求的链接没有权限则跳转到预览界面

        //首次请求页面不会进入路由守卫
        if (
          (firstRouteName === "System" &&
            remote.indexOf("RemoteSysMgt") === -1) ||
          (firstRouteName === "Configuration" &&
            remote.indexOf("RemoteConf") === -1)
        ) {
          this.$router.replace("/");
        }
        router.beforeEach((to, from, next) => {
          const firstRouteName = to.matched[1].name;
          if (
            (firstRouteName === "System" &&
              remote.indexOf("RemoteSysMgt") === -1) ||
            (firstRouteName === "Configuration" &&
              remote.indexOf("RemoteConf") === -1)
          ) {
            next({
              path: "/"
            });
          } else {
            next();
          }
        });
      }
    },
    async queryTimeout() {
      const res = await this.$axiosPost(this.keepAliveUrl),
        result = res.getResult();

      if (result === false) {
        //防止设备重启，接口返回为空时也判断为超时
        //超时
        const hiddenProperty =
          "hidden" in document
            ? "hidden"
            : "webkitHidden" in document
            ? "webkitHidden"
            : "mozHidden" in document
            ? "mozHidden"
            : null;

        if (!document[hiddenProperty]) {
          this.delayToLogin();
        }
        this.timeoutStatus = true;
        clearInterval(this.queryTimer);
        this.queryTimer = null;
      }
    },
    //超时后延迟3s跳转到登录
    delayToLogin() {
      if (this.countDownTimer) {
        return;
      }
      let num = 3; //超时后倒计时跳到登录定时器
      const timeout = this.$dialog.timeout(
        _("Login timeout, redirect to the login page after %ss", [num])
      );

      this.countDownTimer = setInterval(() => {
        num--;
        if (num === 0) {
          clearInterval(this.countDownTimer);
          this.countDownTimer = null;
          timeout && timeout.hide();
          window.location = "/login.html";
        }
        timeout.text = _(
          "Login timeout, redirect to the login page after %ss",
          [num]
        );
      }, 1000);
    },
    //当页面处于激活状态时才显示倒计时弹窗
    bindVisibilityChange() {
      const vm = this,
        hiddenProperty =
          "hidden" in document
            ? "hidden"
            : "webkitHidden" in document
            ? "webkitHidden"
            : "mozHidden" in document
            ? "mozHidden"
            : null,
        // 不同浏览器的事件名
        visibilityChangeEvent = hiddenProperty.replace(
          /hidden/i,
          "visibilitychange"
        ),
        onVisibilityChange = function() {
          if (!document[hiddenProperty] && vm.timeoutStatus) {
            vm.delayToLogin();
          }
        };
      document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/scss/home";
</style>
