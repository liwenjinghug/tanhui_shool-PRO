<template>
  <div class="topbar">
    <div class="topbar-left">
      <button class="menu-toggle" @click="toggleSidebar">☰</button>
      <div class="breadcrumb">
        <span v-for="(item, idx) in breadcrumbs" :key="idx">
          <span v-if="idx > 0">/</span> {{ item }}
        </span>
      </div>
    </div>

    <div class="topbar-right">
      <button class="icon-btn" @click="showSearch">🔍</button>
      <button class="icon-btn" @click="toggleFullscreen">⛶</button>
      <button class="icon-btn notification-btn">
        🔔<span class="badge">3</span>
      </button>

      <div class="user-menu">
        <button class="user-btn" @click="showUserMenu = !showUserMenu">
          <img :src="userAvatar" alt="User" />
          <span>{{ userName }}</span>
        </button>
        <transition name="dropdown">
          <div v-if="showUserMenu" class="dropdown-menu" @click.stop>
            <a href="#" @click.prevent="goToProfile">👤 个人资料</a>
            <a href="#" @click.prevent="goToSettings">⚙️ 系统设置</a>
            <div class="divider"></div>
            <a href="#" @click.prevent="logout" class="logout">🚪 退出登录</a>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// Use relative imports so Vite resolves the files correctly when running from the UI/ folder
import avatarDefault from '../assets/头像.png'
import avatarBoy from '../assets/头像 男孩.png'
import avatarGirl from '../assets/头像 女孩.png'

const router = useRouter()
const route = useRoute()
const showUserMenu = ref(false)

// 用于强制刷新 computed 的响应式变量
const userDataVersion = ref(0)

const userName = computed(() => {
  // 访问 userDataVersion 使其成为依赖项
  userDataVersion.value
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}')
    // 优先显示：nickname（昵称）> realName（真实姓名）> username（用户名）
    return user.nickname || user.realName || user.username || 'User'
  } catch {
    return 'User'
  }
})

const userAvatar = computed(() => {
  // 访问 userDataVersion 使其成为依赖项
  userDataVersion.value
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}')
    const url = user.avatarUrl || 'default'
    if (url === 'boy') return avatarBoy
    if (url === 'girl') return avatarGirl
    if (url === 'default') return avatarDefault
    if (url && (url.startsWith('http') || url.startsWith('data:'))) return url
    return avatarDefault
  } catch {
    return avatarDefault
  }
})

// 监听用户信息更新事件
function handleUserProfileUpdate() {
  console.log('Topbar: 检测到用户信息更新，刷新显示')
  userDataVersion.value++
}

onMounted(() => {
  window.addEventListener('user-profile-updated', handleUserProfileUpdate)
})

onUnmounted(() => {
  window.removeEventListener('user-profile-updated', handleUserProfileUpdate)
})

const breadcrumbs = computed(() => {
  const path = route.path
  if (path === '/dashboard') return ['仪表盘']
  if (path === '/system/user') return ['系统管理', '用户管理']
  if (path === '/system/dorm') return ['系统管理', '宿舍管理']
  if (path === '/report') return ['报表统计']
  return ['页面']
})

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) sidebar.classList.toggle('collapsed')
}

function showSearch() {
  alert('搜索功能开发中...')
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(err)
    })
  } else {
    document.exitFullscreen()
  }
}

function goToProfile() {
  showUserMenu.value = false
  router.push('/profile')
}

function goToSettings() {
  showUserMenu.value = false
  router.push('/settings')
}

function logout() {
  showUserMenu.value = false
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  router.push('/login')
}
</script>

<style scoped>
.topbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topbar-left { flex: 1; }

.menu-toggle {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  border-radius: 4px;
}

.menu-toggle:hover {
  background: #f5f5f5;
}

.breadcrumb {
  font-size: 14px;
  color: #666;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  position: relative;
}

.icon-btn:hover {
  background: #f5f5f5;
}

.notification-btn { position: relative; }
.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu { position: relative; }

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: transparent;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.user-btn img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-btn:hover {
  background: #f5f5f5;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 100;
  padding: 8px 0;
}

.dropdown-menu a {
  display: block;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.dropdown-menu a:hover {
  background: #f5f5f5;
}

.dropdown-menu a.logout {
  color: #f56c6c;
}

.dropdown-menu .divider {
  height: 1px;
  background: #e8e8e8;
  margin: 4px 0;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
