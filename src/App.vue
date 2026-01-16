<template>
  <div class="app-container">
    <!-- 主题切换按钮 -->
    <div class="theme-toggle-container">
      <ThemeToggle />
    </div>
    
    <!-- 顶部导航栏 (非主页时显示) -->
    <nav class="nav-bar" v-if="currentTab !== 'home'">
      <div class="nav-links">
        <a
          href="#"
          :class="{ active: currentTab === 'home' }"
          @click.prevent="navigate('home')"
        ><VueIcon class="nav-icon" icon="house" aria-label="首页" /> 首页</a>
        <a
          href="#"
          :class="{ active: currentTab === 'sub' }"
          @click.prevent="navigate('sub')"
        >共享订阅</a>
        <a
          href="#"
          :class="{ active: currentTab === 'guide' }"
          @click.prevent="navigate('guide')"
        >客户端下载</a>
        <a
          href="#"
          :class="{ active: currentTab === 'client-category' }"
          @click.prevent="navigate('client-category')"
        >客户端分类</a>
        <a
          href="#"
          :class="{ active: currentTab === 'freenode' }"
          @click.prevent="navigate('freenode')"
        >免费节点</a>
        <a
          href="#"
          :class="{ active: currentTab === 'recommend' }"
          @click.prevent="navigate('recommend')"
        >机场推荐</a>
        <a
          href="#"
          :class="{ active: currentTab === 'freevpn' }"
          @click.prevent="navigate('freevpn')"
        >其他类型</a>
        <a
          href="https://sub.ctelspecu.hxcn.top"
          target="_blank"
        >订阅转换</a>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="page-container">
      <!-- 主页导航卡片 -->
      <div v-if="currentTab === 'home'" class="home-page fade-in-scale">
        <div class="home-header">
          <h1 class="home-title">
            <VueIcon class="title-icon" icon="star" aria-label="星空之镜" />
            <span class="title-text">星空之镜</span>
          </h1>
          <p class="home-subtitle">CtelSpecu Ladders - 您的网络自由导航站</p>
        </div>
        
        <div class="nav-cards">
          <div class="nav-card" @click="navigate('sub')">
            <div class="card-icon"><VueIcon icon="link" aria-label="共享订阅" /></div>
            <div class="card-content">
              <h3>共享订阅</h3>
              <p>免费可用的代理订阅链接，一键导入即可使用，定期更新维护</p>
            </div>
            <div class="card-arrow"><VueIcon icon="arrow-right" aria-label="进入" /></div>
          </div>
          
          <div class="nav-card" @click="navigate('guide')">
            <div class="card-icon"><VueIcon icon="download" aria-label="客户端下载" /></div>
            <div class="card-content">
              <h3>客户端下载</h3>
              <p>各平台代理客户端推荐与下载，附带详细使用教程</p>
            </div>
            <div class="card-arrow"><VueIcon icon="arrow-right" aria-label="进入" /></div>
          </div>

          <div class="nav-card" @click="navigate('client-category')">
            <div class="card-icon"><VueIcon icon="layer-group" aria-label="客户端分类" /></div>
            <div class="card-content">
              <h3>客户端分类</h3>
              <p>按 Clash / V2Ray 分类对比，查看不同客户端支持的系统与下载渠道</p>
            </div>
            <div class="card-arrow"><VueIcon icon="arrow-right" aria-label="进入" /></div>
          </div>
          
          <div class="nav-card" @click="navigate('freenode')">
            <div class="card-icon"><VueIcon icon="wifi" aria-label="免费节点" /></div>
            <div class="card-content">
              <h3>免费节点</h3>
              <p>每日更新的免费节点资源汇总，来自各大分享站点</p>
            </div>
            <div class="card-arrow"><VueIcon icon="arrow-right" aria-label="进入" /></div>
          </div>
          
          <div class="nav-card" @click="navigate('recommend')">
            <div class="card-icon"><VueIcon icon="rocket" aria-label="机场推荐" /></div>
            <div class="card-content">
              <h3>机场推荐</h3>
              <p>精选优质付费机场服务商，稳定高速的上网体验</p>
            </div>
            <div class="card-arrow"><VueIcon icon="arrow-right" aria-label="进入" /></div>
          </div>
          
          <div class="nav-card" @click="navigate('freevpn')">
            <div class="card-icon"><VueIcon icon="lock" aria-label="免费VPN" /></div>
            <div class="card-content">
              <h3>免费VPN</h3>
              <p>免费可用的VPN应用推荐，简单易用无需配置</p>
            </div>
            <div class="card-arrow"><VueIcon icon="arrow-right" aria-label="进入" /></div>
          </div>
          
          <a class="nav-card external" href="https://sub.ctelspecu.hxcn.top" target="_blank">
            <div class="card-icon"><VueIcon icon="arrows-rotate" aria-label="订阅转换" /></div>
            <div class="card-content">
              <h3>订阅转换</h3>
              <p>将订阅链接转换为不同客户端支持的格式</p>
            </div>
            <div class="card-arrow"><VueIcon icon="arrow-up-right-from-square" aria-label="新窗口打开" /></div>
          </a>
        </div>
        
        <div class="home-tips">
          <div class="tip-item">
            <span class="tip-icon"><VueIcon icon="lightbulb" aria-label="提示" /></span>
            <span class="tip-text">新手建议：先下载客户端，再使用共享订阅</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><VueIcon icon="bolt" aria-label="提示" /></span>
            <span class="tip-text">追求稳定：推荐选择机场推荐中的付费服务</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><VueIcon icon="bullseye" aria-label="提示" /></span>
            <span class="tip-text">共享订阅用着不错？可在机场推荐自行购买，更安全、稳定、快速</span>
          </div>
        </div>
      </div>

      <!-- 可用订阅页面 -->
      <div v-else-if="currentTab === 'sub'" class="subscription-page fade-in-scale">
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
        <ClientGuidePage :initial-os="guideOs" />
      </div>
      <!-- 客户端分类页面 -->
      <div v-else-if="currentTab === 'client-category'" class="guide-layout slide-in-left">
        <ClientCategoryPage />
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
    </div>
    <!-- 全局通知容器 -->
    <NotificationContainer />
    
    <!-- 客户端更新提醒弹窗 -->
    <UpdateModal v-if="currentTab === 'home'" />
    
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
import VueIcon from './components/VueIcon.vue';
// 懒加载页面组件以提高初始加载性能
const ClientGuidePage = defineAsyncComponent(() => import('./pages/ClientGuidePage.vue'));
const ClientCategoryPage = defineAsyncComponent(() => import('./pages/ClientCategoryPage.vue'));
const FreeNodePage = defineAsyncComponent(() => import('./pages/FreeNodePage.vue'));
const RecommendPage = defineAsyncComponent(() => import('./pages/RecommendPage.vue'));
const FreeVpnPage = defineAsyncComponent(() => import('./pages/FreeVpnPage.vue'));
import { useSubscriptions } from './composables/useSubscriptions.js';
import { useTheme } from './composables/useTheme.js';

const currentTab = ref('home');
const guideOs = ref('');

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
const TAB_PATH = {
  home: '',
  sub: 'subscriptions',
  guide: 'clients',
  'client-category': 'clients/categories',
  freenode: 'free-nodes',
  recommend: 'recommend',
  freevpn: 'other',
};

const PATH_TAB = Object.entries(TAB_PATH).reduce((acc, [tab, path]) => {
  acc[path] = tab;
  return acc;
}, {});

function buildHash(tab, params = {}) {
  const path = TAB_PATH[tab] ?? '';
  const query = new URLSearchParams();
  if (tab === 'guide' && params.os) query.set('os', params.os);
  const qs = query.toString();
  return `#/${path}${qs ? `?${qs}` : ''}`;
}

function parseHash() {
  const raw = window.location.hash || '#/';
  const cleaned = raw.replace(/^#\/?/, '');
  const [pathPart, queryPart] = cleaned.split('?');
  const path = (pathPart || '').replace(/\/+$/, '');
  const tab = PATH_TAB[path] ?? 'home';
  const params = new URLSearchParams(queryPart || '');
  return { tab, os: params.get('os') || '' };
}

function trackUmami(tab, params = {}) {
  const umami = window.umami;
  if (!umami) return;

  const urlPath = `/${TAB_PATH[tab] ?? ''}`;
  const url = tab === 'guide' && params.os ? `${urlPath}?os=${params.os}` : urlPath;

  try {
    if (typeof umami.trackView === 'function') {
      umami.trackView(url);
      return;
    }
    if (typeof umami.track === 'function') {
      umami.track('navigate', { url, tab, ...(params.os ? { os: params.os } : {}) });
    }
  } catch {
    // ignore
  }
}

function navigate(tab, params = {}) {
  if (tab === 'guide') {
    guideOs.value = params.os || guideOs.value || '';
  } else {
    guideOs.value = '';
  }

  currentTab.value = tab;
  const hash = buildHash(tab, params);
  history.pushState({ tab, ...params }, '', hash);
  trackUmami(tab, params);
}

const setCurrentTab = (tab) => navigate(tab);

// 处理来自订阅卡片的导航事件
const handleNavigation = (page) => {
  navigate(page);
};

// 通过provide提供给子组件
provide('setCurrentTab', setCurrentTab);
provide('navigate', navigate);

// 组件挂载时的初始化
onMounted(() => {
  console.log('订阅数据已加载:', subscriptions.value);

  const { tab, os } = parseHash();
  if (tab === 'guide' && os) {
    guideOs.value = os;
  }
  currentTab.value = tab;
  trackUmami(tab, tab === 'guide' ? { os } : {});

  window.addEventListener('popstate', () => {
    const parsed = parseHash();
    guideOs.value = parsed.tab === 'guide' ? parsed.os : '';
    currentTab.value = parsed.tab;
    trackUmami(parsed.tab, parsed.tab === 'guide' ? { os: parsed.os } : {});
  });
});
</script>

<style scoped>
/* 主页样式 */
.home-page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.home-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.home-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.home-title .title-icon {
  font-size: 1.2em;
  animation: float 3s ease-in-out infinite;
}

.home-title .title-text {
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.home-subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin: 0;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.nav-card {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--main-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.nav-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.nav-card:hover::before {
  opacity: 1;
}

.nav-card:active {
  transform: translateY(-2px);
}

.card-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-tertiary);
  border-radius: 14px;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.card-content p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.45;
}

.card-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-tertiary);
  transition: all var(--transition-normal);
  flex-shrink: 0;
}

.nav-card:hover .card-arrow {
  color: var(--text-accent);
  transform: translateX(4px);
}

.nav-card.external .card-arrow {
  font-size: var(--font-size-lg);
}

.home-tips {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
}

.tip-icon {
  font-size: var(--font-size-lg);
}

.tip-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .home-page {
    padding: var(--spacing-lg);
  }
  
  .home-title {
    font-size: 1.8rem;
  }
  
  .home-subtitle {
    font-size: var(--font-size-base);
  }
  
  .nav-cards {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .nav-card {
    padding: var(--spacing-lg);
  }
  
  .card-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }
  
  .card-content h3 {
    font-size: var(--font-size-base);
  }
  
  .card-content p {
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .home-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .nav-card {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }
  
  .card-icon {
    font-size: 1.5rem;
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
  
  .home-tips {
    padding: var(--spacing-md);
  }
  
  .tip-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}

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
