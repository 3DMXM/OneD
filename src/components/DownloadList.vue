
<template>
    <div class="task-item" v-if='data.name'>
        <div class="row">
            <div class="task-name">
                <span>{{data.name}}</span>
            </div>
            <div class="task-item-actions">                    
                <div class="task-item-action" v-if="data.status == 'downloading'" title="暂停" @click="toPause(data)"><i class="mdui-icon material-icons">pause</i></div>
                <div class="task-item-action" v-else-if="data.status == 'pausing'" title="继续" @click="toContinue(data)"><i class="mdui-icon material-icons">play_arrow</i></div>
                <div class="task-item-action" v-else-if="data.status == 'completed'" title="重新下载" @click="toRestart(data)"><i class="mdui-icon material-icons">play_arrow</i></div>

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
            <div class="task-file-size"> {{this.cpeFileSize(data.completedLength)}} / {{ this.cpeFileSize(data.size) }} </div>
            <div class="task-speed-text">{{ downloadSpeed }}</div>
        </div>
    </div>
</template>

<script>

export default {
    name:"DlownloadList",
    props:['gid', 'socket', 'timer'],
    data() {
        return {
            data: {},
        }
    },
    computed:{
        tellStatus(){
            return "tellStatus" + this.randomId()
        },
        progress_style(){
            return {
                width: (this.data.completedLength / this.data.size) * 100 + '%'
            }
        },
        downloadSpeed(){
            let Speed = this.cpeSpeed(this.data.downloadSpeed);

            if (this.data.downloadSpeed == 0) {
                if  (this.data.status == "downloading"){
                    Speed = "连接中..."
                }else if (this.data.status == "pausing"){
                    Speed = "暂停中..."
                }else if (this.data.status == "completed"){
                    Speed = "下载完成"
                }else{
                    Speed = "未知"
                }
            }

            return Speed
        }
    },
    methods: {
        // 暂停
        toPause(data) {
            data.status = "pausing";
            this.stopSpeed()
        },
        // 继续
        toContinue(data) {
            data.status = "downloading";
            this.startSpeed();
        },
        // 重新下载
        toRestart(data) {
            data.status = "downloading";
            this.startSpeed();
        },
        // 计算下载速度 单位：字节/秒
        cpeSpeed(speed) {
            let speedStr = "0kb/s";
            if (speed > 1024 * 1024) {
                speedStr = (speed / 1024 / 1024).toFixed(2) + "MB/s";
            } else if (speed > 1024) {
                speedStr = (speed / 1024).toFixed(2) + "KB/s";
            } else {
                speedStr = speed + "B/s";
            }
            return speedStr;
        },
        // 计算文件大小
        cpeFileSize(size) {
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
        },
        // 生成随机id
        randomId() {
            return Math.random().toString(36).substr(2, 9);
        },

        // 开始获取下载速度
        startSpeed() {
            if (!this.timer[this.gid]){
                this.timer[this.gid] = setInterval(() => {
                    this.socket.send(JSON.stringify({
                        "jsonrpc": "2.0",
                        "id": this.tellStatus,
                        "method": "aria2.tellStatus",
                        'params': [this.gid]
                    }))
                }, 1000);
            }
        },
        // 停止获取下载速度
        stopSpeed() {
            clearInterval(this.timer[this.gid]);
            this.timer[this.gid] = null;
        },
        // 初始化
        init(result) {
            if (!this.data.name){
                this.data.name = '原版风格.zip';
                this.data.size = result.totalLength
                this.data.status = 'downloading';
                this.data.dir = result.dir;
            }
            this.data.downloadSpeed = result.downloadSpeed;
            this.data.completedLength = result.completedLength;
        }
    },
    mounted(){
        this.startSpeed();

        this.socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data)
            if (data.id == this.tellStatus) {
                this.init(data.result);
            }
            // aria2.onDownloadComplete 
            if (data.method == "aria2.onDownloadComplete") {
                this.data.status = 'completed';
                this.stopSpeed();
                this.data.downloadSpeed = 0;
                this.data.completedLength = this.data.size
            }
        });
    },
    destroyed(){
        this.stopSpeed();
    }
}
</script>

<style lang="less" scoped>
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
    .mdui-progress{
        .mdui-progress-determinate{
            background-color: #00ffff;
        }
    }
}
</style>