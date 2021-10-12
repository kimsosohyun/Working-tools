"use strict";

import Vue from "vue";
import store from "@/store";
import axios from "axios";

import { isEmpty } from "@/utils/common";
import { getMessage } from "./statusCode";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

// 是否是开发环境
const isDev = process.env.VUE_APP_PROXY_URL
  ? false
  : process.env.NODE_ENV === "development";

const _axios = axios.create(config);

/**
 * 生成方法，如getParams、getResult等
 * @param {String} fieldName 字段名
 * @returns {*} 字段名对应的值
 */
const methodGenerator = function(fieldName) {
  return function() {
    return this.data && this.data[fieldName];
  };
};

/**
 * 给某个对象添加方法
 * @param {Object} obj 对象
 */
const addMethods = function(obj) {
  // 需要通过方法获取的字段，生成的方法挂载在obj上
  const fieldNames = ["params", "result", "errCode", "errFields"];

  fieldNames.forEach(field => {
    const method = `get${field.replace(/(\w{1})/, $1 => $1.toUpperCase())}`;

    // 等于obj["getParams"] = fn.bind(obj);
    obj[method] = methodGenerator(field).bind(obj);
  });
};

/**
 * 通过字段名获取字段的值
 * @param {Object} res http响应对象
 * @param {Array<String>} fields 字段名数组
 * @returns {Array<*>} 字段名数组对应的值数组
 */
const getErrValuesByFields = (res, fields) => {
  const params = res.getParams();
  return fields.map(field => {
    const value = params[field];

    return isEmpty(value) ? "%s" : value;
  });
};

_axios.interceptors.request.use(
  function(config) {
    const params = config.data || {}; // 原始参数
    const [prodUrl, method, name] = config.url.split(":");

    config.data = {
      method,
      params
    };

    if (!isDev) {
      // 生产环境替换url
      config.url = prodUrl;
    }
    if (name) {
      // 后台需要的固定参数，字符串，定值
      config.data.params.name = name;
    }

    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // const {
    //   data: { code }
    // } = response;
    // if (code > 10) {
    //   this.$message.error(getMessage(code));
    // }
    addMethods(response);
    store.commit("setMainContentLoading", false);

    const {
      data: { result }
    } = response;
    if (result === true) {
      // do something
    } else {
      const errCode = response.getErrCode();
      // 重定向，当前只要是401就重定向到登录
      if (errCode === 401) {
        if (response.data.page == "activate") {
          // 跳转到激活页面
          window.location = "/activate.html";
        } else {
          window.location = "/login.html";
        }
      } else if (errCode >= 1000) {
        let args = response.getErrFields() || [];
        args = getErrValuesByFields(response, args);
        Vue.prototype.$message.error(_(getMessage(errCode), args));
      } else {
        // spacial code
      }
    }

    return response;
  },
  function(error) {
    // Do something with response error
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
      if (error.response.data && error.response.data.page === "login") {
        window.location = "/login.html";
      } else if (
        error.response.data &&
        error.response.data.page === "activate"
      ) {
        window.location = "/activate.html";
      }
    }
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
    $axiosPost: {
      get() {
        return _axios.post;
      }
    },
    $axiosAll: {
      get() {
        return axios.all;
      }
    },
    $axiosSpread: {
      get() {
        return axios.spread;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
