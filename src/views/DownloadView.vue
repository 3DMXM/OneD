<template>
    <div class="Download">
        <div class="toolbar">
            <div class="toolbar-btn" @click="test"><i class="mdui-icon material-icons">add</i> 新建任务</div>
        </div>
        <DlownloadList />
    </div>
</template>

<script lang="ts">
import DlownloadList from '../components/DownloadList.vue'


export default {
    name: 'DownloadView',
    components: {
        DlownloadList
    },
    data() {
        return {
            
        }
    },
    methods: {
        test() {
            // ipcRenderer.send('test')
        }
    }
}
</script>

<style lang="less" scoped>
.Download{
    display: flex;
    flex-direction: column;

    .toolbar{
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        padding-bottom: 15px;
        .toolbar-btn{
            height: 30px;
            margin-right: 8px;
            margin-left: 8px;
            padding: 0 10px;
            color: #8ab4f8;
            font-size: 16px;
            line-height: 30px;
            border: 1px solid #8ab4f8;
            cursor: pointer;
            transition: .5s;

            &:hover{
                background-color: #8ab4f8;
                color: #fff;
            }
        }
    }
}
</style>
