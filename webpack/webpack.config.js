const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglifyPlugin = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //选择官方推荐的此插件
//const PurifyCSSPlugin = require("purifycss-webpack"); 憨憨东西需要和extractTextPlugin一起用，已弃用
// const extractTextPlugin = require("extract-text-webpack-plugin"); webpack4支持不好，暂不使用
const PurgecssPlugin = require('purgecss-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

const entry = require("./webpack_config/entry.js");//模块化的思想，提取入口到单独的文件

// let website;0
// if (process.env.type === "build"){
//     //开发环境
//      website={
//         publicPath:"http://localhost:1010/" //定义所有的出口路径（文件引入路径），防止路径问题找不到文件
//     }
// }else {
//     //生产环境
//     website={
//         publicPath:"http://kimso.com:1010/" //定义所有的出口路径（文件引入路径），防止路径问题找不到文件
//     }
// }
const website = {
    publicPath:"http://localhost:1010/" //定义所有的出口路径（文件引入路径），防止路径问题找不到文件
}



module.exports= {
    //devtool: 'eval-source-map',//可配置4种打包调试方式
    //入口文件的配置项
    entry,
    //出口文件的配置项
    output: {
        //打包的路径
        path: path.resolve(__dirname, 'dist123'),
        //打包的文件名称
        filename: '[name].js',
        //[name] 和 entry对象的key值相同
        publicPath: website.publicPath //在此引用
    },
    //模块：例如解读CSS,图片如何转换，压缩，loader并不需要引入
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // publicPath: '/public/path/to/', 可通过此覆盖全局的publicPath
                        }
                    },
                    'css-loader',
                    'postcss-loader' //用于自动加浏览器前缀
                ],//use数组是倒着使用Loader的！
            },
            //图片打包模块
            {
                test: /\.(png|jpg|gif)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            //小于50000打包成base64的格式，大于50000打包成图片文件单独存在
                            limit: 50000,
                            outputPath: 'img/', //配置输出路径
                            esModule: false //html-withimg-loader与file-loader冲突，需要此配置才能正确得到图片路径
                        }
                    }
                ]
            },
            //<img src="xxx"></img>模块
            {
                test: /\.(htm|html)$/i,
                use: 'html-withimg-loader'
            },
            //less打包模块
            {
                test: /\.less$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] //若第一个参数不是 MiniCssExtractPlugin.loader而是style-loader则css不会分离出来，会打包进js文件里。
            },
            //babel配置模块,当babel-loader的版本高于8时，需要下载@babel/core @babel/preset-env而不是babel-core babel-preset-env(低于8下载这个)
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',
                    //如果options过长时，可以把options提成单独的文件.babelrc进行配置
                    options: {
                        presets: [
                            '@babel/preset-env' //用于es6转es5,且应该采用@babel/preset-env而不是babel-preset-env
                        ]
                    }
                },
                exclude: /node_modules/ //排除node_modules
            }
        ]
    },
    //插件，用于生产模版和各项功能,插件才需要引入
    plugins: [
        //webpack4不支持此打包到静态文件的方式了，换用和entry,plugins同级的optimization
        // new webpack.optimize.CommonsChunkPlugin({
        //     name:"vue",
        //     filename: "assets/[name].js",
        //     minChunks:2
        // },

        //全局配置对象，配置成功后key值即代表引入的包，全局可用，页面中不用再import Vue from "vue"了，
        // 只有采用此方式引入的包才能通过optimization打包到静态文件中，采用Import方式会直接打包到具体文件中，导致具体文件过大
        new webpack.ProvidePlugin({
            //kimsoyaya: "vue",不能使用直接使用vue，会导致表达式解析不成功
            //[Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
            kimsoyaya:"myVue" //采用此vue文件才能正确解析表达式
        }),

        //js代码压缩插件
        new uglifyPlugin(),
        //html文件打包插件,自动将打包好的js,css引入到html中
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
        //可以去除未使用的css，一般与glob配合使用。
        new PurgecssPlugin({
            //用于匹配src目录下的html文件
            paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`,
                {
                    // 不匹配目录，只匹配文件
                    nodir: true,
                }),
        }),
        // new extractTextPlugin("/css/kim.css")
        // new PurifyCSSPlugin({
        //     paths: glob.sync(path.join(__dirname, 'src/*.html'))
        // })

        //标识插件，打包后的每个js文件上都会有此标识
        new webpack.BannerPlugin("kimsosohyun61"),
        new copyWebpackPlugin({
            patterns: [
                {
                    from:path.join(__dirname,'src/public'),
                    to:'public'
                }
            ]
        })
    ],
    //配置webpack开发服务功能
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        host: 'localhost',
        //服务端压缩是否开启
        compress: 'true',
        port: 1010
    },
    //webpack --watch配置选项，和webpack-dev-server功能相似，是一个公共的服务器，webpack-dev-server只适用开发阶段
    watchOptions: {
        poll: 2000,//自动刷新打包时间
        aggregateTimeout: 500,//在500ms内连续按保存只打包一次
        ignored: /node_modules/
    },
    //打包资源包到静态文件，减小具体文件的大小
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: './asset/wxp',//commons里面的name就是生成的共享模块bundle的名字
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    resolve: {
        alias: {
            'myVue': 'vue/dist/vue.js' //为它取个别名
        }
    }
}