<template>
  <div class="card subscription-card">
    <!-- 星级评分 -->
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
    
    <h2>{{ subscriptionName }}</h2>    <!-- 流量显示 -->
    <div class="traffic-info">
      <div class="traffic-header">
        <span class="traffic-label">{{ trafficLabel }}</span>
        <div class="traffic-amount-container">
          <span class="traffic-amount-large" v-if="!remainingTrafficData.loading">{{ trafficDisplay }}</span>
          <div class="loading-indicator" v-else>
            <span class="loading-spinner">⏳</span>
            <span class="loading-text">获取中...</span>
          </div>
        </div>
      </div>
      <div class="traffic-footer">
        <div class="traffic-unit">{{ traffic.unit || 'GB' }}</div>
        <div class="traffic-source" :style="{ color: trafficSourceInfo.color }">
          <span class="source-icon">{{ trafficSourceInfo.icon }}</span>
          <span class="source-text">{{ trafficSourceInfo.text }}</span>
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
      <textarea
          ref="subscriptionLinkTextarea"
          readonly
          :value="subscriptionLink"
      ></textarea>
    </div>

    <div class="import-buttons">
      <button class="copy-link-btn" @click="copySubscriptionLink">
        <i class="fas fa-copy"></i>
        复制链接
      </button>
      <button class="import-btn" @click="importToClient('Clash')">
        <i class="fas fa-download"></i>
        导入Clash
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
  subscriptionLink: String,
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
  source: 'default',
  loading: false
});

// 当组件挂载时获取最新的剩余流量数据
onMounted(async () => {
  await updateTrafficData();
});

// 更新流量数据
const updateTrafficData = async () => {
  if (!props.subscriptionLink) return;
  
  remainingTrafficData.value.loading = true;
  
  try {
    const trafficInfo = await getSubscriptionRemainingTraffic(
      props.subscriptionLink, 
      props.traffic?.total || 100
    );
    
    remainingTrafficData.value = {
      remaining: trafficInfo.remaining,
      hasRealData: trafficInfo.hasRealData,
      source: trafficInfo.source,
      loading: false
    };
  } catch (error) {
    console.error('更新流量数据失败:', error);
    remainingTrafficData.value = {
      remaining: props.traffic?.total ? props.traffic.total * 0.8 : 80,
      hasRealData: false,
      source: 'error',
      loading: false
    };
  }
};

// 流量标签显示 - 所有订阅都显示统一格式
const trafficLabel = computed(() => {
  return '剩余流量/总流量';
});

// 流量显示内容 - 统一显示格式
const trafficDisplay = computed(() => {
  const total = props.traffic?.total || 0;
  
  // 优先使用从props传来的剩余流量数据
  if (props.traffic?.remaining !== undefined) {
    return `${props.traffic.remaining}/${total}`;
  }
  
  // 使用组件内获取的剩余流量数据
  const remaining = remainingTrafficData.value.remaining || 0;
  return `${remaining.toFixed(2)}/${total}`;
});

// 流量数据来源指示器
const trafficSourceInfo = computed(() => {
  if (props.traffic?.source) {
    switch (props.traffic.source) {
      case 'yaml':
        return { icon: '🔄', text: '实时数据', color: '#28a745' };
      case 'fallback':
        return { icon: '📊', text: '估算数据', color: '#ffc107' };
      default:
        return { icon: '⚡', text: '默认数据', color: '#6c757d' };
    }
  }
  
  switch (remainingTrafficData.value.source) {
    case 'yaml':
      return { icon: '🔄', text: '实时数据', color: '#28a745' };
    case 'fallback':
      return { icon: '📊', text: '估算数据', color: '#ffc107' };
    default:
      return { icon: '⚡', text: '默认数据', color: '#6c757d' };
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
    showSuccess('链接已复制到剪贴板!');
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
  font-size: 48px;
  font-weight: 900;
  color:rgb(149, 246, 239);
  text-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
  line-height: 1;
  margin: 10px 0;
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

.copy-link-btn {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); /* 绿色渐变 */
  color: white;
}

.copy-link-btn:hover {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(67, 233, 123, 0.3);
}

.import-btn {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
}

.import-btn:hover {
  background: linear-gradient(135deg, #26d0ce, #2a9d8f);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(78, 205, 196, 0.4);
}

@media (max-width: 768px) {
  .subscription-card {
    padding: 20px;
    margin: 15px 0;
  }

  .import-buttons {
    flex-direction: column;
  }

  .copy-link-btn, .import-btn {
    min-width: auto;
  }

  .time-info {
    gap: 10px;
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

.loading-spinner {
  animation: loading-pulse 1.5s ease-in-out infinite;
}

.loading-text {
  font-size: 0.7em;
  opacity: 0.9;
}

@keyframes loading-pulse {
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(1);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.1);
  }
}

/* 优化流量源信息显示 */
.traffic-source {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.traffic-source:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.source-icon {
  font-size: 12px;
}

.source-text {
  font-size: 10px;
}
</style>