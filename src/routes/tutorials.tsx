import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, Bookmark, Globe } from 'lucide-react'

import { getLocalTutorials, loadTutorials, type Tutorial } from '@/lib/tutorials'

export const Route = createFileRoute('/tutorials')({
  component: TutorialsPage,
})

function TutorialsPage() {
  // 首屏直接用随包发布的本地数据，不等待 sitemap
  const [items, setItems] = useState<Tutorial[]>(() => getLocalTutorials())

  useEffect(() => {
    let alive = true
    // 后台补齐线上新增文章；失败就保持本地列表
    void loadTutorials().then((list) => {
      if (!alive || list.length === 0) return
      setItems((prev) => (sameList(prev, list) ? prev : list))
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
          同步自星空之镜技术博客，覆盖协议原理、分流规则、订阅选购与客户端配置。
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((tutorial) => (
          <TutorialCard key={tutorial.slug} tutorial={tutorial} />
        ))}
      </div>

    </section>
  )
}

function sameList(a: Tutorial[], b: Tutorial[]) {
  if (a.length !== b.length) return false
  return a.every((item, index) => item.slug === b[index].slug && item.updated === b[index].updated)
}

function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <a
      href={tutorial.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors duration-[var(--duration-fast)] hover:border-primary/45"
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
