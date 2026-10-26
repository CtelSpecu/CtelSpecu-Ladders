import { ExternalLink, Download, BookOpen, Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { categoryMeta, osMeta, type Client, type Os } from '@/lib/data/clients'
import { cn } from '@/lib/utils'

/**
 * 客户端卡片：ReactBits Card 5 的结构（名称 → 大字位 → 规格行 → ✓ 清单 → 整宽按钮），
 * 内容全部来自 clients.json，不编造能力描述。
 */
export function ClientCard({ client, os, className }: { client: Client; os: Os; className?: string }) {
  const tutorial = client.tutorials?.[os]
  const platformNames = client.platforms.map((item) => osMeta[item].label)
  const isRecommended = client.recommended?.includes(os) ?? false

  return (
    <article
      className={cn(
        'flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all duration-[var(--duration-standard)] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--shadow-lift)]',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight">{client.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{categoryMeta[client.category].label}</p>
        </div>
        {isRecommended ? <Badge variant="secondary">推荐</Badge> : null}
      </header>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {client.description}
      </p>

      <p className="mt-5 text-2xl font-semibold tracking-tight">
        {platformNames.join(' · ')}
      </p>

      <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
        <div className="flex items-center justify-between py-2.5">
          <dt className="text-muted-foreground">内核</dt>
          <dd className="font-medium">{categoryMeta[client.category].label}</dd>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <dt className="text-muted-foreground">下载渠道</dt>
          <dd className="font-medium">{client.downloads.length} 个</dd>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <dt className="text-muted-foreground">{osMeta[os].label} 教程</dt>
          <dd className="font-medium">{tutorial ? '有' : '暂无'}</dd>
        </div>
      </dl>

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

      <div className="mt-5 flex flex-col gap-2">
        {client.downloads[0] ? (
          <Button
            nativeButton={false}
            render={
              <a href={client.downloads[0].url} target="_blank" rel="noopener noreferrer" />
            }
            className="w-full"
          >
            <Download className="size-4" aria-hidden />
            下载 {client.name}
          </Button>
        ) : null}

        <div className="flex gap-2">
          {tutorial ? (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              className="flex-1"
              render={<a href={tutorial} target="_blank" rel="noopener noreferrer" />}
            >
              <BookOpen className="size-3.5" aria-hidden />
              安装教程
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
