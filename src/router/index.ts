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
            component:()=>""
        },
        {
            path:"/download",
            name:"Gownload",
            component:()=>""
        },
        {
            path:"/setting",
            name:"Setting",
            component:()=>""
        }
    ]
})



export default router