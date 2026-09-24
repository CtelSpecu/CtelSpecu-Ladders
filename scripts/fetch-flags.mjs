// 把推荐渠道用到的国旗下载到 public/flags，避免运行时依赖第三方 CDN（flagcdn.com）
// 用法：bun scripts/fetch-flags.mjs
//   w20 -> flags/<code>.png (1x, 20px 宽) / w40 -> flags/<code>@2x.png (2x, 40px 宽)
// 新增渠道或地区后重跑即可，已存在的文件会跳过。
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'

const DATA = new URL('../src/data/providers.json', import.meta.url)
const OUT = new URL('../public/flags/', import.meta.url)
const SOURCES = [
  ['w20', ''],
  ['w40', '@2x'],
]

const providers = JSON.parse(await readFile(DATA, 'utf8'))
const codes = [...new Set(providers.flatMap((p) => p.regions))].sort()

await mkdir(OUT, { recursive: true })

let added = 0
let skipped = 0
for (const code of codes) {
  for (const [size, suffix] of SOURCES) {
    const file = new URL(`${code}${suffix}.png`, OUT)
    try {
      await access(file)
      skipped++
      continue
    } catch {}
    const res = await fetch(`https://flagcdn.com/${size}/${code}.png`)
    if (!res.ok) throw new Error(`${code} (${size}): HTTP ${res.status}`)
    await writeFile(file, Buffer.from(await res.arrayBuffer()))
    added++
  }
}

console.log(`flags: ${codes.length} 个地区, 新增 ${added} 个文件, 跳过 ${skipped} 个已存在文件`)
