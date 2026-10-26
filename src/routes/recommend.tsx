import { useId, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  BadgePercent,
  Cable,
  Database,
  ExternalLink,
  Fingerprint,
  Gauge,
  House,
  Network,
  Server,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { SlidingTabs } from '@/components/motion/sliding-tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BILLING,
  billingDescription,
  billingLabel,
  providersForBilling,
  type BillingType,
  type ProviderForBilling,
} from '@/lib/data/providers'

export const Route = createFileRoute('/recommend')({
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
  const [billing, setBilling] = useState<BillingType>('monthly')
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
          {billingDescription[billing]}。价格以官网为准，建议先小额试用再转长期。
        </p>
      </header>

      <div className="mt-7 flex justify-center">
        <SlidingTabs
          items={billingTabs}
          active={billing}
          layoutId="billing-tab-indicator"
          ariaLabel="按计费方式筛选"
          onSelect={(value) => setBilling(value as BillingType)}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {list.map((provider) => (
          <ProviderCard key={provider.name} provider={provider} billing={billing} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">
        共 {list.length} 家支持「{billingLabel[billing]}」的机场。价格随套餐与活动浮动，以官网为准。
      </p>
    </section>
  )
}

function ProviderCard({
  provider,
  billing,
}: {
  provider: ProviderForBilling
  billing: BillingType
}) {
  const [expanded, setExpanded] = useState(false)
  const uid = useId().replace(/:/g, '')
  const visibleRegions = expanded ? provider.regions : provider.regions.slice(0, 12)
  const hiddenCount = provider.regions.length - visibleRegions.length

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-[var(--duration-standard)] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--shadow-lift)]">
      <header className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{provider.displayName}</h2>
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
        <p className="text-xs font-medium text-muted-foreground">
          节点地区 · {provider.regions.length} 个
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {visibleRegions.map((iso) => (
            <span
              key={`${uid}-${iso}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground"
            >
              <img
                src={flagUrl(iso)}
                srcSet={`${flagUrl(iso, 2)} 2x`}
                alt=""
                width={16}
                height={12}
                loading="lazy"
                decoding="async"
                className="h-3 w-4 rounded-[2px] object-cover"
              />
              {regionLabel(iso)}
            </span>
          ))}
          {hiddenCount > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-full border border-dashed border-border px-2 py-1 text-[11px] font-medium text-primary"
            >
              +{hiddenCount}
            </button>
          ) : null}
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
    </article>
  )
}
