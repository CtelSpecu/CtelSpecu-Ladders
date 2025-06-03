<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <nav class="nav-bar">
      <div class="nav-links">
        <a
          href="#"
          :class="{ active: currentTab === 'sub' }"
          @click.prevent="currentTab = 'sub'"
        >共享订阅</a>
        <a
          href="#"
          :class="{ active: currentTab === 'guide' }"
          @click.prevent="currentTab = 'guide'"
        >客户端下载</a>
        <a
          href="#"
          :class="{ active: currentTab === 'freenode' }"
          @click.prevent="currentTab = 'freenode'"
        >免费节点</a>
        <a
          href="#"
          :class="{ active: currentTab === 'recommend' }"
          @click.prevent="currentTab = 'recommend'"
        >机场推荐</a>        <a
          href="#"
          :class="{ active: currentTab === 'freevpn' }"
          @click.prevent="currentTab = 'freevpn'"
        >其他类型</a>
        <a
          href="https://sub.ctelspecu.hxcn.top"
          target="_blank"
        >订阅转换</a>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="page-container">
      <!-- 可用订阅页面 -->
      <div v-if="currentTab === 'sub'" class="subscription-page fade-in">        <!-- 页面标题 -->
        <div class="page-header">
          <h1 class="page-title">共享订阅</h1>
        </div>
          <!-- 订阅卡片列表 -->        <div class="subscription-layout">
          <SubscriptionCard
            v-for="subscription in subscriptions"
            :key="subscription.id"
            :subscription-name="subscription.name"
            :subscription-link="subscription.url"
            :yaml-link="subscription.yamlUrl"
            :rating="subscription.rating"
            :traffic="subscription.traffic"
            :reset="subscription.reset"
            :expire="subscription.expire"
            :maximum-rate="subscription.maxRate"
          />        </div>
      </div>
      <!-- 客户端下载页面 -->
      <div v-else-if="currentTab === 'guide'" class="guide-layout fade-in">
        <ClientGuidePage />
      </div>
      <!-- 免费节点页面 -->
      <div v-else-if="currentTab === 'freenode'" class="freenode-layout fade-in">
        <FreeNodePage />
      </div>
      <!-- 机场推荐页面 -->
      <div v-else-if="currentTab === 'recommend'" class="recommend-layout fade-in">
        <RecommendPage />
      </div>      <!-- 其他类型页面 -->
      <div v-else-if="currentTab === 'freevpn'" class="freevpn-layout fade-in">
        <FreeVpnPage />
      </div>
      <!-- 默认页面 -->
      <div v-else class="recommend-layout fade-in">
        <RecommendPage />
      </div>
    </div>
    
    <!-- 全局通知容器 -->
    <NotificationContainer />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import DownloadCard from './components/DownloadCard.vue';
import TutorialCard from './components/TutorialCard.vue';
import SubscriptionCard from './components/SubscriptionCard.vue';
import NotificationContainer from './components/NotificationContainer.vue';
import ClientListPage from './ClientListPage.vue';
import ClientGuidePage from './pages/ClientGuidePage.vue';
import FreeNodePage from './pages/FreeNodePage.vue';
import RecommendPage from './pages/RecommendPage.vue';
import FreeVpnPage from './pages/FreeVpnPage.vue';
import { useSubscriptions } from './composables/useSubscriptions.js';

const currentTab = ref('sub');

// 使用订阅管理composable
const { 
  subscriptions
} = useSubscriptions();

// 提供给子组件的切换页面函数
const setCurrentTab = (tab) => {
  currentTab.value = tab;
};

// 通过provide提供给子组件
provide('setCurrentTab', setCurrentTab);

// 组件挂载时的初始化
onMounted(() => {
  console.log('订阅数据已加载:', subscriptions.value);
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: transparent;
  position: relative;
  font-family: sans-serif;
  padding: 20px;
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 75%, rgba(102, 126, 234, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 75% 25%, rgba(118, 75, 162, 0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 
    0 8px 32px rgba(102,126,234,0.15),
    0 1px 0 rgba(255, 255, 255, 0.2) inset;
  padding: 0 24px;
  margin-bottom: 32px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.nav-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-bar:hover::before {
  opacity: 1;
}

.nav-links {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  justify-content: center;
}

.nav-links a {
  padding: 16px 24px;
  color: #fff;
  text-decoration: none;
  font-size: 1.1em;
  position: relative;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.nav-links a.active {
  color: #ffd700;
}

.nav-links a.active::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 0;
  right: 0;
  height: 80%;
  background: rgba(255,255,255,0.08);
  border-radius: 8px;
  z-index: -1;
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 2px;
}

.nav-links a:hover {
  color: #ffd700;
}

.nav-links a:hover::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 0;
  right: 0;
  height: 80%;
  background: rgba(255,255,255,0.12);
  border-radius: 8px;
  z-index: -1;
}

/* 页面布局统一 - 参考可用订阅页面样式 */
.guide-layout, .recommend-layout, .freenode-layout {
  width: 100%;
  animation: fadeInUp 0.6s ease-out;
}

/* 订阅页面样式 */
.subscription-page {
  width: 100%;
}

.client-list-container {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 0 16px;
    margin-bottom: 24px;
    border-radius: 16px;
  }

  .nav-links {
    gap: 12px;
    flex-wrap: wrap;
  }

  .nav-links a {
    font-size: 0.95em;
    padding: 12px 16px;
  }

  .guide-layout, .recommend-layout, .freenode-layout {
    /* 移动端保持简洁 */
  }
  
  .page-title {
    font-size: 1.8em;
  }
}

/* 页面切换动画 */
.fade-in {
  animation: fadeInUp 0.6s ease-out;
}

.page-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 2.2em;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
