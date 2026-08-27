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
        >免费推荐</a>
        <a
          href="https://subcoverter.ctelspecu.hxcn.top"
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
          
          <a class="nav-card external" href="https://subcoverter.ctelspecu.hxcn.top" target="_blank">
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
      <!-- 免费推荐页面 -->
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

<script setup lang="ts">
import { ref, provide, onMounted, defineAsyncComponent } from 'vue'
import SubscriptionCard from './components/SubscriptionCard.vue'
import NotificationContainer from './components/NotificationContainer.vue'
import UpdateModal from './components/UpdateModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import AppFooter from './components/AppFooter.vue'
import VueIcon from './components/VueIcon.vue'
const ClientGuidePage = defineAsyncComponent(() => import('./pages/ClientGuidePage.vue'))
const ClientCategoryPage = defineAsyncComponent(() => import('./pages/ClientCategoryPage.vue'))
const FreeNodePage = defineAsyncComponent(() => import('./pages/FreeNodePage.vue'))
const RecommendPage = defineAsyncComponent(() => import('./pages/RecommendPage.vue'))
const FreeVpnPage = defineAsyncComponent(() => import('./pages/FreeVpnPage.vue'))
import { useSubscriptions } from './composables/useSubscriptions'
import { useTheme } from './composables/useTheme'

interface NavigateParams {
  os?: string
}

const currentTab = ref<string>('home')
const guideOs = ref<string>('')

const { isDark, toggleTheme, setTheme } = useTheme()

const { subscriptions } = useSubscriptions()

const TAB_PATH: Record<string, string> = {
  home: '',
  sub: 'subscriptions',
  guide: 'clients',
  'client-category': 'clients/categories',
  freenode: 'free-nodes',
  recommend: 'recommend',
  freevpn: 'other',
}

const PATH_TAB: Record<string, string> = Object.entries(TAB_PATH).reduce(
  (acc, [tab, path]) => {
    acc[path as string] = tab as string
    return acc
  },
  {} as Record<string, string>,
)

function buildHash(tab: string, params: NavigateParams = {}): string {
  const path = TAB_PATH[tab] ?? ''
  const query = new URLSearchParams()
  if (tab === 'guide' && params.os) query.set('os', params.os)
  const qs = query.toString()
  return `#/${path}${qs ? `?${qs}` : ''}`
}

function parseHash(): { tab: string; os: string } {
  const raw = window.location.hash || '#/'
  const cleaned = raw.replace(/^#\/?/, '')
  const [pathPart, queryPart] = cleaned.split('?')
  const path = (pathPart || '').replace(/\/+$/, '')
  const tab = (PATH_TAB[path] ?? 'home') as string
  const params = new URLSearchParams(queryPart || '')
  return { tab, os: params.get('os') || '' }
}

function trackUmami(tab: string, params: NavigateParams = {}): void {
  const umami = (window as unknown as { umami?: { trackView?: (url: string) => void; track?: (event: string, data: unknown) => void } }).umami
  if (!umami) return
  const urlPath = `/${TAB_PATH[tab] ?? ''}`
  const url = tab === 'guide' && params.os ? `${urlPath}?os=${params.os}` : urlPath
  try {
    if (typeof umami.trackView === 'function') {
      umami.trackView(url)
      return
    }
    if (typeof umami.track === 'function') {
      umami.track('navigate', { url, tab, ...(params.os ? { os: params.os } : {}) })
    }
  } catch {
    // ignore
  }
}

function navigate(tab: string, params: NavigateParams = {}): void {
  if (tab === 'guide') {
    guideOs.value = params.os || guideOs.value || ''
  } else {
    guideOs.value = ''
  }
  currentTab.value = tab
  const hash = buildHash(tab, params)
  history.pushState({ tab, ...params }, '', hash)
  trackUmami(tab, params)
}

const setCurrentTab = (tab: string): void => navigate(tab)

const handleNavigation = (page: string): void => {
  navigate(page)
}

provide('setCurrentTab', setCurrentTab)
provide('navigate', navigate)

onMounted(() => {
  console.log('订阅数据已加载:', subscriptions.value)
  const { tab, os } = parseHash()
  if (tab === 'guide' && os) {
    guideOs.value = os
  }
  currentTab.value = tab
  trackUmami(tab, tab === 'guide' ? { os } : {})
  window.addEventListener('popstate', () => {
    const parsed = parseHash()
    guideOs.value = parsed.tab === 'guide' ? parsed.os : ''
    currentTab.value = parsed.tab
    trackUmami(parsed.tab, parsed.tab === 'guide' ? { os: parsed.os } : {})
  })
})
</script>

<style scoped>
/* ===== Taste Design Read =====
   Reading this as: utility hub for proxy users (Chinese), calm tech / aurora dark-tech
   language, premium but not loud, leaning toward glassmorphism + refined neutrals.
   Dials: VARIANCE 7 / MOTION 5 / DENSITY 3.5 - generous, asymmetrical calm.
*/

/* 主页样式 - 与导航栏等宽 */
.home-page {
  width: 100%;
  max-width: var(--page-max-w);
  margin: 0 auto;
  padding: clamp(20px, 3vw, 40px) 0;
  box-sizing: border-box;
}
.home-header {
  text-align: center;
  margin-bottom: clamp(24px, 3vw, 36px);
}

.home-title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.home-title .title-icon {
  font-size: 1.15em;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 14px rgba(var(--accent-rgb), 0.28));
}

.home-title .title-text {
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-bottom: 4px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.home-subtitle {
  color: var(--text-secondary);
  font-size: clamp(15px, 1.7vw, 18px);
  margin: 0;
  letter-spacing: -0.01em;
  max-width: 48ch;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(14px, 1.8vw, 20px);
  margin-bottom: clamp(24px, 3vw, 36px);
}
.nav-card {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius);
  padding: clamp(16px, 1.7vw, 22px) clamp(16px, 1.8vw, 20px);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: var(--text-primary);
  box-shadow: var(--soft-shadow);
}

.nav-card::before {
  content: '';
  position: absolute;
  width: 48px;
  height: 48px;
  right: 4px;
  top: 4px;
  background: var(--orb-violet);
  border-radius: 9999px;
  filter: blur(12px);
  opacity: var(--orb-opacity);
  z-index: 0;
  transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
}

.nav-card::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  right: 32px;
  top: 12px;
  background: var(--orb-rose);
  border-radius: 9999px;
  filter: blur(16px);
  opacity: calc(var(--orb-opacity) * 0.9);
  z-index: 0;
  transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
  border-color: rgba(var(--orb-rose-rgb), 0.55);
  color: rgb(var(--orb-rose-rgb));
}

.nav-card:hover::before {
  right: 48px;
  top: auto;
  bottom: -32px;
  filter: blur(14px);
  box-shadow: 20px 20px 20px 30px #a21caf;
}

.nav-card:hover::after {
  right: -32px;
  filter: blur(18px);
}

.nav-card:hover .card-content h3 {
  color: rgb(var(--orb-rose-rgb));
}

.nav-card > * {
  position: relative;
  z-index: 2;
}

.nav-card:active {
  transform: translateY(-2px) scale(0.99);
}

.card-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-tertiary);
  border-radius: 14px;
  border: 1px solid var(--border-secondary);
  color: var(--text-accent);
  position: relative;
  z-index: 2;
}

.card-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 2;
}

.card-content h3 {
  margin: 0 0 4px 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--text-primary);
  line-height: 1.2;
}

.card-content p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-arrow {
  font-size: 1.15rem;
  color: var(--text-quaternary);
  transition: all 0.5s;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  background: var(--background-tertiary);
  border: 1px solid transparent;
  position: relative;
  z-index: 2;
}

.nav-card:hover .card-arrow {
  color: var(--text-accent);
  transform: translateX(2px);
  background: rgba(var(--accent-rgb), 0.10);
  border-color: rgba(var(--accent-rgb), 0.18);
}

.nav-card.external .card-arrow {
  font-size: 0.95rem;
}

.home-tips {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: clamp(14px, 1.6vw, 18px) clamp(16px, 2vw, 22px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--soft-shadow);
  position: relative;
  overflow: hidden;
}

.home-tips::before {
  content: '';
  position: absolute;
  width: 48px;
  height: 48px;
  right: 4px;
  top: 4px;
  background: var(--orb-violet);
  border-radius: 9999px;
  filter: blur(14px);
  opacity: calc(var(--orb-opacity) * 0.45);
  z-index: 0;
}

.home-tips > * { position: relative; z-index: 1; }
.home-tips {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: clamp(14px, 1.6vw, 18px) clamp(16px, 2vw, 22px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--soft-shadow);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 4px 0;
}

.tip-icon {
  font-size: 1.05rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--background-tertiary);
  border: 1px solid var(--border-secondary);
  flex-shrink: 0;
}

.tip-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}
@media (max-width: 768px) {
  .home-page {
    padding: var(--spacing-lg) var(--page-gutter);
  }
  
  .nav-cards {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .nav-card {
    padding: var(--spacing-md);
  }
  
  .card-icon {
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
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
  
  .tip-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}

/* 横屏优化：高度受限时减少纵向留白，宽度已通过 clamp 自适应 */
@media (orientation: landscape) and (max-height: 560px) {
  .home-page {
    padding-top: 14px;
    padding-bottom: 14px;
  }
  .home-header {
    margin-bottom: 16px;
  }
  .nav-cards {
    gap: 12px;
  }
}

.app-container {
  min-height: 100vh;
  min-height: 100dvh;
  background: transparent;
  position: relative;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  padding: clamp(10px, 1.5vw, 18px) var(--page-gutter);
  color: var(--text-primary);
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 22% 18%, rgba(var(--accent-rgb), 0.10) 0%, transparent 42%),
    radial-gradient(circle at 84% 26%, rgba(var(--sub-accent-rgb), 0.08) 0%, transparent 44%),
    radial-gradient(circle at 50% 88%, rgba(var(--accent-rgb), 0.06) 0%, transparent 40%);
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
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.18s ease;
}
.main-navbar button.active,
.main-navbar button:hover {
  background: var(--main-gradient);
  color: var(--text-bright);
  box-shadow: var(--accent-shadow);
}

/* 页面容器 - 与导航栏等宽，间距减半 */
.page-container {
  max-width: var(--page-max-w);
  margin: 0 auto;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}
/* Aurora Enhanced Navigation Bar - 宽度同步扩至 1440 */
.nav-bar {
  background: var(--background-glass);
  border: 1px solid var(--border-primary);
  box-shadow: var(--soft-shadow);
  padding: 12px clamp(14px, 1.6vw, 20px);
  margin-bottom: clamp(18px, 2.2vw, 28px);
  border-radius: var(--radius-lg);
  position: sticky;
  top: clamp(10px, 1.5vw, 16px);
  z-index: 100;
  overflow: hidden;
  backdrop-filter: blur(20px) saturate(1.15);
  -webkit-backdrop-filter: blur(20px) saturate(1.15);
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: var(--page-max-w);
  margin-left: auto;
  margin-right: auto;
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
  max-width: var(--page-max-w);
  margin: 0 auto;
  display: flex;
  gap: 6px 8px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.nav-links a {
  padding: 9px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  position: relative;
  font-weight: 550;
  letter-spacing: -0.01em;
  border-radius: var(--radius-pill);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border: 1px solid transparent;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  background: transparent;
}

.nav-links a:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
  border-color: var(--border-secondary);
}

.nav-links a.active {
  color: var(--text-accent);
  background: rgba(var(--accent-rgb), 0.12);
  border-color: rgba(var(--accent-rgb), 0.28);
  font-weight: 650;
  box-shadow: 0 2px 10px rgba(var(--accent-rgb), 0.14);
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 2px;
  background: var(--text-accent);
  border-radius: 1px;
}

/* Page Layouts - 全部扩宽 + 更透气 */
.guide-layout, .recommend-layout, .freenode-layout {
  width: 100%;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  padding: clamp(18px, 2.2vw, 28px);
  border-radius: var(--card-radius-lg);
  margin-bottom: var(--spacing-xl);
  background: var(--background-glass);
  backdrop-filter: blur(20px) saturate(1.08);
  -webkit-backdrop-filter: blur(20px) saturate(1.08);
  border: 1px solid var(--border-primary);
  box-shadow: var(--soft-shadow);
}

/* Subscription Page - 核心：更宽容器 + 去挤 */
.subscription-page {
  width: 100%;
  padding: clamp(18px, 2.4vw, 32px);
  background: var(--background-glass);
  backdrop-filter: blur(20px) saturate(1.08);
  -webkit-backdrop-filter: blur(20px) saturate(1.08);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--soft-shadow);
}

.client-list-container {
  margin-top: var(--spacing-md);
}

/* Page Header - 统一订阅与其他页面 */
.page-header {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: clamp(18px, 2vw, 28px);
  padding-bottom: 0;
  border-bottom: none;
  position: relative;
}

.page-header::after { display: none; }

.page-title {
  margin: 0;
  font-size: clamp(26px, 2.6vw, 32px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-bottom: 2px;
}

/* Subscription Layout - 去拥挤关键：380 基底, 自适应 2-3 列, 更大 gap */
.subscription-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: clamp(18px, 2vw, 24px);
  width: 100%;
  padding: 4px;
}
@media (min-width: 1480px) {
  .subscription-layout {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 860px) {
  .subscription-layout {
    grid-template-columns: 1fr;
  }
}
/* Tutorial Layout */
.tutorial-layout {
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2vw, 24px);
  padding: clamp(18px, 2.2vw, 28px);
  background: var(--background-glass);
  backdrop-filter: blur(20px) saturate(1.08);
  -webkit-backdrop-filter: blur(20px) saturate(1.08);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius-lg);
  box-shadow: var(--soft-shadow);
}

.tutorial-layout .top-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(18px, 2vw, 24px);
}

.tutorial-layout .bottom-row {
  width: 100%;
}

/* Card - unified radius + taste shadow */
.card {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius);
  padding: clamp(18px, 2vw, 28px);
  box-shadow: var(--soft-shadow);
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all var(--transition-spring);
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
  transform: translateY(-6px);
  box-shadow: var(--card-shadow);
  border-color: rgba(var(--accent-rgb), 0.22);
}

.card:hover::before {
  opacity: 0.08;
}

.card h2 {
  margin-top: 0;
  margin-bottom: var(--spacing-md);
  color: var(--text-accent);
  text-align: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: -0.015em;
}

/* Mobile - 横屏宽度已扩，移动端保持单列但边距更克制 */
@media (max-width: 768px) {
  .nav-bar {
    padding: 10px 12px;
    margin-bottom: var(--spacing-lg);
    border-radius: var(--radius-lg);
    top: 8px;
  }

  .nav-links {
    gap: 6px;
  }

  .nav-links a {
    font-size: 13px;
    padding: 7px 12px;
    min-height: 32px;
  }

  .guide-layout, .recommend-layout, .freenode-layout {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .subscription-page {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .subscription-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: 2px;
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
  .nav-bar {
    padding: 8px 10px;
    margin-bottom: var(--spacing-md);
  }

  .nav-links {
    gap: 4px;
  }

  .nav-links a {
    font-size: 12px;
    padding: 6px 10px;
    min-height: 30px;
  }
}

.theme-toggle-container {
  position: fixed;
  top: clamp(8px, 1.2vw, 14px);
  right: clamp(8px, 1.2vw, 14px);
  z-index: 1000;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.theme-toggle-container > * {
  pointer-events: auto;
}

@media (max-width: 768px) {
  .theme-toggle-container {
    width: 40px;
    height: 40px;
    top: 8px;
    right: 8px;
  }
}

@media (max-width: 480px) {
  .theme-toggle-container {
    width: 36px;
    height: 36px;
  }
}
</style>
