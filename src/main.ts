import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import App from './App.vue'
// @ts-ignore
import { setupCalendar } from 'v-calendar'
// @ts-ignore
import * as mixpanel from 'mixpanel-figma'

mixpanel.init('e497b74427cbb25c36631b7ca1cecf40', {
  debug: true,
  disable_cookie: true,
  disable_persistence: true
})

const app = createApp(App)
app.use(setupCalendar, {}).mount('#app')
