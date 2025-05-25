import { ref } from 'vue';
import * as yaml from 'js-yaml';

// 全局订阅数据状态
const subscriptionsData = ref([]);

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
    const configData = await loadSubscriptionsFromYaml();
    subscriptionsData.value = configData.map(sub => ({
      ...sub,
      reset: calculateResetProgress(sub.monthlyReset),
      expire: {
        date: new Date(sub.expireTime),
        formatted: sub.expireTime
      }
    }));
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
  };
  return {
    subscriptions: subscriptionsData,
    getRatingColor,
    getExpireStatus
  };
}
