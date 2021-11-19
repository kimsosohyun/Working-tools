import Select from "./w-select";

//用于按需引入
Select.install = function(Vue) {
  Vue.component(Select.name, Select);
};

export default Select;
