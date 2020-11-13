//分离出入口配置文件
const entry={
    // //可配置多入口
    entry:"./src/entry.js",
    // kimaa:"./src/entry2.js",
    vue112312:"myVue" //出口必然会打包出一个vue112312.js文件
    // 若value值和全局引入（ProvidePlugin）的value值相同，则optimization会把此文件打包到静态文件夹中
};

//只能通过此方式导出，不能使用exports.default = entry
//否则entry导出为{ default: { entry: './src/entry.js', vue112312: 'vue/dist/vue.js' } }
module.exports = entry
