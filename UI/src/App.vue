<template>
  <!-- 已登录显示 Layout（带侧边栏） -->
  <Layout v-if="isLoggedIn" />
  <!-- 未登录显示登录页面 -->
  <router-view v-else />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from './components/Layout.vue'

const router = useRouter()

// 计算是否已登录
const isLoggedIn = computed(() => {
  return !!(localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'))
})

onMounted(() => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')

  // 如果未登录且不在登录页，跳转到登录页
  if (!token && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }

  // 如果已登录但在登录页，跳转到首页
  if (token && router.currentRoute.value.path === '/login') {
    router.push('/dashboard')
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
  color: #333;
}

body {
  margin: 0;
}
</style>
