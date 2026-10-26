/**
 * 全站动效令牌（ArcUI tokens，已在 spec.md §2.3 备案）。
 * CSS 侧的对应变量定义在 src/index.css 的 @theme 中。
 */
export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.16,
    exit: 0.18,
    standard: 0.24,
    considered: 0.48,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1],
    exit: [0.7, 0, 0.84, 0],
    standard: [0.22, 1, 0.36, 1],
    inOut: [0.65, 0, 0.35, 1],
  },
  spring: {
    responsive: { type: 'spring', stiffness: 520, damping: 44 },
    gentle: { type: 'spring', stiffness: 340, damping: 34 },
    snappy: { type: 'spring', visualDuration: 0.26, bounce: 0 },
    smooth: { type: 'spring', visualDuration: 0.4, bounce: 0 },
    morph: { type: 'spring', visualDuration: 0.42, bounce: 0 },
  },
  stagger: { char: 0.016, word: 0.04, line: 0.08, item: 0.035 },
  blur: { subtle: 2, soft: 4, text: 8 },
} as const

/** GooeyNav 的粘液颈 spring（RareUI 原值）。 */
export const GOOEY_SPRING = { type: 'spring', stiffness: 200, damping: 28, mass: 1 } as const

/** ReactBits Stepper 的手感曲线。 */
export const STEPPER_SPRING =
  'linear(0, 0.0603, 0.2033, 0.3821, 0.5633, 0.7258, 0.8584, 0.9574, 1.0242, 1.0634, 1.0809, 1.0828, 1.0747, 1.0613, 1.046, 1.0313, 1.0186, 1.0085, 1.0012, 0.9965, 0.994, 0.9931, 0.9933, 0.9941, 0.9953, 0.9966, 0.9978, 0.9988, 1)'
export const STEPPER_SETTLE = 'cubic-bezier(0.22, 1, 0.36, 1)'
