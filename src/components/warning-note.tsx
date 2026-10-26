import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * 页面底部的风险提示块：统一用 warning 语义色，深浅色都过 AA。
 */
export function WarningNote({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="note"
      className={cn(
        'flex gap-3 rounded-xl border border-warning/35 bg-warning/10 p-4 text-sm leading-relaxed text-warning',
        className,
      )}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="min-w-0">{children}</p>
    </div>
  )
}
