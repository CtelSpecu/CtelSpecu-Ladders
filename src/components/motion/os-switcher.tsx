import { Apple, Monitor, Smartphone, Terminal } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

import { OS, osMeta, type Os } from '@/lib/data/clients'
import { cn } from '@/lib/utils'

const OS_ICONS: Record<Os, LucideIcon> = {
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
  ios: Smartphone,
  android: Smartphone,
}

/**
 * 系统选择按钮（ArcUI Button 的按压手感）：
 * 选中态填充 primary，未选中为描边；点击时轻微回弹。
 */
export function OsSwitcher({
  value,
  onChange,
  className,
}: {
  value: Os
  onChange: (os: Os) => void
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <div
      role="radiogroup"
      aria-label="选择你的操作系统"
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {OS.map((os) => {
        const Icon = OS_ICONS[os]
        const active = os === value
        return (
          <motion.button
            key={os}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(os)}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-4xl border px-4 text-sm font-medium transition-colors duration-[var(--duration-fast)]',
              active
                ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden />
            {osMeta[os].label}
          </motion.button>
        )
      })}
    </div>
  )
}
