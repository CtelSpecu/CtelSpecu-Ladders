import { z } from 'zod'

import rawProviders from '@/data/providers.json'

export const BILLING = ['monthly', 'traffic'] as const
export type BillingType = (typeof BILLING)[number]

export const billingLabel: Record<BillingType, string> = {
  monthly: '包月',
  traffic: '按流量',
}

export const billingDescription: Record<BillingType, string> = {
  monthly: '固定周期扣费，适合长期稳定使用',
  traffic: '按实际用量计费，适合用量不固定的场景',
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
})

export type Provider = z.infer<typeof providerSchema>
export type ProviderBilling = Provider['billing'][number]

export const providers: Provider[] = z.array(providerSchema).parse(rawProviders)

export function lowestBilling(provider: Provider, type: BillingType): ProviderBilling | null {
  const matches = provider.billing.filter((item) => item.type === type)
  if (matches.length === 0) return null
  return matches.reduce((lowest, item) => (item.price < lowest.price ? item : lowest))
}

export interface ProviderForBilling extends Provider {
  price: ProviderBilling
}

/** 按计费方式筛选机场，并把该方式下的最低价一并带出。 */
export function providersForBilling(type: BillingType): ProviderForBilling[] {
  return providers.flatMap((provider) => {
    const price = lowestBilling(provider, type)
    return price ? [{ ...provider, price }] : []
  })
}
