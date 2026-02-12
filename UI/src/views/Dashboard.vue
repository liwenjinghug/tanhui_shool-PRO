<template>
  <div class="dashboard">
    <!-- 英雄标题区 -->
    <div class="hero">
      <h1 class="hero-title">碳惠校园</h1>
      <p class="hero-subtitle">校园激励低碳管理平台</p>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索学生或资源..."
          @keyup.enter="onSearch"
        />
        <button class="search-btn" @click="onSearch">→</button>
      </div>
    </div>

    <!-- 功能卡片网格 -->
    <div class="features-grid">
      <div
        v-for="feature in features"
        :key="feature.id"
        class="feature-card"
        @mouseenter="hoveredCard = feature.id"
        @mouseleave="hoveredCard = null"
        @click="goToFeature(feature)"
      >
        <div class="card-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const hoveredCard = ref(null)

const features = [
  {
    id: 'users',
    icon: '👤',
    title: '用户管理',
    description: '管理系统用户信息、权限和角色',
    path: '/system/user'
  },
  {
    id: 'dorms',
    icon: '🏠',
    title: '宿舍管理',
    description: '管理校园宿舍和学生住宿信息',
    path: '/system/dorm'
  },
  {
    id: 'carbon',
    icon: '🌱',
    title: '碳积分',
    description: '查看和管理用户的碳积分数据',
    path: '/carbon/record'
  },
  {
    id: 'report',
    icon: '📊',
    title: '数据统计',
    description: '查看系统的数据统计和分析报告',
    path: '/report'
  }
]

function onSearch() {
  if (searchQuery.value.trim()) {
    alert(`搜索: ${searchQuery.value}`)
  }
}

function goToFeature(feature) {
  router.push(feature.path)
}
</script>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 英雄标题区 */
.hero {
  text-align: center;
  margin-bottom: 48px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 18px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 300;
}

/* 搜索框区 */
.search-section {
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
}

.search-box {
  width: 100%;
  max-width: 500px;
  display: flex;
  gap: 8px;
  background: white;
  border-radius: 24px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 20px;
  font-size: 16px;
  color: #333;
  outline: none;
}

.search-box input::placeholder {
  color: #999;
}

.search-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

/* 功能卡片网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: #3498db;
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.feature-card:hover .card-icon {
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 12px;
  font-weight: 600;
}

.feature-card p {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}</style>
