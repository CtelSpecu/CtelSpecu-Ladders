import { useEffect } from 'react'
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'

import { AnnouncementHost } from '@/components/announcements/announcement-host'
import { AppFooter } from '@/components/layout/app-footer'
import { Navbar } from '@/components/layout/navbar'
import { FirstVisitDialog } from '@/components/onboarding/first-visit-dialog'
import { OnboardingProvider } from '@/components/onboarding/onboarding-provider'
import { OnboardingStepper } from '@/components/onboarding/onboarding-stepper'
import { Toaster } from '@/components/ui/sonner'
import { trackPageview } from '@/lib/analytics'
import { ThemeProvider } from '@/lib/theme'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
          <AnalyticsListener />
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <AppFooter />
          <FirstVisitDialog />
          <OnboardingStepper />
          <AnnouncementHost />
          <Toaster position="top-right" duration={5000} closeButton visibleToasts={3} offset={84} />
        </div>
      </OnboardingProvider>
    </ThemeProvider>
  )
}

function AnalyticsListener() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  useEffect(() => {
    trackPageview(pathname)
  }, [pathname])

  return null
}
