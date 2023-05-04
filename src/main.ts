import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import App from './App.vue'
// @ts-ignore
import { setupCalendar } from 'v-calendar'

const app = createApp(App)
app.use(setupCalendar, {}).mount('#app')
