import { createRouter, createWebHashHistory } from 'vue-router'

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