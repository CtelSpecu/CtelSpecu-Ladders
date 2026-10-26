import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, Bookmark, Globe } from 'lucide-react'

import { loadTutorials, type Tutorial } from '@/lib/tutorials'

export const Route = createFileRoute('/tutorials')({
  component: TutorialsPage,
})

function TutorialsPage() {
  const [items, setItems] = useState<Tutorial[] | null>(null)

  useEffect(() => {
    let alive = true
    void loadTutorials().then((list) => {
      if (alive) setItems(list)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="page-shell py-12">
      <header className="text-center">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Tutorials
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          技术教程
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          同步自 ctelspecu 技术博客，覆盖协议原理、分流规则、订阅选购与客户端配置。
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items === null
          ? Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl border border-border bg-muted/40"
              />
            ))
          : items.map((tutorial) => <TutorialCard key={tutorial.slug} tutorial={tutorial} />)}
      </div>

      {items !== null ? (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          共 {items.length} 篇 · 列表来自线上 sitemap，标题由站点同步
        </p>
      ) : null}
    </section>
  )
}

function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <a
      href={tutorial.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-[var(--duration-standard)] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-2">
          {tutorial.tags[0] ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
              {tutorial.tags[0]}
            </span>
          ) : null}
          {tutorial.updated ? <time className="truncate">{tutorial.updated}</time> : null}
          {tutorial.synced ? null : <span className="text-warning">待同步标题</span>}
        </span>
        <Bookmark
          className="size-3.5 shrink-0 transition-colors group-hover:text-primary"
          aria-hidden
        />
      </div>

      <h2 className="mt-3 text-base font-semibold tracking-tight text-balance">
        {tutorial.title}
      </h2>

      {tutorial.summary ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tutorial.summary}
        </p>
      ) : null}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Globe className="size-3.5" aria-hidden />
        ctelspecu.hxcn.top
        <ArrowUpRight
          className="ml-auto size-3.5 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </div>
    </a>
  )
}
