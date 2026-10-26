import { useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Check,
  Download,
  Minus,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Square,
} from 'lucide-react'

import { useOnboarding } from '@/components/onboarding/onboarding-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { detectOs, getRecommendedClients, osMeta } from '@/lib/data/clients'
import { motionTokens } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

const GUIDE_BUY = 'https://ctelspecu.hxcn.top/post/proxy-subscription-guide'
const GUIDE_IMPORT = 'https://ctelspecu.hxcn.top/post/proxy-subscription-import'

const STEP_TITLES = ['开始之前', '准备客户端', '订阅从哪来', '获取订阅', '导入与选节点']

export function OnboardingStepper() {
  const {
    stepperVisible,
    step,
    totalSteps,
    minimized,
    branch,
    goTo,
    next,
    back,
    toggleMinimized,
    complete,
    setBranch,
  } = useOnboarding()
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const os = useMemo(() => detectOs(), [])
  const recommended = useMemo(() => getRecommendedClients(os, 2), [os])

  if (!stepperVisible) return null

  if (minimized) {
    return (
      <div className="fixed inset-x-3 top-[4.5rem] z-40 flex justify-end md:inset-x-auto md:top-auto md:right-5 md:bottom-5">
        <button
          type="button"
          onClick={toggleMinimized}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium shadow-[var(--shadow-lift)] transition-colors hover:bg-muted"
        >
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          新手引导 · {step + 1}/{totalSteps}
          <Square className="size-3" aria-hidden />
        </button>
      </div>
    )
  }

  const isLast = step === totalSteps - 1
  const needsBranch = step === 2

  return (
    <motion.aside
      layout
      initial={false}
      transition={reduced ? { duration: 0 } : motionTokens.spring.smooth}
      aria-label="新手引导"
      className="fixed inset-x-3 top-[4.5rem] z-40 rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)] md:inset-x-auto md:top-auto md:right-5 md:bottom-5 md:w-[380px]"
    >
      {/* 头部：步骤格 + 最小化 */}
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5">
        {Array.from({ length: totalSteps }, (_, index) => {
          const done = index < step
          const active = index === step
          return (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              disabled={index > step}
              aria-label={`第 ${index + 1} 步：${STEP_TITLES[index]}`}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex h-1.5 flex-1 items-center justify-center rounded-full transition-all duration-300',
                active
                  ? 'bg-primary'
                  : done
                    ? 'bg-primary/45 hover:bg-primary/70'
                    : 'bg-muted',
              )}
            >
              {done ? <Check className="size-2.5 text-primary-foreground" aria-hidden /> : null}
            </button>
          )
        })}

        <div className="ml-1 flex items-center gap-1">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {step + 1}/{totalSteps}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="md:hidden"
            onClick={() => setMobileExpanded((value) => !value)}
            aria-label={mobileExpanded ? '收起引导内容' : '展开引导内容'}
            aria-expanded={mobileExpanded}
          >
            <ChevronDown
              className={cn('size-3.5 transition-transform', mobileExpanded && 'rotate-180')}
              aria-hidden
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggleMinimized}
            aria-label="最小化新手引导"
          >
            <Minus className="size-3" aria-hidden />
          </Button>
        </div>
      </div>

      {/* 内容 */}
      <div
        className={cn(
          'max-h-[52vh] overflow-y-auto px-4 py-4 md:block md:max-h-[62vh]',
          mobileExpanded ? 'block' : 'hidden',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -18 }}
            transition={{ duration: motionTokens.duration.standard, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              第 {step + 1} 步
            </p>
            <h2 className="mt-1 text-base font-semibold tracking-tight">{STEP_TITLES[step]}</h2>

            {step === 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  先下载一个适合你系统的客户端，别急着找节点。
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  拿到订阅链接后导入客户端，订阅就是「节点清单」。
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  选延迟低的节点，规则交给客户端自动分流。
                </li>
              </ul>
            ) : null}

            {step === 1 ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-muted-foreground">
                  检测到你的系统是 {osMeta[os].label}，优先用这两个：
                </p>
                {recommended.map((client, index) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-2 rounded-xl border border-border px-3 py-2"
                  >
                    <Download className="size-4 shrink-0 text-primary" aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {client.name}
                    </span>
                    <Badge variant={index === 0 ? 'secondary' : 'outline'}>
                      {index === 0 ? '主推' : '备选'}
                    </Badge>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    void navigate({ to: '/clients', search: { os } })
                  }}
                >
                  前往客户端下载
                  <ArrowRight className="size-3.5" aria-hidden />
                </Button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-muted-foreground">你打算自己购买订阅吗？</p>
                <Button
                  variant={branch === 'paid' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setBranch('paid')}
                >
                  <ShoppingCart className="size-4" aria-hidden />
                  是，我想买一个稳定的
                </Button>
                <Button
                  variant={branch === 'free' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setBranch('free')}
                >
                  <ShieldAlert className="size-4" aria-hidden />
                  否，先用免费的试试
                </Button>
              </div>
            ) : null}

            {step === 3 && branch === 'paid' ? (
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>按你的使用频率选一种计费方式，直接跳到对应的机场列表：</p>
                <button
                  type="button"
                  onClick={() => {
                    next()
                    void navigate({ to: '/recommend', search: { billing: 'monthly' } })
                  }}
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-left transition-colors hover:border-primary/45"
                >
                  <span className="block text-sm font-medium text-foreground">按月付费</span>
                  <span className="mt-0.5 block text-xs">适合经常使用、流量需求大</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    next()
                    void navigate({ to: '/recommend', search: { billing: 'traffic' } })
                  }}
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-left transition-colors hover:border-primary/45"
                >
                  <span className="block text-sm font-medium text-foreground">按流量付费</span>
                  <span className="mt-0.5 block text-xs">适合偶尔使用，用多少算多少</span>
                </button>
                <a
                  href={GUIDE_BUY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 font-medium text-foreground transition-colors hover:border-primary/45"
                >
                  <BookOpen className="size-4 text-primary" aria-hidden />
                  阅读《订阅机制与选购指南》
                </a>
              </div>
            ) : null}

            {step === 3 && branch === 'free' ? (
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <p>免费路线有两个选择，按你的容忍度挑：</p>
                <Link
                  to="/free/subscriptions"
                  className="block rounded-xl border border-border px-3 py-2 transition-colors hover:bg-muted"
                >
                  <span className="text-sm font-medium text-foreground">共享订阅</span>
                  <span className="mt-0.5 block text-xs">别人共享的可用订阅，按推荐度排序</span>
                </Link>
                <Link
                  to="/free/nodes"
                  className="block rounded-xl border border-border px-3 py-2 transition-colors hover:bg-muted"
                >
                  <span className="text-sm font-medium text-foreground">免费订阅</span>
                  <span className="mt-0.5 block text-xs">每日更新的公开节点，稳定性差</span>
                </Link>
                <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
                  免费资源存在限速、掉线与隐私风险，别用来登录重要账号。
                </p>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-muted-foreground">最后两步，照着做就行：</p>
                <a
                  href={GUIDE_IMPORT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 rounded-xl border border-border px-3 py-2.5 transition-colors hover:bg-muted"
                >
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      如何导入订阅和选择节点
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      导入、测速、格式转换的完整操作
                    </span>
                  </span>
                </a>
                <a
                  href={GUIDE_BUY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 rounded-xl border border-border px-3 py-2.5 transition-colors hover:bg-muted"
                >
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      订阅机制与选购指南
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      看懂流量、倍率与 IP 纯净度
                    </span>
                  </span>
                </a>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部操作 */}
      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
        <Button variant="ghost" size="sm" onClick={back} disabled={step === 0} className="gap-1.5">
          <ArrowLeft className="size-3.5" aria-hidden />
          上一步
        </Button>

        {needsBranch ? (
          <span className="text-xs text-muted-foreground">请先选择上面的选项</span>
        ) : isLast ? (
          <Button size="sm" onClick={complete} className="gap-1.5">
            完成
            <Check className="size-3.5" aria-hidden />
          </Button>
        ) : (
          <Button size="sm" onClick={next} className="gap-1.5">
            下一步
            <ArrowRight className="size-3.5" aria-hidden />
          </Button>
        )}
      </div>
    </motion.aside>
  )
}
