import {createRouter,createWebHashHistory} from 'vue-router'


import Login from '../components/Login.vue'
import Regist from '../components/Regist.vue'
import aaa from '../components/aaa.vue'

let router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/",
            component:Login
        },
        {
            path:"/login",
            component:Login
        },
        {
            path:"/aaa",
            component:aaa
        },
        {
            path:"/regist",
            component:Regist
        }


    ]
})

export default router