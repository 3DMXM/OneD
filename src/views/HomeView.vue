<template>
    <div class="home">
        <div class="logo">
            <img src="../assets/logo.png" alt="小莫" @click="OpenHome">
            <h1>OneDrive下载器 <span class="release-tag">v1.0.0</span></h1>
            <p>适用于小莫的网盘/游戏库的一款简易下载器</p>
        </div>
        <hr class="mdui-divider">
        <div class="go">
            <div class="nav-link">开始使用</div>
        </div>
        <div class="hint">友情提示：本工具完全免费，如果您在任何地方花费的任何金钱下载了这款工具，那么您很有可能被骗了，小莫建议您赶快申请退款并给予差评</div>

    </div>
</template>

<script lang="ts">
export default {
    name: 'HomeView',
    data() {
        return {
            
        }
    },
    methods: {
       OpenHome() {
            const { shell } = require('electron');
            shell.openExternal("https://www.aoe.top");
       }
    }
}
</script>

<style lang="less" scoped>
.home{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .logo{
        display: flex;
        flex-direction:column ;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 300px;
        img{
            width: 150px;
            box-shadow: 0 0 5px #fff;
            padding: 5px;
            border-radius: 50%;
            cursor: pointer;
            transition: .5s;

            &:hover{
                box-shadow: 0 0 15px #fff;
            }
        }
        h1{
            margin-bottom: 3px;
            .release-tag{
                font-size: 20px;
                font-weight: bold;
                display: inline-block;
                padding: 6px;
                margin-left: 6px;
                background: #646cff;
                color: #fff;
                border-radius: 10px;
            }
        }
    }
    hr{
        width: calc(100% - 140px);
    }
    .go{
        display:flex;
        justify-content: center;
        padding-top: 15px;

        .nav-link{
            padding: 0 24px;
            line-height: 52px;
            font-size: 1.2rem;
            font-weight: 500;
            cursor: pointer;

            display: inline-block;
            border-radius: 6px;
            padding: 0 20px;
            line-height: 44px;
            font-size: 1rem;
            font-weight: 500;
            color: #ffffff;
            background-color: #646cff;
            border: 2px solid #646cff;
            transition: background-color .1s ease;

            &:hover{
                text-decoration: none;
                color: #fff;
                background-color: #747bff;
            }
        }
    }
    .hint{
        margin-top: 15px;
        padding: 0 24px;
        font-size: 0.8rem;
        color: rgb(214, 205, 205);
        text-align: center;
    }
}
</style>