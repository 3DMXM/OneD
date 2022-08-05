<script setup lang="ts">
import { useStore } from 'vuex'
import { ref, Ref, computed, watch } from 'vue'
import mdui from "mdui"


import DlownloadList from '@/components/DownloadList.vue'
import AddDownload from '@/components/AddDownload.vue'


const Store = useStore();


let task_list: Ref<Array<any>> = ref([]);

let aria2 = Store.state.aria2;

// let state_task_list = Store.state.task_list;
// let state_task_list = computed(() => {
//     return Store.state.task_list;
// })
// watch(state_task_list, (newVal, oldVal) => {
//     // console.log(`state_task_list:`,newVal);
//     state_task_list.value.forEach((item: any) => {
//         let file = item.files[0]
//         // F:/Games//GTA5_REDUX_V1.13.zip
//         let name: string = file.path

//         // 提取文件名称
//         name = name.substring(name.lastIndexOf("/") + 1)
//         task_list.value.push({
//             id: item.gid,
//             file: {
//                 url: file.uris[0].uri,
//                 name: name,
//                 size: file.length
//             }
//         })
//     });
// })






let addUri = ref(false);



function closeAdd() {
    addUri.value = false;
}

function addTask(data: any) {
    // console.log(data);
    let file = {
        url: data['@microsoft.graph.downloadUrl'],
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

    let SavePath = "F:\\test\\";

    let id = aria2.addUri([file.url], file.name, SavePath, data.id);

    // task_list.value.push({
    //     id, file
    // });
    GetTaskList(tab)
    closeAdd()
}

function UpTaskList(result: Array<any>) {

    // 清空 task_list
    task_list.value = [];

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
}

let tab = 1;

function GetTaskList(tell: number) {
    tab = tell;
    switch (tell) {
        case 1:
            aria2.tellActive(0, 100).then((data: any) => {
                let result = data.result;
                UpTaskList(result);
            })
            break;
        case 2:
            aria2.tellWaiting(0, 100).then((data: any) => {
                let result = data.result;
                UpTaskList(result);

            })
            break;
        case 3:
            aria2.tellStopped(0, 100).then((data: any) => {
                let result = data.result;
                UpTaskList(result);
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
