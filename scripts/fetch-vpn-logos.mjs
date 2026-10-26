#!/usr/bin/env node
/**
 * 抓取免费 VPN 的应用 logo（AGENTS.md §2）。
 *
 * 直接从站点 HTML 里解析 <link rel="icon">，取不到再退回 /favicon.ico，
 * 只写 public/logos/vpn/<slug>.<真实扩展名>，不修改 JSON。
 * 跑完把打印出来的文件名填进 src/data/freeVpns.json 的 logo 字段。
 *
 * 用法：node scripts/fetch-vpn-logos.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** slug → 站点域名。写主站，不要写应用商店页面。 */
const TARGETS = {
  letsvpn: 'letsvpn.world',
  turbovpn: 'turbovpn.com',
  pandavpn: 'pandavpnpro.com',
  protonvpn: 'protonvpn.com',
  cloudflare: 'cloudflare.com',
  orbot: 'orbot.app',
}

const OUT_DIR = fileURLToPath(new URL('../public/logos/vpn/', import.meta.url))
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const TIMEOUT = 15_000

function extensionOf(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'png'
  }
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'jpg'
  if (buffer.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0x00]))) return 'ico'
  if (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP') {
    return 'webp'
  }
  if (buffer.subarray(0, 3).toString() === 'GIF') return 'gif'
  const head = buffer.subarray(0, 400).toString('utf8').trimStart()
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'svg'
  return null
}

async function download(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': UA, accept: 'image/*,*/*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

/** 从首页 HTML 里挑出最像 logo 的 icon 链接，优先 SVG / PNG。 */
function iconLinks(html, base) {
  const scores = []
  for (const tag of html.match(/<link[^>]*>/gi) ?? []) {
    if (!/rel=["'][^"']*icon[^"']*["']/i.test(tag)) continue
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1]
    if (!href) continue

    let url
    try {
      url = new URL(href, base).toString()
    } catch {
      continue
    }

    const apple = /apple-touch-icon/i.test(tag)
    const svg = /\.svg(\?|$)/i.test(url)
    scores.push({ url, score: (apple ? 0 : 10) + (svg ? 5 : 0) })
  }
  return scores.sort((a, b) => b.score - a.score).map((entry) => entry.url)
}

async function fetchLogo(slug, domain) {
  const base = `https://${domain}/`
  const candidates = []

  try {
    const response = await fetch(base, {
      headers: { 'user-agent': UA },
      signal: AbortSignal.timeout(TIMEOUT),
    })
    if (response.ok) candidates.push(...iconLinks(await response.text(), base))
  } catch {
    // 首页打不开就只试 favicon
  }

  candidates.push(`${base}favicon.ico`)

  for (const url of candidates) {
    try {
      const buffer = await download(url)
      const ext = extensionOf(buffer)
      if (!ext) continue
      if (ext === 'ico' && buffer.length < 500) continue

      const file = `${slug}.${ext}`
      await writeFile(join(OUT_DIR, file), buffer)
      return file
    } catch {
      // 试下一个候选
    }
  }

  throw new Error('没有可用的 icon')
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const results = []
  for (const [slug, domain] of Object.entries(TARGETS)) {
    try {
      const file = await fetchLogo(slug, domain)
      results.push({ slug, file })
      console.log(`  ✓ ${slug} → ${file}`)
    } catch (error) {
      console.error(`  ✗ ${slug} (${domain}) — ${error.message}`)
      process.exitCode = 1
    }
  }

  if (results.length > 0) {
    console.log('\n把下面的文件名填进 src/data/freeVpns.json 的 logo 字段：')
    for (const { slug, file } of results) console.log(`  ${slug}: ${file}`)
  }
}

await main()
