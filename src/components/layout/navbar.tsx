import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, MoreHorizontal } from 'lucide-react'

import { SiteIcon } from '@/components/brand/site-icon'
import { GooeyNav } from '@/components/motion/gooey-nav'
import { ThemeToggle } from '@/components/motion/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { freeTabs, moreNav, primaryNav } from '@/lib/nav'
import { cn } from '@/lib/utils'

const gooeyItems = primaryNav.map((item) => ({ label: item.label, href: item.to }))

export function Navbar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 pb-2 sm:px-5">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex h-14 items-center gap-2 rounded-4xl border border-border bg-background/95 pr-2 pl-2 shadow-[var(--shadow-soft)] backdrop-blur-md">
          <Link
            to="/"
            className="flex size-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            aria-label="星空之镜 · 首页"
          >
            <SiteIcon className="size-8" />
          </Link>

          {/* 导轨由 gooey 项自身拼成：未激活项共用一条 muted 轨道，
              激活项被 gap 推开、用粘液颈连接，不共享轨道底色 */}
          <GooeyNav items={gooeyItems} size="sm" aria-label="主导航" className="hidden md:block" />

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden rounded-full md:inline-flex"
                    aria-label="更多"
                  />
                }
              >
                <MoreHorizontal className="size-4.5" aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                {moreNav.map((item) =>
                  'href' in item ? (
                    <DropdownMenuItem
                      key={item.label}
                      render={<a href={item.href} target="_blank" rel="noopener noreferrer" />}
                      className="flex-col items-start gap-0.5"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <item.icon className="size-4" aria-hidden />
                        {item.label}
                      </span>
                      <span className="pl-6 text-xs font-normal text-muted-foreground">
                        {item.description}
                      </span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      key={item.label}
                      render={<Link to={item.to as never} />}
                      className="flex-col items-start gap-0.5"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <item.icon className="size-4" aria-hidden />
                        {item.label}
                      </span>
                      <span className="pl-6 text-xs font-normal text-muted-foreground">
                        {item.description}
                      </span>
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="打开菜单" />
                }
              >
                <Menu className="size-4.5" aria-hidden />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto p-6">
                <SheetHeader className="p-0">
                  <SheetTitle>导航</SheetTitle>
                </SheetHeader>

                <nav className="mt-6 flex flex-col gap-1" aria-label="移动端导航">
                  {primaryNav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to as never}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        item.to === '/'
                          ? pathname === '/' && 'bg-secondary text-secondary-foreground'
                          : pathname.startsWith(item.to) && 'bg-secondary text-secondary-foreground',
                        !(item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)) &&
                          'hover:bg-muted',
                      )}
                    >
                      <item.icon className="size-4 text-muted-foreground" aria-hidden />
                      {item.label}
                    </Link>
                  ))}

                  <p className="mt-4 px-3 text-xs font-medium text-muted-foreground">免费专区</p>
                  {freeTabs.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to as never}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        pathname === item.to
                          ? 'bg-secondary text-secondary-foreground'
                          : 'hover:bg-muted',
                      )}
                    >
                      <item.icon className="size-4 text-muted-foreground" aria-hidden />
                      {item.label}
                    </Link>
                  ))}

                  <p className="mt-4 px-3 text-xs font-medium text-muted-foreground">更多</p>
                  {moreNav.map((item) =>
                    'href' in item ? (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        <item.icon className="size-4 text-muted-foreground" aria-hidden />
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        key={item.label}
                        to={item.to as never}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        <item.icon className="size-4 text-muted-foreground" aria-hidden />
                        {item.label}
                      </Link>
                    ),
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
