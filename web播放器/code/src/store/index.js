import Vue from "vue";
import Vuex from "vuex";
import { setHiddenByCapability } from "@/utils/common";

Vue.use(Vuex);

const isDev = process.env.NODE_ENV === "development";
let { hostname } = window.location;
if (isDev) {
  // 测试视频流使用
  hostname = "192.168.1.254";
}

export default new Vuex.Store({
  state: {
    username: "admin", //用户名为"admin"则为管理员，为其他则为用户
    hostname,
    showMainContentLoading: true, // 配置、系统管理路由加载数据完成前显示loading

    $players: [], // 播放器vue实例

    /* preview page */
    channelData: {}, // 已添加摄像头通道列表数据(包含音视频配置)
    customConfigs: {}, // 自定义配置
    activeChannel: null,
    activeWindowId: 0, // 聚焦窗口, 默认：0
    simpleTableHeight: 1, // 表格高度，用于滚动页面
    /* preview page */

    appQRCode: "http://download.cloud.tenda.com.cn/down/TendaSecurity", // 下载tenda App二维码信息，定值

    menuRoutes: [], // 菜单路由
    currentRoute: "", // 当前路由

    MACRO_CONFIG: {}, // NVR能力，首次加载页面获取
    authorityList: {}, // 权限列表，首次加载页面获取
    channelOptions: [],
    channelDisableOptions: [],
    channelStatus: {},
    channelToTitle: {},
    protocolList: []
  },
  getters: {
    /*
     * 已添加摄像头通道列表数据(包含音视频配置、自定义配置)
     * 派生格式如下：
     * {
     *   [channelId]: { ...channelData },
     *   ...
     * }
     */
    channelConfigs({ channelData, customConfigs }) {
      const mixObj = {};
      Object.keys(channelData).forEach(item => {
        const channelItem = channelData[item];
        let { title, channel } = channelItem;
        title = `D${channel + 1} ${title}`;

        mixObj[item] = {
          ...channelItem,
          ...customConfigs[item],
          title
        };
      });

      return mixObj;
    },
    /*
     * 已添加摄像头通道列表数据(包含音视频配置、自定义配置)
     * 派生格式如下：
     * [{channelData}, {channelData}, ...]
     */
    channelCfgList(state, { channelConfigs }) {
      return Object.values(channelConfigs);
    }
  },
  mutations: {
    pushMenuRoutes(state, routes) {
      state.menuRoutes = routes;
    },
    setCurrentRoute(state, currentRoute) {
      state.currentRoute = currentRoute;
    },
    setCapability(state, capability) {
      const custom = {
        // 暂时由前端写死
        maxPresetCount: 300, // 最大预置点数量
        maxCruiseCount: 8, // 最大巡航路径数量
        maxTrackCount: 4, // 最大轨迹数量
        maxSplitScreenCount: 4 // 最大分屏数
      };

      setHiddenByCapability(state, capability);
      state.MACRO_CONFIG = { ...custom, ...capability };
    },
    setUsername(state, name) {
      state.username = name;
    },
    setAuthorityList(state, authorityList) {
      if (authorityList.remote.indexOf("RemoteConf") === -1) {
        //没有配置的权限
        state.menuRoutes.forEach(item => {
          if (item.name === "Configuration") {
            item.meta.hidden = true;
          }
        });
      }
      if (authorityList.remote.indexOf("RemoteSysMgt") === -1) {
        //没有系统管理的权限
        state.menuRoutes.forEach(item => {
          if (item.name === "System") {
            item.meta.hidden = true;
          }
        });
      }
      state.authorityList = authorityList;
    },
    setMainContentLoading(state, showLoading) {
      state.showMainContentLoading = showLoading;
    },

    /* preview module function - start */
    /**
     * 设置当前选中的通道
     * @param {Object} state
     * @param {Number} channel 选中的通道号
     */
    setActiveChannel(state, channel) {
      state.activeChannel = channel;
    },
    /**
     * 设置当前选中的(聚焦)窗口
     * @param {Object} state
     * @param {Number} channel 选中的通道号
     */
    setActiveWindowId(state, windowId) {
      state.activeWindowId = windowId;
    },
    /**
     * 设置通道列表数据(包括音视频配置)
     * @param {Object} state
     * @param {Object} obj 数据对象
     */
    setChannelData(state, obj) {
      state.channelData = obj;
    },
    /**
     * 设置通道自定义配置
     * channel = -1 修改所有通道配置
     * channel = 具体通道号  修改单个通道号配置
     * @param {Object} state
     * @param {Object} payload
     */
    setCustomConfigs(state, { channel, configs }) {
      if (channel === -1) {
        // 自定义配置全部覆盖
        state.customConfigs = configs;
        return;
      }

      // 单独修改某个通道的自定义配置
      let curCfg = state.customConfigs[channel];
      state.customConfigs[channel] = { ...curCfg, ...configs };
      state.customConfigs = { ...state.customConfigs };
    },
    setPlayers(state, players) {
      state.$players = players;
    },
    setSimpleTableHeight(state, height) {
      state.simpleTableHeight = height;
    },
    /* preview module function - end */

    setChannelOptions(state, data) {
      let channels = [],
        disChannels = [],
        channelStatus = {},
        channelToTitle = {},
        protocolList = [];

      data.forEach(({ channel, status, title, protocol }) => {
        protocolList.push(protocol);
        channelStatus[channel] = status == 2;
        if (status != 2) {
          return;
        }
        const label = `D${channel + 1}`;
        channelToTitle[channel] = label;
        channels.push({
          label: `${label} ${title}`,
          value: channel
        });
        disChannels.push({
          label: label,
          value: channel,
          disabled: false
        });
      });

      state.channelOptions = channels;
      state.channelDisableOptions = disChannels;
      state.channelStatus = channelStatus;
      state.channelToTitle = channelToTitle;
      state.protocolList = protocolList;
    }
  },
  actions: {
    async getChannels({ commit }) {
      let res = await Vue.axios.post(
        "/RPC2:configManager.getConfig:RemoteDevice"
      );
      commit("setChannelOptions", res.getParams());
    }
  },
  modules: {}
});
