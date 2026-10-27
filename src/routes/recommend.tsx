import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  BadgePercent,
  Cable,
  ChevronDown,
  Database,
  ExternalLink,
  Fingerprint,
  Gauge,
  House,
  Network,
  Server,
  ShieldCheck,
  TicketPercent,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { SlidingTabs } from '@/components/motion/sliding-tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  BILLING,
  billingDescription,
  billingLabel,
  providersForBilling,
  type BillingType,
  type ProviderForBilling,
} from '@/lib/data/providers'
import { cn } from '@/lib/utils'

export interface RecommendSearch {
  billing?: BillingType
}

export const Route = createFileRoute('/recommend')({
  validateSearch: (search: Record<string, unknown>): RecommendSearch => {
    const value = typeof search.billing === 'string' ? search.billing : ''
    return {
      billing: (BILLING as readonly string[]).includes(value) ? (value as BillingType) : undefined,
    }
  },
  component: RecommendPage,
})

const FEATURE_ICONS: Record<string, LucideIcon> = {
  gauge: Gauge,
  'shield-check': ShieldCheck,
  network: Network,
  'badge-percent': BadgePercent,
  fingerprint: Fingerprint,
  house: House,
  database: Database,
  cable: Cable,
  server: Server,
  ticket: TicketPercent,
}

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['zh-CN'], { type: 'region' })
  } catch {
    return null
  }
})()

function regionLabel(iso: string) {
  try {
    return regionNames?.of(iso.toUpperCase()) ?? iso.toUpperCase()
  } catch {
    return iso.toUpperCase()
  }
}

function flagUrl(iso: string, scale = 1) {
  const base = `${import.meta.env.BASE_URL}flags/${iso.toLowerCase()}`
  return scale === 2 ? `${base}@2x.png` : `${base}.png`
}

const billingTabs = BILLING.map((type) => ({ value: type, label: billingLabel[type] }))

function RecommendPage() {
  const { billing: billingParam } = Route.useSearch()
  const navigate = useNavigate({ from: '/recommend' })
  const billing: BillingType = billingParam ?? 'monthly'
  const list = useMemo(() => providersForBilling(billing), [billing])

  return (
    <section className="page-shell py-12">
      <header className="text-center">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Providers
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          机场推荐
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {billingDescription[billing]}。建议先小额试用再转长期。
        </p>
      </header>

      <div className="mt-7 flex justify-center">
        <SlidingTabs
          items={billingTabs}
          active={billing}
          layoutId="billing-tab-indicator"
          ariaLabel="按计费方式筛选"
          onSelect={(value) =>
            void navigate({ to: '/recommend', search: { billing: value as BillingType }, replace: true })
          }
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {list.map((provider) => (
          <ProviderCard key={provider.name} provider={provider} billing={billing} />
        ))}
      </div>
    </section>
  )
}

/**
 * 只显示两行地区：用一份隐藏的完整列表测量换行位置，
 * 再按测得的数量裁剪真实列表，避免「容器裁剪」与「测量」互相打架。
 */
function useTwoRowClamp(count: number) {
  const probeRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(Number.POSITIVE_INFINITY)

  useLayoutEffect(() => {
    const probe = probeRef.current
    if (!probe) return

    const measure = () => {
      const items = Array.from(probe.children) as HTMLElement[]
      if (items.length === 0) return

      // 用实际行位（而不是「行高 × 2」）判断，避免亚像素取整把第三行算进来
      const rowTops = [...new Set(items.map((item) => item.offsetTop))].sort((a, b) => a - b)
      const cut = rowTops[2] ?? Number.POSITIVE_INFINITY
      const fitting = items.filter((item) => item.offsetTop < cut).length
      const next = Math.max(1, fitting - 1)
      setVisible((prev) => (prev === next ? prev : next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(probe)
    return () => observer.disconnect()
  }, [count])

  return { probeRef, visible }
}

function ProviderCard({
  provider,
  billing,
}: {
  provider: ProviderForBilling
  billing: BillingType
}) {
  const uid = useId().replace(/:/g, '')
  const { probeRef, visible } = useTwoRowClamp(provider.regions.length)
  const [regionsOpen, setRegionsOpen] = useState(false)

  const shown = provider.regions.slice(0, visible)
  const hidden = provider.regions.length - shown.length

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors duration-[var(--duration-fast)] hover:border-primary/45">
      <header className="flex items-start gap-3">
        {provider.logo ? (
          <img
            src={`${import.meta.env.BASE_URL}logos/providers/${provider.logo}`}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            decoding="async"
            className="size-9 shrink-0 rounded-lg bg-muted object-contain"
          />
        ) : (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
            {provider.displayName.slice(0, 1)}
          </span>
        )}
        <h2 className="min-w-0 flex-1 text-lg font-semibold tracking-tight">
          {provider.displayName}
        </h2>
        <Badge variant="secondary">{billingLabel[billing]}</Badge>
      </header>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-sm text-muted-foreground">￥</span>
        <span className="text-4xl font-semibold tracking-tight">{provider.price.price}</span>
        <span className="text-sm text-muted-foreground">/ {provider.price.traffic}</span>
      </div>

      {provider.badges.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {provider.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      ) : null}

      <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
        {provider.features.map((feature) => {
          const Icon = FEATURE_ICONS[feature.icon] ?? ShieldCheck
          return (
            <li key={`${uid}-${feature.title}`} className="flex items-start gap-2.5 text-sm">
              <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span className="text-muted-foreground">{feature.title}</span>
            </li>
          )
        })}
      </ul>

      <div className="mt-5 flex-1 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            节点支持地区 · {provider.regions.length} 个
          </p>
          {hidden > 0 ? (
            <button
              type="button"
              onClick={() => setRegionsOpen(true)}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-primary transition-colors hover:border-primary/45"
            >
              +{hidden}
              <ChevronDown className="size-3" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="relative mt-2">
          <div
            ref={probeRef}
            aria-hidden
            className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap gap-1.5"
          >
            {provider.regions.map((iso) => (
              <RegionChip key={`probe-${uid}-${iso}`} iso={iso} ghost />
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {shown.map((iso) => (
              <RegionChip key={`${uid}-${iso}`} iso={iso} />
            ))}
          </div>
        </div>
      </div>

      <Button
        nativeButton={false}
        render={<a href={provider.url} target="_blank" rel="noopener noreferrer" />}
        className="mt-5 w-full"
      >
        访问官网
        <ExternalLink className="size-3.5" aria-hidden />
      </Button>

      <Dialog open={regionsOpen} onOpenChange={setRegionsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{provider.displayName} 支持的地区</DialogTitle>
            <DialogDescription>共 {provider.regions.length} 个国家和地区</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex max-h-[50vh] flex-wrap gap-1.5 overflow-y-auto">
            {provider.regions.map((iso) => (
              <RegionChip key={`all-${uid}-${iso}`} iso={iso} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}

function RegionChip({
  iso,
  className,
  ghost = false,
}: {
  iso: string
  className?: string
  /** 仅用于测量换行的副本：尺寸与真实 chip 一致，但不请求图片 */
  ghost?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground',
        className,
      )}
    >
      {ghost ? (
        <span className="h-3 w-4 shrink-0 rounded-[2px]" aria-hidden />
      ) : (
        <img
          src={flagUrl(iso)}
          srcSet={`${flagUrl(iso, 2)} 2x`}
          alt=""
          width={16}
          height={12}
          loading="lazy"
          decoding="async"
          className="h-3 w-4 shrink-0 rounded-[2px] object-cover"
        />
      )}
      {regionLabel(iso)}
    </span>
  )
}
