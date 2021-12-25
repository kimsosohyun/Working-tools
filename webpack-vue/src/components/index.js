import Switch from "./switch";
import {Tabs, TabPane} from "./tabs";
import Select from "./select"
import Input from "./input"
import Dialog from "./Dialog"



const components = [Switch, Tabs, TabPane, Select, Input, Dialog];

const install = function(Vue) {
  // window.Vue = Vue;
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install
};
