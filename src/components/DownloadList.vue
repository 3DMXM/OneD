
<template>
    <div class="DlownloadList">
        <div class="task-list">
            <div class="task-item" 
                v-for="item in dlList"
                :key="item.id"
                >
                <div class="row">
                    <div class="task-name">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="task-item-actions">                    
                        <div class="task-item-action" v-if="item.status == 'downloading'" title="暂停" @click="toPause(item)"><i class="mdui-icon material-icons">pause</i></div>
                        <div class="task-item-action" v-else-if="item.status == 'pausing'" title="继续" @click="toContinue(item)"><i class="mdui-icon material-icons">play_arrow</i></div>
                        <div class="task-item-action" v-else-if="item.status == 'completed'" title="重新下载" @click="toRestart(item)"><i class="mdui-icon material-icons">play_arrow</i></div>

                        <div class="task-item-action" title="删除"><i class="mdui-icon material-icons">delete</i></div>
                        <div class="task-item-action" title="打开文件夹"><i class="mdui-icon material-icons">folder</i></div>
                        <div class="task-item-action" title="复制下载地址"><i class="mdui-icon material-icons">insert_link</i></div>
                        <div class="task-item-action" title="详细信息"><i class="mdui-icon material-icons">info_outline</i></div>

                    </div>
                </div>
                <div class="task-progress row">
                    <div class="mdui-progress">
                        <div class="mdui-progress-determinate" :style="{width: item.progress * 100 + '%'}"></div>
                    </div>
                </div>
                <div class="row task-progress-info">
                    <div class="task-file-size"> 100GB / {{ item.size }} </div>
                    <div class="task-speed-text">{{ cpeSpeed( item.speed)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name:"DlownloadList",
    data() {
        return {
            dlList: [
                {
                    id:"1",
                    name:"荒野大镖客",
                    status:"downloading", // downloading | pausing | completed
                    progress:0.5,
                    speed: 0,
                    size:"120GB",
                    time:0,
                    dlurl:"...",
                }
            ],
        }
    },
    methods: {
        toPause(item: { status: Object; }) {
            item.status = "pausing";
        },
        toContinue(item: { status: Object; }) {
            item.status = "downloading";
        },
        toRestart(item: { status: Object; }) {
            item.status = "downloading";
        },
        // 计算下载速度 单位：字节/秒
        cpeSpeed(speed: number) {
            let speedStr = "";
            if (speed > 1024 * 1024) {
                speedStr = (speed / 1024 / 1024).toFixed(2) + "MB/s";
            } else if (speed > 1024) {
                speedStr = (speed / 1024).toFixed(2) + "KB/s";
            } else {
                speedStr = speed + "B/s";
            }
            return speedStr;
        },
    },
}
</script>

<style lang="less" scoped>
.DlownloadList{
    .task-list{
        border-top: 2px solid rgba(0, 0, 0, 0.1);
        padding: 16px;
        display: flex;
        flex-direction: column;

        .task-item{
            border: 1px solid #555;
            padding: 15px;
            background-color: #2d2d2d;
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;

            .task-name{
                color: #eee;
            }

            .row{
                display: flex;
                align-items:center ;
                justify-content: space-between;
                .task-item-actions{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin:0;
                    background-color: #4a4a4a;
                    border-color: #5f5f5f;
                    border-radius: 14px;                
                    border: 1px solid #F5F5F5;
                    
                    .task-item-action{
                        display: inline-block;
                        padding: 5px;
                        margin: 0 4px;
                        font-size: 0;
                        cursor: pointer;

                        &:hover{
                            opacity: .7;
                        }
                        i{
                            font-size: 15px;
                        }
                    }

                }
            }

            .task-progress{
                margin-top: 15px;
                margin-bottom: 15px;
            }

            .task-progress-info{
                .task-speed-text{
                    color: #9B9B9B;  
                    font-size: 12px;              
                    height: 0.875rem;
                    line-height: 0.875rem;
                    display: inline-block;
                    vertical-align: middle;
                }
            }
            
        }
    }
}
</style>