import App from './App'
import './assets/css/style.css'
import './theme/tailwind.css'
import 'ant-design-vue/dist/antd.css'; 
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
