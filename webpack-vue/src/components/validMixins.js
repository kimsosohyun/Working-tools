export default {
  methods: {
    checkData() {
      const { value, valid } = this,
        { require, prop } = valid;

      if (require) {
        //验证是否必填
        if (!value.length) {
          return _("This field is required");
        }
      } else {
        if (!value.length) {
          return false;
        }
      }
      //未定义验证类型时
      if (!prop) {
        return false;
      }

      let validList = [],
        errMsg = "";

      if (!Array.isArray(prop)) {
        validList = [prop];
      } else {
        validList = prop;
      }

      //some方法通过return true即找到符合要求的了，剩下的不用找了，跳出循环
      //every方法通过return false即找到不符合要求的了，剩下的不用再验证了，跳出循环
      //forEach方法不能跳出循环，实现continue的效果可以直接使用return
      validList.some((item) => {
        if (typeof item === "function") {
          errMsg = item.call(this);
        } else {
          const handleValid = this.$valid[item.type],
            args = item.args || [],
            msg = item.msg;

          let res = "";

          if (typeof handleValid === "function") {
            res = handleValid.call(this, value, ...args);
          } else {
            res = handleValid.all.call(this, value, ...args);
          }
          if (res) {
            if (msg) {
              errMsg = msg;
            } else {
              errMsg = res;
            }
          }
        }
        if (errMsg) {
          return true; //有错误了之后直接跳出循环
        }
      });

      if (errMsg) {
        return errMsg;
      } else {
        return false;
      }
    }
  }
};
