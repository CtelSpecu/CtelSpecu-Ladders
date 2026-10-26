import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { ClientCard } from '@/components/cards/client-card'
import { SlidingTabs } from '@/components/motion/sliding-tabs'
import { Button } from '@/components/ui/button'
import {
  CLIENT_CATEGORY,
  OS,
  categoryMeta,
  getClientsByCategory,
  osMeta,
  type Os,
} from '@/lib/data/clients'

export const Route = createFileRoute('/clients/categories')({
  component: ClientCategoriesPage,
})

const osTabItems = [
  { value: 'all', label: '全部系统' },
  ...OS.map((os) => ({ value: os, label: osMeta[os].label })),
]

function ClientCategoriesPage() {
  const [filter, setFilter] = useState<string>('all')
  const os = (OS as readonly string[]).includes(filter) ? (filter as Os) : undefined

  return (
    <section className="page-shell py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link to="/clients" />}
          className="gap-1.5"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          返回按系统选择
        </Button>
      </div>

      <header className="mt-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          客户端分类
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          按内核分成 Clash / Mihomo 与 V2Ray / Xray 两条线，顶部按系统筛选。
        </p>
      </header>

      <div className="mt-7 flex justify-center">
        <SlidingTabs
          items={osTabItems}
          active={filter}
          layoutId="client-os-indicator"
          ariaLabel="按系统筛选客户端"
          onSelect={setFilter}
          className="overflow-x-auto"
        />
      </div>

      <div className="mt-10 space-y-12">
        {CLIENT_CATEGORY.map((category) => {
          const list = getClientsByCategory(category, os)
          return (
            <section key={category}>
              <div className="border-b border-border pb-3">
                <h2 className="text-lg font-semibold">{categoryMeta[category].label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {categoryMeta[category].description}
                  {filter === 'all' ? '' : ` · 已筛选 ${osMeta[filter as Os].label}`}
                </p>
              </div>

              {list.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      os={os ?? (client.platforms[0] ?? 'windows')}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  该分类下暂不支持这个系统。
                </p>
              )}
            </section>
          )
        })}
      </div>
    </section>
  )
}
