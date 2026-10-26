import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { ChoiceIllustration } from '@/components/illustrations/choice-illustration'
import { freeTabs } from '@/lib/nav'

export const Route = createFileRoute('/free/')({
  component: FreeChooser,
})

function FreeChooser() {
  return (
    <div className="mx-auto max-w-4xl">
      <ChoiceIllustration className="mx-auto w-full max-w-2xl" />

      <p className="mt-2 text-center text-sm text-muted-foreground">
        你只是想试试，还是已经清楚自己要什么？选一个最接近的情况。
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {freeTabs.map((item) => (
          <Link
            key={item.to}
            to={item.to as never}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors duration-[var(--duration-fast)] hover:border-primary/45"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <item.icon className="size-5" aria-hidden />
            </span>
            <span className="text-base font-medium">{item.label}</span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </span>
            <span className="mt-auto flex items-center gap-1 text-xs font-medium text-primary">
              查看
              <ArrowRight
                className="size-3.5 transition-transform duration-[var(--duration-standard)] group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
