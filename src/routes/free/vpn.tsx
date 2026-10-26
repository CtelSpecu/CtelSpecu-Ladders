import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { StarRating } from '@/components/cards/star-rating'
import { vpnSections } from '@/lib/data/free'

export const Route = createFileRoute('/free/vpn')({
  component: FreeVpnPage,
})

function FreeVpnPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {vpnSections.map((section) => (
        <section key={section.title} className="overflow-hidden rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">{section.title}</h2>
            <span className="text-xs text-muted-foreground">{section.items.length} 个</span>
          </header>

          <ul className="divide-y divide-border">
            {section.items.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/60"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</span>
                  <StarRating value={item.rating} />
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="rounded-xl border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
        免费 VPN 通常以广告或限速换取免费额度，隐私政策请自行核对；涉及敏感场景请优先使用自建或付费方案。
      </p>
    </div>
  )
}
