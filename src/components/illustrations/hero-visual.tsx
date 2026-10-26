import { cn } from '@/lib/utils'

import { SiteIcon } from '@/components/brand/site-icon'

function MiniRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[10px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-medium', tone ?? 'text-foreground')}>{value}</span>
    </div>
  )
}

/**
 * 主页 hero 视觉：站点图标放大居中，周围是客户端 / 节点 / 订阅三块小面板。
 * 全部为装饰性内容，对读屏隐藏。
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-card',
        className,
      )}
    >
      {/* 底色与光斑 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-info/10" />
      <div className="absolute -top-16 -left-12 size-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-14 -bottom-16 size-64 rounded-full bg-info/20 blur-3xl" />

      {/* 轨道 */}
      <div className="absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border sm:size-80" />
      <div className="absolute top-1/2 left-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70 sm:size-60" />

      {/* 中心图标 */}
      <div className="absolute top-1/2 left-1/2 flex size-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm sm:size-48">
        <SiteIcon className="size-32 sm:size-40" />
      </div>

      {/* 小面板：客户端 */}
      <div className="absolute top-6 left-4 w-40 rounded-xl border border-border bg-background/95 p-2.5 shadow-sm sm:left-6">
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}logos/clients/clash-verge-rev.webp`}
            alt=""
            width={20}
            height={20}
            className="size-5 rounded-md object-contain"
          />
          <span className="text-[11px] font-semibold">Clash Verge</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/3 rounded-full bg-primary" />
        </div>
      </div>

      {/* 小面板：节点 */}
      <div className="absolute top-8 right-3 w-36 rounded-xl border border-border bg-background/95 p-2.5 shadow-sm sm:right-5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="size-1.5 rounded-full bg-success" />
          香港 · 12ms
        </div>
        <div className="mt-1.5 h-1 w-full rounded-full bg-muted">
          <div className="h-full w-4/5 rounded-full bg-success/70" />
        </div>
      </div>

      {/* 小面板：订阅 */}
      <div className="absolute bottom-6 left-1/2 w-44 -translate-x-1/2 rounded-xl border border-border bg-background/95 p-2.5 shadow-sm">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>订阅已导入</span>
          <span className="text-success">✓</span>
        </div>
        <div className="mt-1.5 space-y-1">
          <MiniRow label="剩余流量" value="86.4 GB" />
          <MiniRow label="到期" value="2026-12-01" />
        </div>
      </div>

      {/* 装饰点 */}
      <span className="absolute top-12 right-20 size-1.5 rounded-full bg-primary/60" />
      <span className="absolute bottom-20 left-14 size-2 rounded-full bg-info/50" />
      <span className="absolute top-1/2 right-8 size-1 rounded-full bg-foreground/20" />
    </div>
  )
}
