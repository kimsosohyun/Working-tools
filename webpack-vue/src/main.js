import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vClickOutside from 'v-click-outside'



//引用样式
import "./css/normalize.scss";
import "./css/test.css";
// import "./css/icons.scss";
Vue.use(vClickOutside)
Vue.config.productionTip = false
new Vue({
    render: h => h(App),
    router
}).$mount('#app')
