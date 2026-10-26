import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  Download,
  Gift,
  Layers,
  Network,
  Router,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { HeroVisual } from '@/components/illustrations/hero-visual'
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

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Layers,
    title: 'Clash / Mihomo 客户端',
    description: 'Verge Rev、Nyanpasu、FlClash、Clash Party…覆盖 Windows、macOS、Linux、Android 与鸿蒙。',
  },
  {
    icon: Network,
    title: 'V2Ray / Xray 生态',
    description: 'v2rayN、v2rayNG、v2rayA、sing-box、Hiddify，按平台给出下载渠道与安装教程。',
  },
  {
    icon: Rocket,
    title: '机场推荐',
    description: '包月与按流量分开筛选，价格、卖点、节点地区同屏对比，不用再翻十几家官网。',
  },
  {
    icon: Gift,
    title: '免费节点与共享订阅',
    description: '免费订阅每日更新，共享订阅带实时状态；只想先试试的话，这条路够用。',
  },
  {
    icon: BookOpen,
    title: '技术教程',
    description: '协议原理、分流规则、选购与排障，直接同步技术博客，新文章自动出现。',
  },
  {
    icon: Router,
    title: '路由器与鸿蒙',
    description: 'OpenWrt / 梅林插件与鸿蒙原生客户端一并收录，覆盖电脑手机之外的使用场景。',
  },
]

const steps: { title: string; description: string }[] = [
  {
    title: '选一个客户端',
    description: '按系统挑一个能用的，别一上来就折腾分流规则。',
  },
  {
    title: '拿一条订阅',
    description: '想稳定就买机场，想先试就用共享订阅或免费节点。',
  },
  {
    title: '导入并选节点',
    description: '复制链接或直接唤起客户端，测速后选延迟低的那个。',
  },
]

function HomePage() {
  const { restart } = useOnboarding()

  return (
    <div className="page-shell pt-10 pb-14">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            星空之镜 · CtelSpecu Ladders
          </span>

          <h1 className="mt-4 text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-4xl">
            为什么是<span className="text-primary">「一站式」</span>
            科学上网辅助工具
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

        <HeroVisual />
      </section>

      {/* Features */}
      <section className="mt-14">
        <SectionHeader
          eyebrow="Features"
          title="为什么用这里，而不是自己翻论坛"
          description="信息都摊开在同一个界面里：系统、计费、地区、流量与教程，缺哪块补哪块。"
        />

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3 bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16">
        <SectionHeader
          eyebrow="How it works"
          title="三步走完，不绕路"
          description="每一步都对应一个页面，卡住了就回到新手引导。"
        />

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <span className="text-2xl font-semibold tabular-nums text-primary/40">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Bento */}
      <section className="mt-16">
        <SectionHeader
          eyebrow="Explore"
          title="从这里开始"
          description="六个入口覆盖全部内容，按你当下缺的那一块点进去。"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bento.map((entry) => (
            <Link
              key={entry.to}
              to={entry.to as never}
              className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition-colors duration-[var(--duration-fast)] hover:border-primary/45"
            >
              <div className="flex h-28 items-center justify-center rounded-xl bg-muted">
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

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
