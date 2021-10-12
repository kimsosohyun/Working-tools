module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  ignorePatterns: [
    "src/utils/base64.js",
    "src/plugins/player/*",
    "src/plugins/reasy-ui-src/*",
    "src/utils/svg.resize.js"
  ],
  globals: {
    _: true,
    B: true
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
