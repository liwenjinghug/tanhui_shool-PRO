import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/system/user',
    name: 'SystemUser',
    component: () => import('../views/system/user/index.vue')
  },
  {
    path: '/system/dorm',
    name: 'SystemDorm',
    component: () => import('../views/system/dorm/index.vue')
  },
  {
    path: '/system/role',
    name: 'SystemRole',
    component: () => import('../views/system/role/index.vue')
  },
  {
    path: '/carbon/record',
    name: 'CarbonRecord',
    component: () => import('../views/carbon/record/index.vue')
  },
  {
    path: '/carbon/activity',
    name: 'CarbonActivity',
    component: () => import('../views/carbon/activity/index.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/report/index.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  const user = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')

  // 验证 token 是否有效（简单检查：token 存在且不为空，user 数据完整）
  const isValidToken = token && token.trim() !== '' && user

  // 如果 token 无效但存在，清除旧数据
  if (token && !isValidToken) {
    console.warn('检测到无效的 token，清除本地存储')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_user')
  }

  // 如果已登录（有效 token）
  if (isValidToken) {
    // 如果正在访问登录页，跳转到首页
    if (to.path === '/login') {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    // 如果未登录，只允许访问登录页
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
