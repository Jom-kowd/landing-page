import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <-- Add this

createApp(App).use(router).mount('#app') // <-- Chain .use(router)