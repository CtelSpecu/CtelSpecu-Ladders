# spec.md — 技术栈重构规格

> 状态：**v1.0（全部决策已确认，2026-10-26 开工）**。实现按 §9 顺序推进。
> 规则：❓ 项未经确认不得动工；确认后替换为决定并升版本。
> 旧实现备份：分支 `backup/vue3-legacy-2026-10-26`（指向 `004e2a3`）。

---

## 0. 已确认决定

| # | 决定 | 内容 |
|---|---|---|
| D1 | 技术栈版本 | **升级线**：React 19 + Tailwind 4 + TanStack Router 最新（file-based）+ 全量 `shadcn add`。不照抄模板的 2024 快照 |
| D2 | 路由与部署 | **干净路径** `/clients` 等 + `404.html` SPA 回退 + 明确 `basepath`；旧 hash 链接做重定向 |
| D3 | 引导持久化 | `localStorage` 记录模式与步骤；Navbar「新手引导」可随时重入；不设「不再显示」 |
| D4 | Stepper 步数 | **5 步**，第 3 步分叉出两种不同的第 4 步内容，第 5 步固定为导入方法 |
| D5 | 教程数据 | **推送前自动同步**：检查 sitemap 新增 → 抓标题 → 更新数据文件 → 提交推送；流程写入 `AGENTS.md` |
| D6 | 视觉基底 | 弃用现有霓虹/极光/玻璃；倾向 shadcn 官方 **Luma** 风格（待 Round 2 定基色） |
| D7 | 风格落地 | **Luma + zinc 基色**；primary = 旧霓虹里的 **紫 `#7c3aed`**（唯一在深/浅两模式都能直接当主色的候选，白底 5.70:1） |
| D8 | 部署域名 | **继续 Cloudflare 域名根** `https://ladders.ctelspecu.hxcn.top/`，`basepath = '/'`；不需要 404.html 回退（实测根路径直接 200） |
| D9 | 插画语言 | **柔和渐变光斑 + 几何色块**（Luma 自己的视觉语言），首次弹窗与 hero 同一套 |
| D10 | Stepper 与路由 | 点击才导航，Stepper 悬浮层跟随；**不自动推进** |
| D11 | 主页结构 | Hero（单 CTA）→ Spotlight 3 项 → **Bento 6 卡** → **单行页脚** |
| D12 | UI 原语底座 | **Base UI**（Luma 预设默认）。ArcUI 的 Radix 组件需重写为 Base UI 版本，视觉与动效保留 |
| D13 | 机场计费 | **删除长期价格**，只留「包月 / 按流量」两 Tab，按 Tab 筛选机场卡 |
| D14 | Stepper 行为 | 线性前进 + 可点圆点回看 + 可最小化成胶囊（右下角）+ 最后一步「完成」后关闭并记 done；**移动端改为顶部步骤条** |
| D15 | 教程卡 | ReactBits **Card 7** 结构（已截图证实）：双列、左上「版本 + 日期」、标题、两行摘要、底部「头像 + 作者 + 阅读时长」；本项目映射为「标签 + 日期 / 标题 / 摘要 / 图标 + 来源 + 更新时间」 |
| D16 | 客户端页 | 保留两页：`/clients` 按 OS 推荐（OS 按钮用 ArcUI Button）；按钮进入内核分类页，该页顶部是 **OS 筛选 Tabs**（复刻 ArcUI Tabs） |
| D27 | 统计隔离 | Umami 仅在「生产构建 + 正式域名 + 非自动化浏览器 + 未设置 `umami.disabled`」时注入；`index.html` 不再写静态统计标签；官方排除方式与规则写入 `AGENTS.md` §5.1 |
| D28 | 免费专区路由 | 采用规范路由：`/free/subscriptions`、`/free/nodes`、`/free/vpn`；`/free` 为选择页（插画 + 三张入口卡），三个子页共用滑动 Tab 外壳 |
| D18 | 客户端卡 | ReactBits **Card 5** 结构（已截图）：名称 → 大字价格位（本项目改为「平台/内核」）→ 分隔线 → 规格行 → ✓ 特性清单 → 整宽按钮 |
| D19 | 主页导航卡 | ReactBits **Card 8** 结构（已截图）：顶部浅底图标面板 + 标题 + 一行 meta + 时间戳；整卡可点 |
| D20 | 共享订阅卡 | ArcUI **Billing Overview** 结构（已截图）：标题+状态徽章 → 主数值+次要操作 → 元信息行 → 进度条组 → 明细表 → 底部操作 |
| D21 | 免费订阅 | shadcnblocks **List 2/3**：带分隔线的行，左侧标题+说明，右侧徽章/操作 |
| D22 | 教程卡 | ReactBits **Card 7** 双列：标签+日期 / 标题 / 两行摘要 / 图标+来源+更新时间 |
| D17 | 字体 | 采用用户给定的最佳实践栈：`--font-sans` = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", "Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans CN", sans-serif`；`--font-mono` = `"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, "Liberation Mono", "Courier New", monospace`。**不使用 Inter / Oxanium** |

---

## 1. 目标

把 **Vue 3 + Vite + 手写 CSS** 重写为 **React 19 + TanStack Router + Tailwind 4 + shadcn/ui** 的单页应用：

1. 骨架对齐 `InsaneNaman/tw-shadcn-tanstack-boilerplate` 的形态（Vite + TS + shadcn 变量体系），但依赖升级到当前版本；
2. 视觉推翻重做，弃用霓虹；
3. 业务内容不变（客户端、机场、共享订阅、免费资源、教程），排版与交互按指定参考重构；
4. 新增「首次访问分流」与「新手 5 步引导」。

**边界**：重写，不保留 Vue 共存。主分支直接替换。

---

## 2. 事实基线（已实际核查）

### 2.1 模板实际内容

| 项 | 实际值 |
|---|---|
| 框架 | React **18.2** + TS，Vite **5** |
| 路由 | `@tanstack/react-router` **1.15**（代码式 `createRootRoute`） |
| 样式 | Tailwind **3.4** + `tailwindcss-animate` + autoprefixer |
| shadcn | `style: new-york`、`baseColor: slate`、`cssVariables: true`、`--radius: 0.5rem` |
| 现有 UI | **仅 3 个**：Button / Avatar / DropdownMenu |
| 动效 | **无** |
| 主题 | 自写 Provider（localStorage `vite-ui-theme`，默认 `system`） |
| 图标 | lucide-react 0.321 |
| 缺失 | Dialog / Tabs / Card / Sheet / Toaster / Tooltip / Accordion 全需 `add` |

### 2.2 现有项目能力（须保留）

| 能力 | 数据来源 |
|---|---|
| 客户端下载（按 OS 推荐 + 分类对比） | `src/data/clients.json` |
| 机场推荐（7 家，billing / badges / regions ISO） | `src/data/providers.json` |
| 共享订阅（评分、剩余流量、重置、到期、限速、复制导入） | `/subscriptions.json` |
| 实时流量 | `api.allorigins.win` 代理 → 解析订阅 YAML 的 `subscription-userinfo` |
| 免费节点 / 免费 VPN | `src/data/freeNodes.json` / `freeVpns.json` |
| 国旗 | `public/flags/*.png` + `@2x`（`scripts/fetch-flags.mjs` 生成） |
| 统计 | Umami（`analytics.hxcn.dev`） |
| PWA | `public/sw.js`，生产环境注册 |

### 2.3 参考组件可获得性（关键约束）

| 参考 | 可用性 | 结论 |
|---|---|---|
| ReactBits **Stepper** | ✅ 源码 27,546 字符 | 依赖 `@hugeicons/react`；spring `linear()`；`indicator: numbers\|dots\|bars`；`transition: slide\|fade`；`frame`/`radius`/`width`/`theme` |
| RareUI **GooeyNav** | ✅ 7,631 字符 | SVG `neckPath()` 在间隙绘制"粘液颈"；spring `{stiffness:200,damping:28}`；`size xs/sm/md/lg` |
| beUI **ThemeToggle** | ✅ 22.7 KB | **View Transitions API** + clip-path；变体 `rectangle\|circle\|circle-blur\|blinds`；依赖 next-themes（需替换） |
| ArcUI **Dialog / Tabs / Button** | ✅ registry 可下载 | 配套 `arc-motion-tokens` |
| ArcUI **Spotlight / Bento / Billing** | ⚠️ | 只有 API 文档，无源码 → 按文档自研 |
| shadcnspace **Dialog** | ⚠️ | 画廊页，代码不在 HTML；**用 ArcUI Dialog 作基底** |
| ReactBits Pro **Card 5/7/8 + Nav blocks** | ❌ | **付费墙 + 纯客户端渲染**：HTML 无内容、无 `__next_f` 负载、无预览图。**无法得知真实排版** |
| 其余画廊（shadcnblocks/efferd/paceui/aceternity/reui/neonblade） | ⚠️ | 只能读结构与文案描述，像素级需按描述复刻 |

**ArcUI 全局动效令牌**（已取得，作为项目 motion token）：

```ts
duration: { instant: 0.12, fast: 0.16, exit: 0.18, standard: 0.24, considered: 0.48 }
ease: {
  enter:    [0.16, 1, 0.3, 1],
  exit:     [0.7, 0, 0.84, 0],
  standard: [0.22, 1, 0.36, 1],
  inOut:    [0.65, 0, 0.35, 1],
}
spring: {
  responsive: { stiffness: 520, damping: 44 },
  gentle:     { stiffness: 340, damping: 34 },
  snappy:     { type: 'spring', visualDuration: 0.26, bounce: 0 },
  smooth:     { type: 'spring', visualDuration: 0.4,  bounce: 0 },
  morph:      { type: 'spring', visualDuration: 0.42, bounce: 0 },
}
stagger: { char: 0.016, word: 0.04, line: 0.08, item: 0.035 }
blur: { subtle: 2, soft: 4, text: 8 }
```

**ArcUI Dialog 实测规格**（复刻基底）：
- 遮罩：`oklch(10% 0 0 / .46)` + `backdrop-filter: blur(7px)`。
- 内容：`width: min(calc(100vw - 32px), 440px)`、`height: fit-content`、`max-height: calc(100dvh - 32px)`、`border: 1px solid var(--border)`、`border-radius: var(--radius-surface)`、`box-shadow: var(--shadow-floating)`。
- 入场：`translateY(8px) scale(.96)` + fade；退场：`translateY(4px) scale(.98)`；缓动 `[0.16,1,0.3,1]`。

### 2.4 Luma 风格（Round 2 待定基色）

官方 shadcn 风格（2026-03 发布），定位原文：**"Rounded geometry. Soft elevation. Breathable layouts. Inspired by macOS Tahoe, minus the glass."**

- 它改的是**几何、间距、质感**，不只是配色 —— 正好对应本项目"去掉玻璃拟态与霓虹"的目标。
- 8 种官方风格：Nova / Vega / Mira / Luma / Sera / Maia / Rhea / Lyra；Luma 是其中最圆、最柔、最疏的一个。
- 可通过 `shadcn/create` 预设一键生成（含 base color / accent / chart color / 字体 / 圆角）。

### 2.5 教程数据源（已实测）

| 检查项 | 结果 |
|---|---|
| `sitemap.xml` | 200，13.3 KB，`access-control-allow-origin: *` |
| 条目 | 70：`/post/*.html` **13** + `/tags/*` 55 + `/categories/Proxy` 1 + 根 1 |
| 标题 | **不含**（只有 loc/lastmod/changefreq/priority） |
| 文章页 | 308 → 干净路径，返回 3,177 字节 SPA 空壳，`<title>`/`<h1>` 为空，bot UA 也不预渲染 |
| RSS/search | 无（全部返回空壳） |
| 结论 | URL 可动态获得；**标题必须用真实浏览器渲染后提取**（这正是 D5 流水线的必要性） |

### 2.6 部署现状

`gh-pages -d dist -r git@github.com:CtelSpecu/CtelSpecu-Ladders.git` → GitHub Pages 项目页，线上位于 `/<repo>/`。

---

## 3. 目标架构

### 3.1 目录结构

```
src/
  routes/
    __root.tsx               # 悬浮 Navbar + Footer + 全局 Stepper + 首次访问 Dialog
    index.tsx                # 主页
    clients.tsx              # 客户端下载
    recommend.tsx            # 机场推荐
    tutorials.tsx            # 技术教程
    free/subscriptions.tsx   # 共享订阅
    free/nodes.tsx           # 免费订阅（原免费节点）
    free/vpn.tsx             # 免费 VPN
    onboarding.tsx           # 新手引导（可重入）
  components/
    ui/                      # shadcn 原语（不魔改）
    motion/                  # 魔改 / 自研动效
      gooey-nav.tsx
      theme-toggle.tsx
      stepper.tsx
      dialog.tsx
      spotlight-grid.tsx
      feature-bento.tsx
      billing-overview.tsx
    layout/                  # navbar / footer / page-shell
    cards/                   # client / provider / subscription / free-resource / tutorial
  lib/
    motion-tokens.ts         # ArcUI tokens
    theme.tsx                # 替代 next-themes（class + View Transitions）
    data/                    # 原 JSON 迁移 + zod 校验
    traffic.ts               # 流量（沿用 allorigins）
    sitemap.ts               # 教程索引读取
scripts/
  sync-tutorials.mjs         # D5 流水线
data/
  tutorials.json             # slug → 中文标题/摘要/标签
AGENTS.md                    # 推送前检查新增教程的强制流程
```

### 3.2 路由表

| 页面 | 路由 | 旧 hash |
|---|---|---|
| 主页 | `/` | `#/` |
| 客户端下载 | `/clients` | `#/clients?os=` |
| 机场推荐 | `/recommend` | `#/recommend` |
| 技术教程 | `/tutorials` | *新增* |
| 共享订阅 | `/free/subscriptions` | `#/subscriptions` |
| 免费订阅 | `/free/nodes` | `#/free-nodes` |
| 免费 VPN | `/free/vpn` | `#/other` |
| 新手引导 | `/onboarding` | *新增* |

### 3.3 组件实现方案

| 组件 | 基底 | 要点 | 验收 |
|---|---|---|---|
| Navbar | RareUI GooeyNav + ReactBits Nav | SVG 粘液颈 + spring；左侧 6 项（免费专区为 Dropdown）；右侧主题切换；滚动保持悬浮 | 指示条流动不跳变 |
| ThemeToggle | beUI circle-blur | `startViewTransition` + clip-path 圆形揭开；无 API 降级 fade | 400ms 圆形扩散 |
| 首次访问 Dialog | ArcUI Dialog | 顶部自绘 SVG 插画；两枚大按钮（新手/老手） | 首访必现；选择持久化 |
| 新手 Stepper | ReactBits Stepper | `fixed bottom` 容器；跨路由保留；z-index 高于 navbar；可折叠 | 高度平滑过渡；跨页不重置 |
| 主页 Hero | ReUI hero | 单主 CTA + 自绘插画 | — |
| 主页 Features | efferd / scb / pace / ArcUI | spotlight-grid + bento，指向各页面 | — |
| 客户端下载 | ArcUI Button（OS 选择）+ ArcUI Tabs（分类页 OS 筛选）+ RB Card 5 | `/clients` 为 OS 推荐页，按钮进入 `/clients/categories`；分类页按 Clash/V2Ray 分组 | 同 D16 |
| 机场推荐 | Aceternity pricing | 顶部「包月 / 按流量」Tab 作筛选 → 机场名 → 该模式价格 → 带 icon 特性 → 地区静态堆砌 | 无 marquee；无长期价 |
| 共享订阅 | ArcUI Billing Overview | 流量、重置、到期、复制/导入 | — |
| 免费订阅 | shadcnblocks List | — | — |
| 免费 VPN | ReUI application/list | — | — |
| 技术教程 | RB Card 7 结构 + sitemap | 双列卡片：标签+日期 / 标题 / 摘要 / 图标+来源+更新时间 | 见 D15 |
| Footer | NeonBlade 结构（去霓虹） | 多列 + 品牌 + 法务 | — |

---

## 4. 教程同步流水线（D5 细化，待确认）

目标：**推送前**发现新增文章并补齐中文标题，避免教程页出现英文 slug。

```
scripts/sync-tutorials.mjs
  1. GET /sitemap.xml（CORS 已开放）
  2. 抽取 /post/* → slug 集合
  3. 与 data/tutorials.json 比对
     ├─ 无新增 → 退出码 0，不产生 diff
     └─ 有新增 → 输出待补 slug 列表，退出码 2
  4. 对新 slug，用无头浏览器打开（站点是 SPA，必须执行 JS）
     读取：document.title、h1、meta description
  5. 合并写回 tutorials.json（保留已有的人工修正）
  6. git add + commit（只提交数据文件）
```

`AGENTS.md` 规定：**每次 push 前必须运行**；退出码 2 时先补数据再推送；标题以浏览器渲染结果为准，不准用 slug 生成。

已定：**Playwright**（D2 已确认 bun + Vitest + Playwright，仅用于脚本）。无头浏览器实测可正常渲染目标站；`playwright` Python 已装，Node 侧用 `@playwright/test` 提供的 chromium。

---

## 5. 待确认（Round 6 · 收尾）

| # | 问题 | 建议 |
|---|---|---|
| Q23 ✅ | 教程页列数（已确认） | **双列**（≥768px 双列，<768px 单列） |
| Q24 ✅ | Bento 卡数与入口（已确认） | **6 张**：客户端下载 / 机场推荐 / 技术教程 / 共享订阅 / 免费订阅 / 免费 VPN |
| Q25 ✅ | 页脚形态（已确认） | **单行页脚**：品牌 + 一行链接 + 版权，不做四列 |
| Q26 ✅ | Stepper 形态（已确认） | 桌面：右下角胶囊；**移动端：顶部步骤条**（sticky，不遮挡内容） |
| Q27 ✅ | 第 2 步推荐数（已确认） | **1 主推 + 1 备选** |
| Q28 ✅ | 开工（已确认） | 按 §9 分阶段实现 |

## 6. 风险登记## 6. 风险登记

| 风险 | 影响 | 处理 |
|---|---|---|
| ReactBits Pro 三卡 + Nav blocks 无法获取 | 无法逐像素复刻 | 需截图，或明确「按描述自由发挥」 |
| 教程标题需 JS 渲染 | 纯脚本抓不到 | D5 流水线 + 无头浏览器 |
| `api.allorigins.win` 第三方依赖 | 限流则流量不显示 | 保留重试/失败态；Round 3 讨论是否自建 |
| View Transitions（Safari < 18） | 无圆形扩散 | 降级 fade |
| GitHub Pages 深链 | 刷新 404 | `404.html` 回退 + basepath |
| 国旗路径 | basepath 下 `/flags/*` 404 | 用 `BASE_URL` 前缀 |
| 一次性重写 | 回归面大 | 分阶段上线：骨架 → 布局 → 页面 → 引导 |


---

## 8. 参考视觉实录（无头浏览器实测，非推测）

| 参考 | 实测结构 |
|---|---|
| **ReactBits Card 7** | 双列网格；每卡：左上「版本号 `2.9` + 日期 `12 March`」小号弱化文字，右上书签图标；中间标题（约 17px 半粗）；下方两行摘要（弱化）；底部一行「圆形头像 + 作者名 + `3 min read`」。**无边框重阴影**，仅 1px 边框 + 圆角。 |
| **ReactBits Card 5** | 三列卡片；每卡：名称 → 大号价格 + 周期小字 → 一句描述 → 分隔线 → 2~3 行「标签左 / 值右」规格行 → ✓ 清单（带对勾图标）→ 整宽按钮（主推卡为白色实底，其余为浅灰）。 |
| **ReactBits Card 8** | 四列瓦片；每块：顶部浅灰圆角方框内居中放一个大的类型图标（约 150px 高），右上角复选框；下方文件名（半粗）→ 一行 meta（`Document 2.4 MB`）→ 更弱的更新时间；顶部有一条工具栏（`1 selected of 8 files` + Clear/Download）。 |
| **ReactBits Navigation** | 15 个变体；与本项目相关的是 `navigation-12`（玻璃胶囊 + 滑动指示器）、`navigation-9`（胶囊 + 公告条）、`navigation-2`（圆角 + 卡片式下拉）、`navigation-7`（顶部圆角 + 下拉）。统一特征：**胶囊容器、居中、右侧单独的动作按钮组**。 |
| **RareUI GooeyNav** | 一排胶囊按钮，中间有「粘液颈」把它们连成一根条；切换时颈的宽度用 spring 过渡（`stiffness 200 / damping 28`），活动项底色为浅色（深色模式下为 `#262626`）。 |
| **Aceternity Pricing** | 画廊里 7 个变体；共同骨架：**顶部一个 segmented switch（月度/年度）** → 三列卡片 → 每卡顶部小图标 + 名称 → 大号价格 + `/月` → ✓ 特性列表 → 按钮。 |
| **ArcUI Billing Overview** | 单个大面板：`Current plan` + 绿色「Paid on time」徽章 → 套餐名 + `$199/month` + Update → 支付方式行（卡面图形 + `Visa ending 7773`）→ `Usage this period` 下三行进度条（Seats 12 of 16 / API calls $12,400 of 25,000 / Storage 38.4 GB of 100 GB，右侧百分比）→ 发票表格（日期 / 描述 / 金额 / 状态徽章 / Pay 按钮）。 |
| **shadcnblocks List** | 仅 3 个：List 1 极简行、List 2 带分隔线的行、List 3 带头像+徽章+操作的行。 |
| **ArcUI Spotlight Grid** | 6 张紧凑统计卡 + 1 张高亮大卡；卡内：小标签 + 大数字 + 迷你曲线 + 小徽章。 |
| **ArcUI Feature Bento** | 2 列不等高网格；每卡：标题 + 一句描述 + 一个「像真实 UI」的小视觉（列表/进度/开关/头像组）；卡片间用 1px 边框分隔，圆角统一。 |
| **ReactBits 站内页脚** | 四列：品牌（logo + 一句话 + 社交图标）｜Site｜Docs｜Resources｜Legal & Account；底部一行版权。 |

> 说明：`reui.io` 的 hero / application-list 两页在无头浏览器里样式未生效（背景透明、高度近 1.9 万 px），我按站内描述与同类实现复刻，不作为像素依据。

---

## 9. 实施顺序

1. **骨架**：`bun create vite` → React 19 + TS；接入 TanStack Router（file-based）；Tailwind 4；`shadcn init --style luma --base-color zinc`（Base UI 底座）。
2. **令牌层**：把 Luma 预设的 CSS 变量写入 `src/index.css`，primary 换成紫 `#7c3aed` 对应 OKLCH；字体换成 D17 栈；落地 `motion-tokens.ts`。
3. **布局**：Navbar（GooeyNav + 两个下拉）→ ThemeToggle（circle-blur）→ Footer 四列 → 移动端 Sheet。
4. **数据层**：迁移 5 个 JSON + zod；`traffic.ts` 沿用 allorigins；`sitemap.ts`。
5. **页面**（每页完成即可预览）：主页 → 客户端（两页）→ 机场 → 共享订阅 → 免费订阅/免费 VPN → 教程。
6. **引导链路**：首次 Dialog + 5 步 Stepper（全局悬浮、跨路由）。
7. **脚本**：`sync-tutorials.mjs` + 首次全量抓取 13 篇。
8. **验收**：typecheck / lint / vitest / build；Cloudflare 根路径部署回归。


---

## 10. 实现状态（2026-10-26）

已完成并逐页用无头浏览器验证（1440×900，控制台无报错）：

| 模块 | 状态 | 说明 |
|---|---|---|
| 工程骨架 | ✅ | React 19.3 / Vite 8 / TanStack Router 1.170（file-based）/ Tailwind 4.3 / Base UI + Luma |
| 设计令牌 | ✅ | zinc + 紫 `oklch(0.541 0.247 293)`、Luma `--radius: 0.45rem`、D17 字体栈、ArcUI motion tokens |
| 悬浮导航 | ✅ | GooeyNav 导轨（激活项被 gap 推开、不共享轨道底色）+ 免费专区 + 更多下拉；移动端 Sheet |
| 主题切换 | ✅ | View Transitions circle-blur，700ms；无 API 时降级 |
| 页脚 | ✅ | 单行：品牌 + 链接 + 版权 |
| 主页 | ✅ | Hero（单 CTA）+ Spotlight 3 + Bento 6 |
| 客户端 | ✅ | `/clients` OS 按钮（ArcUI Button 手感）+ Card 5 结构；`/clients/categories` OS 筛选 Tabs |
| 机场推荐 | ✅ | 顶部包月/按流量筛选 + 价格 + 带 icon 特性 + 地区静态堆砌（可展开） |
| 免费专区 | ✅ | `/free` 选择页（插画 + 3 卡）；`/free/subscriptions`、`/free/nodes`、`/free/vpn` 共用滑动 Tab |
| 共享订阅 | ✅ | Billing Overview 结构；流量走 allorigins，并发 2，失败可刷新 |
| 技术教程 | ✅ | sitemap 驱动 + `data/tutorials.json`（12 篇）；`ignored` 过滤非中文页 |
| 教程同步 | ✅ | `scripts/sync-tutorials.mjs`（渲染取标题/首段、重试、`--refresh`） |
| 引导链路 | ✅ | 首次 Dialog（SVG 插画）+ 5 步 Stepper（右下角/移动端顶部、可最小化、跨路由） |
| 统计隔离 | ✅ | 生产 + 正式域名 + 非自动化 + 未 opt-out 才注入 |
| 质量门 | ✅ | `typecheck` / `lint`（0 warning）/ `build` 全绿 |

### 10.1 收尾验证结果

| 项 | 结果 |
|---|---|
| 首屏拆分 | 主包 154 KB（gzip 46 KB），`vendor-react` 218 KB、`vendor-ui` 287 KB、`vendor-router` 75 KB，无 >500 KB 警告 |
| WCAG 审计 | axe（wcag2a/2aa/2.1a/2.1aa）在 `/`、`/clients`、`/recommend`、`/tutorials`、`/free`、`/free/subscriptions` 全部 **clean**；修复项：`--muted-foreground` 加深至 `oklch(0.502 0.013 285.9)`、`--success` 改 green-700、`--destructive` 改 red-700、`StarRating` 补 `role="img"`、去掉 `text-muted-foreground/80` |
| 键盘 | 首次弹窗 Esc 可关；Base UI Dialog 自带焦点管理（`role=dialog`） |
| 生产预览 | `vite preview` 下 `/`、`/clients`、`/free/subscriptions` 深链均 200 且渲染正常，资源为根路径 `/assets/*` |
| 缓存头 | `public/_headers` + `public/_redirects` 已随构建进入 `dist/` |
| 共享订阅流量 | **数据源不可用**：直接请求 403、allorigins 522、唯一 200 的订阅体为空且无 `subscription-userinfo`。代码路径保留，UI 明确显示「流量不可用」；需要服务端代理才能恢复 |

剩余：Cloudflare 实际部署与线上缓存头核对（需要账号权限）。
