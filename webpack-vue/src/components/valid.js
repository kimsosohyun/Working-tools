//首先要在Vue的prototype上绑定$valid数据验证对象，对象形式时，执行all方法

const valid = {
  num: function (str, min, max) {
    console.log(this, "num");
    if (!/^([-0-9])?([0-9]+)$/.test(str)) {
      return "输入值必须为整数";
    }
    if (typeof min === "number" && typeof max === "number") {
      if (parseInt(str, 10) < min || parseInt(str, 10) > max) {
        return `有效输入范围：${min} - ${max}`;
      }
    }
  },
  test: function (str, min, max) {
    if (Number(str) > max) {
      return "大了"
    }
    if (Number(str) < min) {
      return "小了"
    }
  },
  test1: {
    all: function (str, min, max) {
      if (Number(str) > max) {
        return "大了111"
      }
      if (Number(str) < min) {
        return "小了111"
      }
    }
  }
}

export default valid;