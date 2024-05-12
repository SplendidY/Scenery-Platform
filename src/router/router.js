import {createRouter,createWebHashHistory} from 'vue-router'

import Loginregist from '../components/Loginregist.vue'
import Visitor from '../components/Visitor.vue'

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
            path:"/visitor",
            component:Visitor
        }
    ]
})

export default router