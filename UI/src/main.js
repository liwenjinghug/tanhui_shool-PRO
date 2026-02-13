import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import { initAutoLogout } from './utils/autoLogout'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// 自动登出功能已禁用
// router.isReady().then(() => {
//   const currentPath = router.currentRoute.value.path
//   if (currentPath !== '/login') {
//     initAutoLogout()
//   }
// })

// router.afterEach((to) => {
//   if (to.path !== '/login' && localStorage.getItem('auth_token')) {
//     initAutoLogout()
//   }
// })
