<template>
  <div class="app-container">
    <!-- 主题切换按钮 -->
    <div class="theme-toggle-container">
      <ThemeToggle />
    </div>
    
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
      <div v-if="currentTab === 'sub'" class="subscription-page fade-in-scale">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1 class="page-title">共享订阅</h1>
        </div>
        <!-- 订阅卡片列表 -->
        <div class="subscription-layout">
          <SubscriptionCard
            v-for="subscription in subscriptions"
            :key="subscription.id"
            :subscription-id="subscription.id"
            :subscription-name="subscription.name"
            :subscription-link="subscription.url"
            :yaml-link="subscription.yamlUrl"
            :rating="subscription.rating"
            :traffic="subscription.traffic"
            :reset="subscription.reset"
            :expire="subscription.expire"
            :maximum-rate="subscription.maxRate"
            @navigate="handleNavigation"
          />
        </div>
      </div>
      <!-- 客户端下载页面 -->
      <div v-else-if="currentTab === 'guide'" class="guide-layout slide-in-left">
        <ClientGuidePage />
      </div>
      <!-- 免费节点页面 -->
      <div v-else-if="currentTab === 'freenode'" class="freenode-layout slide-in-right">
        <FreeNodePage />
      </div>
      <!-- 机场推荐页面 -->
      <div v-else-if="currentTab === 'recommend'" class="recommend-layout fade-in-up">
        <RecommendPage />
      </div>
      <!-- 其他类型页面 -->
      <div v-else-if="currentTab === 'freevpn'" class="freevpn-layout slide-in-left">
        <FreeVpnPage />
      </div>
      <!-- 默认页面 -->
      <div v-else class="recommend-layout fade-in-up">
        <RecommendPage />
      </div>
    </div>
    <!-- 全局通知容器 -->
    <NotificationContainer />
    
    <!-- 客户端更新提醒弹窗 -->
    <UpdateModal />
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, defineAsyncComponent } from 'vue';
import SubscriptionCard from './components/SubscriptionCard.vue';
import NotificationContainer from './components/NotificationContainer.vue';
import UpdateModal from './components/UpdateModal.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import AppFooter from './components/AppFooter.vue';
// 懒加载页面组件以提高初始加载性能
const ClientGuidePage = defineAsyncComponent(() => import('./pages/ClientGuidePage.vue'));
const FreeNodePage = defineAsyncComponent(() => import('./pages/FreeNodePage.vue'));
const RecommendPage = defineAsyncComponent(() => import('./pages/RecommendPage.vue'));
const FreeVpnPage = defineAsyncComponent(() => import('./pages/FreeVpnPage.vue'));
import { useSubscriptions } from './composables/useSubscriptions.js';
import { useTheme } from './composables/useTheme.js';

const currentTab = ref('sub');

// 使用主题管理composable
const { 
  isDark,
  toggleTheme,
  setTheme
} = useTheme();

// 使用订阅管理composable
const { 
  subscriptions
} = useSubscriptions();

// 提供给子组件的切换页面函数
const setCurrentTab = (tab) => {
  currentTab.value = tab;
};

// 处理来自订阅卡片的导航事件
const handleNavigation = (page) => {
  currentTab.value = page;
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
  color: var(--text-normal);
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 75%, rgba(15, 182, 214, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 75% 25%, rgba(244, 86, 157, 0.06) 0%, transparent 50%);
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
  background: var(--background-secondary);
  border: 1px solid var(--text-accent);
  border-radius: 8px;
  box-shadow: var(--accent-shadow);
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
  color: var(--text-normal);
  cursor: pointer;
  transition: all 0.18s ease;
}
.main-navbar button.active,
.main-navbar button:hover {
  background: var(--main-gradient);
  color: var(--text-bright);
  box-shadow: var(--accent-shadow);
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

/* Aurora Enhanced Navigation Bar */
.nav-bar {
  background: var(--background-glass);
  border: 1px solid var(--border-primary);
  box-shadow: var(--soft-shadow);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border-radius: 12px;
  position: sticky;
  top: var(--spacing-md);
  z-index: 100;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform, filter;
  transform: translateZ(0);
}

.nav-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sub-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.nav-bar:hover::before {
  opacity: 0.05;
}


.nav-links {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.nav-links a {
  padding: var(--spacing-sm) var(--spacing-lg);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  position: relative;
  font-weight: 500;
  border-radius: 8px;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border: 1px solid transparent;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
}

.nav-links a:hover {
  color: var(--text-primary);
  background: var(--background-tertiary);
}

.nav-links a.active {
  color: var(--text-accent);
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--text-accent);
  font-weight: 600;
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--text-accent);
  border-radius: 1px;
}

/* Aurora Enhanced Page Layouts */
.guide-layout, .recommend-layout, .freenode-layout {
  width: 100%;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  padding: var(--spacing-lg);
  border-radius: 16px;
  margin-bottom: var(--spacing-xl);
  background: var(--background-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-primary);
}

/* Aurora Enhanced Subscription Page */
.subscription-page {
  width: 100%;
  padding: var(--spacing-xl);
  background: var(--background-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  margin-bottom: var(--spacing-xl);
}

.client-list-container {
  margin-top: var(--spacing-md);
}

/* Aurora Enhanced Page Header */
.page-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--text-accent);
  position: relative;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--main-gradient);
  border-radius: 2px;
}

/* Aurora Enhanced Subscription Layout */
.subscription-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  width: 100%;
  padding: var(--spacing-md);
}

/* Aurora Enhanced Tutorial Layout */
.tutorial-layout {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  background: var(--background-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
}

.tutorial-layout .top-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.tutorial-layout .bottom-row {
  width: 100%;
}

/* Aurora Enhanced Card Styles */
.card {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: var(--spacing-xl);
  box-shadow: var(--soft-shadow);
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sub-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.card:hover::before {
  opacity: 0.1;
}

.card h2 {
  margin-top: 0;
  margin-bottom: var(--spacing-md);
  color: var(--text-accent);
  text-align: center;
  font-size: var(--font-size-xl);
  font-weight: 600;
}

/* Aurora Enhanced Mobile Responsive Design */
@media (max-width: 768px) {
  .nav-bar {
    padding: var(--spacing-sm) var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    border-radius: 10px;
  }

  .nav-links {
    gap: var(--spacing-xs);
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-links a {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    min-height: 32px;
    border-radius: 6px;
  }

  .guide-layout, .recommend-layout, .freenode-layout {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .subscription-page {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .subscription-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-sm);
  }
  
  .page-title {
    font-size: var(--font-size-xl);
  }

  .tutorial-layout {
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
  }

  .tutorial-layout .top-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: var(--spacing-md);
  }

  .page-container {
    padding: 0 var(--spacing-sm);
  }

  .nav-bar {
    padding: var(--spacing-xs) var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    border-radius: 8px;
  }

  .nav-links {
    gap: 4px;
  }

  .nav-links a {
    font-size: 11px;
    padding: 6px 8px;
    min-height: 28px;
    border-radius: 4px;
  }

  .guide-layout, .recommend-layout, .freenode-layout {
    padding: var(--spacing-md);
  }

  .subscription-page {
    padding: var(--spacing-md);
  }

  .subscription-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .tutorial-layout {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .page-title {
    font-size: var(--font-size-lg);
  }

  .card {
    padding: var(--spacing-lg);
  }

  .card h2 {
    font-size: var(--font-size-lg);
  }
}

/* Aurora Enhanced App Container */
.app-container {
  min-height: 100vh;
  background: transparent;
  position: relative;
  font-family: sans-serif;
  padding: var(--spacing-xl);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.theme-toggle-container {
  position: fixed;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 75%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 75% 25%, rgba(124, 58, 237, 0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 var(--spacing-xl);
}
</style>
