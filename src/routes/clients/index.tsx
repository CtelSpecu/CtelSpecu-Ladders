import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Layers } from 'lucide-react'

import { ClientCard } from '@/components/cards/client-card'
import { OsSwitcher } from '@/components/motion/os-switcher'
import { Button } from '@/components/ui/button'
import { OS, detectOs, getRecommendedClients, osMeta, type Os } from '@/lib/data/clients'

export interface ClientsSearch {
  os?: string
}

export const Route = createFileRoute('/clients/')({
  validateSearch: (search: Record<string, unknown>): ClientsSearch => ({
    os: typeof search.os === 'string' ? search.os : undefined,
  }),
  component: ClientsPage,
})

function isOs(value: string | undefined): value is Os {
  return typeof value === 'string' && (OS as readonly string[]).includes(value)
}

function ClientsPage() {
  const { os: osParam } = Route.useSearch()
  const navigate = useNavigate({ from: '/clients/' })
  // UA 只探测一次；URL 里的 os 优先，未指定时用探测结果
  const [detectedOs] = useState<Os>(() => detectOs())
  const autoDetected = !isOs(osParam)
  const os: Os = isOs(osParam) ? osParam : detectedOs
  const recommended = getRecommendedClients(os, 2)

  const selectOs = (next: Os) => {
    void navigate({ to: '/clients', search: { os: next }, replace: true })
  }

  return (
    <section className="page-shell py-12">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          客户端下载
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {autoDetected
            ? `已识别你的系统为 ${osMeta[os].label}，下面是适配它的客户端。`
            : '选择你的系统，或直接查看下面的推荐结果。'}
        </p>
      </header>

      <div className="mt-7 flex justify-center">
        <OsSwitcher value={os} onChange={selectOs} className="justify-center" />
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">为 {osMeta[os].label} 推荐</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            推荐顺序来自维护者的实测，先装一个能用的，再折腾分流。
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link to="/clients/categories" />}
          className="gap-2"
        >
          <Layers className="size-3.5" aria-hidden />
          按内核分类对比
          <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {recommended.map((client) => (
          <ClientCard key={client.id} client={client} os={os} />
        ))}
      </div>

      {recommended.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          这个系统暂时没有推荐项，可以到「按内核分类对比」里自己挑。
        </p>
      ) : null}
    </section>
  )
}
