import Vue from "vue";
import "./plugins/axios/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import global from "@/utils/global";

import "@/assets/scss/index.scss";

// 引入本地reasy-ui2.0组件  todo: replace;
import ReasyUI from "@/plugins/reasy-ui-src/components/index";
Vue.use(ReasyUI);
Vue.use(global);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
