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

import { EntryArt } from '@/components/illustrations/entry-art'
import type { EntryArtVariant } from '@/components/illustrations/entry-art'
import { HeroVisual } from '@/components/illustrations/hero-visual'
import { RotatingText } from '@/components/motion/rotating-text'
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
  art: EntryArtVariant
  meta: string
  hint: string
}

const bento: BentoEntry[] = [
  {
    title: '客户端下载',
    art: 'clients',
    to: '/clients',
    icon: Download,
    meta: `${clients.length} 个客户端 · 按系统推荐`,
    hint: '选系统，装一个能用的',
  },
  {
    title: '机场推荐',
    art: 'recommend',
    to: '/recommend',
    icon: Rocket,
    meta: `${providers.length} 家精选 · 包月 / 按流量`,
    hint: '看价格、特性与地区',
  },
  {
    title: '技术教程',
    art: 'tutorials',
    to: '/tutorials',
    icon: BookOpen,
    meta: `${localTutorials.length} 篇 · 协议与实操`,
    hint: '从原理到排障',
  },
  {
    title: '共享订阅',
    art: 'subscriptions',
    to: '/free/subscriptions',
    icon: Layers,
    meta: '他人共享 · 实时流量',
    hint: '不花钱先试',
  },
  {
    title: '免费订阅',
    art: 'free',
    to: '/free/nodes',
    icon: Gift,
    meta: `${nodeSections.length} 组来源 · 每日更新`,
    hint: '临时应急用',
  },
  {
    title: '免费 VPN',
    art: 'vpn',
    to: '/free/vpn',
    icon: ShieldCheck,
    meta: `${vpnSections.reduce((sum, section) => sum + section.items.length, 0)} 个应用 · 无需配置`,
    hint: '装上就能用',
  },
]

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Layers,
    title: '客户端怎么装',
    description: '选好系统就给答案，不用在十几个名字里猜；每个客户端都标了适合谁、去哪儿下载。',
  },
  {
    icon: Network,
    title: 'Clash 和 V2Ray 差在哪',
    description: '两个生态各用一页讲清楚：分别是什么、什么时候该选哪个，而不是只丢一串软件名。',
  },
  {
    icon: Rocket,
    title: '机场怎么挑',
    description: '价格、流量、支持地区和真实卖点摆在同一屏，按预算和用途比，不用挨个翻官网。',
  },
  {
    icon: Gift,
    title: '想先免费试试',
    description: '每天更新的免费节点，加上他人共享的订阅；能用就先不花钱，不稳也不耽误继续挑。',
  },
  {
    icon: BookOpen,
    title: '连不上怎么办',
    description: '导入、测速、分流、排障都有步骤可循，技术博客更新会自动同步进来。',
  },
  {
    icon: Router,
    title: '想让全家都能用',
    description: '路由器插件和鸿蒙客户端单独整理，手机、电脑之外的设备也能一起覆盖。',
  },
]

/** hero 标题里轮播的目标人群，3 秒一换。 */
const audiences = [
  '科研人员',
  '跨境贸易',
  '编程开发',
  '海外学习',
  '内容创作者',
  '远程办公',
  '跨境游戏',
] as const

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

          <h1 className="mt-4 text-3xl leading-[1.15] font-semibold tracking-tight sm:text-4xl">
            <span className="block">
              为
              <span className="text-primary">
                <RotatingText items={audiences} />
              </span>
            </span>
            <span className="block">提供「一站式」</span>
            <span className="block">科学上网辅助工具</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            从零开始帮你挑客户端，再按需求在性价比、高速、稳定之间选机场；解锁海外 AI 工具、视频网站、学术数据库、海外游戏与跨境办公，常见的坑也先替你标出来。
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
          description="不用先搞懂术语。装哪个、买哪家、连不上怎么办，这里都有一页直接回答。"
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
              <span className="text-2xl font-semibold tabular-nums text-primary/70 dark:text-primary">
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
              <EntryArt variant={entry.art} icon={entry.icon} />
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
