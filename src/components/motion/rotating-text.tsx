import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { motionTokens } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

/**
 * 轮播文字：所有词叠在同一个网格单元里，容器宽度取最宽的那个，
 * 切换时只做淡入淡出，不会让周围排版跳动。
 * 非当前项对读屏隐藏，避免一次念出全部候选。
 */
export function RotatingText({
  items,
  interval = 3000,
  className,
}: {
  items: readonly string[]
  interval?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (items.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length)
    }, interval)
    return () => window.clearInterval(timer)
  }, [items.length, interval])

  return (
    <span className={cn('relative inline-grid align-baseline', className)}>
      {items.map((item, position) => {
        const active = position === index
        return (
          <motion.span
            key={item}
            aria-hidden={!active}
            className="col-start-1 row-start-1 whitespace-nowrap"
            initial={false}
            animate={{
              opacity: active ? 1 : 0,
              y: active || reduced ? 0 : 8,
            }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: motionTokens.duration.standard, ease: [0.16, 1, 0.3, 1] }
            }
          >
            {item}
          </motion.span>
        )
      })}
    </span>
  )
}
