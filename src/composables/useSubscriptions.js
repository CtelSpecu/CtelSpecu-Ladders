import { ref, reactive } from 'vue';
import { SubscriptionParser, defaultSubscriptionData } from '../utils/subscriptionParser.js';

// 全局订阅数据状态
const subscriptionsData = ref([...defaultSubscriptionData]);
const isLoading = ref(false);
const lastUpdateTime = ref(null);

export function useSubscriptions() {
  
  // 更新单个订阅的信息
  const updateSubscriptionInfo = async (subscriptionIndex) => {
    if (subscriptionIndex < 0 || subscriptionIndex >= subscriptionsData.value.length) {
      return false;
    }
    
    const subscription = subscriptionsData.value[subscriptionIndex];
    
    try {
      isLoading.value = true;
      
      // 尝试获取订阅信息
      const info = await SubscriptionParser.fetchSubscriptionInfo(subscription.url);
      
      if (info) {
        // 更新订阅信息
        if (info.traffic) {
          subscription.traffic = {
            remaining: info.traffic.remaining,
            total: subscription.traffic.total, // 保持原有总量设置
            unit: info.traffic.unit
          };
        }
        
        if (info.reset) {
          subscription.reset = info.reset;
        }
        
        if (info.expire) {
          subscription.expire = info.expire;
        }
        
        lastUpdateTime.value = new Date();
        return true;
      }
    } catch (error) {
      console.error(`更新订阅${subscriptionIndex + 1}信息失败:`, error);
    } finally {
      isLoading.value = false;
    }
    
    return false;
  };
  
  // 更新所有订阅信息
  const updateAllSubscriptions = async () => {
    const promises = subscriptionsData.value.map((_, index) => 
      updateSubscriptionInfo(index)
    );
    
    const results = await Promise.allSettled(promises);
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;
    
    return {
      total: subscriptionsData.value.length,
      success: successCount,
      failed: subscriptionsData.value.length - successCount
    };
  };
  
  // 手动刷新订阅数据
  const refreshSubscriptions = async () => {
    console.log('开始刷新订阅数据...');
    const result = await updateAllSubscriptions();
    console.log(`订阅数据刷新完成: ${result.success}/${result.total} 成功`);
    return result;
  };
  
  // 获取订阅推荐等级颜色
  const getRatingColor = (rating) => {
    if (rating >= 5) return '#28a745'; // 绿色
    if (rating >= 4) return '#ffc107'; // 黄色
    if (rating >= 3) return '#fd7e14'; // 橙色
    return '#dc3545'; // 红色
  };
  
  // 获取流量使用状态
  const getTrafficStatus = (percentage) => {
    if (percentage >= 90) return { status: 'danger', color: '#dc3545' };
    if (percentage >= 75) return { status: 'warning', color: '#ffc107' };
    if (percentage >= 50) return { status: 'info', color: '#17a2b8' };
    return { status: 'success', color: '#28a745' };
  };
  
  // 计算到期天数状态
  const getExpireStatus = (days) => {
    if (days <= 7) return { status: 'danger', color: '#dc3545' };
    if (days <= 30) return { status: 'warning', color: '#ffc107' };
    return { status: 'success', color: '#28a745' };
  };
  
  return {
    subscriptions: subscriptionsData,
    isLoading,
    lastUpdateTime,
    updateSubscriptionInfo,
    updateAllSubscriptions,
    refreshSubscriptions,
    getRatingColor,
    getTrafficStatus,
    getExpireStatus
  };
}
