import { useCallback, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

/**
 * circle-blur 主题切换（复刻 beUI /theme-toggle 的 `circle-blur` 变体）。
 * 用 View Transitions 让新主题从按钮位置以圆形揭开，边缘带轻微模糊；
 * 不支持该 API 或用户要求减少动效时退化为瞬时切换。
 */
const VT_STYLE_ID = 'ctelspecu-theme-vt'

const VT_CSS = `
html[data-theme-vt="circle-blur"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-theme-vt="circle-blur"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: ctelspecu-circle-blur 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes ctelspecu-circle-blur {
  from {
    clip-path: circle(0% at var(--theme-vt-origin, 50% 50%));
    filter: blur(8px);
  }
  to {
    clip-path: circle(150% at var(--theme-vt-origin, 50% 50%));
    filter: blur(0px);
  }
}
@media (prefers-reduced-motion: reduce) {
  html[data-theme-vt="circle-blur"]::view-transition-new(root) {
    animation: none;
  }
}
`

function ensureTransitionStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(VT_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = VT_STYLE_ID
  style.textContent = VT_CSS
  document.head.appendChild(style)
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    ensureTransitionStyles()
  }, [])

  const onToggle = useCallback(() => {
    const root = document.documentElement
    const button = buttonRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canTransition = typeof document.startViewTransition === 'function' && !reduced && button

    if (!canTransition) {
      toggle()
      return
    }

    const rect = button.getBoundingClientRect()
    const originX = rect.left + rect.width / 2
    const originY = rect.top + rect.height / 2

    root.style.setProperty('--theme-vt-origin', `${originX}px ${originY}px`)
    root.dataset.themeVt = 'circle-blur'

    const transition = document.startViewTransition(() => {
      flushSync(() => toggle())
    })

    void transition.finished.finally(() => {
      delete root.dataset.themeVt
      root.style.removeProperty('--theme-vt-origin')
    })
  }, [toggle])

  const isDark = resolved === 'dark'

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
      className={cn('relative size-9 rounded-full', className)}
    >
      <Sun
        aria-hidden
        className={cn(
          'absolute size-4.5 transition-all duration-[var(--duration-standard)]',
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          'absolute size-4.5 transition-all duration-[var(--duration-standard)]',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0',
        )}
      />
    </Button>
  )
}
