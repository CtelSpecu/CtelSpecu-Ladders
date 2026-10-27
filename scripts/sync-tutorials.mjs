#!/usr/bin/env node
/**
 * 教程索引同步（AGENTS.md §1）。
 *
 * sitemap 只有 <loc>/<lastmod>，没有标题；文章页是 SPA 空壳，
 * 必须用真实浏览器渲染后取 h1 与正文首段。
 *
 * 用法：
 *   node scripts/sync-tutorials.mjs             仅补齐新增
 *   node scripts/sync-tutorials.mjs --refresh   全量重抓（换了抽取规则时用）
 *
 * 退出码：0 无新增 · 2 有更新并已写入 · 1 失败
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

const SITEMAP_URL = 'https://ctelspecu.hxcn.top/sitemap.xml'
const DATA_PATH = fileURLToPath(new URL('../src/data/tutorials.json', import.meta.url))
const SITE_ORIGIN = 'https://ctelspecu.hxcn.top'
const REFRESH = process.argv.includes('--refresh')

/**
 * 摘要暂时留空：文章页会同时渲染多篇文章的容器，首段无法可靠归属，
 * 宁可空着也不要把别的文章（或 Hexo 模板）的文案挂到这篇上。
 * 需要时在 src/data/tutorials.json 里手工补 summary。
 */

async function fetchSitemap() {
  const response = await fetch(SITEMAP_URL, {
    headers: { 'user-agent': 'CtelSpecu-Ladders/1.0 (+sync-tutorials)' },
  })
  if (!response.ok) throw new Error(`sitemap HTTP ${response.status}`)
  return response.text()
}

/** 从 sitemap 中取出全部 /post/ 条目，slug 去掉 .html 后缀。 */
function parsePosts(xml) {
  const posts = []
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? []

  for (const block of blocks) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1]
    if (!loc || !loc.includes('/post/')) continue
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1] ?? null

    const slug = new URL(loc).pathname.replace(/^\/post\//, '').replace(/\.html$/, '')
    if (!slug) continue

    posts.push({ slug, url: `${SITE_ORIGIN}/post/${slug}`, lastmod })
  }

  return posts
}

async function readExisting() {
  try {
    const parsed = JSON.parse(await readFile(DATA_PATH, 'utf8'))
    return {
      tutorials: Array.isArray(parsed.tutorials) ? parsed.tutorials : [],
      ignored: Array.isArray(parsed.ignored) ? parsed.ignored : [],
    }
  } catch (error) {
    if (error.code === 'ENOENT') return { tutorials: [], ignored: [] }
    throw error
  }
}

async function launchBrowser() {
  const executablePath = process.env.CHROMIUM_PATH
  const options = { args: ['--no-sandbox', '--disable-dev-shm-usage'] }
  if (executablePath) return chromium.launch({ ...options, executablePath })
  return chromium.launch(options)
}

/** WSL / 移动网络下偶发 ERR_NETWORK_CHANGED，重试三次。 */
async function gotoWithRetry(page, url) {
  let lastError
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 })
      return
    } catch (error) {
      lastError = error
      await page.waitForTimeout(1500)
    }
  }
  throw lastError
}

/** 渲染后取标题与首段；非中文（模板页）返回 null，由调用方记入 ignored。 */
async function scrapePost(context, post) {
  const page = await context.newPage()
  try {
    await gotoWithRetry(page, post.url)

    // SPA 首屏的 h1 可能是模板占位（"post"），等真正标题挂载出来
    await page
      .waitForFunction(
        () => {
          const text = document.querySelector('h1')?.textContent?.trim() ?? ''
          return Boolean(text) && !/^(post|page|article)$/i.test(text)
        },
        undefined,
        { timeout: 15_000 },
      )
      .catch(() => {})
    await page.waitForTimeout(600)

    const readMeta = () =>
      page.evaluate(() => {
      const h1 = document.querySelector('h1')?.textContent?.trim() ?? ''
      const paragraphs = Array.from(
        document.querySelectorAll('.article-content p, .post-content p, .markdown-body p'),
      )
        .map((node) => node.textContent?.replace(/\s+/g, ' ').trim() ?? '')
        .filter(Boolean)

        return { h1, paragraphs, title: document.title }
      })

    let meta = await readMeta()
    if (!/[\u4e00-\u9fa5]/.test(meta.h1)) {
      // 首屏没挂载出中文标题时刷新重试一次
      await page.reload({ waitUntil: 'networkidle', timeout: 45_000 }).catch(() => {})
      await page.waitForTimeout(1500)
      meta = await readMeta()
    }

    const fromTitle = meta.title.split(/\s*[|·—]\s*/)[0].trim()
    const title = /^(post|page|article)$/i.test(meta.h1) ? fromTitle : meta.h1 || fromTitle
    if (!title) throw new Error('渲染后仍无标题')
    if (!/[\u4e00-\u9fa5]/.test(title)) return null

    return {
      slug: post.slug,
      title,
      summary: '',
      tags: [],
      updated: post.lastmod,
      url: post.url,
    }
  } finally {
    await page.close()
  }
}

async function main() {
  const xml = await fetchSitemap()
  const posts = parsePosts(xml)
  const existing = await readExisting()
  const known = new Set(existing.tutorials.map((item) => item.slug))
  const ignored = new Set(existing.ignored)

  const targets = posts.filter(
    (post) => !ignored.has(post.slug) && (REFRESH || !known.has(post.slug)),
  )

  if (targets.length === 0) {
    console.log(`[sync-tutorials] 已是最新：${existing.tutorials.length} 篇，无新增。`)
    return 0
  }

  console.log(
    `[sync-tutorials] ${REFRESH ? '全量重抓' : '发现新增'}：${targets.length} 篇，开始渲染…`,
  )

  const browser = await launchBrowser()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  })

  const bySlug = new Map(existing.tutorials.map((item) => [item.slug, item]))
  const failed = []

  try {
    for (const post of targets) {
      try {
        const entry = await scrapePost(context, post)
        if (!entry) {
          ignored.add(post.slug)
          console.log(`  - ${post.slug} — 跳过（非中文或占位页）`)
          continue
        }
        bySlug.set(entry.slug, entry)
        console.log(`  ✓ ${entry.slug} — ${entry.title}`)
      } catch (error) {
        console.error(`  ✗ ${post.slug} — ${error.message}`)
        failed.push(post.slug)
      }
    }
  } finally {
    await browser.close()
  }

  const merged = [...bySlug.values()].sort((a, b) =>
    String(b.updated ?? '').localeCompare(String(a.updated ?? '')),
  )

  await mkdir(dirname(DATA_PATH), { recursive: true })
  await writeFile(
    DATA_PATH,
    `${JSON.stringify({ tutorials: merged, ignored: [...ignored] }, null, 2)}\n`,
    'utf8',
  )

  console.log(`[sync-tutorials] 已写入 ${DATA_PATH}（共 ${merged.length} 篇）。`)

  if (failed.length > 0) {
    console.error(`[sync-tutorials] 有 ${failed.length} 篇抓取失败：${failed.join(', ')}`)
    console.error('[sync-tutorials] 已写入成功部分；请重新运行以补齐失败项。')
    return 1
  }

  return 2
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error(`[sync-tutorials] 失败：${error.message}`)
    process.exit(1)
  })
