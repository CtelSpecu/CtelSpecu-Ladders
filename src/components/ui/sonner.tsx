import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { useTheme } from '@/lib/theme'

/**
 * shadcn / ReUI 的 Sonner 封装：把 sonner 自带配色换成本站令牌，
 * 深浅色跟随 ThemeProvider 解析后的结果。
 */
function Toaster(props: ToasterProps) {
  const { resolved } = useTheme()

  return (
    <Sonner
      theme={resolved}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius-lg, 14px)',
          zIndex: 100,
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
