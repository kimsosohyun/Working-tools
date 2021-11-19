const path = require('path');
const webpack = require('webpack');
const htmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// let myPath6=path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// console.log(myPath6);  \foo\bar\baz\asdf

module.exports= {
    entry: {
        app:'./src/main.js'
    },
    output: {
        //path: 项目打包所存放到的路径，此路径中包含项目所有文件和目录。应该是一个绝对路径。
        //publicPath: 静态文件打包存放的目录。静态文件是指 img 的src ,link ，script 标签等所指向的文件。publicPath 是相对于path 所在的路径。是一个相对路径。

        path: path.resolve(__dirname, '../dist'),//__dirname：以当前文件所在绝对路径为起点，不包含当前文件，__filename包含当前文件
        filename: 'js/[name].js',
        publicPath: "/"
    },
    module:{ // 对 高级js语法 和 非js文件 的处理
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                    //设置sass储存全局变量的文件
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: './src/css/wxp.scss',
                        },
                    }
                ]
            },
            //vue文件中的img标签不需要html-withimg-loader也能正确打包
            {
                test: /\.(png|jpg|gif)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'img/', //配置输出路径
                            name: '[name].[hash:8].[ext]',
                            esModule: false //否则引入的资源是 [object Module] 404 (Not Found)
                        }
                    }
                ]
            },
            //html文件中的img标签必须要用此插件才能正确打包
            {
                test: /\.(htm|html)$/i,
                use: 'html-withimg-loader'
            },
            //字体打包
            {
                test: /\.(eot|svg|ttf|woff)(\?\S*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:8].[ext]',
                        outputPath: 'fonts/',
                    }
                }]

            },
            {   //js文件不用做模块处理可以直接打包运行
                // babel-loader是做一些兼容性处理，让高级语法在浏览器中都能正常运行，如es6转兼容性更好的es5
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                },
                exclude: /node_modules/
            },
            { // 处理vue
                test: /\.vue$/,
                loader: 'vue-loader'
            },
        ]
    },
    plugins: [
        new htmlPlugin({
            minify: { //压缩html文件
                removeAttributeQuotes: true //去掉双引号
            },
            hash: true,//防止js缓存
            template: "./src/index.html"//相对路径以根路径为起点,不用管当前文件路径在哪里，从根路径开始算起
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new webpack.DefinePlugin({
			//设置代理服务器
			MOCK_HTTP: JSON.stringify("http://192.168.98.17:3010/mock/177"),
		}),
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            'vue':'vue/dist/vue.js',
            '@':path.resolve("src")
        },
        extensions: ['.js', '.vue']// 引用js和vue文件可以省略后缀名
    },
    optimization: { // 一些优化配置（抽出公共代码，单独打包）
        // 官网文档  https://webpack.docschina.org/configuration/optimization/
        splitChunks: { // 详细配置 https://webpack.docschina.org/plugins/split-chunks-plugin/
            chunks: 'all', // (function(chunks)|String) 哪些板块将会被打包到公共包中 'all'，'async'和'initial'
            minSize: 20000, // 压缩之前大于30K 的文件才进行单独打包
            maxSize: 0, // 压缩之前小于 0K 不进行压缩,它的优先级 小于minSize,所以当值小于minSize的值时 maxSize的设置不会生效
            minChunks: 1, //拆分前必须共享模块的最小块数。// 达到这个数目才进行分割
            maxAsyncRequests: 5, // 按需加载块时并行请求的最大数量将小于或等于5 ,此时将分割代码
            maxInitialRequests: 2, // 初始页面加载时并行请求的最大数量将小于或等于2 ,此时将分割代码
            name:'chunk-vendors',//将静态文件全部打包到chunk-vendors.js中
            cacheGroups: {
                // cacheGroup 设置缓存组,缓存组意味着打包成的公共包文件  不会轻易变动,一般node_modules中的文件建议设置在缓存组内打包
                // 缓存组的配置 会覆盖掉父级配置(splitChunks中的一些配置)
                vendors: { // 缓存组的名字 默认和配置key相同(vendors),当然你也可以自定义
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10 // 优先级为 -10
                },
                //功能：自动提取并将src中的静态css文件normalize.scss打包到静态文件chunk-vendors.css中
                //而不是和其他动态css一起放在app.css中
                //优先级要低于node_modules，否则node_modules又打包到app.js中了
                styles: {
                    test: /\.(css|scss)$/,
                    name: 'chunk-vendors',
                    chunks: 'all',
                    priority: -20,
                    enforce: true
                },
                default: {
                    minChunks: 2,
                    priority: -30,
                    reuseExistingChunk: false // 如果当前块包含已从主捆绑包中拆分出的模块，则将重用该模块，而不是生成新的模块。这可能会影响块的结果文件名。
                }
            }
        }
    },

}