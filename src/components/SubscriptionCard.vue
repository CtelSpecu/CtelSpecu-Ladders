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
      <div class="traffic-header">        <div class="traffic-label-row">
          <span class="traffic-label">{{ trafficLabel }}</span>
          <div class="retry-controls" v-if="!isSubscriptionExpired">
            <!-- 手动重试按钮 -->
            <button 
              v-if="remainingTrafficData.remaining === null && !isTrafficLoading" 
              @click="updateTrafficData(true, true)"
              class="retry-btn manual-retry"
              title="手动重新获取流量数据"
            >
              <i class="fas fa-redo"></i>
              重试
            </button>
              <!-- 强制刷新按钮 -->
            <button 
              v-if="remainingTrafficData.remaining !== null && !isTrafficLoading" 
              @click="updateTrafficData(true, true)"
              class="retry-btn force-refresh"
              title="强制刷新流量数据"
            >
              <i class="fas fa-sync-alt"></i>
              刷新
            </button>
            
            <!-- 自动重试状态指示器 -->
            <div 
              v-if="remainingTrafficData.autoRetryCount > 0 && remainingTrafficData.remaining === null"
              class="auto-retry-indicator"
              title="正在后台自动重试获取流量数据"
            >
              <i class="fas fa-clock"></i>
              自动重试中
            </div>
          </div>
        </div>        <div class="traffic-amount-container">
          <div class="traffic-amount-large" v-if="!isTrafficLoading">
            <span class="remaining-traffic" :class="{ 
              'expired': isSubscriptionExpired,
              'failed': remainingTrafficData.remaining === null && !isSubscriptionExpired
            }">{{ formattedTraffic.remaining }}</span>
            <span class="total-traffic" v-if="!isSubscriptionExpired && formattedTraffic.total">{{ formattedTraffic.total }}</span>
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
      <button class="uiverse-btn uiverse-btn--copy" @click="copySubscriptionLink" aria-label="复制链接">
        <p>复制链接</p>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      </button>
      <button class="uiverse-btn uiverse-btn--import" @click="importToClient('Clash')" aria-label="导入Clash">
        <p>导入Clash</p>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- 订阅失败弹窗 -->
  <SubscriptionFailedModal
    ref="subscriptionFailedModal"
    @navigate="(page) => emit('navigate', page)"
  />

</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useNotification } from '../composables/useNotification';
import { useSubscriptions } from '../composables/useSubscriptions';
import SubscriptionFailedModal from './SubscriptionFailedModal.vue';

const { showSuccess, showError, showInfo } = useNotification();
const { getSubscriptionRemainingTraffic, forceRefreshTrafficData } = useSubscriptions();

// 失败弹窗引用
const subscriptionFailedModal = ref<any>(null);

// 导航事件处理
const emit = defineEmits(['navigate']);

interface Props {
  subscriptionName?: string
  subscriptionLink?: string
  yamlLink?: string
  subscriptionId: string | number
  rating?: number
  traffic?: any
  expire?: any
  reset?: any
  maximumRate?: string
}
const props = withDefaults(defineProps<Props>(), {
  rating: 3,
  maximumRate: '1 Gbps',
  traffic: () => ({ used: 0, total: 100, unit: 'GB' }),
});

const subscriptionLinkTextarea = ref<any>(null);

// 使用订阅ID创建唯一的本地状态，避免串行
const remainingTrafficData = ref<any>({
  remaining: null,
  hasRealData: false,
  loading: false,
  retryCount: 0,
  lastRetry: null,
  autoRetryCount: 0,
  maxAutoRetries: 5,
  subscriptionId: props.subscriptionId,
});

// 自动重试定时器 - 每个组件实例独立的定时器
let autoRetryTimer: any = null;
let visibilityChangeListener: any = null;

// 组件实例唯一标识，用于调试
const componentInstanceId = `subscription-${props.subscriptionId}-${Math.random().toString(36).substr(2, 9)}`;

// 当组件挂载时获取最新的剩余流量数据
onMounted(async () => {
  console.log(`[${componentInstanceId}] 组件挂载，开始获取流量数据`);
  await updateTrafficData();
  
  // 如果初始获取失败，启动自动重试机制
  if (remainingTrafficData.value.remaining === null && !isSubscriptionExpired.value) {
    console.log(`[${componentInstanceId}] 初始获取失败，启动自动重试机制`);
    startAutoRetry();
  }
  
  // 添加页面可见性变化监听器
  setupVisibilityListener();
});

// 组件卸载时清理定时器和监听器
onUnmounted(() => {
  console.log(`[${componentInstanceId}] 组件卸载，清理资源`);
  if (autoRetryTimer) {
    clearTimeout(autoRetryTimer);
  }
  if (visibilityChangeListener) {
    document.removeEventListener('visibilitychange', visibilityChangeListener);
  }
});

// 设置页面可见性监听器
const setupVisibilityListener = () => {
  visibilityChangeListener = () => {
    if (!document.hidden) {
      const lastRetry: any = remainingTrafficData.value.lastRetry;
      const now: any = new Date();
      
      if (lastRetry && (now - lastRetry) > 5 * 60 * 1000) {
        console.log('页面重新获得焦点，自动刷新流量数据');
        updateTrafficData(false, false);
      }
      
      // 如果当前显示获取失败且没有自动重试在进行，重新启动重试
      if (remainingTrafficData.value.remaining === null && !autoRetryTimer && !isSubscriptionExpired.value) {
        console.log('页面重新获得焦点，重新启动自动重试');
        startAutoRetry();
      }
    }
  };
  
  document.addEventListener('visibilitychange', visibilityChangeListener);
};

// 启动自动重试机制
const startAutoRetry = () => {
  if (autoRetryTimer) {
    clearTimeout(autoRetryTimer);
  }
  
  // 如果已达到最大自动重试次数，不再重试
  if (remainingTrafficData.value.autoRetryCount >= remainingTrafficData.value.maxAutoRetries) {
    console.log(`[${componentInstanceId}] 已达到最大自动重试次数，停止重试`);
    return;
  }
  
  // 使用递增延迟：5秒、10秒、20秒、30秒、60秒
  const delaySeconds = Math.min(5 * Math.pow(2, remainingTrafficData.value.autoRetryCount), 60);
  
  console.log(`[${componentInstanceId}] 将在 ${delaySeconds} 秒后自动重试获取流量数据`);
  
  autoRetryTimer = setTimeout(async () => {
    remainingTrafficData.value.autoRetryCount++;
    console.log(`[${componentInstanceId}] 自动重试第 ${remainingTrafficData.value.autoRetryCount} 次`);
    
    await updateTrafficData();
    
    // 如果仍然失败且未过期，继续自动重试
    if (remainingTrafficData.value.remaining === null && !isSubscriptionExpired.value) {
      startAutoRetry();
    }
  }, delaySeconds * 1000);
};

// 停止自动重试
const stopAutoRetry = () => {
  if (autoRetryTimer) {
    console.log(`[${componentInstanceId}] 停止自动重试`);
    clearTimeout(autoRetryTimer);
    autoRetryTimer = null;
  }
};

// 检查订阅是否过期
const isSubscriptionExpired = computed(() => {
  if (!props.expire) return false;
  
  let expireDate;
  if (typeof props.expire === 'object' && props.expire.date) {
    expireDate = new Date(props.expire.date);
  } else if (typeof props.expire === 'string') {
    expireDate = new Date(props.expire);
  } else {
    return false;
  }
  
  return new Date() > expireDate;
});

// 更新流量数据（带重试机制）
const updateTrafficData = async (forceRetry = false, isManualRetry = false) => {
  console.log(`[${componentInstanceId}] 开始更新流量数据 - 强制重试:${forceRetry}, 手动重试:${isManualRetry}`);
  
  // 如果订阅已过期，不需要获取流量数据
  if (isSubscriptionExpired.value && !forceRetry) {
    console.log(`[${componentInstanceId}] 订阅已过期，跳过流量数据获取`);
    remainingTrafficData.value = {
      remaining: null,
      hasRealData: false,
      loading: false,
      retryCount: 0,
      lastRetry: null,
      autoRetryCount: 0,
      maxAutoRetries: 5,
      subscriptionId: props.subscriptionId
    };
    stopAutoRetry();
    return;
  }

  // 优先使用 yamlLink，如果没有则回退到 subscriptionLink
  const linkToUse = props.yamlLink || props.subscriptionLink;
  if (!linkToUse) {
    console.log(`[${componentInstanceId}] 没有可用的链接，跳过流量数据获取`);
    return;
  }
  
  console.log(`[${componentInstanceId}] 使用链接获取流量数据: ${linkToUse}`);
  
  // 如果是手动重试，重置自动重试计数
  if (isManualRetry) {
    remainingTrafficData.value.autoRetryCount = 0;
    stopAutoRetry();
  }
  
  remainingTrafficData.value.loading = true;
  const maxRetries = isManualRetry ? 5 : 3; // 手动重试允许更多次数
  const retryDelay = 2000; // 2秒延迟
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`尝试获取流量数据 - 第 ${attempt + 1}/${maxRetries} 次 ${isManualRetry ? '(手动重试)' : ''}`);
      
      // 如果是强制重试，清除缓存
      if (forceRetry || isManualRetry) {
        await forceRefreshTrafficData(linkToUse);
      }
      
      const trafficInfo = await getSubscriptionRemainingTraffic(
        linkToUse,
        props.traffic?.total || 100,
        isManualRetry ? 3 : 2 // 手动重试时使用更多内部重试
      );
        remainingTrafficData.value = {
        remaining: trafficInfo.remaining,
        hasRealData: trafficInfo.hasRealData,
        loading: false,
        retryCount: attempt + 1,
        lastRetry: new Date(),
        autoRetryCount: remainingTrafficData.value.autoRetryCount,
        maxAutoRetries: remainingTrafficData.value.maxAutoRetries,
        subscriptionId: props.subscriptionId
      };
      
      // 如果获取到有效数据，跳出重试循环并停止自动重试
      if (trafficInfo.hasValidData || (trafficInfo.remaining !== null && trafficInfo.remaining >= 0)) {
        console.log(`[${componentInstanceId}] 成功获取流量数据: ${trafficInfo.remaining} GB，重试次数: ${attempt + 1}`);
        stopAutoRetry();
        
        // 显示成功通知（仅手动重试时）
        if (isManualRetry) {
          showSuccess(`${props.subscriptionName}: 流量数据获取成功 ${trafficInfo.remaining} GB`);
        }
        break;
      }
      
      // 如果是最后一次尝试，不再延迟
      if (attempt < maxRetries - 1) {
        console.log(`第 ${attempt + 1} 次尝试未获取到有效数据，${retryDelay/1000}秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
    } catch (error) {
      console.error(`第 ${attempt + 1} 次获取剩余流量失败:`, error);
      
      // 如果是最后一次尝试，设置错误状态
      if (attempt === maxRetries - 1) {
        const errorMsg = `获取流量信息失败，已重试 ${maxRetries} 次`;
        if (isManualRetry) {
          showError(errorMsg);
        }
          remainingTrafficData.value = {
          remaining: null,
          hasRealData: false,
          loading: false,
          retryCount: maxRetries,
          lastRetry: new Date(),
          autoRetryCount: remainingTrafficData.value.autoRetryCount,
          maxAutoRetries: remainingTrafficData.value.maxAutoRetries,
          subscriptionId: props.subscriptionId
        };
        
        // 启动自动重试（如果不是手动重试且未过期）
        if (!isManualRetry && !isSubscriptionExpired.value) {
          startAutoRetry();
        }
      } else {
        // 非最后一次尝试，等待后继续
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
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
  // 检查订阅是否过期
  if (isSubscriptionExpired.value) {
    return '已过期';
  }
  
  // 优先使用从props传来的剩余流量数据
  if (props.traffic?.remaining !== undefined && props.traffic?.remaining !== null) {
    return props.traffic.remaining.toString();
  }
  
  // 使用组件内获取的剩余流量数据
  const remaining = remainingTrafficData.value.remaining;
  
  // 如果剩余流量为null且不在加载中，显示"获取失败"
  if (remaining === null && !isTrafficLoading.value) {
    return '获取失败';
  }
  
  // 如果剩余流量为null且在加载中，显示加载状态
  if (remaining === null && isTrafficLoading.value) {
    return '获取中...';
  }
  
  return remaining.toFixed(2);
});

// 总流量部分（包含斜杠、总流量数字和单位）
const totalTrafficWithUnit = computed(() => {
  // 如果订阅过期，不显示总流量部分
  if (isSubscriptionExpired.value) {
    return '';
  }
  
  // 如果剩余流量为null（获取失败），不显示总流量部分
  if (props.traffic?.remaining === null || remainingTrafficData.value.remaining === null) {
    return '';
  }
  
  const total = props.traffic?.total || 0;
  const unit = props.traffic?.unit || 'GB';
  return `/${total} ${unit}`;
});

// 流量使用进度百分比，避免数据串行
const trafficProgressPercentage = computed(() => {
  const total = props.traffic?.total || 0;
  if (total === 0) return 0; // 无总流量时显示0%
  
  // 优先使用本地组件的剩余流量数据，避免与其他组件串行
  const remaining = remainingTrafficData.value.remaining;
  
  // 如果订阅过期，显示100%
  if (isSubscriptionExpired.value) {
    return 100;
  }
  
  // 如果本地状态为null（无法获取），显示0%
  if (remaining === null) {
    return 0;
  }
  
  // 使用本地获取的剩余流量计算进度
  const used = Math.max(0, total - remaining);
  const percentage = (used / total) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
});

// 优化计算属性，避免数据串行，优先使用本地状态
const formattedTraffic = computed(() => {
  if (!props.traffic) return { remaining: '0', total: '0 GB' };
  
  // 检查订阅是否过期
  if (isSubscriptionExpired.value) {
    return {
      remaining: '已过期',
      total: ''
    };
  }
  
  // 优先使用组件内部获取的剩余流量数据，避免与其他组件串行
  const remaining = remainingTrafficData.value.remaining;
  
  // 如果本地状态正在加载中，显示加载状态
  if (remainingTrafficData.value.loading) {
    return {
      remaining: '获取中...',
      total: ''
    };
  }
  
  // 如果本地状态获取失败，显示获取失败状态
  if (remaining === null) {
    return {
      remaining: '获取失败',
      total: ''
    };
  }
  
  // 如果有有效的本地数据，使用本地数据
  if (remaining !== null && remaining >= 0) {
    return {
      remaining: remaining.toFixed(2),
      total: props.traffic.total ? `/${props.traffic.total} GB` : '/0 GB'
    };
  }
  
  // 最后才考虑使用 props 中的数据（作为后备）
  if (props.traffic?.remaining !== undefined && props.traffic?.remaining !== null) {
    return {
      remaining: props.traffic.remaining.toString(),
      total: props.traffic.total ? `/${props.traffic.total} GB` : '/0 GB'
    };
  }
  
  return {
    remaining: '0',
    total: props.traffic.total ? `/${props.traffic.total} GB` : '/0 GB'
  };
});

// 优化进度条样式计算
const progressBarStyle = computed(() => {
  return {
    width: `${trafficProgressPercentage.value}%`,
    background: trafficProgressColor.value
  };
});

// 流量进度颜色计算（避免串行）
const trafficProgressColor = computed(() => {
  // 如果订阅过期，显示红色
  if (isSubscriptionExpired.value) {
    return '#ef4444';
  }
  
  // 如果本地获取失败，显示灰色
  if (remainingTrafficData.value.remaining === null) {
    return '#6b7280';
  }
  
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
    // 检查订阅评分，如果为0则显示失败弹窗
    if (props.rating === 0) {
      subscriptionFailedModal.value.show();
      return;
    }
    
    await navigator.clipboard.writeText(props.subscriptionLink);
    
    // 检查是否为应急订阅 - toast 提示
    if (props.subscriptionName === '应急订阅') {
      showInfo('该订阅仅用于应急使用！\n请勿滥用此应急通道！');
    } else {
      showSuccess('复制成功!');
    }
  } catch (err) {
    console.error('复制失败:', err);
    showError('复制失败，请手动复制');
  }
};

const importToClient = (client) => {
  // 检查订阅评分，如果为0则显示失败弹窗
  if (props.rating === 0) {
    subscriptionFailedModal.value.show();
    return;
  }
  
  if (client === 'Clash') {
    window.open(`clash://install-config?url=${encodeURIComponent(props.subscriptionLink)}`, '_blank');
    showInfo(`正在导入到 ${client}...`);
  }
};
</script>

<style scoped>
.subscription-card {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius-lg);
  padding: clamp(18px, 2vw, 26px);
  margin: 0;
  color: var(--text-primary);
  box-shadow: var(--soft-shadow);
  transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  animation: card-appear 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.subscription-card::before {
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

.subscription-card::after {
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

.subscription-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
  border-color: rgba(var(--orb-rose-rgb), 0.5);
}

.subscription-card:hover::before {
  right: 48px;
  top: auto;
  bottom: -32px;
  filter: blur(14px);
  box-shadow: 20px 20px 30px 10px rgba(var(--orb-violet-rgb), 0.32);
}

.subscription-card:hover::after {
  right: -32px;
  filter: blur(18px);
}

.subscription-card > * {
  position: relative;
  z-index: 1;
}
.rating-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 15px;
  color: var(--text-quaternary);
  transition: all var(--transition-normal);
  cursor: pointer;
  line-height: 1;
}

.star.active {
  color: var(--text-accent);
  text-shadow: var(--glow-primary);
}

.star:hover {
  transform: scale(1.18);
}

.rating-text {
  font-size: 12px;
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--text-secondary);
}

h2 {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
}

.traffic-info {
  background: var(--background-tertiary);
  border-radius: var(--radius-lg);
  padding: 18px 16px;
  margin: 16px 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-secondary);
  text-align: center;
}

.traffic-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.traffic-label-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.retry-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.retry-btn {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-pill);
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(5px);
}

.retry-btn i {
  font-size: 10px;
}

.retry-btn.manual-retry {
  background: rgba(var(--warning-rgb), 0.10);
  border: 1px solid rgba(var(--warning-rgb), 0.26);
  color: var(--text-warning);
}

.retry-btn.manual-retry:hover {
  background: rgba(var(--warning-rgb), 0.16);
  border-color: rgba(var(--warning-rgb), 0.36);
  transform: translateY(-1px);
  box-shadow: var(--soft-shadow);
}

.retry-btn.force-refresh {
  background: rgba(var(--success-rgb), 0.10);
  border: 1px solid rgba(var(--success-rgb), 0.24);
  color: var(--text-success);
}

.retry-btn.force-refresh:hover {
  background: rgba(var(--success-rgb), 0.16);
  border-color: rgba(var(--success-rgb), 0.34);
  transform: translateY(-1px);
  box-shadow: var(--soft-shadow);
}

.retry-btn:active {
  transform: scale(0.97);
}

.auto-retry-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 4px 8px;
  background: var(--background-tertiary);
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-primary);
}

.auto-retry-indicator i {
  animation: spin 2s linear infinite;
  color: var(--text-tertiary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.traffic-amount-large {
  display: flex;
  align-items: baseline;
  justify-content: center;
  color: var(--text-accent);
  text-shadow: var(--glow-primary);
  line-height: 1;
  margin: 8px 0;
  letter-spacing: -0.02em;
}
.remaining-traffic {
  font-size: clamp(36px, 3.2vw, 46px);
  font-weight: 900;
  letter-spacing: -0.03em;
}

.remaining-traffic.expired {
  color: var(--text-error) !important;
  text-shadow: 0 0 18px rgba(var(--error-rgb), 0.42) !important;
}

.remaining-traffic.failed {
  color: var(--text-quaternary) !important;
  text-shadow: none !important;
}

.total-traffic {
  font-size: 20px;
  font-weight: 750;
  color: var(--text-secondary);
  margin-left: 4px;
}

.traffic-unit {
  font-size: 15px;
  font-weight: 650;
  color: var(--text-tertiary);
  margin-left: 2px;
}

.traffic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.traffic-source {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.04em;
  color: var(--text-tertiary);
}

.source-icon {
  font-size: 13px;
  color: var(--text-tertiary);
}

.source-text {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.reset-info {
  background: var(--background-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  padding: 16px 18px;
  margin: 16px 0;
  backdrop-filter: blur(8px);
}

.reset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reset-label {
  font-weight: 650;
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: -0.01em;
}

.reset-text {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-primary);
}

.traffic-label {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: -0.01em;
}

.traffic-amount {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-primary);
}

.progress-bar {
  background: var(--background-trans);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-pill);
  height: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d38f 0%, var(--text-accent) 100%);
  border-radius: var(--radius-pill);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent);
  animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: 11px;
  text-align: center;
  color: var(--text-tertiary);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.time-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin: 18px 0;
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--background-tertiary);
  border: 1px solid var(--border-secondary);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  backdrop-filter: blur(5px);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.time-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.08), transparent);
  transition: left 0.5s ease;
}

.time-item:hover::before {
  left: 100%;
}

.time-item:hover {
  background: var(--surface-hover);
  border-color: rgba(var(--accent-rgb), 0.20);
  transform: translateX(4px);
  box-shadow: var(--soft-shadow);
}

.time-label {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-label i {
  width: 16px;
  text-align: center;
  color: var(--text-tertiary);
}

.time-value {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-primary);
}

.subscription-link-area {
  margin: 18px 0;
}

.link-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.link-header i {
  color: var(--text-accent);
}

.subscription-link-area textarea {
  width: 100%;
  min-height: 88px;
  max-height: 160px;
  background: var(--background-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  color: var(--text-primary);
  font-family: ui-monospace, 'Cascadia Code', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  overflow-y: auto;
  box-sizing: border-box;
}

.subscription-link-area textarea:focus {
  outline: none;
  border-color: rgba(var(--accent-rgb), 0.42);
  background: var(--background-secondary);
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.14);
}

.subscription-link-area textarea::placeholder {
  color: var(--text-tertiary);
}

.import-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

/* Uiverse sliding button - 统一项目配色，注意深浅色 */
.uiverse-btn {
  position: relative;
  width: 168px;
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid var(--btn-accent);
  background: var(--background-secondary);
  color: var(--btn-accent);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.45s, border-color 0.45s, transform 0.2s, box-shadow 0.45s;
  box-shadow: var(--soft-shadow);
  flex: 0 0 auto;
}

.uiverse-btn--copy { --btn-accent: var(--text-accent); }
.uiverse-btn--import { --btn-accent: var(--text-sub-accent); }

.uiverse-btn p {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  transition: all 0.45s;
  color: var(--btn-accent);
  white-space: nowrap;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.uiverse-btn svg {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.45s;
  height: 18px;
  width: 18px;
  fill: #fff;
  pointer-events: none;
}

.uiverse-btn:hover {
  background: var(--btn-accent);
  border-color: var(--btn-accent);
  box-shadow: var(--card-shadow);
  transform: translateY(-1px);
}

.uiverse-btn:hover p {
  left: 42%;
  color: #fff;
}

.uiverse-btn:hover svg {
  opacity: 1;
  right: 18px;
  fill: #fff;
}

.uiverse-btn:active {
  transform: translateY(0) scale(0.98);
}

/* 兼容旧类名以防残留 */
.copy-link-btn, .import-btn { display: none; }

@media (max-width: 768px) {
  .subscription-card {
    padding: 18px;
    margin: 0;
  }

  .import-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .uiverse-btn {
    width: 100%;
    height: 46px;
    font-size: 14px;
  }
  .time-info {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .uiverse-btn {
    height: 44px;
    font-size: 13px;
  }
}

/* 加载指示器 */
.traffic-amount-container {
  position: relative;
  min-height: 2.2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 650;
  color: var(--text-secondary);
}

/* Spinner - 自适应颜色 */
.windows-loading-spinner {
  box-sizing: border-box;
  width: 2.2rem;
  height: 2.2rem;
  padding: 2px;
  overflow: visible;
}

.windows-loading-spinner > circle {
  stroke: var(--text-accent);
  fill: none;
  stroke-width: 2.4px;
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
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 600;
}

/* 流量进度条 - 去白膜 */
.traffic-progress {
  margin: 10px 0 6px;
}

.progress-bar-container {
  position: relative;
}

.progress-bar-bg {
  height: 8px;
  background: var(--background-trans);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-pill);
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width 0.8s ease-in-out, background 0.8s ease-in-out;
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #00cc88 0%, var(--text-accent) 100%);
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.26), transparent);
  animation: progress-shine 2s infinite;
}

.progress-text {
  font-size: 11px;
  text-align: center;
  margin-top: 6px;
  color: var(--text-tertiary);
  font-weight: 600;
}

@keyframes progress-shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

</style>
