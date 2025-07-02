import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
const app = createApp(App)

const pinia = createPinia()
app.use(pinia)          // ✅ Important: register Pinia before using any stores
app.use(router)

app.mount('#app')
// createApp(App).mount('#app')
