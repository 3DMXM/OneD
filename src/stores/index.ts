// import { webContents } from 'electron';
import { createStore, StoreOptions } from 'vuex'

import aria2 from '../model/aria2'

const store = createStore({
    state() {
        // state 是静态数据
        return {
            task_list: Array<object>(),
            aria2: new aria2()
        }
    },
    getters: {
        // getter 可以认为是store 的计算属性        
        uuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = (c === 'x') ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

    },
    actions: {
        async init(state) {
            let socket = state.state.aria2;
            socket.message().then((data: any) => {
                // console.log(data);
                // if (data.result && data.result.length > 0) {
                //     state.commit('update_task_list', data.result);
                // }
                // if (data.method == 'aria2.onDownloadStart') {
                //     console.log(`[oned]:开始下载:${data.params[0].gid}`);
                // }
                console.log(`[oned]:初始化完成`);
                
            });
        },
        // async get_task_list(state) {
        //     let aria2 = state.state.aria2;
        //     if (aria2.readyState() === 1) {
        //         aria2.send({
        //             jsonrpc: "2.0",
        //             method: "aria2.tellActive",
        //             params: []
        //         })
        //     }
        // }
    },
    mutations: {
        // 直接修改state
        update_task_list(state: any, data: any) {
            console.log(data);

            state.task_list = data;
        },
    }
})

// 暴露
export default store