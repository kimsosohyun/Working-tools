const path = require("path");
const playerDir = path.resolve("src/plugins/player"),
  langDir = path.resolve("src/assets/lang");

const isDev = process.env.NODE_ENV !== "production";
const customHash = new Date().getTime();

module.exports = {
  productionSourceMap: false,
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: `index.html?${customHash}`,
      title: "NVR",
      customHash,
      jsFiles: ["pcm_player", "libffmpeg_tenda", "webgl", "index"],
      chunks: ["chunk-vendors", "chunk-common", "index"]
    },
    login: {
      entry: "src/login.js",
      template: "public/index.html",
      customHash,
      filename: `login.html?${customHash}`,
      title: "NVR login"
    },
    activate: {
      entry: "src/activate.js",
      template: "public/index.html",
      customHash,
      filename: `activate.html?${customHash}`,
      title: "NVR activate"
    }
  },
  css: {
    loaderOptions: {
      scss: {
        // eslint-disable-next-line prettier/prettier
        // todo: replace;
        prependData: `@import "src/plugins/reasy-ui-src/scss/vars.scss";@import "src/assets/scss/vars.scss";`
      },
      postcss: {
        plugins: [require("postcss-sass-unicode"), require("autoprefixer")]
      }
    }
  },
  devServer: {
    open: true,
    proxy: process.env.VUE_APP_PROXY_URL || "http://172.16.30.64:3000/mock/102",
    headers: {
      // 以下两个头部信息用于处理 sharedArrayBuffer is undefined 问题
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin"
    }
  },
  configureWebpack: config => {
    if (isDev) {
      //config.devtool = 'inline-source-map';
      config.devtool = "source-map";
      config.output.devtoolModuleFilenameTemplate = info => {
        const resPath = info.resourcePath;
        if (/node_modules/.test(resPath) || /\.js$/.test(resPath)) {
          return `webpack:///${resPath.replace(/^(\.\/)?src/, "my-code/src")}`;
        } else if (/\.vue$/.test(resPath)) {
          if (!/type=script/.test(info.identifier)) {
            return `webpack:///${resPath.replace(
              /^(\.\/)?src/,
              "my-code/src"
            )}`;
          }
        }

        return `webpack:///${resPath}?${info.hash}`;
      };
    }
  },
  chainWebpack: config => {
    config.module
      .rule("worker-loader")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .options({ filename: "[name].js" });

    //自定义鼠标样式
    config.module
      .rule("image")
      .test(/\.cur$/)
      .use("url-loader")
      .loader("url-loader");

    // 生产环境去除打印信息及断点
    config.when(!isDev, config => {
      config.optimization.minimizer("terser").tap(args => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        return args;
      });
    });

    config.plugin("copy").use(require("copy-webpack-plugin"), [
      [
        {
          from: path.resolve("public") + "/favicon.ico",
          to: "./"
        },
        {
          from: playerDir + "/**/*",
          to: "./player/[name].[ext]"
        },
        {
          from: langDir,
          to: "./lang"
        }
      ]
    ]);
  }
};
