import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  Download,
  Gift,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { WelcomeIllustration } from '@/components/illustrations/welcome-illustration'
import { useOnboarding } from '@/components/onboarding/onboarding-provider'
import { Button } from '@/components/ui/button'
import { clients } from '@/lib/data/clients'
import { nodeSections, vpnSections } from '@/lib/data/free'
import { providers } from '@/lib/data/providers'
import { localTutorials } from '@/lib/tutorials'

export const Route = createFileRoute('/')({
  component: HomePage,
})

interface BentoEntry {
  title: string
  to: string
  icon: LucideIcon
  meta: string
  hint: string
}

const bento: BentoEntry[] = [
  {
    title: '客户端下载',
    to: '/clients',
    icon: Download,
    meta: `${clients.length} 个客户端 · 按系统推荐`,
    hint: '选系统，装一个能用的',
  },
  {
    title: '机场推荐',
    to: '/recommend',
    icon: Rocket,
    meta: `${providers.length} 家精选 · 包月 / 按流量`,
    hint: '看价格、特性与地区',
  },
  {
    title: '技术教程',
    to: '/tutorials',
    icon: BookOpen,
    meta: `${localTutorials.length} 篇 · 协议与实操`,
    hint: '从原理到排障',
  },
  {
    title: '共享订阅',
    to: '/free/subscriptions',
    icon: Layers,
    meta: '他人共享 · 实时流量',
    hint: '不花钱先试',
  },
  {
    title: '免费订阅',
    to: '/free/nodes',
    icon: Gift,
    meta: `${nodeSections.length} 组来源 · 每日更新`,
    hint: '临时应急用',
  },
  {
    title: '免费 VPN',
    to: '/free/vpn',
    icon: ShieldCheck,
    meta: `${vpnSections.reduce((sum, section) => sum + section.items.length, 0)} 个应用 · 无需配置`,
    hint: '装上就能用',
  },
]

function HomePage() {
  const { restart } = useOnboarding()

  return (
    <div className="page-shell py-14">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            星空之镜 · 网络自由导航
          </span>

          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            从下载到能用，
            <span className="text-primary">五分钟</span>就够
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            按你的系统推荐客户端，再给一条能用的订阅。买不买、用不用免费，你说了算。
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={restart} className="gap-2">
              <Sparkles className="size-4" aria-hidden />
              开始新手引导
            </Button>
            <Link
              to="/clients"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              我熟悉流程，直接看客户端
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>

        <WelcomeIllustration className="w-full rounded-2xl" />
      </section>

      {/* Spotlight */}
      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        <SpotlightCard label="客户端" value={clients.length} suffix="个" hint="覆盖 5 个平台" />
        <SpotlightCard label="精选机场" value={providers.length} suffix="家" hint="包月与按流量分开展示" />
        <SpotlightCard label="中文教程" value={localTutorials.length} suffix="篇" hint="协议、分流、选购与排障" />
      </section>

      {/* Bento */}
      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">从这里开始</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              六个入口覆盖全部内容，按你当下缺的那一块点进去。
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bento.map((entry) => (
            <Link
              key={entry.to}
              to={entry.to as never}
              className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition-all duration-[var(--duration-standard)] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex h-28 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-muted/70">
                <entry.icon className="size-9 text-primary" aria-hidden />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{entry.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{entry.meta}</p>
              <p className="mt-auto flex items-center gap-1 pt-4 text-[11px] text-muted-foreground">
                {entry.hint}
                <ArrowRight
                  className="size-3 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
                  aria-hidden
                />
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function SpotlightCard({
  label,
  value,
  suffix,
  hint,
}: {
  label: string
  value: number
  suffix: string
  hint: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
        <span className="text-sm text-muted-foreground">{suffix}</span>
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
