import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vClickOutside from 'v-click-outside'
import KimUi from "./components"

import ReasyUi from '@reasy-team/reasy-ui';
import "@reasy-team/reasy-ui/dist/style.css";

Vue.use(ReasyUi);



//引用样式
import "./css/normalize.scss";
import "./css/test.css";
import "./css/icons.scss";
Vue.use(vClickOutside)
Vue.config.productionTip = false

KimUi.install(Vue);
new Vue({
    render: h => h(App),
    router
}).$mount('#app')
