import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "../views/layout/home.vue";

// 连续重复访问相同路由内部捕获错误，console页不报错
const prototypeReplace = VueRouter.prototype.replace;
const prototypePush = VueRouter.prototype.push;
VueRouter.prototype.replace = function replace(location) {
  return prototypeReplace.call(this, location).catch(err => err);
};
VueRouter.prototype.push = function push(location) {
  return prototypePush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

// 中间路由组件
const Menu = {
  render(h) {
    return h("router-view");
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: "/preview",
    children: [
      {
        path: "preview",
        name: "Preview",
        meta: {
          title: _("Live View"),
          hidden: false,
          icon: ""
        },
        component: () => import("../views/preview/index")
      },
      {
        path: "replay",
        name: "Replay",
        meta: {
          title: _("Playback"),
          hidden: false,
          icon: ""
        },
        component: () => import("../views/replay/index")
      },
      {
        path: "configuration",
        name: "Configuration",
        meta: {
          title: _("Configuration"),
          hidden: false,
          icon: ""
        },
        component: Menu,
        redirect: "/configuration/channel",
        children: [
          {
            path: "channel",
            name: "Channel",
            meta: {
              title: _("Channel"),
              hidden: false,
              icon: "icon-menu-channel"
            },
            component: Menu,
            redirect: "/configuration/channel/camera",
            children: [
              {
                path: "camera",
                name: "Camera",
                meta: {
                  title: _("Camera"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import("../views/configuration/channel/camera/camera")
              },
              {
                path: "osd",
                name: "Osd",
                meta: {
                  title: _("OSD"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/channel/osd")
              },
              {
                path: "image",
                name: "Image",
                meta: {
                  title: _("Image"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/channel/image")
              },
              {
                path: "audioVideo",
                name: "AudioVideo",
                meta: {
                  title: _("Audio & Video"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import("../views/configuration/channel/audioVideo")
              }
              // {
              //   path: "areaMask",
              //   name: "AreaMask",
              //   meta: {
              //     title: "区域遮蔽",
              //     hidden: false,
              //     icon: ""
              //   },
              //   component: () =>
              //     import("../views/configuration/channel/areaMask")
              // },
              // {
              //   path: "reboot",
              //   name: "Reboot",
              //   meta: {
              //     title: "重启设置",
              //     hidden: false,
              //     icon: ""
              //   },
              //   component: () => import("../views/configuration/channel/reboot")
              // }
            ]
          },
          {
            path: "storage",
            name: "Storage",
            meta: {
              title: _("Storage"),
              hidden: false,
              icon: "icon-menu-storage"
            },
            component: Menu,
            redirect: "/configuration/storage/hardDrive",
            children: [
              {
                path: "hardDrive",
                name: "HardDrive",
                meta: {
                  title: _("HDD"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import("../views/configuration/storage/hardDrive")
              },
              {
                path: "videoPlan",
                name: "VideoPlan",
                meta: {
                  title: _("Schedule"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import("../views/configuration/storage/videoPlan")
              }
              // {
              //   path: "localStorage",
              //   name: "LocalStorage",
              //   meta: {
              //     title: "本地存储",
              //     hidden: false,
              //     icon: ""
              //   },
              //   component: () =>
              //     import("../views/configuration/storage/localStorage")
              // }
            ]
          },
          {
            path: "alarm",
            name: "Alarm",
            meta: {
              title: _("Alarm"),
              hidden: false,
              icon: "icon-menu-alarm"
            },
            component: Menu,
            redirect: "/configuration/alarm/motion",
            children: [
              {
                path: "motion",
                name: "Motion",
                meta: {
                  title: _("Motion Detection"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/alarm/motion")
              },
              // {
              //   path: "occlusion",
              //   name: "Occlusion",
              //   meta: {
              //     title: "遮挡检测",
              //     hidden: false,
              //     icon: ""
              //   },
              //   component: () =>
              //     import("../views/configuration/alarm/occlusion")
              // },
              // {
              //   path: "crossBorder",
              //   name: "CrossBorder",
              //   meta: {
              //     title: "越界侦测",
              //     hidden: false,
              //     icon: ""
              //   },
              //   component: () =>
              //     import("../views/configuration/alarm/crossBorder")
              // },
              // {
              //   path: "invasion",
              //   name: "Invasion",
              //   meta: {
              //     title: "区域入侵",
              //     hidden: false,
              //     icon: ""
              //   },
              //   component: () => import("../views/configuration/alarm/invasion")
              // },
              {
                path: "abnormal",
                name: "Abnormal",
                meta: {
                  title: _("Exception Detection"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/alarm/abnormal")
              }
            ]
          },
          {
            path: "network",
            name: "Network",
            meta: {
              title: _("Network"),
              hidden: false,
              icon: "icon-menu-network"
            },
            component: Menu,
            redirect: "/configuration/network/basic",
            children: [
              {
                path: "basic",
                name: "Basic",
                meta: {
                  title: _("Basics"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/network/basic")
              },
              {
                path: "cloud",
                name: "Cloud",
                meta: {
                  title: _("Cloud Service"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/network/cloud")
              },
              {
                path: "poe",
                name: "PoE",
                meta: {
                  title: _("PoE Config"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/network/poe")
              },
              {
                path: "port",
                name: "Port",
                meta: {
                  title: _("Port Config"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/network/port")
              },
              {
                path: "pppoe",
                name: "PPPoE",
                meta: {
                  title: _("PPPoE"),
                  hidden: true, // n6p移除该功能
                  icon: ""
                },
                component: () => import("../views/configuration/network/pppoe")
              },
              {
                path: "email",
                name: "Email",
                meta: {
                  title: _("Email"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/network/email")
              },
              {
                path: "ddns",
                name: "DDNS",
                meta: {
                  title: _("DDNS"),
                  hidden: false,
                  icon: ""
                },
                component: () => import("../views/configuration/network/ddns")
              },
              {
                path: "portMapping",
                name: "PortMapping",
                meta: {
                  title: _("UPnP"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import("../views/configuration/network/portMapping")
              }
            ]
          }
        ]
      },
      {
        path: "system",
        name: "System",
        meta: {
          title: _("System Management"),
          hidden: false,
          icon: ""
        },
        component: Menu,
        redirect: "/system/details",
        children: [
          {
            path: "details",
            name: "Details",
            meta: {
              title: _("Device Info"),
              hidden: false,
              icon: "icon-menu-details"
            },
            component: Menu,
            redirect: "/system/details/info",
            children: [
              {
                path: "info",
                name: "Info",
                meta: {
                  title: _("Device Info"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import(
                    /* webpackChunkName: "info" */ "../views/system/details/info"
                  )
              },
              {
                path: "log",
                name: "Log",
                meta: {
                  title: _("Device Log"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import(
                    /* webpackChunkName: "info" */ "../views/system/details/log"
                  )
              }
            ]
          },
          {
            path: "setting",
            name: "Setting",
            meta: {
              title: _("System Settings"),
              hidden: false,
              icon: "icon-menu-system"
            },
            component: Menu,
            redirect: "/system/setting/basic",
            children: [
              {
                path: "basic",
                name: "BasicSetting",
                meta: {
                  title: _("U#wKd#Basics"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import(
                    /* webpackChunkName: "info" */ "../views/system/setting/basic"
                  )
              },
              {
                path: "time",
                name: "Time",
                meta: {
                  title: _("Time"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import(
                    /* webpackChunkName: "info" */ "../views/system/setting/time"
                  )
              }
            ]
          },
          {
            path: "maintain",
            name: "Maintain",
            meta: {
              title: _("System Maintenance"),
              hidden: false,
              icon: "icon-menu-maintain"
            },
            component: Menu,
            redirect: "/system/maintain/upgrade",
            children: [
              {
                path: "upgrade",
                name: "Upgrade",
                meta: {
                  title: _("Firmware Upgrade"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import(
                    /* webpackChunkName: "info" */ "../views/system/maintain/upgrade"
                  )
              },
              {
                path: "config",
                name: "Config",
                meta: {
                  title: _("Configuration Mgmt"),
                  hidden: false,
                  loading: false,
                  icon: ""
                },
                component: () =>
                  import(
                    /* webpackChunkName: "info" */ "../views/system/maintain/config"
                  )
              },
              {
                path: "reboot",
                name: "RebootSetting",
                meta: {
                  title: _("Reboot Settings"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import(
                    /* webpackChunkName: "info" */ "../views/system/maintain/reboot"
                  )
              },
              {
                path: "service",
                name: "Service",
                meta: {
                  title: _("System Service"),
                  hidden: false,
                  icon: ""
                },
                component: () =>
                  import(
                    /* webpackChunkName: "info" */ "../views/system/maintain/service"
                  )
              }
            ]
          },
          {
            path: "userManagement",
            name: "UserManagement",
            meta: {
              title: _("Users"),
              hidden: false,
              icon: "icon-menu-accout"
            },
            component: () =>
              import("../views/system/userManagement/userManagement")
          }
        ]
      }
    ]
  }
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () => import("../views/activation/login")
  // },
  // {
  //   path: "/activate",
  //   name: "Activate",
  //   component: () => import("../views/activation/activate")
  // }
];

// 将路由信息存入state中
if (store.state.menuRoutes.length === 0) {
  store.commit("pushMenuRoutes", routes[0].children);
}

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const { meta, matched } = to;

  let loadingVal = matched.length > 2; // 多级菜单

  if (meta.loading === false) {
    // 通过配置项过滤不显示loading的路由页面
    loadingVal = false;
  }

  store.commit("setMainContentLoading", loadingVal); // 配置、系统管理下的路由，添加loading

  next();
});

router.afterEach(to => {
  // 设置当前路由
  store.commit("setCurrentRoute", to);
});

export default router;
