const path = require('path');
const htmlPlugin = require('html-webpack-plugin');
module.exports= {
    entry: {
        entry:'./src/main.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
    },
    module:{},
    plugins: [
        new htmlPlugin({ //在使用插件分离css后，html会自动添加link引用css文件，但是css文件仍需要在js文件中引用。
            minify: { //压缩html文件
                removeAttributeQuotes: true //去掉双引号
            },
            hash: true,//防止js缓存
            template: "../src/index.html"//模板页面
        }),
    ]
}