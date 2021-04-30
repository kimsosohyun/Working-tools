//开发环境配置
const merge = require('webpack-merge')
const path = require('path')
const BaseConfig = require('./test/webpack.base.js')
module.exports = merge(BaseConfig,{
    mode:"development",
    //devtool: 'eval-source-map',//可配置4种打包调试方式
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, "../dist"),
        host: '192.168.98.62',
        //服务端压缩是否开启
        compress: 'true',
        port: 6161
    }
})