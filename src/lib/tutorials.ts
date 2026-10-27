import { z } from 'zod'

import rawTutorials from '@/data/tutorials.json'

const SITE_ORIGIN = 'https://ctelspecu.hxcn.top'
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`
const CACHE_KEY = 'ctelspecu:sitemap-posts'
const CACHE_TTL = 10 * 60 * 1000

const entrySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().default(''),
  tags: z.array(z.string()).default([]),
  updated: z.string().nullable().default(null),
  url: z.string().optional(),
})

const fileSchema = z.object({
  tutorials: z.array(entrySchema),
  /** 同步脚本判定为非中文/占位页，页面同样不展示 */
  ignored: z.array(z.string()).default([]),
})

type LocalEntry = z.infer<typeof entrySchema>

export interface Tutorial {
  slug: string
  title: string
  summary: string
  tags: string[]
  updated: string | null
  url: string
  /** 是否已由 sync-tutorials 补齐文案 */
  synced: boolean
}

const parsedFile = fileSchema.parse(rawTutorials)
const ignoredSlugs = new Set(parsedFile.ignored)

export const localTutorials: LocalEntry[] = parsedFile.tutorials

interface SitemapPost {
  slug: string
  url: string
  lastmod: string | null
}

function parseSitemap(xml: string): SitemapPost[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const posts: SitemapPost[] = []

  for (const node of Array.from(doc.querySelectorAll('url'))) {
    const loc = node.querySelector('loc')?.textContent?.trim() ?? ''
    if (!loc.includes('/post/')) continue

    const lastmod = node.querySelector('lastmod')?.textContent?.trim() ?? null
    const slug = new URL(loc).pathname.replace(/^\/post\//, '').replace(/\.html$/, '')
    if (!slug) continue

    posts.push({ slug, url: `${SITE_ORIGIN}/post/${slug}`, lastmod })
  }

  return posts
}

function readCache(): SitemapPost[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; posts: SitemapPost[] }
    if (Date.now() - parsed.at > CACHE_TTL) return null
    return parsed.posts
  } catch {
    return null
  }
}

function writeCache(posts: SitemapPost[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), posts }))
  } catch {
    // 缓存失败不影响渲染
  }
}

async function fetchPosts(): Promise<SitemapPost[]> {
  const cached = readCache()
  if (cached) return cached

  const response = await fetch(SITEMAP_URL, { headers: { Accept: 'application/xml' } })
  if (!response.ok) throw new Error(`sitemap HTTP ${response.status}`)

  const posts = parseSitemap(await response.text())
  writeCache(posts)
  return posts
}

function byUpdatedDesc(a: Tutorial, b: Tutorial) {
  return String(b.updated ?? '').localeCompare(String(a.updated ?? ''))
}

/** 本地数据同步转成渲染结构：首屏直接用它，不发网络请求。 */
export function getLocalTutorials(): Tutorial[] {
  return localTutorials
    .map<Tutorial>((entry) => ({
      ...entry,
      url: entry.url ?? `${SITE_ORIGIN}/post/${entry.slug}`,
      synced: true,
    }))
    .sort(byUpdatedDesc)
}

/**
 * 以线上 sitemap 补齐「本地还没有」的文章（例如刚发布、尚未同步标题的）。
 * 失败时退回本地列表；页面首屏不等这个请求。
 */
export async function loadTutorials(): Promise<Tutorial[]> {
  const local = new Map(localTutorials.map((entry) => [entry.slug, entry]))

  try {
    const posts = (await fetchPosts()).filter((post) => !ignoredSlugs.has(post.slug))
    return posts
      .map<Tutorial>((post) => {
        const meta = local.get(post.slug)
        return meta
          ? {
              ...meta,
              url: post.url,
              updated: meta.updated ?? post.lastmod,
              synced: true,
            }
          : {
              slug: post.slug,
              title: post.slug,
              summary: '',
              tags: [],
              updated: post.lastmod,
              url: post.url,
              synced: false,
            }
      })
      .sort(byUpdatedDesc)
  } catch {
    return localTutorials
      .map<Tutorial>((entry) => ({
        ...entry,
        url: entry.url ?? `${SITE_ORIGIN}/post/${entry.slug}`,
        synced: true,
      }))
      .sort(byUpdatedDesc)
  }
}
