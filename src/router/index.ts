import { createRouter, createWebHashHistory } from 'vue-router'
// import {join} from 'path'

// const ROOT_PATH = {
//     // /dist
//     dist: join(__dirname, '../..'),
//     // /dist or /public
//     public: join(__dirname, import.meta.env.MODE == "production"  ? '../..' : '../../../public'),
// }


// let History = "";
// if (import.meta.env.MODE == "production"){
//     History = new URL('../..',import.meta.url).origin
// }

// console.log(import.meta.url);



const router = createRouter({
    history: createWebHashHistory(),    // createWebHistory
    routes:[
        {
            path:"/", 
            name:"Home",
            component:()=>import("../views/HomeView.vue")
        },        
        {
            path:"/game",
            name:"Game",
            component:()=>import("../views/GameView.vue")
        },
        {
            path:"/download",
            name:"Download",
            component:()=>import("../views/DownloadView.vue")
        },
        {
            path:"/setting",
            name:"Setting",
            component:()=>import("../views/SettingView.vue")
        }
    ]
})



export default router