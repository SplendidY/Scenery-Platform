//router.js
import {createRouter,createWebHashHistory} from 'vue-router'

import Loginregist from '../components/Loginregist.vue'
import Service from '../components/Service.vue'

let router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/",
            component:Loginregist
        },
        {
            path:"/login",
            component:Loginregist
        },
        {
            path:"/regist",
            component:Loginregist
        },
        {
            path:"/service",
            component:Service
        }
    ]
})

export default router