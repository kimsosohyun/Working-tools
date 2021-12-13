//开发环境配置
const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const BaseConfig = require('./test/webpack.base.js')
const fs = require('fs');
const glob = require('glob');

module.exports = merge(BaseConfig, {
    mode: "development",
    devtool: 'source-map',//可配置4种打包调试方式
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, "../dist"),
        host: 'localhost',
        //服务端压缩是否开启
        compress: 'true',
        port: 6161,
        //提供在服务器内部的所有其他中间件之前执行定制中间件的功能
        before: (app) => { 

            //只能拦截http://localhost:6161下的goform请求
            // https://stackoverflow.com/questions/47442543/how-do-i-get-webpack-dev-server-to-accept-post-requests
            
            app.post('/goform/**', function (req, res) {//解决post没响应的问题
                res.redirect(req.originalUrl); //重定向到对应路径
            });

            app.get('/goform/**', function (req, res) {
                try {
                    let reqUrl = req.originalUrl;

                    console.log(reqUrl,"reqUrlreqUrlreqUrlreqUrl");

                    let fileStr, fileObj, data,
                        filePath = glob.sync(("./src/**/" + reqUrl.split("/")[2] + ".json")); //匹配src下所有包含xxx.json文件的路径

                    fileStr = fs.readFileSync(filePath[0], 'utf-8'); //在所有路径中取第一个

                    fileStr = fileStr.replace(/^\s+|\s+$/g, "");

                    fileObj = JSON.parse(fileStr);

                    res.send(fileObj);
              
                } catch (e) {
                    res.send("404 No Found wxp");
                }
            });

        }
    }
})