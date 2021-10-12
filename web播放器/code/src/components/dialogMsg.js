import Vue from "vue";
import MsgConponent from "./dialogMsg.vue";

const MsgConstructor = Vue.extend(MsgConponent);

let zIndex = 1000;

const DialogMsg = {},
  msgs = ["loading", "error", "success", "timeout"];

const getExecutor = function(type) {
  return function(
    text,
    wait = 0,
    closeCallback = () => {},
    dangerouslyUseHTMLString = false
  ) {
    let options = {
      type,
      text,
      wait,
      dangerouslyUseHTMLString
    };

    const instance = new MsgConstructor({
      data: options,
      methods: {
        closeCallback
      }
    });
    instance.$mount();
    document.body.appendChild(instance.$el);

    instance.id = zIndex;
    instance.$el.style.zIndex = zIndex++;
    instance.show();

    if (wait > 0) {
      instance.hideAfterWait();
    }
    return instance;
  };
};

msgs.forEach(msg => (DialogMsg[msg] = getExecutor(msg)));

export default DialogMsg;
