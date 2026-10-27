import { z } from 'zod'

import rawProviders from '@/data/providers.json'

export const BILLING = ['monthly', 'traffic', 'yearly', 'quarterly'] as const
export type BillingType = (typeof BILLING)[number]

export const billingLabel: Record<BillingType, string> = {
  monthly: '包月',
  traffic: '按流量',
  yearly: '年付',
  quarterly: '季付',
}

export const billingDescription: Record<BillingType, string> = {
  monthly: '固定周期扣费，适合长期稳定使用',
  traffic: '按实际用量计费，适合用量不固定的场景',
  yearly: '一次性付一年，折合到月通常更便宜',
  quarterly: '按季付款，折合到月低于包月',
}

const providerSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  url: z.url(),
  billing: z.array(
    z.object({
      type: z.enum(BILLING),
      label: z.string(),
      price: z.number(),
      traffic: z.string(),
    }),
  ),
  features: z.array(z.object({ icon: z.string(), title: z.string(), badge: z.string() })),
  badges: z.array(z.string()),
  regions: z.array(z.string()),
  /** public/logos/providers 下的图标文件名；缺失时卡片用首字母占位 */
  logo: z.string().nullish(),
  /** 卡片顶部的一句话介绍，可省略 */
  summary: z.string().nullish(),
})

export type Provider = z.infer<typeof providerSchema>
export type ProviderBilling = Provider['billing'][number]

/**
 * 地区展示规则：不包含台湾（业务要求）。
 * 在解析层过滤，保证后续更新数据也不会把 tw 带回来。
 */
const EXCLUDED_REGIONS = new Set(['tw'])

/**
 * 地区展示顺序：常用地区优先，其余保持数据里的原始顺序（sort 稳定）。
 */
const REGION_PRIORITY = ['hk', 'jp', 'sg', 'us', 'gb', 'my']

function priorityIndex(iso: string) {
  const index = REGION_PRIORITY.indexOf(iso)
  return index === -1 ? REGION_PRIORITY.length : index
}

export const providers: Provider[] = z.array(providerSchema)
  .parse(rawProviders)
  .map((provider) => ({
    ...provider,
    regions: provider.regions
      .filter((iso) => !EXCLUDED_REGIONS.has(iso.toLowerCase()))
      .sort((a, b) => priorityIndex(a) - priorityIndex(b)),
  }))

export function lowestBilling(provider: Provider, type: BillingType): ProviderBilling | null {
  const matches = provider.billing.filter((item) => item.type === type)
  if (matches.length === 0) return null
  return matches.reduce((lowest, item) => (item.price < lowest.price ? item : lowest))
}

export interface ProviderForBilling extends Provider {
  price: ProviderBilling
}

/**
 * 各计费方式下的展示顺序（机场 name）。未列出的排在后面并保持 JSON 顺序。
 */
const BILLING_ORDER: Partial<Record<BillingType, string[]>> = {
  traffic: ['CuteCloud', 'XSUS', '赔钱机场', '魔戒'],
  yearly: ['Mikasa', 'SpeedCat', 'CokeCloud', 'TAG', '一元机场'],
}

/** 按计费方式筛选机场，并把该方式下的最低价一并带出。 */
export function providersForBilling(type: BillingType): ProviderForBilling[] {
  const list = providers.flatMap((provider) => {
    const price = lowestBilling(provider, type)
    return price ? [{ ...provider, price }] : []
  })

  const order = BILLING_ORDER[type]
  if (!order) return list
  const rank = (name: string) => {
    const index = order.indexOf(name)
    return index === -1 ? order.length : index
  }
  return list.sort((a, b) => rank(a.name) - rank(b.name))
}
