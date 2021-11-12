import Switch from "./switch/w-switch";
import Tabs from "./tabs/w-tabs";


const components = [Switch, Tabs];

const install = function(Vue) {
  // window.Vue = Vue;
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install
};
