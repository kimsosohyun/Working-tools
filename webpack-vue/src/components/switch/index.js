import Switch from "./w-switch";

//用于按需引入
Switch.install = function(Vue) {
  Vue.component(Switch.name, Switch);
};

export default Switch;
