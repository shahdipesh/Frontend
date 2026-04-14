
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
// After installation you may include the library by importing from node_modules.
//node_modules/primeflex/primeflex.css
import 'primeflex/primeflex.css'


const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.mount('#app')
