<script setup lang="ts">
import { useStore } from 'vuex'
import { ref, reactive, computed, toRefs } from 'vue'
import { number } from 'yargs';

const Store = useStore();
let aria2 = Store.state.aria2
let aria2_data: any = null;

// 定时器
let timer: any = null;


let props: any = defineProps({
    task: Object
})

let { task } = toRefs(props)
let file = reactive(task.value.file)
// let status = ref(task.value.status) // 下载状态
let completedLength = ref(0); // 已下载大小

let status = ref(task.value.status) // 下载状态
switch (task.value.status) {
    /**
     * active   正在下载的状态. 
     * waiting  列队中,等待开始下载. 
     * paused   暂停中,. 
     * error    由于错误而停止. 
     * complete 已停止或已完成. 
     * removed  用户删除的下载.
     */
    case "active":
        status.value = "downloading";
        break;
    case "waiting":
        status.value = "waiting";
        break;
    case "paused":
        status.value = "paused"
        break;
    case "error":
        status.value = "error"
        break;
    default:
        status.value = "completed"
        break;
}

if (status.value == "downloading") {
    timer = setInterval(getProgress, 1000);
}

let errmsg = computed(() => {
    if (task.value.status == "error") {
        return `错误: ${task.value.result.errorMessage}`
    } else {
        return null
    }
})


// 每隔1秒获取一次下载进度
function getProgress() {
    aria2.tellStatus(task.value.id).then((data: any) => {
        let result = data.result;

        console.log(result);

        completedLength.value = result.completedLength;
        file.downloadSpeed = result.downloadSpeed;

        if (result.status == "complete") {
            clearInterval(timer);
            task.value.status = "completed";
        }
    })
}

// 进度条 百分百
let progress = computed(() => {
    let size: number = task.value.file.size;
    let completed: number = completedLength.value;

    let progress: number = completed / size * 100;

    console.log(size, completedLength.value);
    if (status.value == "completed") {
        progress = 100;
    }

    // 保留2位小数
    return progress.toFixed(2);

})
let progress_style = computed(() => {
    return {
        width: `${progress.value}%`
    }
})
// 下载速度
let downloadSpeed = computed(() => {
    let Speed = cpeSpeed(file.downloadSpeed);
    if (!file.downloadSpeed) {
        console.log(status.value);

        if (status.value == "downloading") {
            Speed = "连接中..."
        } else if (status.value == "pausing") {
            Speed = "暂停中..."
        } else if (status.value == "completed") {
            Speed = "下载完成"
        } else {
            Speed = "未知"
        }
    }
    return Speed
})


// 暂停
function toPause() {
    aria2.pause(task.value.id).then((data: any) => {
        console.log(data);

        clearInterval(timer);
        status.value = "pausing"
    })

}
// 继续
function toContinue() {
    aria2.unpause(task.value.id).then((data: any) => {
        console.log(data);
        timer = setInterval(getProgress, 1000);
        status.value = "downloading"
    })


    // timer = setInterval(getProgress, 1000);
    // status.value = "downloading"
}
// 重新下载
function toRestart() {

}
// 格式化文件大小
function cpeFileSize(size: number) {
    let sizeStr = "0kb";
    if (size > 1024 * 1024 * 1024) {
        sizeStr = (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
    } else if (size > 1024 * 1024) {
        sizeStr = (size / 1024 / 1024).toFixed(2) + "MB";
    } else if (size > 1024) {
        sizeStr = (size / 1024).toFixed(2) + "KB";
    } else {
        sizeStr = size + "B";
    }
    return sizeStr;
}
// 计算下载速度 单位：字节/秒
function cpeSpeed(speed: number) {
    let speedStr = "0kb/s";
    if (speed > 1024 * 1024) {
        speedStr = (speed / 1024 / 1024).toFixed(2) + "MB/s";
    } else if (speed > 1024) {
        speedStr = (speed / 1024).toFixed(2) + "KB/s";
    } else {
        speedStr = speed + "B/s";
    }
    return speedStr;
}

</script>
<template>
    <div class="task-item">
        <div class="row">
            <div class="task-name" :title="file.name">
                <span>{{ file.name }}</span>
            </div>
            <div class="task-item-actions">
                <div class="task-item-action" v-if="status == 'downloading'" title="暂停" @click="toPause()"><i
                        class="mdui-icon material-icons">pause</i></div>
                <div class="task-item-action" v-else-if="status == 'paused'" title="继续" @click="toContinue()"><i
                        class="mdui-icon material-icons">play_arrow</i></div>
                <div class="task-item-action" v-else-if="status == 'completed' || status == 'error' " title="重新下载" @click="toRestart()">
                    <i class="mdui-icon material-icons">play_arrow</i>
                </div>

                <div class="task-item-action" title="删除"><i class="mdui-icon material-icons">delete</i></div>
                <div class="task-item-action" title="打开文件夹"><i class="mdui-icon material-icons">folder</i></div>
                <div class="task-item-action" title="复制下载地址"><i class="mdui-icon material-icons">insert_link</i></div>
                <div class="task-item-action" title="详细信息"><i class="mdui-icon material-icons">info_outline</i></div>

            </div>
        </div>
        <div class="task-progress row">
            <div class="mdui-progress">
                <div class="mdui-progress-determinate" :style="progress_style"></div>
            </div>
        </div>
        <div class="row task-progress-info">
            <div class="task-file-size"> {{ cpeFileSize(completedLength) }} / {{ cpeFileSize(file.size) }}
                <span>{{ progress }}%</span>
            </div>
            <div class="task-err" v-if="errmsg">{{ errmsg }}</div>
            <div class="task-speed-text" v-else>{{ downloadSpeed }}</div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "DlownloadList",
}
</script>

<style lang="less" scoped>
.task-item {
    border: 1px solid #555;
    padding: 15px;
    background-color: #2d2d2d;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    .task-name {
        flex: 1 1 auto;
        color: #eee;
    }

    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .task-item-actions {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 0;
            background-color: #4a4a4a;
            border-color: #5f5f5f;
            border-radius: 14px;
            border: 1px solid #F5F5F5;

            .task-item-action {
                display: inline-block;
                padding: 5px;
                margin: 0 4px;
                font-size: 0;
                cursor: pointer;

                &:hover {
                    opacity: .7;
                }

                i {
                    font-size: 15px;
                }
            }

        }
    }

    .task-progress {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .task-progress-info {
        .task-speed-text {
            color: #9B9B9B;
            font-size: 12px;
            height: 0.875rem;
            line-height: 0.875rem;
            display: inline-block;
            vertical-align: middle;
        }

        .task-file-size {
            span {
                color: #9B9B9B;
                font-size: 12px;
                margin-left: 15px;
            }
        }

        .task-err {
            font-size: 12px;
            color: rgb(202, 122, 122);
        }
    }

    .mdui-progress {
        .mdui-progress-determinate {
            background-color: #00ffff;
        }
    }
}
</style>