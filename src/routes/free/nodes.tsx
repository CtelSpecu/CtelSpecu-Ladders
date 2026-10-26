import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Globe, Link as LinkIcon, Server, Wifi } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { nodeSections } from '@/lib/data/free'

export const Route = createFileRoute('/free/nodes')({
  component: FreeNodesPage,
})

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  link: LinkIcon,
  server: Server,
  wifi: Wifi,
}

function FreeNodesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {nodeSections.map((section) => {
        const SectionIcon = ICONS[section.icon] ?? Globe
        return (
          <section key={section.title} className="overflow-hidden rounded-2xl border border-border bg-card">
            <header className="border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <SectionIcon className="size-4 text-primary" aria-hidden />
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            </header>

            <ul className="divide-y divide-border">
              {section.links.map((link) => {
                const LinkIconComponent = ICONS[link.icon] ?? LinkIcon
                return (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/60"
                    >
                      <LinkIconComponent className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="min-w-0 flex-1 text-sm font-medium">{link.name}</span>
                      <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    </a>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <p className="rounded-xl border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
        免费节点由第三方维护，稳定性与隐私都无法保证，只适合临时使用。需要长期稳定请走
        「机场推荐」里的付费服务。
      </p>
    </div>
  )
}
