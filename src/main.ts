import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// import './samples/node-api'

const app =  createApp(App)
app.use(router)
app.mount('#app').$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })