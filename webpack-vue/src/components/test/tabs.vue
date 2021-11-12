<template>
    <div class="tab">
        <div class="title">
            <div class="title-item" v-for="(item,index) in tabKey" :key="index" :class="{titleActive:index===showItem}" @click="changeShowItem(index)">
                <span>{{item}}</span>
            </div>
             <div class="slider" ref="slider"></div>
        </div>
        <div class="tab-container">
            <div class="content" ref="content">
                <div class="contentItem" v-for="(item,index) in tabValue" :key="index">
                    <slot :name="item"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"tabs",
    data(){
        return {
            showItem:0,
            items:this.tabKey.length
        }
    },
    props:{
        tabKey:Array,
        tabValue:Array
    },
    mounted(){
         this.$refs.content.style.width = this.items * "100" +  "%" ;
    },
    methods:{
        changeShowItem(index){
            this.showItem = index;
            this.$refs.slider.style.left = index * "100" +  "px" ;
            this.$refs.content.style.left = -index * "100" + "%";
        }
    }
}
</script>

<style lang="scss"> 
.tab {
    width: 100%;
    // height: 100%;
    .title {
        width: 100%;
        overflow: hidden;
        position: relative;
        .title-item {
            cursor: pointer;
            float: left;
            width: 96px;
            margin-right: 4px;
            height: 20px;
            line-height: 20px;
            margin-bottom: 6px;
            text-align: center;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .slider {
            width: 96px;
            position: absolute;
            left: 0;
            bottom: 0;
            height: 3px;
            background: $main-active-color;
            transition: all .2s ease-in-out;
        }
        .titleActive,.title-item:hover {
            color: $main-active-color;
        }
        &::after{
            z-index: 0;
            position: absolute;
            content: "";
            bottom: 0;
            display: block;
            width: 100%;
            height: 1px;
            background: #ddd;
        }
    }
    .tab-container {
        margin-top: 2px;
        width: 100%;
        height: 382px;
        position: relative;
        overflow: hidden;
        .content {
            position: absolute;
            transition: all .2s ease-in-out;
            top: 0;
            left: 0;
            height: 382px;
            display: flex;
            .contentItem {
                flex: 1;
                width: 100%;
                height: 100%;
                overflow: auto;
            }
        }
    }
}
</style>