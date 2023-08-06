import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import 'amfe-flexible'
import './style/index.less'
// 2. 引入组件样式
import 'vant/lib/index.css'

const app = createApp(App)

app.use(router)

app.use(store)

app.mount('#app')
