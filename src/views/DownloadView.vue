<script setup lang="ts">
import { useStore } from 'vuex'
import { ref, Ref, computed, watch } from 'vue'
import mdui from "mdui"


import DlownloadList from '@/components/DownloadList.vue'
import AddDownload from '@/components/AddDownload.vue'


const Store = useStore();


let task_list: Ref<Array<any>> = ref([]);

let aria2 = Store.state.aria2;

let addUri = ref(false);

function closeAdd() {
    addUri.value = false;
}

function addTask(data: any, SavePath: string) {
    // console.log(data);
    // pan.aoetop.workers.dev
    let url: string = data['@microsoft.graph.downloadUrl'];

    // 替換url中的 xmsky-my.sharepoint.com 为 pan.aoetop.workers.dev
    url = url.replace(/xmsky-my.sharepoint.com/g, "pan.aoetop.workers.dev");

    // 替換url中的 xmsky2-my.sharepoint.com 为 game.aoetop.workers.dev
    url = url.replace(/xmsky2-my.sharepoint.com/g, "game.aoetop.workers.dev");


    let file = {
        url: url,
        name: data.name,
        size: data.size,
        id: data.id
    }

    if (!file.url) {
        mdui.snackbar({
            message: "文件ID错误,无法下载文件",
            position: 'right-top'
        });
        return;
    }

    aria2.addUri([file.url], file.name, SavePath, file.id).then((data: any) => {
        console.log('addUri', data);
        GetTaskList(1)
    });
}

function UpTaskList(data: any) {
    let result = data.result;
    if (result) {
        // 清空 task_list
        task_list.value = [];
        if (result.length > 0) {
            console.log(data);

            result.forEach((item: any) => {
                let file = item.files[0]
                // F:/Games//GTA5_REDUX_V1.13.zip
                let name: string = file.path

                // 提取文件名称
                name = name.substring(name.lastIndexOf("/") + 1)
                task_list.value.push({
                    id: item.gid,
                    file: {
                        url: file.uris[0].uri,
                        name: name,
                        size: file.length
                    },
                    status: item.status,
                    result: item
                })
            })
            closeAdd()
        }
    } else {
        console.log(data);
        mdui.snackbar({
            message: "发生错误：" + data.error.message,
            position: 'right-top'
        });
    }


}

let tab = 1;

function GetTaskList(tell: number) {
    tab = tell;
    switch (tell) {
        case 1:
            aria2.tellActive(0, 100).then((data: any) => {
                UpTaskList(data);
            })
            break;
        case 2:
            aria2.tellWaiting(0, 100).then((data: any) => {
                UpTaskList(data);
            })
            break;
        case 3:
            aria2.tellStopped(0, 100).then((data: any) => {
                UpTaskList(data);
            })
            break;
    }
}

GetTaskList(1)


</script>

<template>
    <div class="Download">
        <div class="toolbar">
            <div class="toolbar-btn" @click="addUri = true"><i class="mdui-icon material-icons">add</i> 新建任务</div>
        </div>
        <div class="toolbar-tab">
            <div class="mdui-tab" mdui-tab>
                <a @click="GetTaskList(1)" class="mdui-ripple">下载中</a>
                <a @click="GetTaskList(2)" class="mdui-ripple">等待下载</a>
                <a @click="GetTaskList(3)" class="mdui-ripple">已停止下载</a>
            </div>
        </div>
        <div class="task-list">
            <DlownloadList v-for="item in task_list" :key="item.id" :task='item' />
        </div>
        <AddDownload v-if="addUri" @closeAdd="closeAdd" @addTask="addTask" />
    </div>
</template>

<script lang="ts">

export default {
    name: 'DownloadView',
    components: {
        DlownloadList
    }
}
</script>

<style lang="less" scoped>
.Download {
    display: flex;
    flex-direction: column;

    .toolbar {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        padding-bottom: 15px;

        .toolbar-btn {
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

            &:hover {
                background-color: #8ab4f8;
                color: #fff;
            }
        }
    }

    .task-list {
        border-top: 2px solid rgba(0, 0, 0, 0.1);
        padding: 16px;
        display: flex;
        flex-direction: column;
    }
}
</style>
