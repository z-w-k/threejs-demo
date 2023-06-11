import App from './App.vue'
import './assets/css/style.scss'

import router from './router'
export const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
