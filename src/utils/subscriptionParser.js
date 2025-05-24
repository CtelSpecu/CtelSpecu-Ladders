// 订阅信息解析工具
export class SubscriptionParser {
  // 解析Clash配置文件中的订阅信息
  static parseClashConfig(yamlContent) {
    try {
      // 提取代理信息
      const proxies = this.extractProxies(yamlContent);
      
      // 从代理名称中提取信息
      const trafficInfo = this.extractTrafficInfo(proxies);
      const resetInfo = this.extractResetInfo(proxies);
      const expireInfo = this.extractExpireInfo(proxies);
      
      return {
        traffic: trafficInfo,
        reset: resetInfo,
        expire: expireInfo
      };
    } catch (error) {
      console.error('解析订阅配置失败:', error);
      return null;
    }
  }
  
  // 从订阅链接获取配置信息
  static async fetchSubscriptionInfo(subscriptionUrl) {
    try {
      // 由于CORS限制，这里返回模拟数据
      // 在实际部署中，可能需要通过后端代理来获取订阅信息
      console.log(`尝试获取订阅信息: ${subscriptionUrl}`);
      
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 根据不同的订阅链接返回不同的模拟数据
      if (subscriptionUrl.includes('43.100.58.97')) {
        return {
          traffic: { remaining: 73.53, unit: 'GB' },
          reset: { days: 9, formatted: '9 天后重置' },
          expire: { 
            date: new Date('2025-07-02'), 
            days: 39, 
            formatted: '2025-07-02 (39天后到期)' 
          }
        };
      } else if (subscriptionUrl.includes('23.145.248.218')) {
        return {
          traffic: { remaining: 58.2, unit: 'GB' },
          reset: { days: 15, formatted: '15 天后重置' },
          expire: { 
            date: new Date('2025-06-21'), 
            days: 28, 
            formatted: '2025-06-21 (28天后到期)' 
          }
        };
      } else {
        return {
          traffic: { remaining: 280.5, unit: 'GB' },
          reset: { days: 30, formatted: '30 天后重置' },
          expire: { 
            date: new Date('2026-03-21'), 
            days: 301, 
            formatted: '2026-03-21 (301天后到期)' 
          }
        };
      }
    } catch (error) {
      console.error('获取订阅信息失败:', error);
      return null;
    }
  }
  
  // 提取代理列表
  static extractProxies(yamlContent) {
    const lines = yamlContent.split('\n');
    const proxies = [];
    let inProxiesSection = false;
    
    for (const line of lines) {
      if (line.trim().startsWith('proxies:')) {
        inProxiesSection = true;
        continue;
      }
      
      if (inProxiesSection) {
        if (line.startsWith('proxy-groups:') || line.startsWith('rules:')) {
          break;
        }
        
        if (line.trim().startsWith('- {') && line.includes('name:')) {
          const nameMatch = line.match(/name:\s*['"]?([^'",}]+)['"]?/);
          if (nameMatch) {
            proxies.push(nameMatch[1]);
          }
        }
      }
    }
    
    return proxies;
  }
  
  // 提取流量信息
  static extractTrafficInfo(proxies) {
    for (const proxy of proxies) {
      const trafficMatch = proxy.match(/剩余流量：([\d.]+)\s*(GB|MB|TB)/);
      if (trafficMatch) {
        const amount = parseFloat(trafficMatch[1]);
        const unit = trafficMatch[2];
        
        // 转换为GB
        let trafficInGB;
        switch (unit) {
          case 'TB':
            trafficInGB = amount * 1024;
            break;
          case 'MB':
            trafficInGB = amount / 1024;
            break;
          default:
            trafficInGB = amount;
        }
        
        return {
          remaining: trafficInGB,
          unit: 'GB',
          formatted: `${trafficInGB.toFixed(2)} GB`
        };
      }
    }
    return null;
  }
  
  // 提取重置时间信息
  static extractResetInfo(proxies) {
    for (const proxy of proxies) {
      const resetMatch = proxy.match(/距离下次重置剩余：(\d+)\s*天/);
      if (resetMatch) {
        const days = parseInt(resetMatch[1]);
        const resetDate = new Date();
        resetDate.setDate(resetDate.getDate() + days);
        
        return {
          days: days,
          date: resetDate,
          formatted: `${days} 天后重置`
        };
      }
    }
    return null;
  }
  
  // 提取到期时间信息
  static extractExpireInfo(proxies) {
    for (const proxy of proxies) {
      const expireMatch = proxy.match(/套餐到期：(\d{4}-\d{2}-\d{2})/);
      if (expireMatch) {
        const expireDate = new Date(expireMatch[1]);
        const now = new Date();
        const diffTime = expireDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          date: expireDate,
          days: diffDays,
          formatted: `${expireMatch[1]} (${diffDays}天后到期)`
        };
      }
    }
    return null;
  }
  
  // 计算流量使用百分比（需要总流量信息）
  static calculateTrafficUsage(remaining, total = 100) {
    if (!remaining || !total) return 0;
    const used = total - remaining;
    return Math.max(0, Math.min(100, (used / total) * 100));
  }
}

// 默认的订阅数据（当无法获取真实数据时使用）
export const defaultSubscriptionData = [
  {
    id: 1,
    name: "可用订阅1（IP纯净）",
    url: "https://43.100.58.97/5b780ba09d5a66c7950914244600b801",
    rating: 5,
    traffic: {
      remaining: 73.53,
      total: 100,
      unit: "GB"
    },
    reset: {
      days: 9,
      date: new Date('2025-06-02'),
      formatted: "9 天后重置"
    },
    expire: {
      date: new Date('2025-07-02'),
      days: 39,
      formatted: "2025-07-02 (39天后到期)"
    },
    maxRate: "500Mbps"
  },
  {
    id: 2,
    name: "可用订阅2（速度快）",
    url: "http://23.145.248.218:3389/api/v1/client/subscribe?token=b248fd5a74963c377a8fa88eac51cefa",
    rating: 4,
    traffic: {
      remaining: 109.7,
      total: 168,
      unit: "GB"
    },
    reset: {
      days: 15,
      date: new Date('2025-06-08'),
      formatted: "15 天后重置"
    },
    expire: {
      date: new Date('2025-06-21'),
      days: 28,
      formatted: "2025-06-21 (28天后到期)"
    },
    maxRate: "500Mbps"
  },
  {
    id: 3,
    name: "可用订阅3（仅供应急，请勿使用）",
    url: "https://sublink.cute-cloud.de/link?token=8ce120621aac8c6b7793e63a3bdb759f",
    rating: 3,
    traffic: {
      remaining: 245.8,
      total: 300,
      unit: "GB"
    },
    reset: {
      days: 30,
      date: new Date('2025-06-23'),
      formatted: "30 天后重置"
    },
    expire: {
      date: new Date('2026-03-21'),
      days: 301,
      formatted: "2026-03-21 (301天后到期)"
    },
    maxRate: "500Mbps"
  }
];
