import  "./css/index.css";
import "./css/kim1.less";
import "./css/red.less";
let json = require("./config.json"); //可以直接打包json文件
// import  Vue from "vue/dist/vue.js";

let obj = ()=> {

    const b=2;

    // console.log("vue",kimsoyaya);


};
// alert(222);

document.title = json.name + json.age ;

obj();

new kimsoyaya({
    el:"#div",
    data(){
        return {
            title:"kimsoso222"
        }
    },
    mounted() {
        console.log(11);
    }
})

