import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export type EntryArtVariant =
  | 'clients'
  | 'recommend'
  | 'tutorials'
  | 'subscriptions'
  | 'free'
  | 'vpn'

/**
 * 「从这里开始」入口卡的弥散插画：柔和光斑 + 细点阵 + 虚线环 + 图标胶囊。
 * 颜色全部取自主题变量，深浅色自动适配；整块是装饰，对读屏隐藏。
 */
const ART: Record<EntryArtVariant, { wash: string; blobA: string; blobB: string }> = {
  clients: {
    wash: 'from-primary/12 via-transparent to-info/12',
    blobA: 'bg-primary/25',
    blobB: 'bg-info/25',
  },
  recommend: {
    wash: 'from-primary/14 via-transparent to-success/10',
    blobA: 'bg-primary/28',
    blobB: 'bg-success/20',
  },
  tutorials: {
    wash: 'from-info/12 via-transparent to-primary/12',
    blobA: 'bg-info/25',
    blobB: 'bg-primary/22',
  },
  subscriptions: {
    wash: 'from-success/12 via-transparent to-primary/12',
    blobA: 'bg-success/22',
    blobB: 'bg-primary/22',
  },
  free: {
    wash: 'from-warning/10 via-transparent to-primary/12',
    blobA: 'bg-warning/16',
    blobB: 'bg-primary/20',
  },
  vpn: {
    wash: 'from-info/12 via-transparent to-success/12',
    blobA: 'bg-info/24',
    blobB: 'bg-success/20',
  },
}

export function EntryArt({
  variant,
  icon: Icon,
  className,
}: {
  variant: EntryArtVariant
  icon: LucideIcon
  className?: string
}) {
  const art = ART[variant]

  return (
    <div
      aria-hidden
      className={cn(
        'relative flex h-28 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-card',
        className,
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br', art.wash)} />
      <div className={cn('absolute -top-12 -left-10 size-36 rounded-full blur-3xl', art.blobA)} />
      <div className={cn('absolute -right-12 -bottom-14 size-40 rounded-full blur-3xl', art.blobB)} />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:10px_10px]" />
      <div className="absolute size-28 rounded-full border border-dashed border-border" />
      <div className="relative flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-background/70 shadow-sm backdrop-blur-sm">
        <Icon className="size-6 text-primary" />
      </div>
    </div>
  )
}
