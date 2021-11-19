import Switch from "./switch";
import {Tabs, TabPane} from "./tabs";
import Select from "./select"


const components = [Switch, Tabs, TabPane, Select];

const install = function(Vue) {
  // window.Vue = Vue;
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install
};
