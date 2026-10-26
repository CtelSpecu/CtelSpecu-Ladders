import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'ctelspecu:theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

interface ThemeContextValue {
  theme: Theme
  resolved: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // 隐私模式 / 存储被禁用，退回跟随系统
  }
  return 'system'
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.classList.toggle('light', resolved === 'light')
  root.style.colorScheme = resolved
}

function subscribeSystemTheme(onChange: () => void) {
  const media = window.matchMedia(MEDIA_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getSystemDark() {
  return window.matchMedia(MEDIA_QUERY).matches
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const systemDark = useSyncExternalStore(subscribeSystemTheme, getSystemDark, () => false)

  const resolved: ResolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  // 只同步 DOM，不派生 state
  useEffect(() => {
    applyTheme(resolved)
  }, [resolved])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // 持久化失败也要保持内存里的选择
    }
  }, [])

  const toggle = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setTheme])

  const value = useMemo(
    () => ({ theme, resolved, setTheme, toggle }),
    [theme, resolved, setTheme, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

export { STORAGE_KEY as THEME_STORAGE_KEY }
