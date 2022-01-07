import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vClickOutside from 'v-click-outside'
import KimUi from "./components"

import ReasyUi from '@reasy-team/reasy-ui';
import "@reasy-team/reasy-ui/dist/style.css";

import valid from "@/components/valid"

import weiPhoto from 'wei-photo'
import "wei-photo/style/index.css"
Vue.use(weiPhoto);
// KimUi.install(Vue); 等同于Vue.use(KimUi)，Vue.use函数内部会调用参数的install方法
Vue.use(KimUi);
Vue.use(ReasyUi);



//引用样式
import "./css/normalize.scss";
import "./css/test.css";
import "./css/icons.scss";
Vue.use(vClickOutside)
Vue.config.productionTip = false
new Vue({
    render: h => h(App),
    router
}).$mount('#app')
