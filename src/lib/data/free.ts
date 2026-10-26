import { z } from 'zod'

import rawNodes from '@/data/freeNodes.json'
import rawVpns from '@/data/freeVpns.json'

const nodesSchema = z.object({
  sections: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string(),
      links: z.array(z.object({ name: z.string(), url: z.url(), icon: z.string() })),
    }),
  ),
})

const vpnsSchema = z.object({
  sections: z.array(
    z.object({
      title: z.string(),
      icon: z.string(),
      items: z.array(z.object({ name: z.string(), url: z.url(), rating: z.number() })),
    }),
  ),
})

export type NodeSection = z.infer<typeof nodesSchema>['sections'][number]
export type VpnSection = z.infer<typeof vpnsSchema>['sections'][number]

export const nodeSections: NodeSection[] = nodesSchema.parse(rawNodes).sections
export const vpnSections: VpnSection[] = vpnsSchema.parse(rawVpns).sections
