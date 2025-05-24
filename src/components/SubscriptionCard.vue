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
    
    <h2>{{ subscriptionName }}</h2>
    
    <!-- 流量使用进度条 -->
    <div class="traffic-info">
      <div class="traffic-header">
        <span class="traffic-label">流量剩余</span>
        <span class="traffic-amount">{{ trafficFormatted }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: trafficPercentage + '%' }"></div>
      </div>
      <div class="progress-text">已使用 {{ trafficPercentage }}%</div>
    </div>

    <!-- 时间信息 -->
    <div class="time-info">
      <div class="time-item">
        <span class="time-label">
          <i class="fas fa-calendar-alt"></i>
          套餐到期
        </span>
        <span class="time-value">{{ expireFormatted }}</span>
      </div>
      <div class="time-item" v-if="resetFormatted">
        <span class="time-label">
          <i class="fas fa-sync-alt"></i>
          流量重置
        </span>
        <span class="time-value">{{ resetFormatted }}</span>
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
import { ref, computed } from 'vue';
import { useNotification } from '../composables/useNotification.js';

const { showSuccess, showError, showInfo } = useNotification();

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

// 流量格式化
const trafficFormatted = computed(() => {
  if (!props.traffic) return '0 GB / 100 GB';
  
  // 如果有 remaining 字段（剩余流量）
  if (props.traffic.remaining !== undefined && props.traffic.total !== undefined) {
    const remaining = props.traffic.remaining;
    const total = props.traffic.total;
    const unit = props.traffic.unit || 'GB';
    return `${remaining.toFixed(2)} ${unit} / ${total} ${unit}`;
  }
  
  // 如果有 used 字段（已使用流量）
  if (props.traffic.used !== undefined && props.traffic.total !== undefined) {
    const used = props.traffic.used;
    const total = props.traffic.total;
    const unit = props.traffic.unit || 'GB';
    return `${used} ${unit} / ${total} ${unit}`;
  }
  
  return '0 GB / 100 GB';
});

// 流量使用百分比
const trafficPercentage = computed(() => {
  if (!props.traffic) return 0;
  
  // 如果有 remaining 字段（剩余流量）
  if (props.traffic.remaining !== undefined && props.traffic.total !== undefined) {
    const remaining = props.traffic.remaining;
    const total = props.traffic.total;
    if (total === 0) return 0;
    const used = total - remaining;
    return Math.round((used / total) * 100);
  }
  
  // 如果有 used 字段（已使用流量）
  if (props.traffic.used !== undefined && props.traffic.total !== undefined) {
    const used = props.traffic.used;
    const total = props.traffic.total;
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  }
  
  return 0;
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
}

.traffic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
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
</style>