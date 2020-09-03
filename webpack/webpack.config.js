const path = require('path');
const uglifyPlugin = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //选择官方推荐的此插件
// const extractTextPlugin = require("extract-text-webpack-plugin"); webpack4支持不好，暂不使用
const website ={
    publicPath:"http://localhost:1010/" //定义所有的出口路径（文件引入路径），防止路径问题找不到文件
}
module.exports={
    //入口文件的配置项
    entry:{
        //可配置多入口
        entry:"./src/entry.js",
        kim:"./src/entry2.js"
    },
    //出口文件的配置项
    output:{
        //打包的路径
        path:path.resolve(__dirname,'dist'),
        //打包的文件名称
        filename:'[name].js',
        //[name] 和 entry对象的key值相同
        publicPath: website.publicPath //在此引用
    },
    //模块：例如解读CSS,图片如何转换，压缩，loader并不需要引入
    module:{
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                             // publicPath: '/public/path/to/', 可通过此覆盖全局的publicPath
                        },
                    },
                    'css-loader',
                ],//use数组是倒着使用Loader的！
            },
            //图片打包模块
            {
                test:/\.(png|jpg|gif)/,
                use:[
                {
                    loader:'url-loader',
                    options: {
                        //小于50000打包成base64的格式，大于50000打包成图片文件单独存在
                        limit:50000,
                        outputPath:'img/', //配置输出路径
                        esModule:false //html-withimg-loader与file-loader冲突，需要此配置才能正确得到图片路径
                    }
                }
                ]
            },
            //<img src="xxx"></img>模块
            {
                test: /\.(htm|html)$/i,
                use:'html-withimg-loader'
            },
            //less打包模块
            {
                test: /\.less$/i,
                use:['style-loader','css-loader','less-loader'] //若第一个参数不是 MiniCssExtractPlugin.loader而是style-loader
                //则css不会分离出来，会打包进js文件里。
            }
        ]
    },
    //插件，用于生产模版和各项功能,插件才需要引入
    plugins:[
        //js代码压缩插件
        new uglifyPlugin(),
        //html文件打包插件
        new htmlPlugin({ //在使用插件分离css后，html会自动添加link引用css文件，但是css文件仍需要在js文件中引用。
            minify: { //压缩html文件
                removeAttributeQuotes: true //去掉双引号
            },
            hash: true,//防止js缓存
            template: "./src/index.html"//模板页面
        }),
        //css分离插件，若没有此插件，css由于在js引用，会直接打包到js文件中
        new MiniCssExtractPlugin({
            filename: 'css/kim.css', //定义输出文件路径和文件名，若路径不存在则会创建文件
        }),
        // new extractTextPlugin("/css/kim.css")
    ],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        host:'localhost',
        //服务端压缩是否开启
        compress:'true',
        port:1010
    }
}