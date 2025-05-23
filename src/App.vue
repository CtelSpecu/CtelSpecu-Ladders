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
      <div v-if="currentTab === 'sub'" class="subscription-layout">
        <SubscriptionCard
          subscriptionName="可用订阅1（IP纯净）"
          subscriptionLink="https://43.100.58.97/5b780ba09d5a66c7950914244600b801"
          trafficUsage="220GB"
          expireDate="2025-07-02(每月重置)"
          maximumRate="500Mbps"
        />
        <SubscriptionCard
          subscriptionName="可用订阅2（速度快）"
          subscriptionLink="http://23.145.248.218:3389/api/v1/client/subscribe?token=b248fd5a74963c377a8fa88eac51cefa"
          trafficUsage="168GB"
          expireDate="2025-06-21"
          maximumRate="500Mbps"
        />
        <SubscriptionCard
          subscriptionName="可用订阅3（仅供应急，请勿使用）"
          subscriptionLink="https://sublink.cute-cloud.de/link?token=4f8a0a2715bda1511d190c896cea00f2"
          trafficUsage="300GB"
          expireDate="2026-03-21"
          maximumRate="500Mbps"
        />
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
import { ref, provide } from 'vue';
import DownloadCard from './components/DownloadCard.vue';
import TutorialCard from './components/TutorialCard.vue';
import SubscriptionCard from './components/SubscriptionCard.vue';
import ClientListPage from './ClientListPage.vue';
import ClientGuidePage from './pages/ClientGuidePage.vue';
import FreeNodePage from './pages/FreeNodePage.vue';
import RecommendPage from './pages/RecommendPage.vue';

const currentTab = ref('sub'); // sub: 可用订阅, guide: 下载和使用教程, freenode: 免费节点收集, recommend: 梯子购买推荐

// 提供给子组件的切换页面函数
const setCurrentTab = (tab) => {
  currentTab.value = tab;
};

// 通过provide提供给子组件
provide('setCurrentTab', setCurrentTab);
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
