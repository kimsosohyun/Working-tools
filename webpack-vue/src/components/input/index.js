import Input from "./w-input";

//用于按需引入
Input.install = function(Vue) {
  Vue.component(Input.name, Input);
};

export default Input;
