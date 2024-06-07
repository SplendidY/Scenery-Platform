//main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/router.js'
import store from './jses/store.js'; 
const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
