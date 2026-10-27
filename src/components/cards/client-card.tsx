import { BookOpen, Check, Download, ExternalLink, Layers } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { categoryMeta, osMeta, type Client, type Os } from '@/lib/data/clients'
import { cn } from '@/lib/utils'

/**
 * 客户端卡片：ReactBits Card 5 结构（名称 → 平台大字位 → ✓ 清单 → 整宽按钮）。
 * 已按反馈移除「内核 / 下载渠道 / 教程」规格行，按钮统一贴底对齐。
 */
export function ClientCard({ client, os, className }: { client: Client; os: Os; className?: string }) {
  const tutorial = client.tutorials?.[os]
  const platformNames = client.platforms.map((item) => osMeta[item].label)
  const isRecommended = client.recommended?.includes(os) ?? false

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors duration-[var(--duration-fast)] hover:border-primary/45',
        className,
      )}
    >
      <header className="flex items-start gap-3">
        {client.logo ? (
          <img
            src={`${import.meta.env.BASE_URL}logos/clients/${client.logo}`}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="size-10 shrink-0 rounded-lg bg-muted object-contain"
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Layers className="size-5" aria-hidden />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold tracking-tight">{client.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{categoryMeta[client.category].label}</p>
        </div>
        {isRecommended ? <Badge variant="secondary">推荐</Badge> : null}
      </header>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {client.description}
      </p>

      <p className="mt-5 text-2xl font-semibold tracking-tight">{platformNames.join(' · ')}</p>

      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          支持 {platformNames.join('、')}
        </li>
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          {isRecommended ? `官方推荐用于 ${osMeta[os].label}` : `可在 ${osMeta[os].label} 上运行`}
        </li>
      </ul>

      <div className="mt-auto flex flex-col gap-2 pt-5">
        {client.downloads[0] ? (
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href={client.downloads[0].url} target="_blank" rel="noopener noreferrer" />}
            className="w-full"
          >
            <Download className="size-4" aria-hidden />
            下载 {client.name}
          </Button>
        ) : null}

        <div className="flex gap-2">
          {tutorial ? (
            <Button
              size="sm"
              nativeButton={false}
              className="flex-1"
              title="首次安装建议走教程里的网盘下载"
              render={<a href={tutorial} target="_blank" rel="noopener noreferrer" />}
            >
              <BookOpen className="size-3.5" aria-hidden />
              安装教程(含网盘高速下载)
            </Button>
          ) : null}
          {client.downloads[1] ? (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              className="flex-1"
              render={
                <a href={client.downloads[1].url} target="_blank" rel="noopener noreferrer" />
              }
            >
              <ExternalLink className="size-3.5" aria-hidden />
              {client.downloads[1].label}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
