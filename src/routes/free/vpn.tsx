import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, TriangleAlert } from 'lucide-react'

import { StarRating } from '@/components/cards/star-rating'
import { toast } from 'sonner'
import { vpnSections } from '@/lib/data/free'

export const Route = createFileRoute('/free/vpn')({
  component: FreeVpnPage,
})

function logoUrl(file: string) {
  return `${import.meta.env.BASE_URL}logos/vpn/${file}`
}

function FreeVpnPage() {
  useEffect(() => {
    toast.warning('免费 VPN 有取舍', {
      id: 'free-vpn-note',
      description:
        '通常以广告或限速换取免费额度，隐私政策请自行核对；涉及敏感场景请优先使用自建或付费方案。',
      icon: <TriangleAlert className="size-4 text-warning" />,
    })
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {vpnSections.map((section) => (
        <section key={section.title}>
          <header className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-semibold">{section.title}</h2>
            <span className="text-xs text-muted-foreground">{section.items.length} 个</span>
          </header>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {section.items.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-border bg-card p-2.5 transition-colors duration-[var(--duration-fast)] hover:border-primary/45"
              >
                <div className="flex aspect-4/3 items-center justify-center rounded-lg bg-muted">
                  {item.logo ? (
                    <img
                      src={logoUrl(item.logo)}
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="size-11 rounded-lg object-contain"
                    />
                  ) : (
                    <ShieldCheck className="size-10 text-muted-foreground" aria-hidden />
                  )}
                </div>

                <h3 className="mt-2.5 truncate text-xs font-semibold">{item.name}</h3>
                <StarRating value={item.rating} className="mt-1" />

                <span className="mt-auto flex items-center gap-1 pt-2 text-[11px] font-medium text-primary">
                  访问官网
                  <span
                    aria-hidden
                    className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}

    </div>
  )
}
