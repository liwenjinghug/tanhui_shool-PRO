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

// 启用自动登出功能（10分钟无操作自动退出）
router.isReady().then(() => {
  // 等待路由准备好后再启用自动登出
  // 避免在登录页也启动计时器
  const currentPath = router.currentRoute.value.path
  if (currentPath !== '/login') {
    initAutoLogout()
  }
})

// 监听路由变化，登录后启用自动登出
router.afterEach((to) => {
  if (to.path !== '/login' && localStorage.getItem('auth_token')) {
    initAutoLogout()
  }
})
