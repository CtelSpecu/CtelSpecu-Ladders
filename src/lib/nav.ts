import { BookOpen, Download, Gift, House, Layers, Rocket, Server, ShieldCheck, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavLink {
  label: string
  to: string
  icon: LucideIcon
  description: string
}

/** 主导航（全部进入 GooeyNav 导轨）。 */
export const primaryNav: NavLink[] = [
  { label: '主页', to: '/', icon: House, description: '回到落地页' },
  { label: '客户端下载', to: '/clients', icon: Download, description: '按系统推荐客户端' },
  { label: '机场推荐', to: '/recommend', icon: Rocket, description: '精选付费机场' },
  { label: '技术教程', to: '/tutorials', icon: BookOpen, description: '协议、分流与选购' },
  { label: '免费专区', to: '/free', icon: Gift, description: '共享订阅 / 免费订阅 / 免费 VPN' },
]

/** 免费专区页内的三个 Tab。 */
export const freeTabs: NavLink[] = [
  {
    label: '共享订阅',
    to: '/free/subscriptions',
    icon: Layers,
    description: '他人共享、按可用度排序',
  },
  {
    label: '免费订阅',
    to: '/free/nodes',
    icon: Gift,
    description: '每日更新的免费节点',
  },
  {
    label: '免费 VPN',
    to: '/free/vpn',
    icon: ShieldCheck,
    description: '无需配置的免费应用',
  },
]

/** 右侧「更多」下拉：订阅转换、新手引导。 */
export const moreNav: (NavLink | { label: string; href: string; icon: LucideIcon; description: string })[] = [
  {
    label: '订阅转换',
    href: 'https://subcoverter.ctelspecu.hxcn.top',
    icon: Server,
    description: '转换为不同客户端支持的格式',
  },
  {
    label: '新手引导',
    to: '/onboarding',
    icon: Sparkles,
    description: '重新走一遍配置流程',
  },
]

export const blogUrl = 'https://ctelspecu.hxcn.top'
