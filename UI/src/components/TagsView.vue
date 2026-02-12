<template>
  <div class="tags-view" v-if="tags.length > 0">
    <div class="tags-container">
      <div
        v-for="tag in tags"
        :key="tag.path"
        class="tag-item"
        :class="{ active: isActive(tag) }"
        @click="goToTag(tag)"
      >
        <span>{{ tag.label }}</span>
        <i v-if="tags.length > 1" class="close-icon" @click.stop="closeTag(tag)">✕</i>
      </div>
    </div>
    <button v-if="tags.length > 1" class="close-all" @click="closeAllTags">关闭所有</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const tags = ref([])

const tagLabels = {
  '/dashboard': '仪表盘',
  '/system/user': '用户管理',
  '/system/dorm': '宿舍管理',
  '/system/role': '角色权限',
  '/carbon/record': '积分记录',
  '/carbon/activity': '活动管理',
  '/report': '报表统计'
}

function getTagLabel(path) {
  return tagLabels[path] || path
}

function addTag() {
  const currentPath = route.path
  if (tags.value.some(t => t.path === currentPath)) return

  tags.value.push({
    label: getTagLabel(currentPath),
    path: currentPath
  })
}

function isActive(tag) {
  return route.path === tag.path
}

function goToTag(tag) {
  router.push(tag.path)
}

function closeTag(tag) {
  const idx = tags.value.indexOf(tag)
  tags.value.splice(idx, 1)

  if (isActive(tag) && tags.value.length > 0) {
    router.push(tags.value[Math.max(0, idx - 1)].path)
  } else if (tags.value.length === 0) {
    router.push('/dashboard')
  }
}

function closeAllTags() {
  tags.value = []
  router.push('/dashboard')
}

watch(() => route.path, () => {
  addTag()
}, { immediate: true })
</script>

<style scoped>
.tags-view {
  height: 40px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  overflow-x: auto;
}

.tags-container {
  display: flex;
  gap: 8px;
  flex: 1;
  overflow-x: auto;
}

.tags-container::-webkit-scrollbar {
  height: 4px;
}

.tags-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.tag-item:hover {
  color: #333;
}

.tag-item.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.close-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.close-icon:hover {
  opacity: 1;
}

.close-all {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.close-all:hover {
  background: #f5f5f5;
}
</style>

