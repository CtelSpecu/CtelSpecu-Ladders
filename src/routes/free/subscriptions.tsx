import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Copy, Download, RefreshCw } from 'lucide-react'

import { StarRating } from '@/components/cards/star-rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SubscriptionView } from '@/lib/data/subscriptions'
import { cn } from '@/lib/utils'
import { useSubscriptions } from '@/lib/use-subscriptions'

export const Route = createFileRoute('/free/subscriptions')({
  component: SharedSubscriptionsPage,
})

function usedPercent(item: SubscriptionView) {
  const { remaining } = item.trafficState
  if (remaining === null || item.traffic <= 0) return 0
  const used = Math.max(0, item.traffic - remaining)
  return Math.min(100, Math.round((used / item.traffic) * 100))
}

function SharedSubscriptionsPage() {
  const { items, status, error, refresh } = useSubscriptions()
  const sorted = [...items].sort((a, b) => b.rating - a.rating)

  if (status === 'error') {
    return (
      <p className="mx-auto max-w-2xl rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        {error ?? '订阅清单加载失败'}
      </p>
    )
  }

  if (status === 'loading') {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-64 animate-pulse rounded-2xl border border-border bg-muted/40" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {sorted.map((item) => (
        <SubscriptionPanel key={item.id} item={item} onRefresh={() => refresh(item)} />
      ))}
      <p className="rounded-xl border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground lg:col-span-2">
        共享订阅由他人提供，随时可能失效或限速。流量来自订阅接口返回的 `subscription-userinfo` 响应头，
        对方不返回时无法显示，可点卡片右下角刷新重试。介意隐私与稳定请自行购买。
      </p>
    </div>
  )
}

function SubscriptionPanel({ item, onRefresh }: { item: SubscriptionView; onRefresh: () => void }) {
  const [copied, setCopied] = useState(false)
  const percent = usedPercent(item)
  const { remaining, isLoading, failed } = item.trafficState

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const importToClash = () => {
    window.open(
      `clash://install-config?url=${encodeURIComponent(item.yamlUrl || item.url)}`,
      '_blank',
    )
  }

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{item.name}</h2>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={item.rating} />
            <span className="text-xs text-muted-foreground">{item.rating}/5 推荐</span>
          </div>
        </div>
        <Badge variant={item.expired ? 'destructive' : 'outline'} className={cn(!item.expired && 'text-success')}>
          {item.expired ? '已过期' : failed ? '流量不可用' : isLoading ? '获取中' : '可用'}
        </Badge>
      </header>

      <div className="px-5 py-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">
            {item.expired ? '—' : isLoading ? '···' : (remaining ?? '—')}
          </span>
          <span className="text-sm text-muted-foreground">/ {item.traffic} GB 剩余</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {failed ? '订阅未返回流量头' : `${percent}% 已用`}
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-[var(--duration-considered)]"
            style={{ width: `${percent}%` }}
          />
        </div>

        <dl className="mt-4 divide-y divide-border text-sm">
          <div className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">流量重置</dt>
            <dd className="font-medium">{item.reset.label}</dd>
          </div>
          <div className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">套餐到期</dt>
            <dd className="font-medium">{item.expireTime}</dd>
          </div>
          <div className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">最大速率</dt>
            <dd className="font-medium">{item.maxRate}</dd>
          </div>
        </dl>
      </div>

      <footer className="mt-auto flex items-center gap-2 border-t border-border px-5 py-3">
        <Button size="sm" onClick={copyLink} className="flex-1">
          <Copy className="size-3.5" aria-hidden />
          {copied ? '已复制' : '复制链接'}
        </Button>
        <Button size="sm" variant="outline" onClick={importToClash} className="flex-1">
          <Download className="size-3.5" aria-hidden />
          导入 Clash
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onRefresh}
          aria-label="刷新流量"
          disabled={isLoading}
        >
          <RefreshCw className={cn('size-3.5', isLoading && 'animate-spin')} aria-hidden />
        </Button>
      </footer>
    </article>
  )
}
