<template>
    <div class="drawer">
        <ul class="mdui-list">
            <router-link 
                class="mdui-list-item mdui-ripple"
                v-for="(item, index) in list"
                :key="index"
                 :to="item.path"
                >
                    <i class="mdui-list-item-icon mdui-icon material-icons">{{item.icon}}</i>
                    <div class="mdui-list-item-content">{{item.name}}</div>
            </router-link>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Drawer',
    data() {
        return {
            list:[
                {
                    'name':"首页",
                    'icon':"home",
                    'path':"/"
                },
                {
                    'name':"游戏库",
                    'icon':"videogame_asset",
                    'path':"/game"
                },
                {
                    'name':"下载管理",
                    'icon':"get_app",
                    'path':"/download"
                },
                {
                    'name':"设置",
                    'icon':"settings",
                    'path':"/setting"
                }
            ]
        }
    },
    methods: {
       
    }
};
</script>

<style lang="less" scoped>
.drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
}
</style>