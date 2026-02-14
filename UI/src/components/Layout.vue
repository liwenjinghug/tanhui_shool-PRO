<template>
  <div class="layout">
    <Sidebar />
    <div class="main">
      <Topbar />
      <TagsView />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import TagsView from './TagsView.vue'
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 20px;
}
</style>