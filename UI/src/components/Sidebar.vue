<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Logo 区域 -->
    <div class="logo-section">
      <div class="logo-avatar">
        <img src="../assets/logo.png" alt="Logo" />
      </div>
      <div v-if="!isCollapsed" class="logo-text">
        <h2>碳惠校园</h2>
        <p>管理平台</p>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 导航菜单 -->
    <div class="menu">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="menu-item"
        :class="{ active: activeMenu === item.id, 'has-submenu': item.children }"
        @click="toggleMenu(item)"
      >
        <div class="menu-header">
          <i :class="`icon ${item.icon}`"></i>
          <span v-if="!isCollapsed" class="menu-label">{{ item.label }}</span>
          <i
            v-if="item.children && !isCollapsed"
            class="arrow"
            :class="{ open: expandedMenus.includes(item.id) }"
          ></i>
        </div>

        <!-- 子菜单 -->
        <transition name="submenu">
          <div
            v-if="item.children && expandedMenus.includes(item.id) && !isCollapsed"
            class="submenu"
          >
            <router-link
              v-for="child in item.children"
              :key="child.id"
              :to="child.path"
              class="submenu-item"
              :class="{ active: $route.path === child.path }"
              @click.stop
            >
              {{ child.label }}
            </router-link>
          </div>
        </transition>
      </div>
    </div>

    <!-- 底部用户信息（已移除） -->
    <!-- 用户头像和退出登录按钮已按需求移除 -->

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCollapsed = ref(false)
const expandedMenus = ref([])
const activeMenu = ref('')

// 底部用户信息已移除 — 如果将来需要显示，请重新添加计算属性及头像导入

const menuItems = [
  {
    id: 'dashboard',
    label: '仪表盘',
    icon: 'icon-dashboard',
    path: '/dashboard'
  },
  {
    id: 'system',
    label: '系统管理',
    icon: 'icon-settings',
    children: [
      { id: 'user', label: '用户管理', path: '/system/user' },
      { id: 'dorm', label: '宿舍管理', path: '/system/dorm' },
      { id: 'role', label: '角色权限', path: '/system/role' }
    ]
  },
  {
    id: 'carbon',
    label: '碳积分管理',
    icon: 'icon-carbon',
    children: [
      { id: 'record', label: '积分记录', path: '/carbon/record' },
      { id: 'activity', label: '活动管理', path: '/carbon/activity' }
    ]
  },
  {
    id: 'report',
    label: '报表统计',
    icon: 'icon-chart',
    path: '/report'
  }
]

function toggleMenu(item) {
  if (item.children) {
    const idx = expandedMenus.value.indexOf(item.id)
    if (idx > -1) {
      expandedMenus.value.splice(idx, 1)
    } else {
      expandedMenus.value.push(item.id)
    }
  } else if (item.path) {
    router.push(item.path)
  }
  activeMenu.value = item.id
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

onMounted(() => {
  // 默认展开系统管理菜单
  expandedMenus.value = ['system']
})

defineExpose({ toggleSidebar })
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: #f5f6f7;
  color: #333;
  overflow-y: auto;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.sidebar.collapsed {
  width: 0;
  min-width: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
}

.sidebar.collapsed .logo-section,
.sidebar.collapsed .divider,
.sidebar.collapsed .menu {
  opacity: 0;
  pointer-events: none;
}

/* Logo 区域 */
.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.logo-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-text h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #333;
}

.logo-text p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #999;
  opacity: 0.8;
}

.divider {
  height: 1px;
  background: #e8e8e8;
  margin: 0;
}

/* 菜单区域 */
.menu {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}

.menu-item {
  position: relative;
  margin: 0;
  cursor: pointer;
  user-select: none;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  position: relative;
  color: #333;
}

.menu-header:hover {
  background: #f0f0f0;
}

.menu-item.active > .menu-header {
  background: rgba(52, 152, 219, 0.3);
  border-left: 4px solid #3498db;
  padding-left: 12px;
}

.menu-item:not(.active) > .menu-header:hover {
  padding-left: 20px;
}

.icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.icon::before {
  content: '📁';
}

.menu-item[class*='system'] .icon::before {
  content: '⚙️';
}

.menu-item[class*='carbon'] .icon::before {
  content: '🌱';
}

.menu-item[class*='report'] .icon::before {
  content: '📊';
}

.menu-item[class*='dashboard'] .icon::before {
  content: '📈';
}

.menu-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.arrow {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-90deg);
  transition: transform 0.3s ease;
  font-size: 12px;
  flex-shrink: 0;
}

.arrow::before {
  content: '▼';
}

.arrow.open {
  transform: rotate(0deg);
}

/* 子菜单 */
.submenu {
  background: #f5f5f5;
  padding: 8px 0;
}

.submenu-item {
  display: block;
  padding: 10px 16px 10px 52px;
  font-size: 13px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.submenu-item:hover {
  background: #f0f0f0;
  color: #333;
  padding-left: 56px;
}

.submenu-item.active {
  background: #e3f2fd;
  color: #3498db;
  border-left-color: #3498db;
  font-weight: 600;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* 底部用户信息 (已移除) - 相关样式已删除 */

/* 滚动条 */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
