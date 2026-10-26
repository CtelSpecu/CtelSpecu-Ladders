import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

import { motionTokens } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

export interface SlidingTabItem {
  label: string
  /** 路由型 Tab：点击后导航 */
  to?: string
  /** 状态型 Tab：点击后回调 */
  value?: string
  icon?: LucideIcon
}

/**
 * 复刻 ArcUI Tabs 的滑动指示条：所有 Tab 共用一个 layout 指示器，
 * 切换时指示器在轨道内平移而非跳变。
 * 同时支持「路由型」（to）与「状态型」（value）两种 Tab。
 */
export function SlidingTabs({
  items,
  active,
  layoutId,
  ariaLabel,
  onSelect,
  className,
}: {
  items: SlidingTabItem[]
  active: string
  layoutId: string
  ariaLabel: string
  onSelect?: (value: string) => void
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex max-w-full items-center rounded-full bg-muted p-1', className)}
    >
      {items.map((item) => {
        const key = item.to ?? item.value ?? item.label
        const isActive = active === key
        const inner = (
          <>
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-background shadow-sm"
                transition={reduced ? { duration: 0 } : motionTokens.spring.smooth}
              />
            )}
            <span className="relative flex items-center gap-2">
              {item.icon ? <item.icon className="size-4" aria-hidden /> : null}
              {item.label}
            </span>
          </>
        )

        const classes = cn(
          'relative inline-flex h-9 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors',
          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        )

        return item.to ? (
          <Link
            key={key}
            to={item.to as never}
            role="tab"
            aria-selected={isActive}
            className={classes}
          >
            {inner}
          </Link>
        ) : (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect?.(key)}
            className={classes}
          >
            {inner}
          </button>
        )
      })}
    </div>
  )
}
