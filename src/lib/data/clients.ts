import { z } from 'zod'

import rawClients from '@/data/clients.json'

export const OS = ['windows', 'macos', 'linux', 'ios', 'android', 'harmony', 'openwrt'] as const
export type Os = (typeof OS)[number]

export const CLIENT_CATEGORY = ['clash', 'v2ray', 'other'] as const
export type ClientCategory = (typeof CLIENT_CATEGORY)[number]

export const osMeta: Record<Os, { label: string; short: string }> = {
  windows: { label: 'Windows', short: 'Win' },
  macos: { label: 'macOS', short: 'Mac' },
  linux: { label: 'Linux', short: 'Linux' },
  ios: { label: 'iOS', short: 'iOS' },
  android: { label: 'Android', short: 'Android' },
  harmony: { label: 'HarmonyOS', short: '鸿蒙' },
  openwrt: { label: 'OpenWrt / 梅林', short: '路由' },
}

export const categoryMeta: Record<ClientCategory, { label: string; description: string }> = {
  clash: {
    label: 'Clash / Mihomo',
    description: '图形化为主的 Clash / Mihomo 生态客户端',
  },
  v2ray: {
    label: 'V2Ray / Xray',
    description: '协议生态为主的 V2Ray / Xray / sing-box 客户端',
  },
  other: {
    label: '其他 / 专有协议',
    description: '不基于 Clash / V2Ray 内核的客户端',
  },
}

const clientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(CLIENT_CATEGORY),
  description: z.string(),
  platforms: z.array(z.enum(OS)),
  recommended: z.array(z.enum(OS)).optional(),
  downloads: z.array(z.object({ label: z.string(), url: z.url() })),
  tutorials: z.record(z.string(), z.url()).optional(),
  /** public/logos/clients 下的图标文件名 */
  logo: z.string().optional(),
})

const clientsFileSchema = z.object({
  clients: z.array(clientSchema),
  recommendedByOs: z.record(z.string(), z.array(z.string())),
})

const parsed = clientsFileSchema.parse(rawClients)

export type Client = z.infer<typeof clientSchema>

export const clients: Client[] = parsed.clients

/** 某个系统下的全部客户端，维护者推荐的排前面。 */
export function getClientsForOs(os: Os): Client[] {
  const order = new Map((parsed.recommendedByOs[os] ?? []).map((id, index) => [id, index]))
  return clients
    .filter((client) => client.platforms.includes(os))
    .sort((a, b) => (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER))
}

export function getRecommendedClients(os: Os, limit = 2): Client[] {
  const ids = parsed.recommendedByOs[os] ?? []
  const byId = new Map(clients.map((client) => [client.id, client]))
  return ids
    .map((id) => byId.get(id))
    .filter((client): client is Client => Boolean(client))
    .slice(0, limit)
}

export function getClientsByCategory(category: ClientCategory, os?: Os): Client[] {
  return clients.filter((client) => {
    if (client.category !== category) return false
    return os ? client.platforms.includes(os) : true
  })
}

export function detectOs(): Os {
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'android'
  if (/(iphone|ipad|ipod)/i.test(ua)) return 'ios'
  if (/(macintosh|mac os x)/i.test(ua)) return 'macos'
  if (/linux/i.test(ua)) return 'linux'
  return 'windows'
}
