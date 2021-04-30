//生产环境配置
const path = require('path')
const merge = require('webpack-merge')
const BaseConfig = require('./test/webpack.base.js')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = merge(BaseConfig, {
    mode:"production",
    plugins: [
        new CleanWebpackPlugin({}) //自动删除dist文件
    ]
})