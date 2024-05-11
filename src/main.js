import { createApp } from 'vue'

import App from './App.vue'

// 导入路由
import router from './router/router.js'

let app =createApp(App)

// 全局使用路由
app.use(router)

app.mount('#app')