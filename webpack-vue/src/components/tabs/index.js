import Tabs from "./w-tabs";
import TabPane from "./w-tab-pane"  

Tabs.install = function(Vue) {
  Vue.component(Tabs.name, Tabs);
  Vue.component(TabPane.name, TabPane);
};

//用于按需引入,直接注册两个组件
export default Tabs; 

export {Tabs, TabPane}
