import { ref } from 'vue'

export interface SubscriptionRaw {
  id: number
  name: string
  url: string
  yamlUrl: string
  rating: number
  traffic: number
  maxRate: string
  expireTime: string
  monthlyReset: number | null
}

interface SubscriptionFile {
  subscriptions: SubscriptionRaw[]
}

interface LoadedSubscription {
  id: number
  name: string
  url: string
  yamlUrl: string
  rating: number
  traffic: {
    total: number
    unit: string
  }
  maxRate: string
  expireTime: string
  monthlyReset: number | null
}

export interface ResetProgress {
  daysRemaining: number | null
  progress: number
  formatted: string
}

export interface SubscriptionTraffic {
  total: number
  unit: string
  remaining: number | null
  used: number
  hasRealData: boolean
  hasValidData: boolean
  isLoading: boolean
}

export interface SubscriptionDisplay {
  id: number
  name: string
  url: string
  yamlUrl: string
  rating: number
  traffic: SubscriptionTraffic
  maxRate: string
  expireTime: string
  monthlyReset: number | null
  reset: ResetProgress
  expire: {
    date: Date
    formatted: string
  }
}

interface TrafficResult {
  remaining: number | null
  hasRealData: boolean
  hasValidData: boolean
}

interface CacheEntry {
  content: string
  timestamp: number
}

const subscriptionsData = ref<SubscriptionDisplay[]>([])
const isLoading = ref<boolean>(false)
const loadingError = ref<string | null>(null)

const loadSubscriptionsFromJson = async (): Promise<LoadedSubscription[]> => {
  try {
    const response = await fetch('/subscriptions.json')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const config = (await response.json()) as SubscriptionFile
    return config.subscriptions.map((sub) => ({
      id: sub.id,
      name: sub.name,
      url: sub.url,
      yamlUrl: sub.yamlUrl,
      rating: sub.rating,
      traffic: {
        total: sub.traffic,
        unit: 'GB',
      },
      maxRate: sub.maxRate,
      expireTime: sub.expireTime,
      monthlyReset: sub.monthlyReset,
    }))
  } catch (error) {
    console.error('加载订阅配置失败:', error)
    return [
      {
        id: 1,
        name: '可用订阅1（IP纯净）',
        url: 'https://43.100.58.97/5b780ba09d5a66c7950914244600b801',
        yamlUrl: 'https://43.100.58.97/5b780ba09d5a66c7950914244600b801',
        rating: 5,
        traffic: { total: 500, unit: 'GB' },
        maxRate: '500Mbps',
        expireTime: '2025-07-02',
        monthlyReset: 2,
      },
    ]
  }
}

const parseRemainingTrafficFromContent = (content: string): number | null => {
  try {
    const patterns: RegExp[] = [
      /剩余流量[：:]\s*(\d+\.?\d*)\s*GB/gi,
      /剩余流量[：:]\s*(\d+\.?\d*)\s*gb/gi,
      /remaining.*?(\d+\.?\d*)\s*GB/gi,
      /traffic.*?(\d+\.?\d*)\s*GB/gi,
    ]

    for (const pattern of patterns) {
      pattern.lastIndex = 0
      const match = pattern.exec(content)
      if (match?.[1]) {
        const traffic = parseFloat(match[1])
        if (!isNaN(traffic) && traffic > 0) {
          console.log(`找到剩余流量信息: ${traffic} GB`)
          return traffic
        }
      }
    }

    console.warn('未找到剩余流量信息')
    return null
  } catch (error) {
    console.error('解析剩余流量失败:', error)
    return null
  }
}

const yamlCache = new Map<string, CacheEntry>()
const CACHE_DURATION = 5 * 60 * 1000
const MAX_CACHE_SIZE = 20

const cleanExpiredCache = (): void => {
  const now = Date.now()
  const keysToDelete: string[] = []
  for (const [key, data] of yamlCache.entries()) {
    if (now - data.timestamp > CACHE_DURATION) {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach((key) => yamlCache.delete(key))
  if (yamlCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(yamlCache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toDelete = entries.slice(0, yamlCache.size - MAX_CACHE_SIZE)
    toDelete.forEach(([key]) => yamlCache.delete(key))
  }
}

const generateCacheKey = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const lastSegment = urlObj.pathname.split('/').pop() ?? ''
    return `${urlObj.hostname}_${lastSegment}`.slice(0, 50)
  } catch {
    return url.slice(-50).replace(/[^a-zA-Z0-9]/g, '_')
  }
}

const fetchAndCacheYaml = async (url: string): Promise<string | null> => {
  const cacheKey = generateCacheKey(url)
  const now = Date.now()
  const cached = yamlCache.get(cacheKey)
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log(`使用缓存的YAML数据: ${cacheKey}`)
    return cached.content
  }
  try {
    console.log(`正在获取YAML文件: ${url}`)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'CtelSpecu-Ladders/1.0',
      },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = (await response.json()) as { contents: string }
    const yamlContent = data.contents
    if (!yamlContent || yamlContent.trim() === '') {
      throw new Error('YAML内容为空')
    }
    yamlCache.set(cacheKey, {
      content: yamlContent,
      timestamp: now,
    })
    console.log(`成功缓存YAML文件: ${cacheKey}`)
    return yamlContent
  } catch (error) {
    const err = error as Error
    if (err.name === 'AbortError') {
      console.warn(`获取YAML文件超时 ${url}`)
    } else {
      console.warn(`获取YAML文件失败 ${url}:`, err.message)
    }
    return null
  }
}

const delay = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

const getSubscriptionRemainingTraffic = async (
  subscriptionUrl: string,
  _fallbackTotal = 100,
  retryCount = 3,
): Promise<TrafficResult> => {
  cleanExpiredCache()
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      console.log(`获取流量数据尝试 ${attempt + 1}/${retryCount + 1}: ${subscriptionUrl}`)
      const yamlContent = await fetchAndCacheYaml(subscriptionUrl)
      if (yamlContent) {
        const remainingTraffic = parseRemainingTrafficFromContent(yamlContent)
        if (remainingTraffic !== null && remainingTraffic >= 0) {
          console.log(`从YAML获取到剩余流量: ${remainingTraffic} GB (尝试 ${attempt + 1})`)
          return {
            remaining: remainingTraffic,
            hasRealData: true,
            hasValidData: true,
          }
        } else {
          console.warn(`YAML内容解析失败，尝试 ${attempt + 1}: 未找到流量信息`)
        }
      } else {
        console.warn(`获取YAML内容失败，尝试 ${attempt + 1}`)
      }
      if (attempt < retryCount) {
        const waitMs = Math.min(1000 * Math.pow(2, attempt), 5000)
        console.log(`等待 ${waitMs}ms 后进行第 ${attempt + 2} 次尝试...`)
        await delay(waitMs)
        continue
      }
    } catch (error) {
      const err = error as Error
      console.warn(`获取订阅流量失败，尝试 ${attempt + 1}/${retryCount + 1}:`, err.message)
      if (attempt < retryCount) {
        const waitMs = Math.min(1000 * Math.pow(2, attempt), 5000)
        console.log(`错误后等待 ${waitMs}ms 重试...`)
        await delay(waitMs)
        continue
      }
    }
  }
  console.log(`所有重试均失败，无法获取剩余流量，订阅URL: ${subscriptionUrl}`)
  return {
    remaining: null,
    hasRealData: false,
    hasValidData: false,
  }
}

const getReoKuRemainingTraffic = async (): Promise<number | null> => {
  const result = await getSubscriptionRemainingTraffic('https://example.com/ReoKuSFzwPUp.yaml', 100)
  return result.remaining
}

const calculateResetProgress = (monthlyReset: number | null): ResetProgress => {
  if (monthlyReset === null) {
    return {
      daysRemaining: null,
      progress: 0,
      formatted: '长期有效',
    }
  }
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const currentDay = now.getDate()
  let nextResetDate: Date
  if (currentDay < monthlyReset) {
    nextResetDate = new Date(currentYear, currentMonth, monthlyReset)
  } else {
    nextResetDate = new Date(currentYear, currentMonth + 1, monthlyReset)
  }
  const diffTime = nextResetDate.getTime() - now.getTime()
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  let lastResetDate: Date
  if (currentDay < monthlyReset) {
    lastResetDate = new Date(currentYear, currentMonth - 1, monthlyReset)
  } else {
    lastResetDate = new Date(currentYear, currentMonth, monthlyReset)
  }
  const totalDays = Math.ceil((nextResetDate.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24))
  const passedDays = Math.ceil((now.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24))
  const progress = Math.max(0, Math.min(100, (passedDays / totalDays) * 100))
  return {
    daysRemaining,
    progress,
    formatted: `距离下次重置剩余：${daysRemaining} 天`,
  }
}

export function useSubscriptions() {
  const quickInitializeSubscriptions = async (): Promise<void> => {
    if (isLoading.value) {
      console.log('初始化已在进行中，跳过重复请求')
      return
    }
    try {
      isLoading.value = true
      loadingError.value = null
      console.log('开始快速初始化订阅数据...')
      const configData = await loadSubscriptionsFromJson()
      const quickSubscriptions: SubscriptionDisplay[] = configData.map((sub) => ({
        ...sub,
        traffic: {
          ...sub.traffic,
          remaining: null,
          used: 0,
          hasRealData: false,
          hasValidData: false,
          isLoading: true,
        },
        reset: calculateResetProgress(sub.monthlyReset),
        expire: {
          date: new Date(sub.expireTime),
          formatted: sub.expireTime,
        },
      }))
      subscriptionsData.value = quickSubscriptions
      console.log(`快速显示 ${quickSubscriptions.length} 个订阅卡片`)
      void updateTrafficDataAsync()
    } catch (error) {
      const err = error as Error
      console.error('快速初始化订阅数据失败:', err)
      loadingError.value = err.message || '初始化失败'
      try {
        const configData = await loadSubscriptionsFromJson()
        subscriptionsData.value = configData.map((sub) => ({
          ...sub,
          traffic: {
            ...sub.traffic,
            remaining: sub.traffic.total * 0.8,
            used: sub.traffic.total * 0.2,
            hasRealData: false,
            hasValidData: false,
            isLoading: false,
          },
          reset: calculateResetProgress(sub.monthlyReset),
          expire: {
            date: new Date(sub.expireTime),
            formatted: sub.expireTime,
          },
        }))
      } catch (fallbackError) {
        console.error('Fallback加载也失败:', fallbackError)
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateTrafficDataAsync = async (): Promise<void> => {
    console.log('开始异步更新流量数据...')
    const subscriptions = subscriptionsData.value.filter((sub) => sub.traffic.isLoading)
    if (subscriptions.length === 0) {
      console.log('没有需要更新的流量数据')
      return
    }
    const batchSize = 2
    for (let i = 0; i < subscriptions.length; i += batchSize) {
      const batch = subscriptions.slice(i, i + batchSize)
      await Promise.all(
        batch.map(async (sub) => {
          try {
            console.log(`正在更新订阅流量: ${sub.name}`)
            const trafficInfo = await getSubscriptionRemainingTraffic(sub.yamlUrl || sub.url, sub.traffic.total)
            const index = subscriptionsData.value.findIndex((s) => s.id === sub.id)
            if (index !== -1) {
              const current = subscriptionsData.value[index]
              subscriptionsData.value[index].traffic = {
                ...current.traffic,
                remaining: trafficInfo.remaining,
                used: trafficInfo.remaining !== null ? Math.max(0, sub.traffic.total - trafficInfo.remaining) : 0,
                hasRealData: trafficInfo.hasRealData,
                hasValidData: trafficInfo.hasValidData,
                isLoading: false,
              }
              console.log(`成功更新订阅 ${sub.name} 的流量数据`)
            }
          } catch (error) {
            console.error(`更新订阅 ${sub.name} 流量数据失败:`, error)
            const index = subscriptionsData.value.findIndex((s) => s.id === sub.id)
            if (index !== -1) {
              subscriptionsData.value[index].traffic.isLoading = false
            }
          }
        }),
      )
      if (i + batchSize < subscriptions.length) {
        await delay(500)
      }
    }
    console.log('流量数据异步更新完成')
  }

  const initializeSubscriptions = async (): Promise<void> => {
    return quickInitializeSubscriptions()
  }

  if (subscriptionsData.value.length === 0) {
    void quickInitializeSubscriptions()
  }

  const getRatingColor = (rating: number): string => {
    if (rating >= 5) return '#28a745'
    if (rating >= 4) return '#ffc107'
    if (rating >= 3) return '#fd7e14'
    return '#dc3545'
  }

  const getExpireStatus = (days: number): { status: string; color: string } => {
    if (days <= 7) return { status: 'danger', color: '#dc3545' }
    if (days <= 30) return { status: 'warning', color: '#ffc107' }
    return { status: 'success', color: '#28a745' }
  }

  const forceRefreshTrafficData = async (subscriptionUrl: string): Promise<TrafficResult> => {
    try {
      const cacheKey = generateCacheKey(subscriptionUrl)
      yamlCache.delete(cacheKey)
      console.log(`已清除缓存: ${cacheKey}`)
      const baseUrl = subscriptionUrl.split('?')[0] ?? ''
      for (const [key] of yamlCache.entries()) {
        if (key.includes(baseUrl)) {
          yamlCache.delete(key)
          console.log(`已清除相关缓存: ${key}`)
        }
      }
      return await getSubscriptionRemainingTraffic(subscriptionUrl, 100, 5)
    } catch (error) {
      console.error('强制刷新流量数据失败:', error)
      throw error
    }
  }

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
    refreshSubscriptions: (): Promise<void> => {
      subscriptionsData.value = []
      return quickInitializeSubscriptions()
    },
  }
}
