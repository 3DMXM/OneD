import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
import store from './stores'
// import './samples/node-api'

const app =  createApp(App)
app.use(router)
app.use(store)
app.mount('#app').$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })