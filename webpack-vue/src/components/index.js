import Switch from "./switch";
import {
  Tabs,
  TabPane
} from "./tabs";
import Select from "./select"
import Input from "./input"
import Dialog from "./dialog"
import Button from "./button";



const components = [Switch, Tabs, TabPane, Select, Input, Dialog, Button];

const install = function (Vue) {
  // window.Vue = Vue;
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install
};