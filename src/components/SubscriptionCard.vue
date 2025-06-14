<template>
  <div class="card subscription-card">    <!-- 星级评分 -->
    <div class="rating-container">
      <div class="stars">
        <i v-for="i in 5" 
           :key="i" 
           class="star" 
           :class="{ 
             'fas fa-star active': i <= rating,
             'far fa-star': i > rating
           }">
        </i>
      </div>
      <span class="rating-text">{{ rating }}/5 推荐</span>
    </div>
    
    <h2>{{ subscriptionName }}</h2>
    
    <!-- 流量显示 - 使用计算属性优化 -->
    <div class="traffic-info">
      <div class="traffic-header">
        <span class="traffic-label">{{ trafficLabel }}</span>
        <div class="traffic-amount-container">
          <div class="traffic-amount-large" v-if="!isTrafficLoading">
            <span class="remaining-traffic">{{ formattedTraffic.remaining }}</span>
            <span class="total-traffic">{{ formattedTraffic.total }}</span>
          </div>
          <div class="loading-indicator" v-else>
            <svg class="windows-loading-spinner" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6"></circle>
            </svg>
            <span class="loading-text">获取中...</span>
          </div>
        </div>
      </div>
      <!-- 流量进度条 -->
      <div class="traffic-progress">
        <div class="progress-bar-container">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" :style="progressBarStyle"></div>
          </div>
          <div class="progress-text">{{ trafficProgressPercentage }}% 已使用</div>
        </div>
      </div>
    </div>

    <!-- 重置时间进度条 - 为所有订阅显示 -->
    <div class="reset-info" v-if="reset">
      <div class="reset-header">
        <span class="reset-label">流量重置</span>
        <span class="reset-text">{{ reset.formatted }}</span>
      </div>
      <div class="progress-bar" v-if="reset.daysRemaining !== null">
        <div class="progress-fill" :style="{ width: reset.progress + '%' }"></div>
      </div>
      <div class="progress-text" v-if="reset.daysRemaining !== null">
        {{ Math.round(reset.progress) }}% 已过去
      </div>
    </div><!-- 时间信息 -->
    <div class="time-info">
      <div class="time-item">
        <span class="time-label">
          <i class="fas fa-calendar-alt"></i>
          套餐到期
        </span>
        <span class="time-value">{{ expireFormatted }}</span>
      </div>
      <div class="time-item">
        <span class="time-label">
          <i class="fas fa-tachometer-alt"></i>
          最大速率
        </span>
        <span class="time-value">{{ maximumRate }}</span>
      </div>
    </div>
      <div class="subscription-link-area">
      <div class="link-header">
        <i class="fas fa-link"></i>
        <span>订阅链接 (用于复制和导入客户端)</span>
      </div>
      <textarea
          ref="subscriptionLinkTextarea"
          readonly
          :value="subscriptionLink"
      ></textarea>
    </div>    <div class="import-buttons">
      <button class="animated-button animated-button-copy" @click="copySubscriptionLink">
        <svg class="arr-2" viewBox="0 0 24 24">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        <span class="text">复制链接</span>
        <span class="circle"></span>
        <svg class="arr-1" viewBox="0 0 24 24">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm5 4H9c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H9V7h11v14z"/>
        </svg>
      </button>
      <button class="animated-button animated-button-import" @click="importToClient('Clash')">
        <svg class="arr-2" viewBox="0 0 24 24">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7z"/>
        </svg>
        <span class="text">导入Clash</span>
        <span class="circle"></span>
        <svg class="arr-1" viewBox="0 0 24 24">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNotification } from '../composables/useNotification.js';
import { useSubscriptions } from '../composables/useSubscriptions.js';

const { showSuccess, showError, showInfo } = useNotification();
const { getSubscriptionRemainingTraffic } = useSubscriptions();

const props = defineProps({
  subscriptionName: String,
  subscriptionLink: String,   // 用于文本框复制和导入客户端
  yamlLink: String,          // 用于获取流量信息
  rating: {
    type: Number,
    default: 3
  },
  traffic: {
    type: Object,
    default: () => ({
      used: 0,
      total: 100,
      unit: 'GB'
    })
  },
  expire: [String, Object],
  reset: [String, Object],
  maximumRate: {
    type: String,
    default: '1 Gbps'
  }
});

const subscriptionLinkTextarea = ref(null);

// 剩余流量数据状态
const remainingTrafficData = ref({
  remaining: 0,
  hasRealData: false,
  loading: false
});

// 当组件挂载时获取最新的剩余流量数据
onMounted(async () => {
  await updateTrafficData();
});

// 更新流量数据
const updateTrafficData = async () => {
  // 优先使用 yamlLink，如果没有则回退到 subscriptionLink
  const linkToUse = props.yamlLink || props.subscriptionLink;
  if (!linkToUse) return;
  
  remainingTrafficData.value.loading = true;
  
  try {
    const trafficInfo = await getSubscriptionRemainingTraffic(
      linkToUse, 
      props.traffic?.total || 100
    );
      remainingTrafficData.value = {
      remaining: trafficInfo.remaining, // 可能为null
      hasRealData: trafficInfo.hasRealData,
      hasValidData: trafficInfo.hasValidData || false,
      loading: false
    };
  } catch (error) {
    console.error('更新流量数据失败:', error);
    remainingTrafficData.value = {
      remaining: null, // 错误时设为null
      hasRealData: false,
      hasValidData: false,
      loading: false
    };
  }
};

// 判断是否正在加载流量数据
const isTrafficLoading = computed(() => {
  // 如果props中有isLoading标志，优先使用
  if (props.traffic?.isLoading !== undefined) {
    return props.traffic.isLoading;
  }
  
  // 否则使用组件内部的加载状态
  return remainingTrafficData.value.loading;
});

// 流量标签显示 - 所有订阅都显示统一格式
const trafficLabel = computed(() => {
  return '剩余流量/总流量';
});

// 流量显示内容 - 统一显示格式，单位放在最后
const trafficDisplay = computed(() => {
  const total = props.traffic?.total || 0;
  const unit = props.traffic?.unit || 'GB';
  
  // 优先使用从props传来的剩余流量数据
  if (props.traffic?.remaining !== undefined && props.traffic?.remaining !== null) {
    return `${props.traffic.remaining}/${total} ${unit}`;
  }
  
  // 使用组件内获取的剩余流量数据
  const remaining = remainingTrafficData.value.remaining;
  
  // 如果剩余流量为null，显示"获取失败"
  if (remaining === null) {
    return `获取失败`;
  }
  
  return `${remaining.toFixed(2)}/${total} ${unit}`;
});

// 剩余流量值（仅数字部分）
const remainingTrafficValue = computed(() => {
  // 优先使用从props传来的剩余流量数据
  if (props.traffic?.remaining !== undefined && props.traffic?.remaining !== null) {
    return props.traffic.remaining.toString();
  }
  
  // 使用组件内获取的剩余流量数据
  const remaining = remainingTrafficData.value.remaining;
  
  // 如果剩余流量为null，显示"获取失败"
  if (remaining === null) {
    return '获取失败';
  }
  
  return remaining.toFixed(2);
});

// 总流量部分（包含斜杠、总流量数字和单位）
const totalTrafficWithUnit = computed(() => {
  // 如果剩余流量为null（获取失败），不显示总流量部分
  if (props.traffic?.remaining === null || remainingTrafficData.value.remaining === null) {
    return '';
  }
  
  const total = props.traffic?.total || 0;
  const unit = props.traffic?.unit || 'GB';
  return `/${total} ${unit}`;
});

// 流量使用进度百分比
const trafficProgressPercentage = computed(() => {
  const total = props.traffic?.total || 0;
  if (total === 0) return 0; // 无总流量时显示0%
  
  let remaining = 0;
  
  // 优先使用从props传来的剩余流量数据
  if (props.traffic?.remaining !== undefined && props.traffic?.remaining !== null) {
    remaining = props.traffic.remaining;
  } else {
    remaining = remainingTrafficData.value.remaining;
  }
  
  // 如果剩余流量为null（无法获取），显示0%已使用
  if (remaining === null) {
    return 0;
  }
  
  const used = Math.max(0, total - remaining);
  const percentage = (used / total) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
});

// 优化计算属性，使用缓存
const formattedTraffic = computed(() => {
  if (!props.traffic) return { remaining: '0', total: '0 GB' };
  
  return {
    remaining: props.traffic.remaining?.toString() || '0',
    total: props.traffic.total ? `${props.traffic.total} GB` : '0 GB'
  };
});

// 优化进度条样式计算
const progressBarStyle = computed(() => {
  return {
    width: `${trafficProgressPercentage.value}%`,
    background: trafficProgressColor.value
  };
});

// 流量进度颜色计算（简化版本）
const trafficProgressColor = computed(() => {
  const percentage = trafficProgressPercentage.value;
  
  if (percentage <= 50) {
    // 0-50%: 绿色渐变
    return '#4ade80';
  } else if (percentage <= 75) {
    // 50-75%: 黄绿色到橙色
    return '#fbbf24';
  } else {
    // 75-100%: 红色
    return '#ef4444';
  }
});

// 总流量显示（保留原有功能，但现在不直接使用）
const trafficTotal = computed(() => {
  if (!props.traffic || !props.traffic.total) return '0';
  return props.traffic.total.toString();
});

// 到期时间格式化
const expireFormatted = computed(() => {
  if (!props.expire) return '未知';
  
  // 如果是对象类型（从解析器返回的数据）
  if (typeof props.expire === 'object' && props.expire.formatted) {
    return props.expire.formatted;
  }
  
  // 如果是字符串类型
  if (typeof props.expire === 'string') {
    try {
      const date = new Date(props.expire);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return props.expire;
    }
  }
  
  return '未知';
});

// 重置时间格式化
const resetFormatted = computed(() => {
  if (!props.reset) return '';
  
  // 如果是对象类型（从解析器返回的数据）
  if (typeof props.reset === 'object' && props.reset.formatted) {
    return props.reset.formatted;
  }
  
  // 如果是字符串类型
  if (typeof props.reset === 'string') {
    return props.reset;
  }
  
  return '';
});

const copySubscriptionLink = async () => {
  try {
    await navigator.clipboard.writeText(props.subscriptionLink);
    
    // 检查是否为应急订阅
    if (props.subscriptionName === '应急订阅') {
      // 使用原生 JS 弹窗
      alert('复制成功！\n\n⚠️ 该订阅仅用于应急使用！\n⚠️ 请仅在其他订阅无法使用时使用该订阅！\n⚠️ 请勿滥用此应急通道！');
    } else {
      showSuccess('链接已复制到剪贴板!');
    }
  } catch (err) {
    console.error('复制失败:', err);
    showError('复制失败，请手动复制');
  }
};

const importToClient = (client) => {
  if (client === 'Clash') {
    window.open(`clash://install-config?url=${encodeURIComponent(props.subscriptionLink)}`, '_blank');
    showInfo(`正在导入到 ${client}...`);
  }
};
</script>

<style scoped>
.subscription-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin: 20px 0;
  color: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.subscription-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.subscription-card:hover::before {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

.subscription-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.stars {
  display: flex;
  gap: 5px;
}

.star {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.star.active {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.star:hover {
  transform: scale(1.2);
}

.rating-text {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
}

h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 25px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.traffic-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
  text-align: center;
}

.traffic-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.traffic-amount-large {
  display: flex;
  align-items: baseline;
  color: rgb(149, 246, 239);
  text-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
  line-height: 1;
  margin: 10px 0;
}

.remaining-traffic {
  font-size: 48px;
  font-weight: 900;
}

.total-traffic {
  font-size: 23px;
  font-weight: 700;
  opacity: 0.85;
  margin-left: 2px;
}

.traffic-unit {
  font-size: 18px;
  font-weight: 600;
  opacity: 0.8;
}

.traffic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.traffic-source {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
}

.source-icon {
  font-size: 14px;
}

.source-text {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reset-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

.reset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reset-label {
  font-weight: 600;
  font-size: 16px;
}

.reset-text {
  font-weight: 700;
  font-size: 14px;
  opacity: 0.9;
}

.traffic-label {
  font-weight: 600;
  font-size: 16px;
}

.traffic-amount {
  font-weight: 700;
  font-size: 14px;
  opacity: 0.9;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00ccff);
  border-radius: 10px;
  transition: width 0.8s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: 12px;
  text-align: center;
  opacity: 0.8;
  font-weight: 600;
}

.time-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin: 25px 0;
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.time-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.time-label {
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-label i {
  width: 16px;
  text-align: center;
  opacity: 0.9;
}

.time-value {
  font-weight: 700;
  font-size: 14px;
  opacity: 0.9;
}

.subscription-link-area {
  margin: 25px 0;
}

.link-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
}

.link-header i {
  color: #4ecdc4;
}

.subscription-link-area textarea {
  width: 100%;
  min-height: 120px;
  max-height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  color: white;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  resize: vertical;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  overflow-y: auto;
  box-sizing: border-box;
}

.subscription-link-area textarea:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.subscription-link-area textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.import-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.copy-link-btn, .import-btn {
  flex: 1;
  min-width: 140px;
  padding: 15px 25px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.copy-link-btn i, .import-btn i {
  font-size: 16px;
}

/* 基础动画按钮样式 */
.animated-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px 36px;
  border: 4px solid;
  border-color: transparent;
  font-size: 16px;
  background-color: inherit;
  border-radius: 100px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  flex: 1;
  min-width: 140px;
  max-width: 200px;
  height: 56px;
  box-sizing: border-box;
}

.animated-button svg {
  position: absolute;
  width: 24px;
  z-index: 9;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button .arr-1 {
  right: 16px;
}

.animated-button .arr-2 {
  left: -25%;
}

.animated-button .circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 0;
}

.animated-button .text {
  position: relative;
  z-index: 2;
  transform: translateX(-12px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  text-align: center;
  white-space: nowrap;
}

.animated-button:hover {
  box-shadow: 0 0 0 12px transparent;
  border-radius: 12px;
}

.animated-button:hover .arr-1 {
  right: -25%;
}

.animated-button:hover .arr-2 {
  left: 16px;
}

.animated-button:hover .text {
  transform: translateX(12px);
}

.animated-button:active {
  scale: 0.95;
}

.animated-button:hover .circle {
  width: 250px;
  height: 250px;
  opacity: 1;
}

/* 复制链接按钮样式 - 绿色主题 */
.animated-button-copy {
  color: greenyellow;
  box-shadow: 0 0 0 2px greenyellow;
}

.animated-button-copy svg {
  fill: greenyellow;
}

.animated-button-copy .circle {
  background-color: greenyellow;
}

.animated-button-copy:hover {
  color: #212121;
}

.animated-button-copy:hover svg {
  fill: #212121;
}

.animated-button-copy:active {
  box-shadow: 0 0 0 4px greenyellow;
}

/* 导入按钮样式 - 蓝色主题 */
.animated-button-import {
  color: #4ecdc4;
  box-shadow: 0 0 0 2px #4ecdc4;
}

.animated-button-import svg {
  fill: #4ecdc4;
}

.animated-button-import .circle {
  background-color: #4ecdc4;
}

.animated-button-import:hover {
  color: white;
}

.animated-button-import:hover svg {
  fill: white;
}

.animated-button-import:active {
  box-shadow: 0 0 0 4px #4ecdc4;
}

@media (max-width: 768px) {
  .subscription-card {
    padding: 20px;
    margin: 15px 0;
  }

  .import-buttons {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .animated-button {
    width: 100%;
    max-width: 280px;
    min-width: 200px;
    height: 52px;
    font-size: 15px;
    padding: 14px 32px;
  }

  .copy-link-btn, .import-btn {
    min-width: auto;
  }

  .time-info {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .animated-button {
    width: 100%;
    max-width: 240px;
    min-width: 180px;
    height: 48px;
    font-size: 14px;
    padding: 12px 28px;
  }

  .animated-button .text {
    font-size: 14px;
  }

  .animated-button svg {
    width: 20px;
  }

  .animated-button:hover .circle {
    width: 200px;
    height: 200px;
  }
}

/* 加载指示器样式 */
.traffic-amount-container {
  position: relative;
  min-height: 2.5em;
  display: flex;
  align-items: center;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.8em;
  font-weight: 600;
  color: #ffffff;
  opacity: 0.8;
}

/* Windows风格加载动画 */
.windows-loading-spinner {
  box-sizing: border-box;
  width: 3rem;
  height: 3rem;
  padding: 2px;
  overflow: visible;
}

.windows-loading-spinner > circle {
  stroke: #fff;
  fill: none;
  stroke-width: 2px;
  stroke-linecap: round;
  transform-origin: 50% 50%;
  transition: all 0.2s ease-in-out 0s;
  animation: 2s linear 0s infinite normal none running loading-spinner;
}

@keyframes loading-spinner {
  0% {
    stroke-dasharray: 0.01px, 43.97px;
    transform: rotate(0);
  }

  50% {
    stroke-dasharray: 21.99px, 21.99px;
    transform: rotate(450deg);
  }

  100% {
    stroke-dasharray: 0.01px, 43.97px;
    transform: rotate(1080deg);
  }
}

.loading-text {
  font-size: 0.7em;
  opacity: 0.9;
}

/* 流量进度条样式 */
.traffic-progress {
  margin: 12px 0 8px;
}

.progress-bar-container {
  position: relative;
}

.progress-bar-bg {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.8s ease-in-out, background 0.8s ease-in-out;
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progress-shine 2s infinite;
}

.progress-text {
  font-size: 11px;
  text-align: center;
  margin-top: 4px;
  opacity: 0.8;
  font-weight: 500;
}

@keyframes progress-shine {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>