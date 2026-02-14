import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import Login from '../views/Login.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        component: Layout, // 使用布局组件作为父级
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: 'system/user',
                name: 'SystemUser',
                component: () => import('../views/system/user/index.vue')
            },
            {
                path: 'system/dorm',
                name: 'SystemDorm',
                component: () => import('../views/system/dorm/index.vue')
            },
            {
                path: 'system/role',
                name: 'SystemRole',
                component: () => import('../views/system/role/index.vue')
            },
            {
                path: 'carbon/record',
                name: 'CarbonRecord',
                component: () => import('../views/carbon/record/index.vue')
            },
            {
                path: 'carbon/activity',
                name: 'CarbonActivity',
                component: () => import('../views/carbon/activity/index.vue')
            },
            {
                path: 'report',
                name: 'Report',
                component: () => import('../views/report/index.vue')
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('../views/Profile.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫：统一处理权限
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const user = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')

    // 1. 检查 Token 是否存在
    const hasToken = !!(token && token.trim() !== '' && user)

    if (to.path === '/login') {
        // 如果已登录还访问登录页，直接去首页
        if (hasToken) {
            next('/dashboard')
        } else {
            next()
        }
    } else {
        // 如果未登录访问其他页，强制去登录页
        if (hasToken) {
            next()
        } else {
            next('/login')
        }
    }
})

export default router