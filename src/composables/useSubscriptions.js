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
      url: sub.url,
      rating: sub.rating,
      traffic: {
        total: sub.traffic,
        unit: "GB"
      },
      maxRate: sub.maxRate,
      expireTime: sub.expireTime,
      monthlyReset: sub.monthlyReset
    }));
  } catch (error) {
    console.error('加载订阅配置失败:', error);
    // 返回默认配置
    return [
      {
        id: 1,
        name: "可用订阅1（IP纯净）",
        url: "https://43.100.58.97/5b780ba09d5a66c7950914244600b801",
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

// 缓存存储
const yamlCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存

// 生成缓存键（去除文件扩展名）
const generateCacheKey = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // 移除文件扩展名
    const baseName = pathname.split('/').pop().replace(/\.[^/.]+$/, '');
    return `${urlObj.hostname}_${baseName}`;
  } catch {
    // 如果URL解析失败，使用简化方法
    return url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
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
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
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
const getSubscriptionRemainingTraffic = async (subscriptionUrl, fallbackTotal = 100, retryCount = 2) => {
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      // 尝试从URL获取YAML文件
      const yamlContent = await fetchAndCacheYaml(subscriptionUrl);
      
      if (yamlContent) {
        const remainingTraffic = parseRemainingTrafficFromYaml(yamlContent);
        if (remainingTraffic !== null && remainingTraffic > 0) {          console.log(`从YAML获取到剩余流量: ${remainingTraffic} GB`);
          return {
            remaining: remainingTraffic,
            hasRealData: true
          };
        }
      }
      
      // 如果没有找到有效数据，但这是第一次尝试，继续到fallback
      break;
      
    } catch (error) {
      console.warn(`获取订阅流量失败，尝试 ${attempt + 1}/${retryCount + 1}:`, error.message);
      
      // 如果不是最后一次尝试，等待一秒后重试
      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
    }
  }
    // 如果无法获取YAML数据，只返回总流量作为剩余流量
  console.log(`无法获取YAML数据，显示总流量: ${fallbackTotal} GB`);
  
  return {
    remaining: fallbackTotal, // 直接显示总流量
    hasRealData: false
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
  // 初始化订阅数据
  const initializeSubscriptions = async () => {
    if (isLoading.value) {
      console.log('初始化已在进行中，跳过重复请求');
      return;
    }
    
    try {
      isLoading.value = true;
      loadingError.value = null;
      
      console.log('开始初始化订阅数据...');
      const configData = await loadSubscriptionsFromYaml();
      
      // 为每个订阅获取剩余流量数据（并行处理，但限制并发数）
      const batchSize = 2; // 限制并发请求数量
      const subscriptionsWithTraffic = [];
      
      for (let i = 0; i < configData.length; i += batchSize) {
        const batch = configData.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (sub) => {
            console.log(`正在处理订阅: ${sub.name}`);
            const trafficInfo = await getSubscriptionRemainingTraffic(sub.url, sub.traffic.total);
              return {
              ...sub,
              traffic: {
                ...sub.traffic,
                remaining: trafficInfo.remaining,
                used: Math.max(0, sub.traffic.total - trafficInfo.remaining),
                hasRealData: trafficInfo.hasRealData
              },
              reset: calculateResetProgress(sub.monthlyReset),
              expire: {
                date: new Date(sub.expireTime),
                formatted: sub.expireTime
              }
            };
          })
        );
        
        subscriptionsWithTraffic.push(...batchResults);
        
        // 如果还有更多批次，稍作等待避免过于频繁的请求
        if (i + batchSize < configData.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      subscriptionsData.value = subscriptionsWithTraffic;
      console.log(`成功初始化 ${subscriptionsWithTraffic.length} 个订阅`);
      
    } catch (error) {
      console.error('初始化订阅数据失败:', error);
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
            source: 'default',
            hasRealData: false
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
  
  // 如果数据为空，初始化数据
  if (subscriptionsData.value.length === 0) {
    initializeSubscriptions();
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
  };  return {
    subscriptions: subscriptionsData,
    isLoading,
    loadingError,
    getRatingColor,
    getExpireStatus,
    getReoKuRemainingTraffic,
    getSubscriptionRemainingTraffic,
    fetchAndCacheYaml,
    initializeSubscriptions,
    refreshSubscriptions: () => {
      subscriptionsData.value = [];
      return initializeSubscriptions();
    }
  };
}
