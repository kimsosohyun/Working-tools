import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import("../pages/Home/Home.vue");
const Map = () => import("../pages/Map/Map.vue");
const Subway = () => import("../pages/Subway/Subway.vue");
const Svg = () => import("../pages/Svg/Svg.vue");
const Show = () => import("@/components/show");
const Input = () => import("../pages/Input/Input.vue");
const Select = () => import("../pages/Select/Select.vue");
const Dialog = () => import("../pages/Dialog/Dialog.vue");

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
    },
    {
      path:"/show",
      component: Show
    },
    {
      path:"/input",
      component: Input
    },
    {
      path:"/select",
      component: Select
    },
    {
      path:"/Dialog",
      component: Dialog
    }
  ]
})