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
const Button = () => import("../pages/Button/Button.vue");
const Photo = () => import("../pages/Photo/Photo.vue");
const Login = () => import("../pages/Login/Login.vue");
const Date = () => import("../pages/Date/Date.vue");

Vue.use(Router)

export default new Router({
  routes: [{
      path: "/",
      // component: Svg
      redirect: "/show"
    },
    {
      path: "/map",
      component: Map
    },
    {
      path: "/subway",
      component: Subway
    },
    {
      path: "/svg",
      component: Svg
    },
    {
      path: "/home",
      component: Home
    },
    {
      path: "/show",
      component: Show
    },
    {
      path: "/input",
      component: Input
    },
    {
      path: "/select",
      component: Select
    },
    {
      path: "/Dialog",
      component: Dialog
    },
    {
      path: "/Photo",
      component: Photo
    },
    {
      path: "/Login",
      component: Login
    },
    {
      path: "/Button",
      component: Button
    }, 
    {
      path: "/Date",
      component: Date
    }
  ]
})