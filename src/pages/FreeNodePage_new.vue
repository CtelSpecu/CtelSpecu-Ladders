<template>
  <div class="free-node-page">
    <h1 class="page-title">免费节点</h1>
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
            免费节点资源少或者觉得免费节点不稳定的话可以考虑购买收费节点（参见<a href="#" @click.prevent="switchToRecommend" class="inline-link">机场推荐</a>）。
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
/* 页面容器 - 简洁样式，参考可用订阅页面 */
.free-node-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 使用全局的 page-title 样式 */

.free-node-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
}

/* 使用全局的 card 样式 */
.free-node-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.free-node-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.08), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.free-node-section:hover::before {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

.free-node-section:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.free-node-section h2 {
  font-size: 1.5em;
  color: #fff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #43e97b;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}

.section-description {
  color: #e0e0e0;
  margin-bottom: 20px;
}

.free-node-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.free-node-link {
  display: block;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1em;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.08);
}

.free-node-link:hover {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(67, 233, 123, 0.18);
}

.note-section {
  background: linear-gradient(135deg, #232946 0%, #3a3a5d 100%);
  border-left: 4px solid #ffc107;
  color: #fff;
}

.section-note {
  color: #fff;
  line-height: 1.6;
}

.inline-link {
  color: #43e97b;
  text-decoration: none;
  font-weight: 500;
}

.inline-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .free-node-section {
    padding: 16px;
  }
  .free-node-link {
    padding: 12px;
  }
}
</style>
