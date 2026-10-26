import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type OnboardingMode = 'newbie' | 'veteran'
export type OnboardingBranch = 'paid' | 'free'

const STORAGE_KEY = 'ctelspecu:onboarding'
const TOTAL_STEPS = 5

interface OnboardingState {
  mode: OnboardingMode | null
  step: number
  branch: OnboardingBranch | null
  doneAt: string | null
  minimized: boolean
}

const INITIAL: OnboardingState = {
  mode: null,
  step: 0,
  branch: null,
  doneAt: null,
  minimized: false,
}

interface OnboardingContextValue extends OnboardingState {
  totalSteps: number
  dialogOpen: boolean
  stepperVisible: boolean
  choose: (mode: OnboardingMode) => void
  next: () => void
  back: () => void
  goTo: (step: number) => void
  setBranch: (branch: OnboardingBranch) => void
  toggleMinimized: () => void
  complete: () => void
  restart: () => void
  dismissDialog: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

function readState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL
    const parsed = JSON.parse(raw) as Partial<OnboardingState>
    const mode =
      parsed.mode === 'newbie' || parsed.mode === 'veteran' ? parsed.mode : null
    const branch = parsed.branch === 'paid' || parsed.branch === 'free' ? parsed.branch : null
    const step = typeof parsed.step === 'number' ? Math.min(Math.max(parsed.step, 0), TOTAL_STEPS - 1) : 0

    return {
      mode,
      step,
      branch,
      doneAt: typeof parsed.doneAt === 'string' ? parsed.doneAt : null,
      minimized: Boolean(parsed.minimized),
    }
  } catch {
    return INITIAL
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  // SPA 里 localStorage 可同步读取，直接作为初始值，避免 effect 里 setState
  const [state, setState] = useState<OnboardingState>(readState)
  const [dialogOpen, setDialogOpen] = useState<boolean>(() => readState().mode === null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // 忽略隐私模式下的存储失败
    }
  }, [state])

  const choose = useCallback((mode: OnboardingMode) => {
    setState((prev) => ({
      ...prev,
      mode,
      step: 0,
      branch: null,
      doneAt: null,
      minimized: false,
    }))
    setDialogOpen(false)
  }, [])

  const next = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, TOTAL_STEPS - 1) }))
  }, [])

  const back = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }))
  }, [])

  const goTo = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step: Math.min(Math.max(step, 0), TOTAL_STEPS - 1) }))
  }, [])

  const setBranch = useCallback((branch: OnboardingBranch) => {
    setState((prev) => ({ ...prev, branch, step: 3 }))
  }, [])

  const toggleMinimized = useCallback(() => {
    setState((prev) => ({ ...prev, minimized: !prev.minimized }))
  }, [])

  const complete = useCallback(() => {
    setState((prev) => ({ ...prev, doneAt: new Date().toISOString(), minimized: false }))
  }, [])

  const restart = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mode: 'newbie',
      step: 0,
      branch: null,
      doneAt: null,
      minimized: false,
    }))
  }, [])

  const dismissDialog = useCallback(() => {
    setDialogOpen(false)
    // 直接关掉弹窗视为老手，避免下次再来打扰
    setState((prev) => (prev.mode ? prev : { ...prev, mode: 'veteran' }))
  }, [])

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      totalSteps: TOTAL_STEPS,
      dialogOpen,
      stepperVisible: state.mode === 'newbie' && !state.doneAt,
      choose,
      next,
      back,
      goTo,
      setBranch,
      toggleMinimized,
      complete,
      restart,
      dismissDialog,
    }),
    [state, dialogOpen, choose, next, back, goTo, setBranch, toggleMinimized, complete, restart, dismissDialog],
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider')
  return context
}

export const ONBOARDING_STORAGE_KEY = STORAGE_KEY
