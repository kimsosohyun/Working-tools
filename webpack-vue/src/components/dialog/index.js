import Dialog from "./w-dialog";

//用于按需引入
Dialog.install = function(Vue) {
  Vue.component(Dialog.name, Input);
};

export default Dialog;
