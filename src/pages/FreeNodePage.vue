<template>
  <div class="free-node-page">
    <h1 class="page-title">免费节点收集</h1>
    <div class="free-node-content">
      <div class="free-node-grid">
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
            <a href="https://github.com/ermaozi/get_subscribe" target="_blank" class="free-node-link">
              GitHub - ermaozi/get_subscribe
            </a>
          </div>
        </section>

        <section class="free-node-section note-section">
          <h2>注意事项</h2>
          <p class="section-note">
            免费节点资源少或者觉得免费节点不稳定的话可以考虑购买收费节点（参见<a href="#" @click.prevent="switchToRecommend" class="inline-link">梯子购买推荐</a>）。
          </p>
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
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2em;
  color: #333;
  margin-bottom: 32px;
  text-align: center;
}

.free-node-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
}

.free-node-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.free-node-section h2 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #007bff;
}

.section-description {
  color: #666;
  margin-bottom: 20px;
}

.free-node-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.free-node-link {
  display: block;
  background-color: #f8f9fa;
  color: #007bff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 1em;
}

.free-node-link:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.note-section {
  background-color: #f8f9fa;
  border-left: 4px solid #ffc107;
}

.section-note {
  color: #666;
  line-height: 1.6;
}

.inline-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.inline-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .free-node-page {
    padding: 16px;
  }

  .free-node-section {
    padding: 16px;
  }

  .free-node-link {
    padding: 12px;
  }
}
</style>
