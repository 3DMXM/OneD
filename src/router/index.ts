import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
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
            name:"Gownload",
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