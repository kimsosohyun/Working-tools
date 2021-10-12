import valid from "@/utils/validate";
import DialogMsg from "@/components/dialogMsg";
import Popconfirm from "@/components/popconfirm";
import { Base64 } from "@/utils/base64.js";

const install = function(Vue) {
  Vue.prototype.$valid = valid;
  Vue.prototype.$dialog = DialogMsg;
  Vue.prototype.$popconfirm = Popconfirm;
  Vue.prototype.Base64 = Base64;
  Vue.prototype._ = function() {
    return window.B.getFormatText.apply(window.B, arguments);
  };
};

export default {
  install
};
