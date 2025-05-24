<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <nav class="nav-bar">
      <div class="nav-links">
        <a
          href="#"
          :class="{ active: currentTab === 'sub' }"
          @click.prevent="currentTab = 'sub'"
        >可用付费订阅</a>
        <a
          href="#"
          :class="{ active: currentTab === 'guide' }"
          @click.prevent="currentTab = 'guide'"
        >下载和使用教程</a>
        <a
          href="#"
          :class="{ active: currentTab === 'freenode' }"
          @click.prevent="currentTab = 'freenode'"
        >免费节点收集</a>
        <a
          href="#"
          :class="{ active: currentTab === 'recommend' }"
          @click.prevent="currentTab = 'recommend'"
        >梯子购买推荐</a>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="page-container">
      <!-- 可用订阅页面 -->
      <div v-if="currentTab === 'sub'" class="subscription-page">
        <!-- 页面标题和刷新按钮 -->
        <div class="page-header">
          <h1 class="page-title">可用付费订阅</h1>
          <div class="page-actions">
            <button 
              class="refresh-btn" 
              @click="handleRefresh" 
              :disabled="isLoading"
              :class="{ loading: isLoading }"
            >
              <span class="refresh-icon">🔄</span>
              {{ isLoading ? '刷新中...' : '刷新数据' }}
            </button>
          </div>
        </div>
        
        <!-- 最后更新时间 -->
        <div v-if="lastUpdateTime" class="update-info">
          最后更新: {{ new Date(lastUpdateTime).toLocaleString('zh-CN') }}
        </div>
        
        <!-- 订阅卡片列表 -->
        <div class="subscription-layout">
          <SubscriptionCard
            v-for="subscription in subscriptions"
            :key="subscription.id"
            :subscription-name="subscription.name"
            :subscription-link="subscription.url"
            :rating="subscription.rating"
            :traffic="subscription.traffic"
            :reset="subscription.reset"
            :expire="subscription.expire"
            :maximum-rate="subscription.maxRate"
          />
        </div>
      </div>
      <!-- 下载和使用教程页面 -->
      <div v-else-if="currentTab === 'guide'" class="guide-layout">
        <ClientGuidePage />
      </div>
      <!-- 免费节点收集页面 -->
      <div v-else-if="currentTab === 'freenode'" class="freenode-layout">
        <FreeNodePage />
      </div>
      <!-- 梯子购买推荐页面 -->
      <div v-else class="recommend-layout">
        <RecommendPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import DownloadCard from './components/DownloadCard.vue';
import TutorialCard from './components/TutorialCard.vue';
import SubscriptionCard from './components/SubscriptionCard.vue';
import ClientListPage from './ClientListPage.vue';
import ClientGuidePage from './pages/ClientGuidePage.vue';
import FreeNodePage from './pages/FreeNodePage.vue';
import RecommendPage from './pages/RecommendPage.vue';
import { useSubscriptions } from './composables/useSubscriptions.js';

const currentTab = ref('sub');

// 使用订阅管理composable
const { 
  subscriptions, 
  isLoading, 
  lastUpdateTime, 
  refreshSubscriptions 
} = useSubscriptions();

// 提供给子组件的切换页面函数
const setCurrentTab = (tab) => {
  currentTab.value = tab;
};

// 通过provide提供给子组件
provide('setCurrentTab', setCurrentTab);

// 手动刷新按钮的处理函数
const handleRefresh = async () => {
  await refreshSubscriptions();
};

// 组件挂载时的初始化
onMounted(() => {
  console.log('订阅数据已加载:', subscriptions.value);
  // 可以在这里添加自动刷新逻辑
});
</script>

<style scoped>
.app-container {
  font-family: sans-serif;
  padding: 20px;
  background-color: #f0f2f5; /* 简约背景色 */
  min-height: 100vh;
}

.main-navbar {
  width: 100%;
  max-width: 900px;
  margin: 0 auto 32px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 16px 0 8px 0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.main-navbar button {
  background: none;
  border: none;
  font-size: 1.1em;
  padding: 8px 28px;
  border-radius: 6px;
  color: #333;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.main-navbar button.active,
.main-navbar button:hover {
  background: #007bff;
  color: #fff;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 页面容器 */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
}

/* 导航栏样式 */
.nav-bar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  margin-bottom: 24px;
}

.nav-links {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  justify-content: center;
}

.nav-links a {
  padding: 16px 0;
  color: #666;
  text-decoration: none;
  font-size: 1.1em;
  position: relative;
}

.nav-links a.active {
  color: #007bff;
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #007bff;
}

.nav-links a:hover {
  color: #007bff;
}

/* 指南页面布局 */
.guide-layout, .recommend-layout, .freenode-layout {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.client-list-container {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 0 16px;
  }

  .nav-links {
    gap: 16px;
  }

  .nav-links a {
    font-size: 1em;
    padding: 12px 0;
  }

  .guide-layout {
    padding: 16px;
  }
}

/* 订阅页面样式 */
.subscription-page {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 2em;
  font-weight: 600;
}

.page-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.refresh-btn.loading .refresh-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.refresh-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.update-info {
  background-color: #f8f9fa;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9em;
  color: #6c757d;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #e9ecef;
}

/* 可用订阅页面布局 */
.subscription-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

/* 软件下载和教程页面布局 */
.tutorial-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tutorial-layout .top-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.tutorial-layout .bottom-row {
  width: 100%;
}

/* 响应式布局 */
@media (max-width: 1199px) {
  .subscription-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 991px) {
  .tutorial-layout .top-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .subscription-layout {
    grid-template-columns: 1fr;
  }
  
  .page-container {
    padding: 0 12px;
  }
  
  .subscription-layout,
  .tutorial-layout {
    gap: 16px;
  }
}

@media (max-width: 900px) {
  .main-navbar, .card-container {
    max-width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
  .tutorial-layout .row {
    flex-direction: column;
    gap: 16px;
  }
}

.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}
</style>
