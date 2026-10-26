import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

import { SlidingTabs } from '@/components/motion/sliding-tabs'
import { freeTabs } from '@/lib/nav'

export const Route = createFileRoute('/free')({
  component: FreeLayout,
})

function FreeLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <section className="page-shell py-12">
      <header className="text-center">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Free Zone
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          免费专区
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          三种免费资源，先看它们分别适合谁，再选一个开始。
        </p>
      </header>

      <div className="mt-7 flex justify-center">
        <SlidingTabs
          items={freeTabs}
          active={pathname}
          layoutId="free-tab-indicator"
          ariaLabel="免费专区视图"
          className="max-w-full overflow-x-auto"
        />
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </section>
  )
}
