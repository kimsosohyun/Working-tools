/**
 * 防抖
 * @param {Function} fn - 需要防抖的函数
 * @param {Number} wait - 防抖时间
 * @param {Boolean} immediate - 是否马上执行
 */
export function debounce(fn, wait, immediate) {
  let timer = null;

  return function() {
    let args = arguments;

    if (immediate && !timer) {
      fn.apply(this, args);
    }

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}
/**
 * 节流
 * @param {Function} fn - 需要节流的函数
 * @param {Number} wait - 节流时间
 * @param {Boolean} immediate - 是否马上执行
 */
export function throttle(fn, wait, immediate) {
  let timer = null,
    callNow = immediate;

  return function(...args) {
    if (callNow) {
      fn.apply(this, args);
      callNow = false;
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  };
}

/**
 * 将数组对象转换成对象
 * 取数组对象中的属性值作为key，另一个属性(也可以是同一个属性)值作为value
 * @param {Array} array 需要转换的数组
 * @param {String} keyName 键名
 * @param {String} valueName 值名
 * @returns {Object} { key1: value1, key2: value2, ... }
 */
export function arrayToObject(
  array = [],
  keyName = "key",
  valueName = "value"
) {
  const obj = {};

  array.reduce((prev, cur) => {
    prev[cur[keyName]] = cur[valueName];
    return prev;
  }, obj);

  return obj;
}

export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler, useCapture = false) {
      if (element && event && handler) {
        let eventObj = element.__event__ || {};
        if (eventObj[event] && eventObj[event].length >= 0) {
          eventObj[event].push(handler);
        } else {
          eventObj[event] = [handler];
          element.addEventListener(
            event,
            function(evt) {
              for (let fn of eventObj[event]) {
                fn(evt);
              }
            },
            useCapture
          );
        }
        element.__event__ = eventObj;
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler, isAnonymous = false) {
      if (element && event) {
        let eventObj = element.__event__ || {};
        for (let i = 0; i < (eventObj[event] || []).length; i++) {
          const isSameFunc = !isAnonymous
            ? eventObj[event][i] === handler
            : eventObj[event][i].toString() === handler.toString();
          if (isSameFunc) {
            eventObj[event].splice(i, 1);
          }
        }
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

export const isType = (obj, type) => {
  if (typeof obj !== "object") return false;
  const typeString = Object.prototype.toString.call(obj);
  let flag;
  switch (type) {
    case "Array":
      flag = typeString === "[object Array]";
      break;
    case "Date":
      flag = typeString === "[object Date]";
      break;
    case "RegExp":
      flag = typeString === "[object RegExp]";
      break;
    default:
      flag = false;
  }
  return flag;
};
export const isFunction = variable => {
  return typeof variable === "function";
};

const getRegExp = re => {
  var flags = "";
  if (re.global) flags += "g";
  if (re.ignoreCase) flags += "i";
  if (re.multiline) flags += "m";
  return flags;
};

/**
 * deep clone
 * @param  {[type]} parent object 需要进行克隆的对象
 * @return {[type]}        深克隆后的对象
 */
export const clone = parent => {
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];

  const _clone = parent => {
    if (parent === null) return null;
    if (typeof parent !== "object") return parent;

    let child, proto;

    if (isType(parent, "Array")) {
      // 对数组做特殊处理
      child = [];
    } else if (isType(parent, "RegExp")) {
      // 对正则对象做特殊处理
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, "Date")) {
      // 对Date对象做特殊处理
      child = new Date(parent.getTime());
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent);
      // 利用Object.create切断原型链
      child = Object.create(proto);
    }

    // 处理循环引用
    const index = parents.indexOf(parent);

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index];
    }
    parents.push(parent);
    children.push(child);

    for (let i in parent) {
      // 递归
      child[i] = _clone(parent[i]);
    }

    return child;
  };
  return _clone(parent);
};

/**
 * 将时间转换成数字
 * @export
 * @param {String} time
 * @returns 时间数字
 */
export function getTime(time) {
  let timeArr = time.split(":");
  return (
    Number(timeArr[0] || "0") * 60 * 60 +
    Number(timeArr[1] || "0") * 60 +
    Number(timeArr[2] || "0")
  );
}

/**
 * @description 解析字符串为对应的时间戳
 * @param {*} str
 * @param {*} 时间格式
 * @returns
 */
export function parseDateToNum(str, fmt) {
  let dateObj = parseDateToObj(str, fmt);
  return Date.parse(
    new Date(
      dateObj.year,
      dateObj.month,
      dateObj.day,
      dateObj.hour,
      dateObj.minute,
      dateObj.second
    )
  );
}

/**
 * @description 解析字符串为年月日
 * @param {*} str
 * @param {*} 时间格式
 * @returns 年月日时分秒对象
 */
export function parseDateToObj(str, fmt) {
  fmt = fmt || "YYYY-MM-DD";
  let obj = { Y: 0, M: 1, D: 0, h: 0, m: 0, s: 0 };
  fmt.replace(/([^YMDhms]*?)(([YMDhms])\3*)([^YMDhms]*?)/g, function(
    m,
    $1,
    $2,
    $3,
    $4
  ) {
    str = str.replace(
      new RegExp($1 + "(\\d{" + $2.length + "})" + $4),
      function(_m, _$1) {
        obj[$3] = parseInt(_$1);
        return "";
      }
    );
    return "";
  });
  obj.M--; // 月份是从0开始的，所以要减去1
  return {
    year: obj.Y,
    month: obj.M,
    day: obj.D,
    hour: obj.h,
    minute: obj.m,
    second: obj.s
  };
}

/**
 * 将时间对象转成字符串返回
 * @export
 * @param {*} date
 * @param {*} fmt
 * @returns
 */
export function formatDateToString(date, fmt) {
  date = date == undefined ? new Date() : date;
  date = typeof date == "number" ? new Date(date) : date;
  fmt = fmt || "YYYY-MM-DD";

  var obj = {
    Y: date.getFullYear(), // 年份，注意必须用getFullYear
    M: date.getMonth() + 1, // 月份，注意是从0-11
    D: date.getDate(), // 日期
    h: date.getHours(), // 24小时制
    m: date.getMinutes(), // 分钟
    s: date.getSeconds() // 秒
  };

  for (var i in obj) {
    fmt = fmt.replace(new RegExp(i + "+", "g"), function(m) {
      var val = obj[i] + "";
      for (var j = 0, len = val.length; j < m.length - len; j++)
        val = "0" + val;
      return m.length == 1 ? val : val.substring(val.length - m.length);
    });
  }
  return fmt;
}

export function formatDate(date, fmt = "YYYY-MM-DD hh:mm:ss") {
  //author: meizz
  date = date == undefined ? new Date() : new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //月份
    "D+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    S: date.getMilliseconds() //毫秒
  };
  if (/(Y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
}

/**
 * 获取某个时区的时间
 * @param {String} time - 参考时间
 * @param {Number} refZone - 参考时间所属时区
 * @param {Number} zone - 需要切换的时区
 * @param {String} fmt - 时间格式
 * @returns {String}
 */
export function getTimeByZone(time = new Date(), refZone, zone = 8, fmt) {
  time = time instanceof Date ? time : new Date(time);
  const len = time.getTime();
  const offset = refZone * -60 * 60000; // 传入时区与GMT时间差值
  const utcTime = len + offset; // 格林尼治时间
  const date = new Date(utcTime + 3600000 * zone); // 格林尼治时间和当前时区的差值

  return formatDateToString(date, fmt);
}

/**
 * @description 读，写，删cookie
 * @param {String} name cookie指定名称
 * @param {String} value 写入cookie信息
 * @param {Object} options 配置项：有效期、有效路径、有效域和是否加密数据传输
 */
export function cookie(name, value, options) {
  if (typeof value != "undefined") {
    //如果第二个参数存在
    options = options || {}; //初始化选项参数
    if (value === null) {
      //value值为null则删除该cookie的值
      value = "";
      options.expires = -1;
    }

    //如果存在时间参数，且只类型为number或者为具体时间，分别设置时间
    var expires = "";
    if (
      options.expires &&
      (typeof options.expires == "number" || options.expires.toGMTString)
    ) {
      var date = null;
      if (typeof options.expires == "number") {
        //设置时间格式，把天数转换为毫秒数添加到时间对象中
        date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      } else {
        //如果是时间格式则之间传递时间参数
        date = options.expires;
      }
      expires = ";expires=" + date.toGMTString(); //设置有效期
    }

    var path = options.path ? ";path=" + options.path : ""; //设置路径
    var domain = options.domain ? ";domain=" + options.domain : ""; //设置域
    var secure = options.secure ? ";secure" : ""; //设置安全措施，为true则直接设置，否则为空
    //把所有字符串信息都存入数组，然后调用join方法转换为字符串，并写入cookie信息
    document.cookie = [
      name,
      "=",
      escape(value),
      expires,
      path,
      domain,
      secure
    ].join("");
  } else {
    //如果第二个参数不存在，则读取指定cookie信息
    if (document.cookie && document.cookie != "") {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; "); //分号后面必需有空格，可以输出document.cookie.splite(";")查看
      for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (name == arr[0]) {
          return unescape(arr[1]);
        }
      }
      return "";
    }
  }
}

export function isUndefinedOrNull(a) {
  return a === undefined || a === null;
}

export function isEmpty(val) {
  const emptyArr = ["{}", "[]"];

  return (
    val === "" ||
    isUndefinedOrNull(val) ||
    emptyArr.includes(JSON.stringify(val))
  );
}

export function channelResultHandle(res) {
  let channelToTitle = this.channelToTitle;

  if (res.getResult() === true) {
    this.$message.success(_("Saved Successfully"));
  } else {
    let channels = res.getParams();
    channels = channels.channel || [];
    let errorText = channels.map(item => channelToTitle[item]).join(", ");
    this.$message.error(errorText + _("Failed to save"));
  }
}

/**
 * 检测是否在同一网段
 * @param  {String}  ip_lan   [description]
 * @param  {String}  ip_wan   [description]
 * @param  {String}  mask_lan [description]
 * @param  {String}  mask_wan [description]
 * @return {Boolean}          [true在同一网段]
 */
export function isSameNet(ip_lan, ip_wan, mask_lan, mask_wan) {
  if (ip_lan === "" || ip_wan === "" || mask_lan === "" || mask_wan === "") {
    return false;
  }

  var ip1Arr = ip_lan.split("."),
    ip2Arr = ip_wan.split("."),
    maskArr1 = mask_lan.split("."),
    maskArr2 = mask_wan ? mask_wan.split(".") : maskArr1,
    maskArr = maskArr1,
    i;

  for (i = 0; i < 4; i++) {
    if (maskArr1[i] != maskArr2[i]) {
      if ((maskArr1[i] & maskArr2[i]) == maskArr1[i]) {
        maskArr = maskArr1;
      } else {
        maskArr = maskArr2;
      }
      break;
    }
  }

  for (i = 0; i < 4; i++) {
    if ((ip1Arr[i] & maskArr[i]) != (ip2Arr[i] & maskArr[i])) {
      return false;
    }
  }

  return true;
}

export function setHiddenByCapability(state, capability) {
  const nameCapMap = {
    // PoE：路由名称，HasPOE：capability中的key
    // capability中key的含义必须为“是否有xxx能力(HasXXX)”，不能是“NoXXX”，否则此方法不可用
    PoE: "HasPOE"
  };
  let i = 0,
    menuRoutes = [...state.menuRoutes],
    routeNames = Object.keys(nameCapMap);

  while (routeNames.length && i <= menuRoutes.length) {
    const route = menuRoutes[i],
      idx = routeNames.indexOf(route.name);

    if (idx > -1) {
      route.meta.hidden = !capability[nameCapMap[route.name]];
      routeNames.splice(idx, 1);
    }
    if (route.children && route.children.length) {
      // 广度优先遍历
      menuRoutes = menuRoutes.concat(route.children);
    }
    i++;
  }
}

export function getSessionStorage(name) {
  return window.sessionStorage.getItem(name);
}

export function setSessionStorage(name, value) {
  window.sessionStorage.setItem(name, value);
}

export function removeSessionStorage(name) {
  window.sessionStorage.removeItem(name);
}
