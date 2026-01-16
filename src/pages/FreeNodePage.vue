<template>
  <div class="free-node-page">
    <h1 class="page-title">
      <VueIcon class="title-icon" icon="wifi" aria-label="免费节点" />
      <span class="title-text">免费节点</span>
    </h1>
    <div class="free-node-content">
      <div class="free-node-grid">
        <section class="free-node-section note-section">
          <h2><VueIcon class="section-icon" icon="bullhorn" aria-label="注意事项" /> 注意事项</h2>
          <p class="section-note">
            免费节点资源有限且稳定性较差，如需更好体验可考虑付费节点（参见<a href="#" @click.prevent="switchToRecommend" class="inline-link">机场推荐</a>）。
          </p>
        </section>
        <section class="free-node-section">
          <h2><VueIcon class="section-icon" icon="globe" aria-label="免费节点网站" /> 免费节点网站</h2>
          <p class="section-description">每日更新的免费节点资源</p>
          <div class="free-node-links">
            <a href="https://www.freeclashnode.com/free-node/" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="link" aria-label="链接" /></span>
              <span class="link-text">FreeClashNode - 每日更新节点</span>
            </a>
            <a href="https://github.com/crossxx-labs/free-proxy" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="box" aria-label="仓库" /></span>
              <span class="link-text">crossxx-labs - 多协议免费订阅</span>
            </a>
            <a href="https://nodefree.net/" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="link" aria-label="链接" /></span>
              <span class="link-text">NodeFree - 网络自由工具箱</span>
            </a>
            <a href="https://github.com/Flikify/getNode" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="box" aria-label="仓库" /></span>
              <span class="link-text">Flikify - 每小时更新节点</span>
            </a>
            <a href="https://telegeam.github.io/clashnode/" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="link" aria-label="链接" /></span>
              <span class="link-text">ClashNode - SSR/V2ray节点</span>
            </a>
            <a href="https://clashnode.cc/free-node/" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="link" aria-label="链接" /></span>
              <span class="link-text">ClashNode中文网 - 每天更新</span>
            </a>
            <a href="https://clash-free-node.github.io/" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="link" aria-label="链接" /></span>
              <span class="link-text">Clash免费节点 - 机场订阅</span>
            </a>
          </div>
        </section>

        <section class="free-node-section">
          <h2><VueIcon class="section-icon" icon="folder-open" aria-label="GitHub资源" /> GitHub资源</h2>
          <p class="section-description">GitHub上的开源节点项目</p>
          <div class="free-node-links">
            <a href="https://github.com/Pawdroid/Free-servers" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="box" aria-label="仓库" /></span>
              <span class="link-text">Pawdroid/Free-servers</span>
            </a>
            <a href="https://github.com/peasoft/NoMoreWalls" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="box" aria-label="仓库" /></span>
              <span class="link-text">peasoft/NoMoreWalls</span>
            </a>
            <a href="https://github.com/mahdibland/V2RayAggregator" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="box" aria-label="仓库" /></span>
              <span class="link-text">mahdibland/V2RayAggregator</span>
            </a>
            <a href="https://github.com/w1770946466/Auto_proxy" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="box" aria-label="仓库" /></span>
              <span class="link-text">w1770946466/Auto_proxy</span>
            </a>
            <a href="https://github.com/ermaozi/get_subscribe" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="box" aria-label="仓库" /></span>
              <span class="link-text">ermaozi/get_subscribe</span>
            </a>
            <a href="https://github.com/mfuu/v2ray" target="_blank" class="free-node-link">
              <span class="link-icon"><VueIcon icon="box" aria-label="仓库" /></span>
              <span class="link-text">mfuu/v2ray</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import VueIcon from '../components/VueIcon.vue';

// 获取切换页面的函数
const setCurrentTab = inject('setCurrentTab');

// 切换到推荐页面
const switchToRecommend = () => {
  if (setCurrentTab) {
    setCurrentTab('recommend');
  }
};
</script>

<style scoped>
.free-node-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: 1.1em;
  color: var(--text-accent);
}

.title-text {
  color: var(--text-title-h1);
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.free-node-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  width: 100%;
}

@media (min-width: 1024px) {
  .free-node-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .note-section {
    grid-column: 1 / -1;
  }
}

.free-node-section {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: var(--spacing-xl);
  color: var(--text-primary);
  box-shadow: var(--soft-shadow);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.free-node-section::before {
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

.free-node-section:hover {
  transform: translateY(-8px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.free-node-section:hover::before {
  opacity: 0.1;
}

.free-node-section h2 {
  font-size: var(--font-size-lg);
  color: var(--text-accent);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--text-accent);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-icon {
  color: var(--text-accent);
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.free-node-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.free-node-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: 10px;
  padding: var(--spacing-md) var(--spacing-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  font-size: var(--font-size-base);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.link-icon {
  flex-shrink: 0;
  font-size: 1.1em;
}

.link-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.free-node-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.free-node-link:hover::before {
  left: 100%;
}

.free-node-link:hover {
  background: var(--background-trans);
  border-color: var(--text-accent);
  transform: translateX(4px);
  box-shadow: var(--soft-shadow);
}

.note-section {
  background: var(--background-tertiary);
  border-left: 4px solid var(--text-sub-accent);
  border: 1px solid var(--border-primary);
  padding: var(--spacing-lg);
}

.note-section h2 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
  border-bottom: none;
  padding-bottom: 0;
  color: var(--text-sub-accent);
}

.section-note {
  color: var(--text-secondary);
  line-height: 1.6;
}

.inline-link {
  color: var(--text-link);
  text-decoration: none;
  font-weight: 500;
  position: relative;
}

.inline-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--text-link);
  transition: width var(--transition-normal);
}

.inline-link:hover::after {
  width: 100%;
}

.inline-link:hover {
  color: var(--text-link-hover);
}

@media (max-width: 768px) {
  .free-node-section {
    padding: var(--spacing-lg);
  }
  .free-node-link {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }
  .link-icon {
    font-size: 1em;
  }
}
</style>
