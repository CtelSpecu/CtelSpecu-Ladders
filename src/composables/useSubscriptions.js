import { ref } from 'vue';
import * as yaml from 'js-yaml';

// 全局订阅数据状态
const subscriptionsData = ref([]);
const isLoading = ref(false);
const loadingError = ref(null);

// 从YAML文件加载订阅配置
const loadSubscriptionsFromYaml = async () => {
  try {
    const response = await fetch('/subscriptions.yaml');
    const yamlText = await response.text();
    const config = yaml.load(yamlText);
      return config.subscriptions.map(sub => ({
      id: sub.id,
      name: sub.name,
      url: sub.url,           // 用于文本框复制和导入客户端
      yamlUrl: sub.yamlUrl,   // 用于获取流量信息
      rating: sub.rating,
      traffic: {
        total: sub.traffic,
        unit: "GB"
      },
      maxRate: sub.maxRate,
      expireTime: sub.expireTime,
      monthlyReset: sub.monthlyReset
    }));  } catch (error) {
    console.error('加载订阅配置失败:', error);
    // 返回默认配置
    return [
      {
        id: 1,
        name: "可用订阅1（IP纯净）",
        url: "https://43.100.58.97/5b780ba09d5a66c7950914244600b801",
        yamlUrl: "https://43.100.58.97/5b780ba09d5a66c7950914244600b801", // 添加yamlUrl字段
        rating: 5,
        traffic: { total: 500, unit: "GB" },
        maxRate: "500Mbps",
        expireTime: "2025-07-02",
        monthlyReset: 2
      }
    ];
  }
};

// 解析 ReoKuSFzwPUp.yaml 文件中的剩余流量
const parseRemainingTrafficFromYaml = (yamlContent) => {
  try {
    // 使用更灵活的正则表达式来匹配剩余流量信息
    // 支持多种格式：
    // 1. 在name字段中：{name: '剩余流量：73.48 GB', ...}
    // 2. 在name字段中：{name: 🏳️‍🌈 剩余流量：73.48 GB, ...}
    // 3. 在proxy名称中：- { name: '剩余流量：228.6 GB', type: trojan, ...}
    
    const patterns = [
      /剩余流量[：:]\s*(\d+\.?\d*)\s*GB/gi,
      /剩余流量[：:]\s*(\d+\.?\d*)\s*gb/gi,
      /remaining.*?(\d+\.?\d*)\s*GB/gi,
      /traffic.*?(\d+\.?\d*)\s*GB/gi
    ];
    
    for (const pattern of patterns) {
      pattern.lastIndex = 0; // 重置正则表达式索引
      const match = pattern.exec(yamlContent);
      if (match && match[1]) {
        const traffic = parseFloat(match[1]);
        if (!isNaN(traffic) && traffic > 0) {
          console.log(`找到剩余流量信息: ${traffic} GB`);
          return traffic;
        }
      }
    }
    
    console.warn('未找到剩余流量信息');
    return null;
  } catch (error) {
    console.error('解析剩余流量失败:', error);
    return null;
  }
};

// 缓存存储 - 优化内存使用
const yamlCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 减少到5分钟缓存
const MAX_CACHE_SIZE = 20; // 限制缓存大小

// 清理过期缓存
const cleanExpiredCache = () => {
  const now = Date.now();
  const keysToDelete = [];
  
  for (const [key, data] of yamlCache.entries()) {
    if (now - data.timestamp > CACHE_DURATION) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => yamlCache.delete(key));
  
  // 如果缓存太大，删除最老的条目
  if (yamlCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(yamlCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = entries.slice(0, yamlCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => yamlCache.delete(key));
  }
};

// 生成缓存键（优化版本）
const generateCacheKey = (url) => {
  try {
    const urlObj = new URL(url);
    // 使用简化的缓存键生成
    return `${urlObj.hostname}_${urlObj.pathname.split('/').pop()}`.slice(0, 50);
  } catch {
    // URL解析失败时的fallback
    return url.slice(-50).replace(/[^a-zA-Z0-9]/g, '_');
  }
};

// 从URL获取YAML文件内容并缓存
const fetchAndCacheYaml = async (url) => {
  const cacheKey = generateCacheKey(url);
  const now = Date.now();
  
  // 检查缓存
  if (yamlCache.has(cacheKey)) {
    const cached = yamlCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_DURATION) {
      console.log(`使用缓存的YAML数据: ${cacheKey}`);
      return cached.content;
    }
  }
  
  try {
    console.log(`正在获取YAML文件: ${url}`);
      // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
    
    // 使用代理避免CORS问题
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CtelSpecu-Ladders/1.0',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const yamlContent = data.contents;
    
    if (!yamlContent || yamlContent.trim() === '') {
      throw new Error('YAML内容为空');
    }
    
    // 缓存内容
    yamlCache.set(cacheKey, {
      content: yamlContent,
      timestamp: now
    });
    
    console.log(`成功缓存YAML文件: ${cacheKey}`);
    return yamlContent;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`获取YAML文件超时 ${url}`);
    } else {
      console.warn(`获取YAML文件失败 ${url}:`, error.message);
    }
    return null;
  }
};

// 获取订阅的剩余流量信息（带重试机制）
const getSubscriptionRemainingTraffic = async (subscriptionUrl, fallbackTotal = 100, retryCount = 3) => {
  // 清理过期缓存
  cleanExpiredCache();
  
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      console.log(`获取流量数据尝试 ${attempt + 1}/${retryCount + 1}: ${subscriptionUrl}`);
      
      // 尝试从URL获取YAML文件
      const yamlContent = await fetchAndCacheYaml(subscriptionUrl);
      
      if (yamlContent) {
        const remainingTraffic = parseRemainingTrafficFromYaml(yamlContent);
        
        if (remainingTraffic !== null && remainingTraffic >= 0) {
          console.log(`从YAML获取到剩余流量: ${remainingTraffic} GB (尝试 ${attempt + 1})`);
          return {
            remaining: remainingTraffic,
            hasRealData: true,
            hasValidData: true
          };
        } else {
          console.warn(`YAML内容解析失败，尝试 ${attempt + 1}: 未找到流量信息`);
        }
      } else {
        console.warn(`获取YAML内容失败，尝试 ${attempt + 1}`);
      }
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < retryCount) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // 指数退避，最大5秒
        console.log(`等待 ${delay}ms 后进行第 ${attempt + 2} 次尝试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
    } catch (error) {
      console.warn(`获取订阅流量失败，尝试 ${attempt + 1}/${retryCount + 1}:`, error.message);
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < retryCount) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // 指数退避
        console.log(`错误后等待 ${delay}ms 重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }
  
  // 如果无法获取YAML数据或检测不到剩余流量，返回无效数据标识
  console.log(`所有重试均失败，无法获取剩余流量，订阅URL: ${subscriptionUrl}`);
  
  return {
    remaining: null, // 设为null表示无数据
    hasRealData: false,
    hasValidData: false
  };
};

// 保持向后兼容性
const getReoKuRemainingTraffic = async () => {
  const result = await getSubscriptionRemainingTraffic('https://example.com/ReoKuSFzwPUp.yaml', 100);
  return result.remaining;
};

// 计算重置时间进度
const calculateResetProgress = (monthlyReset) => {
  if (monthlyReset === null) {
    return {
      daysRemaining: null,
      progress: 0,
      formatted: "长期有效"
    };
  }
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDay = now.getDate();
  
  // 计算下次重置日期
  let nextResetDate;
  if (currentDay < monthlyReset) {
    // 本月还未到重置日
    nextResetDate = new Date(currentYear, currentMonth, monthlyReset);
  } else {
    // 本月已过重置日，下个月重置
    nextResetDate = new Date(currentYear, currentMonth + 1, monthlyReset);
  }
  
  // 计算剩余天数
  const diffTime = nextResetDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 计算上次重置日期和本周期总天数
  let lastResetDate;
  if (currentDay < monthlyReset) {
    // 如果本月还未到重置日，上次重置是上个月
    lastResetDate = new Date(currentYear, currentMonth - 1, monthlyReset);
  } else {
    // 如果本月已过重置日，上次重置是本月
    lastResetDate = new Date(currentYear, currentMonth, monthlyReset);
  }
  
  const totalDays = Math.ceil((nextResetDate.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24));
  const passedDays = Math.ceil((now.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.max(0, Math.min(100, (passedDays / totalDays) * 100));
  
  return {
    daysRemaining,
    progress,
    formatted: `距离下次重置剩余：${daysRemaining} 天`
  };
};

export function useSubscriptions() {
  // 快速初始化订阅数据（仅显示基础信息）
  const quickInitializeSubscriptions = async () => {
    if (isLoading.value) {
      console.log('初始化已在进行中，跳过重复请求');
      return;
    }
    
    try {
      isLoading.value = true;
      loadingError.value = null;
      
      console.log('开始快速初始化订阅数据...');
      const configData = await loadSubscriptionsFromYaml();
      
      // 立即显示基础订阅信息，不等待流量数据
      const quickSubscriptions = configData.map(sub => ({
        ...sub,
        traffic: {
          ...sub.traffic,
          remaining: null, // 标记为待加载
          used: 0,
          hasRealData: false,
          hasValidData: false,
          isLoading: true // 添加加载状态
        },
        reset: calculateResetProgress(sub.monthlyReset),
        expire: {
          date: new Date(sub.expireTime),
          formatted: sub.expireTime
        }
      }));
      
      subscriptionsData.value = quickSubscriptions;
      console.log(`快速显示 ${quickSubscriptions.length} 个订阅卡片`);
      
      // 异步更新流量数据
      updateTrafficDataAsync();
      
    } catch (error) {
      console.error('快速初始化订阅数据失败:', error);
      loadingError.value = error.message || '初始化失败';
      
      // 使用基础配置作为fallback
      try {
        const configData = await loadSubscriptionsFromYaml();
        subscriptionsData.value = configData.map(sub => ({
          ...sub,
          traffic: {
            ...sub.traffic,
            remaining: sub.traffic.total * 0.8, // 假设剩余80%
            used: sub.traffic.total * 0.2,
            hasRealData: false,
            isLoading: false
          },
          reset: calculateResetProgress(sub.monthlyReset),
          expire: {
            date: new Date(sub.expireTime),
            formatted: sub.expireTime
          }
        }));
      } catch (fallbackError) {
        console.error('Fallback加载也失败:', fallbackError);
      }
    } finally {
      isLoading.value = false;
    }
  };

  // 异步更新流量数据
  const updateTrafficDataAsync = async () => {
    console.log('开始异步更新流量数据...');
    
    // 获取所有需要更新流量数据的订阅
    const subscriptions = subscriptionsData.value.filter(sub => sub.traffic.isLoading);
    
    if (subscriptions.length === 0) {
      console.log('没有需要更新的流量数据');
      return;
    }
    
    // 批量处理，但限制并发数
    const batchSize = 2;
    
    for (let i = 0; i < subscriptions.length; i += batchSize) {
      const batch = subscriptions.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (sub) => {
          try {            console.log(`正在更新订阅流量: ${sub.name}`);
            // 使用 yamlUrl 来获取流量信息，而不是 url
            const trafficInfo = await getSubscriptionRemainingTraffic(sub.yamlUrl || sub.url, sub.traffic.total);
            
            // 找到对应的订阅并更新流量数据
            const index = subscriptionsData.value.findIndex(s => s.id === sub.id);
            if (index !== -1) {
              subscriptionsData.value[index].traffic = {
                ...subscriptionsData.value[index].traffic,
                remaining: trafficInfo.remaining,
                used: trafficInfo.remaining !== null ? Math.max(0, sub.traffic.total - trafficInfo.remaining) : 0,
                hasRealData: trafficInfo.hasRealData,
                hasValidData: trafficInfo.hasValidData,
                isLoading: false
              };
              console.log(`成功更新订阅 ${sub.name} 的流量数据`);
            }
          } catch (error) {
            console.error(`更新订阅 ${sub.name} 流量数据失败:`, error);
            // 更新失败时，至少移除加载状态
            const index = subscriptionsData.value.findIndex(s => s.id === sub.id);
            if (index !== -1) {
              subscriptionsData.value[index].traffic.isLoading = false;
            }
          }
        })
      );
      
      // 如果还有更多批次，稍作等待避免过于频繁的请求
      if (i + batchSize < subscriptions.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('流量数据异步更新完成');
  };

  // 初始化订阅数据（兼容旧版本调用）
  const initializeSubscriptions = async () => {
    return quickInitializeSubscriptions();
  };  
  // 如果数据为空，使用快速初始化
  if (subscriptionsData.value.length === 0) {
    quickInitializeSubscriptions();
  }
  
  // 获取订阅推荐等级颜色
  const getRatingColor = (rating) => {
    if (rating >= 5) return '#28a745'; // 绿色
    if (rating >= 4) return '#ffc107'; // 黄色
    if (rating >= 3) return '#fd7e14'; // 橙色
    return '#dc3545'; // 红色
  };
    // 计算到期天数状态
  const getExpireStatus = (days) => {
    if (days <= 7) return { status: 'danger', color: '#dc3545' };
    if (days <= 30) return { status: 'warning', color: '#ffc107' };
    return { status: 'success', color: '#28a745' };
  };
    // 强制刷新流量数据（清除缓存）
  const forceRefreshTrafficData = async (subscriptionUrl) => {
    try {
      // 清除相关缓存
      const cacheKey = generateCacheKey(subscriptionUrl);
      yamlCache.delete(cacheKey);
      console.log(`已清除缓存: ${cacheKey}`);
      
      // 也清除可能的变体缓存（考虑URL参数变化）
      const baseUrl = subscriptionUrl.split('?')[0];
      for (const [key] of yamlCache.entries()) {
        if (key.includes(baseUrl)) {
          yamlCache.delete(key);
          console.log(`已清除相关缓存: ${key}`);
        }
      }
      
      // 重新获取流量数据，使用更多重试次数
      return await getSubscriptionRemainingTraffic(subscriptionUrl, 100, 5);
    } catch (error) {
      console.error('强制刷新流量数据失败:', error);
      throw error;
    }
  };
  
  return {
    subscriptions: subscriptionsData,
    isLoading,
    loadingError,
    getRatingColor,
    getExpireStatus,
    getReoKuRemainingTraffic,
    getSubscriptionRemainingTraffic,
    fetchAndCacheYaml,
    forceRefreshTrafficData,
    initializeSubscriptions,
    quickInitializeSubscriptions,
    updateTrafficDataAsync,
    refreshSubscriptions: () => {
      subscriptionsData.value = [];
      return quickInitializeSubscriptions();
    }
  };
}
