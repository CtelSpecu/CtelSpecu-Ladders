import { z } from 'zod'

const rawSchema = z.object({
  subscriptions: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      url: z.string(),
      yamlUrl: z.string(),
      rating: z.number(),
      traffic: z.number(),
      maxRate: z.string(),
      expireTime: z.string(),
      monthlyReset: z.number().nullable(),
    }),
  ),
})

export type RawSubscription = z.infer<typeof rawSchema>['subscriptions'][number]

export interface TrafficState {
  remaining: number | null
  isLoading: boolean
  failed: boolean
}

export interface ResetProgress {
  daysRemaining: number | null
  progress: number
  label: string
}

export interface SubscriptionView extends RawSubscription {
  trafficState: TrafficState
  reset: ResetProgress
  expired: boolean
}

const DATA_URL = `${import.meta.env.BASE_URL}subscriptions.json`
const PROXY = 'https://api.allorigins.win/get?url='
const CACHE_TTL = 5 * 60 * 1000

const cache = new Map<string, { content: string; at: number }>()

/** 逐月重置进度：以 monthlyReset 日为锚点计算已过天数与剩余天数。 */
export function resetProgress(monthlyReset: number | null, now = new Date()): ResetProgress {
  if (monthlyReset === null) {
    return { daysRemaining: null, progress: 0, label: '长期有效' }
  }

  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  const next =
    day < monthlyReset ? new Date(year, month, monthlyReset) : new Date(year, month + 1, monthlyReset)
  const last =
    day < monthlyReset ? new Date(year, month - 1, monthlyReset) : new Date(year, month, monthlyReset)

  const totalDays = Math.max(1, Math.ceil((next.getTime() - last.getTime()) / 86_400_000))
  const passedDays = Math.ceil((now.getTime() - last.getTime()) / 86_400_000)
  const daysRemaining = Math.ceil((next.getTime() - now.getTime()) / 86_400_000)

  return {
    daysRemaining,
    progress: Math.max(0, Math.min(100, (passedDays / totalDays) * 100)),
    label: `距离下次重置 ${daysRemaining} 天`,
  }
}

/** 订阅 YAML 的注释里带「剩余流量：xx GB」，优先按这个解析。 */
export function parseRemaining(content: string): number | null {
  const patterns = [
    /剩余流量[：:]\s*(\d+\.?\d*)\s*GB/i,
    /remaining[^\d]{0,12}(\d+\.?\d*)\s*GB/i,
    /traffic[^\d]{0,12}(\d+\.?\d*)\s*GB/i,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(content)
    if (match?.[1]) {
      const value = Number.parseFloat(match[1])
      if (Number.isFinite(value) && value >= 0) return value
    }
  }
  return null
}

async function fetchYaml(url: string): Promise<string | null> {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.content

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)

  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(url)}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) return null
    const payload = (await response.json()) as { contents?: string }
    const content = payload.contents?.trim()
    if (!content) return null
    cache.set(url, { content, at: Date.now() })
    return content
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function wait(ms: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>()
  setTimeout(resolve, ms)
  return promise
}

/** 订阅源无 CORS，统一走 allorigins；失败按指数退避重试 3 次。 */
export async function fetchRemaining(url: string, force = false): Promise<number | null> {
  if (force) cache.delete(url)
  for (let attempt = 0; attempt <= 3; attempt += 1) {
    const content = await fetchYaml(url)
    if (content) {
      const remaining = parseRemaining(content)
      if (remaining !== null) return remaining
    }
    if (attempt < 3) await wait(Math.min(1000 * 2 ** attempt, 5000))
  }
  return null
}

export async function loadSubscriptions(): Promise<SubscriptionView[]> {
  const response = await fetch(DATA_URL)
  if (!response.ok) throw new Error(`订阅清单加载失败：HTTP ${response.status}`)

  const { subscriptions } = rawSchema.parse(await response.json())
  const now = new Date()

  return subscriptions.map((item) => ({
    ...item,
    trafficState: { remaining: null, isLoading: true, failed: false },
    reset: resetProgress(item.monthlyReset, now),
    expired: new Date(item.expireTime).getTime() < now.getTime(),
  }))
}
