module.exports = {
    plugins: [
        require('autoprefixer')({ //用于自动加浏览器前缀，且autoprefixer的版本应该低于10，否则会报错
            "browsers": [ //配置浏览器限制，不然没有效果
                "defaults",
                "not ie < 11",
                "last 2 versions",
                "> 1%",
                "iOS 7",
                "last 3 iOS versions"
            ]
        })
    ]
}