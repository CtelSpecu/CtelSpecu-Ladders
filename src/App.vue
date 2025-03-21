<template>
  <div class="app-container">
    <div class="card-container">
      <DownloadCard />
      <RecommendCard />
      <SubscriptionCard
          subscriptionName="可用订阅1（高速）"
          subscriptionLink="http://106.75.141.168:3389/api/v1/client/subscribe?token=b248fd5a74963c377a8fa88eac51cefa"
          trafficUsage="168GB"
          expireDate="2025-06-21(每月重置)"
          maximumRate="500Mbps"
      />
      <SubscriptionCard
          subscriptionName="可用订阅2（大流量）"
          subscriptionLink="https://sub1.qingze-quick.top/api/v1/client/subscribe?token=e39a8fb7c6ecc53aeb180ad3674d389f"
          trafficUsage="488GB"
          expireDate="2025-05-02(每月重置)"
          maximumRate="500Mbps"
      />
      <SubscriptionCard
          subscriptionName="可用订阅3"
          subscriptionLink="https://sublink.cute-cloud.de/link?token=4f8a0a2715bda1511d190c896cea00f2"
          trafficUsage="300GB"
          expireDate="2026-03-21"
          maximumRate="500Mbps"
      />
    </div>
  </div>
</template>

<script setup>
import DownloadCard from './components/DownloadCard.vue';
import SubscriptionCard from './components/SubscriptionCard.vue';
import RecommendCard from './components/RecommendCard.vue';
</script>

<style scoped>
.app-container {
  font-family: sans-serif;
  padding: 20px;
  background-color: #f0f2f5; /* 简约背景色 */
}

.card-container {
  display: flex;          /* 启用 Flexbox 布局 */
  flex-wrap: wrap;      /* 允许卡片自动换行 */
  justify-content: flex-start; /*  卡片在主轴方向（水平）左对齐，可以根据需要修改为 center 或 space-around 等 */
  gap: 20px;             /*  卡片之间的间距，可以根据需要调整 */
}

.card-container > * {
  flex: 1 1 300px;      /*  设置卡片的基本宽度为 300px，允许伸缩以适应容器，可以根据需要调整 */
  min-width: 300px;     /*  卡片的最小宽度，防止内容挤压 */
  /* max-width: 400px; */ /*  可以设置卡片的最大宽度，如果需要限制卡片过宽 */
  margin-bottom: 0;      /*  移除底部 margin，因为是水平排列，主要用 gap 控制间距 */
}

/*  以下样式可以保持不变，或者根据需要进一步调整 DownloadCard 和 SubscriptionCard 的样式 */
.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;           /*  保持卡片内部内容 Flexbox 布局 */
  flex-direction: column;  /*  卡片内部内容垂直排列，如果需要水平排列可以修改为 row */
}

.card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  text-align: center;      /*  标题居中 */
}
</style>