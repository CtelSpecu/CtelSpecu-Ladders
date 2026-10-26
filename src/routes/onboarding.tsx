import { createFileRoute } from '@tanstack/react-router'
import { Check, Play } from 'lucide-react'

import { useOnboarding } from '@/components/onboarding/onboarding-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

const STEPS = [
  { title: '开始之前', description: '用一分钟弄清客户端、订阅、节点三者的关系。' },
  { title: '准备客户端', description: '按你的系统推荐一个主推与一个备选。' },
  { title: '订阅从哪来', description: '决定自己购买还是先用免费资源。' },
  { title: '获取订阅', description: '买到就去看机场推荐，免费就去共享订阅或免费节点。' },
  { title: '导入与选节点', description: '导入订阅、测速、选出可用节点。' },
]

function OnboardingPage() {
  const { restart, step, mode, doneAt, stepperVisible, minimized } = useOnboarding()

  return (
    <section className="page-shell max-w-3xl py-14">
      <header>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Getting started
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          新手引导
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          五步走完，从「什么都没装」到「节点能用」。引导会跟着页面走，不会挡住正文。
        </p>
      </header>

      <ol className="mt-8 space-y-3">
        {STEPS.map((item, index) => {
          const active = stepperVisible && index === step
          const done = mode === 'newbie' && (index < step || Boolean(doneAt))
          return (
            <li
              key={item.title}
              className={cn(
                'flex gap-3 rounded-2xl border p-4 transition-colors',
                active ? 'border-primary/40 bg-primary/5' : 'border-border bg-card',
              )}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  done
                    ? 'bg-primary text-primary-foreground'
                    : active
                      ? 'border border-primary text-primary'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button onClick={restart} className="gap-1.5">
          <Play className="size-4" aria-hidden />
          {mode === 'newbie' && !doneAt ? '从第一步重新开始' : '开始新手引导'}
        </Button>
        {stepperVisible ? (
          <span className="text-xs text-muted-foreground">
            {minimized ? '引导已最小化，点右下角胶囊展开' : '引导已展开，跟随页面右下角'}
          </span>
        ) : null}
        {doneAt ? (
          <span className="text-xs text-muted-foreground">上次完成于 {doneAt.slice(0, 10)}</span>
        ) : null}
      </div>
    </section>
  )
}
