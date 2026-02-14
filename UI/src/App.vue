<template>
  <div v-if="authenticating" class="loading-screen">
    <div class="spinner"></div>
    <p>正在验证登录状态...</p>
  </div>

  <router-view v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserProfile } from './api/user'

const authenticating = ref(true)

onMounted(async () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')

  if (token) {
    try {
      // 启动应用时验证一次用户信息有效性
      await getUserProfile()
    } catch (e) {
      console.warn('Token无效或已过期:', e)
      localStorage.clear()
      sessionStorage.clear()
    } finally {
      authenticating.value = false
    }
  } else {
    authenticating.value = false
  }
})
</script>

<style>
.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 16px;
  color: #666;
  background: #f5f7fa;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f7fa;
  color: #333;
}
</style>