import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import("../pages/Home/Home.vue");
const Map = () => import("../pages/Map/Map.vue");
const Test = () => import("../pages/Test/Test.vue");
const Svg = () => import("../pages/Svg/Svg.vue");

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      // component: Svg
      redirect:"/test"
    },
    {
      path:"/map",
      component: Map
    },
    {
      path:"/test",
      component: Test
    },
    {
      path:"/svg",
      component: Svg
    }
  ]
})