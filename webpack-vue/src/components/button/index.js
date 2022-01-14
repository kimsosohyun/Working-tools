import Button from "./w-button";

//用于按需引入
Button.install = function(Vue) {
  Vue.component(Button.name, Button);
};

export default Button;
