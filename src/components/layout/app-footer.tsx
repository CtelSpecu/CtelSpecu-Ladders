import { Link } from '@tanstack/react-router'

import { SiteIcon } from '@/components/brand/site-icon'
import { freeTabs, primaryNav } from '@/lib/nav'

const footerLinks = [
  ...primaryNav.filter((item) => item.to !== '/'),
  ...freeTabs,
]

export function AppFooter() {
  return (
    <footer className="mt-16 border-t border-border/70">
      <div className="page-shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <SiteIcon className="size-6" />
          <span className="font-medium text-foreground">星空之镜 · CtelSpecu Ladders</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1" aria-label="页脚">
          {footerLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to as never}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://ctelspecu.hxcn.top"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            技术博客
          </a>
        </nav>

        <p className="shrink-0 text-muted-foreground">
          © {new Date().getFullYear()} CtelSpecu · 仅供参考
        </p>
      </div>
    </footer>
  )
}
