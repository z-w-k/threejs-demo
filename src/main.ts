import App from './App'
import './assets/css/style.css'
import './theme/tailwind.css'
import 'ant-design-vue/dist/antd.css'; 
import router from './router'
export const pinia = createPinia()


createApp(App).use(pinia).use(router).mount('#app')
