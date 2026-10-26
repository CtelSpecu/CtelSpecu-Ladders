import { useCallback, useEffect, useRef, useState } from 'react'

import {
  fetchRemaining,
  loadSubscriptions,
  type SubscriptionView,
} from '@/lib/data/subscriptions'

type Status = 'loading' | 'ready' | 'error'

/**
 * 订阅列表 + 实时流量。
 *
 * 流量必须从订阅的原始 url 取（`subscription-userinfo` 在响应头里）；
 * `yamlUrl` 是 subconverter 转换后的产物，头部会被剥掉，只用于导入。
 * 订阅源无 CORS，统一走 allorigins，并发 2 个，失败保留可重试状态。
 */
export function useSubscriptions() {
  const [items, setItems] = useState<SubscriptionView[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const aliveRef = useRef(true)

  const patch = useCallback((id: number, next: Partial<SubscriptionView>) => {
    if (!aliveRef.current) return
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...next } : item)))
  }, [])

  const loadTraffic = useCallback(
    async (targets: SubscriptionView[], force = false) => {
      const queue = [...targets]
      const worker = async () => {
        for (;;) {
          const item = queue.shift()
          if (!item) return
          const remaining = await fetchRemaining(item.url, force)
          patch(item.id, {
            trafficState: { remaining, isLoading: false, failed: remaining === null },
          })
        }
      }
      await Promise.all([worker(), worker()])
    },
    [patch],
  )

  useEffect(() => {
    aliveRef.current = true

    void (async () => {
      try {
        const list = await loadSubscriptions()
        if (!aliveRef.current) return
        setItems(list)
        setStatus('ready')
        void loadTraffic(list.filter((item) => !item.expired))
      } catch (err) {
        if (!aliveRef.current) return
        setError(err instanceof Error ? err.message : '订阅清单加载失败')
        setStatus('error')
      }
    })()

    return () => {
      aliveRef.current = false
    }
  }, [loadTraffic])

  const refresh = useCallback(
    (item: SubscriptionView) => {
      patch(item.id, {
        trafficState: { remaining: item.trafficState.remaining, isLoading: true, failed: false },
      })
      void fetchRemaining(item.url, true).then((remaining) => {
        patch(item.id, {
          trafficState: { remaining, isLoading: false, failed: remaining === null },
        })
      })
    },
    [patch],
  )

  return { items, status, error, refresh }
}
