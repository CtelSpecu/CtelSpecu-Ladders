<template>
  <div class="free-node-page">
    <h1 class="page-title">免费节点</h1>
    <div class="free-node-content">
      <div class="free-node-grid">
        <section class="free-node-section note-section">
          <h2>注意事项</h2>
          <p class="section-note">
            免费节点资源少或者觉得免费节点不稳定的话可以考虑购买收费节点（参见<a href="#" @click.prevent="switchToRecommend" class="inline-link">机场推荐</a>）。
          </p>
        </section>
        <section class="free-node-section">
          <h2>免费节点</h2>
          <p class="section-description">每日更新的免费节点资源网站</p>
          <div class="free-node-links">
            <a href="https://www.freeclashnode.com/free-node/" target="_blank" class="free-node-link">
              2025最新免费Clash节点，每日更新，节点资源大全 - FreeClashNode
            </a>
            <a href="https://github.com/crossxx-labs/free-proxy" target="_blank" class="free-node-link">
              GitHub - crossxx-labs/free-proxy: 提供免费clash订阅，免费ssr节点，免费trojan节点，免费vmess节点，免费hysteria2节点服务器
            </a>
            <a href="https://nodefree.net/" target="_blank" class="free-node-link">
              NodeFree - 免费节点|网络自由工具箱
            </a>
            <a href="https://github.com/Flikify/getNode" target="_blank" class="free-node-link">
              GitHub - Flikify/getNode: 每小时更新最新的Clash、v2ray节点信息
            </a>
            <a href="https://telegeam.github.io/clashnode/" target="_blank" class="free-node-link">
              clashnode | SSR/V2ray/Clash免费节点
            </a>
            <a href="https://clashnode.cc/free-node/" target="_blank" class="free-node-link">
              免费节点订阅，每天更新，V2ray节点大全 - ClashNode中文网
            </a>
            <a href="https://clash-free-node.github.io/" target="_blank" class="free-node-link">
              Clash免费节点 | V2ray/Clash/SSR/VPN免费机场订阅地址持续更新，2025免费机场分享
            </a>
          </div>
        </section>

        <section class="free-node-section">
          <h2>GitHub资源</h2>
          <p class="section-description">GitHub上的免费节点项目</p>
          <div class="free-node-links">
            <a href="https://github.com/Pawdroid/Free-servers" target="_blank" class="free-node-link">
              GitHub - Pawdroid/Free-servers
            </a>
            <a href="https://github.com/peasoft/NoMoreWalls" target="_blank" class="free-node-link">
              GitHub - peasoft/NoMoreWalls
            </a>
            <a href="https://github.com/mahdibland/V2RayAggregator" target="_blank" class="free-node-link">
              GitHub - mahdibland/V2RayAggregator
            </a>
            <a href="https://github.com/w1770946466/Auto_proxy" target="_blank" class="free-node-link">
              GitHub - w1770946466/Auto_proxy
            </a>
            <a href="https://github.com/ermaozi/get_subscribe" target="_blank" class="free-node-link">
              GitHub - ermaozi/get_subscribe
            </a>
            <a href="https://github.com/mfuu/v2ray" target="_blank" class="free-node-link">
              GitHub - mfuu/v2ray
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

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
  color: var(--text-title-h1);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: var(--spacing-xl);
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
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.free-node-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.free-node-link {
  display: flex;
  align-items: center;
  height: 100%;
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: var(--spacing-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  font-size: var(--font-size-base);
  font-weight: 500;
  position: relative;
  overflow: hidden;
  line-height: 1.5;
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
  transform: translateY(-2px);
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
    padding: var(--spacing-md);
  }
}
</style>
