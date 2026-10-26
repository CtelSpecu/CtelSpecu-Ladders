import { motion, useReducedMotion } from 'motion/react'

import { OsIcon } from '@/components/brand/os-icon'
import { OS, osMeta, type Os } from '@/lib/data/clients'
import { cn } from '@/lib/utils'

/**
 * 系统选择器：复刻 ArcUI ExpandingButtonGroup 的交互，
 * 但只由点击驱动——只有当前选中的系统展开标签，hover 不改变展开状态。
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
      className={cn(
        'inline-flex max-w-full flex-wrap items-center justify-center gap-0.5 rounded-full border border-border bg-surface p-1',
        className,
      )}
    >
      {OS.map((os) => {
        const active = os === value

        return (
          <motion.button
            key={os}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={osMeta[os].label}
            onClick={() => onChange(os)}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className={cn(
              'inline-flex h-9 shrink-0 items-center rounded-full px-2.5 text-sm font-medium transition-colors duration-[var(--duration-fast)]',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <OsIcon os={os} className="size-4" />
            <span
              aria-hidden
              className="grid transition-[grid-template-columns,opacity] duration-[var(--duration-standard)] ease-[var(--ease-standard)]"
              style={{
                gridTemplateColumns: active ? '1fr' : '0fr',
                opacity: active ? 1 : 0,
              }}
            >
              <span className="min-w-0 overflow-hidden pl-2 whitespace-nowrap">{osMeta[os].label}</span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
