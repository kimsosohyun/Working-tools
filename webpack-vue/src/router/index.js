import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import("../pages/Home/Home.vue");
const Map = () => import("../pages/Map/Map.vue");
const Subway = () => import("../pages/Subway/Subway.vue");
const Svg = () => import("../pages/Svg/Svg.vue");

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      // component: Svg
      redirect:"/subway"
    },
    {
      path:"/map",
      component: Map
    },
    {
      path:"/subway",
      component: Subway
    },
    {
      path:"/svg",
      component: Svg
    },
    {
      path:"/home",
      component: Home
    }
  ]
})