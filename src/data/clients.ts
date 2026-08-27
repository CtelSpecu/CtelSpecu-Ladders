import rawData from './clients.json'

export const OS = {
  windows: 'windows',
  macos: 'macos',
  linux: 'linux',
  ios: 'ios',
  android: 'android',
} as const

export type Os = (typeof OS)[keyof typeof OS]

export type OsMeta = {
  label: string
  icon: string
}

export const osMeta: Record<Os, OsMeta> = {
  [OS.windows]: { label: 'Windows', icon: 'windows' },
  [OS.macos]: { label: 'macOS', icon: 'apple' },
  [OS.linux]: { label: 'Linux', icon: 'linux' },
  [OS.ios]: { label: 'iOS', icon: 'mobile-screen-button' },
  [OS.android]: { label: 'Android', icon: 'android' },
}

export const CLIENT_CATEGORY = {
  clash: 'clash',
  v2ray: 'v2ray',
} as const

export type ClientCategory = (typeof CLIENT_CATEGORY)[keyof typeof CLIENT_CATEGORY]

export type CategoryMeta = {
  label: string
  description: string
  icon: string
}

export const categoryMeta: Record<ClientCategory, CategoryMeta> = {
  [CLIENT_CATEGORY.clash]: {
    label: 'Clash / Mihomo',
    description: '偏图形化代理客户端（Clash / Mihomo 生态）',
    icon: 'bolt',
  },
  [CLIENT_CATEGORY.v2ray]: {
    label: 'V2Ray / Xray',
    description: '偏协议生态客户端（V2Ray / Xray / sing-box 等）',
    icon: 'network-wired',
  },
}

export interface ClientLink {
  label: string
  url: string
}

export interface Client {
  id: string
  name: string
  category: ClientCategory
  description: string
  platforms: Os[]
  recommended?: Os[]
  downloads: ClientLink[]
  tutorials?: Partial<Record<Os, string>>
}
interface RawClientsData {
  clients: Client[]
  recommendedByOs: Record<Os, string[]>
}

// rawData comes from JSON with validated shape — narrow via known structure
const rawClientsData: RawClientsData = rawData as RawClientsData

export const clients: Client[] = rawClientsData.clients

export const recommendedByOs: Record<Os, string[]> = rawClientsData.recommendedByOs

export function getClientById(id: string): Client | null {
  return clients.find((client) => client.id === id) ?? null
}

export function getRecommendedClientsForOs(os: Os): Client[] {
  const ids: string[] = recommendedByOs[os] ?? []
  return ids.map(getClientById).filter((c): c is Client => c !== null)
}

export function getClientsByCategory(category: ClientCategory): Client[] {
  return clients.filter((client) => client.category === category)
}
