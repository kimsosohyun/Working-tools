import Vue from "vue";
import "./plugins/axios/axios";
import Login from "./views/activation/login";

import store from "./store";

import "@/assets/scss/index.scss";
import global from "@/utils/global";

// 引入本地reasy-ui2.0组件  todo: replace;
import ReasyUI from "@/plugins/reasy-ui-src/components/index";
Vue.use(ReasyUI);
Vue.use(global);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Login)
}).$mount("#app");
