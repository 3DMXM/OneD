<template>
    <div class="Download">
        <div class="toolbar">
            <div class="toolbar-btn" @click="addUri"><i class="mdui-icon material-icons">add</i> 新建任务</div>
        </div>
        <div class="task-list">
            <DlownloadList 
                v-for="gid in tasks"
                :key="gid"
                :gid='gid' 
                :socket="socket"
                :timer="timer"
                />
        </div>        
    </div>
</template>

<script lang="ts">
import DlownloadList from '@/components/DownloadList.vue'

import {ipcRenderer} from 'electron'


export default {
    name: 'DownloadView',
    components: {
        DlownloadList
    },
    computed:{
        socket(){
            return new WebSocket('ws://localhost:6800/jsonrpc')
        },
    },
    data() {
        let d : any = {
            tasks: [],
            timer: []
        }
        return d
    },
    methods:{
        uuid(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = (c === 'x') ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        addUri(){
            // 新建下载
            // aria2.addUri([secret, ]uris[, options[, position]])
            let id = this.uuid();
            console.log(id);
            
            let urls = 'https://dmod.3dmgame.com/mod/Download/186563'
            let name = '原版风格.zip';
            let savePath = 'C:\\Users\\xiaom\\Downloads\\test'
            let options = {
                'jsonrpc':'2.0',
                'id':id,
                'method':'aria2.addUri',
                'params':[
                    [urls],
                    {
                        'out':name,
                        'dir':savePath,
                    }
                ]
            }
            this.socket.send(JSON.stringify(options))
            
        }
    },
    mounted(){
        // 用websocket监听 ws://localhost:6800/jsonrpc 
        const socket = this.socket
        socket.onopen = () => {
            socket.send(JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "aria2.tellActive",
                params: []
            }))
        }        
        socket.addEventListener('message',(event: any)=>{
            let data = JSON.parse(event.data)
            console.log(data);
            
            // console.log(data)
            if (data.method == "aria2.onDownloadStart"){                
                this.tasks.push(data.params[0]['gid'])
            }
            if (data.method == "aria2.onDownloadComplete"){
                let gid = data.params[0]['gid']               
                clearInterval(this.timer[gid])
            }
        })
        // 监听下载进度
        // aria2.tellStatus(secret, [gid])
        // let gid = "gid"
        // let secret = "secret"
        // let params = [secret, gid]
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
    .task-list{
        border-top: 2px solid rgba(0, 0, 0, 0.1);
        padding: 16px;
        display: flex;
        flex-direction: column;
    }
}
</style>
