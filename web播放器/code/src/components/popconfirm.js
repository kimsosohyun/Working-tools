import Vue from "vue";
import popconfirmConponent from "@/plugins/reasy-ui-src/components/popconfirm/v-popconfirm.vue";

const PopconfirmConstructor = Vue.extend(popconfirmConponent);

let instance = null;

const popconfirm = function(
  el,
  {
    icon,
    title,
    position,
    popupsOffset,
    arrowOffset,
    betweenSpace,
    clickOutsideToHide = true
  },
  confirmCb = () => {},
  cancelCb = () => {}
) {
  let propsData = {
    icon,
    title,
    position,
    popupsOffset,
    arrowOffset,
    betweenSpace,
    clickOutsideToHide
  };

  if (!instance) {
    instance = new PopconfirmConstructor({
      propsData,
      mounted() {
        this.$on("confirm", () => this.customConfirm());
        this.$on("cancel", () => this.customCancel());
      }
    });
    instance.$mount();
  }

  instance.$refs.popups.parentElm = el;
  instance.customConfirm = confirmCb;
  instance.customCancel = cancelCb;
  instance.show();

  return instance;
};

export default popconfirm;
