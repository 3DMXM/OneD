// import { webContents } from 'electron';
import { createStore, StoreOptions } from 'vuex'

import aria2 from '../model/aria2'

const store = createStore({
    state() {
        // state 是静态数据
        return {
            task_list: Array<object>(),
            aria2: new aria2(),
            save_path: 'C:\\Downloads',
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
                console.log(`[oned]:初始化完成`);
            });
        },
    },
    mutations: {
        // 直接修改state
        update_task_list(state: any, data: any) {
            console.log(data);
            state.task_list = data;
        },
        change_save_path(state: any, path: string) {
            state.save_path = path;
        }
    }
})

// 暴露
export default store