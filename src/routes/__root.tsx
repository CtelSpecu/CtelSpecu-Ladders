import { useEffect } from 'react'
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'

import { AppFooter } from '@/components/layout/app-footer'
import { Navbar } from '@/components/layout/navbar'
import { FirstVisitDialog } from '@/components/onboarding/first-visit-dialog'
import { OnboardingProvider } from '@/components/onboarding/onboarding-provider'
import { OnboardingStepper } from '@/components/onboarding/onboarding-stepper'
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
