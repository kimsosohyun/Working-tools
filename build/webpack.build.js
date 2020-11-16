//生产环境配置
const path = require('path')
const merge = require('webpack-merge')
const BaseConfig = require('./webpack.base.js')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = merge(BaseConfig, {
    plugins: [
        new CleanWebpackPlugin({}) //自动删除dist文件
    ]
})