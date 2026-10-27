# AGENTS.md

本仓库是「星空之镜 / CtelSpecu Ladders」导航站。技术栈：**React 19 + Vite + TanStack Router（file-based）+ Tailwind 4 + shadcn/ui（Base UI 底座）+ motion**。

`spec.md` 是唯一需求真相源；`DESIGN.md` 记录的是**旧 Vue 版本**的设计系统，仅作历史参考，**不要照它实现**。

> **内容红线：不得出现台湾节点/地区。**
> 机场地区列表、节点展示、任何新增数据源都必须排除 `tw`。
> 代码层面的强制点：`src/lib/data/providers.ts` 在 zod 解析后过滤 `EXCLUDED_REGIONS`，
> 即使上游数据重新带回 `tw` 也不会渲染。新增地区相关功能时同样走这个过滤，
> 不要只在界面上隐藏。

---

## 1. 强制流程：推送前同步教程索引

教程页 `/tutorials` 的数据来自远端 sitemap，而文章标题只有执行 JS 后才能拿到。因此**每次 `git push` 之前必须执行**：

```bash
bun run sync:tutorials            # 只补新增
bun run sync:tutorials:refresh    # 换了抽取规则时全量重抓
```

无头浏览器默认用 Playwright 自带的 chromium；本机已装系统 chromium 时可复用：

```bash
CHROMIUM_PATH=/usr/bin/chromium-browser bun run sync:tutorials
```

退出码含义：

| 退出码 | 含义 | 动作 |
|---|---|---|
| `0` | 无新增文章 | 可直接推送 |
| `2` | 发现新增 slug，需补数据 | 按第 2 节补齐 `data/tutorials.json`，再跑一次直到 `0` |
| `1` | 网络/解析失败 | 修复后再推，**不得**跳过 |

### 为什么必须用浏览器抓

- `https://ctelspecu.hxcn.top/sitemap.xml` 可跨域读取，但**只有 `<loc>` / `<lastmod>`，没有标题**。
- 文章页返回 ~3.1 KB 的 SPA 空壳，`<title>`、`<h1>` 为空；Googlebot UA 也不预渲染。
- 无 RSS / Atom / `search.xml` / `content.json`（全部命中 History fallback）。

因此脚本对每个新 slug 用 Playwright（chromium）打开页面，读取渲染后的 `document.title`、`h1`、`meta[name=description]`、标签与日期，再写回 `data/tutorials.json`。

### 抓取规则

- 标题**禁止**由 slug 推导（`proxy-subscription-guide` ≠ 中文标题）。
- 已存在于 `data/tutorials.json` 的条目**不得覆盖**——人工修正优先。
- 只提交 `data/tutorials.json`（可附带 `scripts/sync-tutorials.mjs` 的修复），提交信息用 `chore(tutorials): sync N new posts`。
- 抓取结果里出现乱码/空标题时，**判失败**，不要写入占位值。
- 非中文或占位页（如 `hello-world`）会被跳过，并记入 `data/tutorials.json` 的 `ignored` 数组；页面同样不渲染它们。不要手工删掉 `ignored`，否则每次同步都会重新尝试。
- 摘要与标签当前一律留空：文章页会同时渲染多个文章容器，首段无法可靠归属，宁可空着也不要挂错文案。需要时手工补 `summary`，脚本不会覆盖已有条目（除非 `--refresh`）。

---

## 2. 数据文件

| 文件 | 内容 | 维护方式 |
|---|---|---|
| `src/data/tutorials.json` | 教程 slug → 标题 / 摘要 / 标签 / 日期 | 脚本生成 + 人工修正 |
| `src/data/clients.json` | 客户端（分类、平台、下载、教程链接、logo） | 手工；logo 来自 huarun.win，**下载链接只指向官方仓库/官网，不用聚合站跳转** |
| `src/data/providers.json` | 机场（计费、特性、地区 ISO 码、logo） | 手工；logo 来自各机场官网 |
| `src/data/freeNodes.json` | 免费订阅链接分组 | 手工 |
| `src/data/freeVpns.json` | 免费 VPN 分组与评分 | 手工 |
| `src/data/subscriptions.json` | 共享订阅清单（随包发布，直接 import，不再运行时 fetch） | 手工 |
| `src/data/announcements.json` | 公告（标题、内容、频率、展示时长、起止时间） | 手工 |

**所有数据文件都放在 `src/data/`**，不要新建根目录 `data/`，也不要把数据丢进 `public/` 再 fetch —— 会变成两套写法。

`providers.json` 的计费有四种：**包月 / 按流量 / 年付 / 季付**，Tab 顺序即此顺序。

- `price` 是该周期的实付金额，`traffic` 是该套餐的流量。
- 流量口径必须写清楚：周期套餐里**每月给多少**写成 `50G/月`；整周期总量就写 `1T`，
  不要用同一个字段混着表示两种含义。

### 2.1 公告（announcements）

`src/data/announcements.json` → `src/lib/announcements.ts`（zod 校验 + 可见性判断）→ `AnnouncementHost` 用 sonner 逐条弹出。

| 字段 | 说明 |
|---|---|
| `order` | 展示顺序，小的先弹；同时只会有一条在屏幕上 |
| `title` / `content` | `content` 支持行内 Markdown：`**加粗**`、`*斜体*`、`~~删除线~~`、`==高亮==`、`` `代码` ``、换行 |
| `publishedAt` | 发布时间，早于它的不弹 |
| `expiresAt` | `null` 表示永久；过了时间自动不再弹 |
| `frequency` | `always` 每次进站都弹（仍受免打扰约束）／`daily` 每天一次／`interval` 距上次 N 小时·天·周·月／`until` 显示到指定时间／`duration` 发布后 N 小时·天·周·月内 |
| `duration` | 停留时长：`seconds` / `minutes` / `hours` / `sticky`（一直显示，只能手动关） |

交互约束：

- **首访弹窗没关之前不弹公告**（新手 / 老手都算）；`AnnouncementHost` 监听 `useOnboarding().dialogOpen`。
- 关掉一条或它自然消失后，才弹下一条。
- 底部是 Arc 风格的 SplitButton：主按钮「今天不提示」，下拉是「七天内不提示」「关闭此公告」。
- 免打扰记录写在 `localStorage['ctelspecu:announcements']`（`hiddenUntil` / `closed` / `lastShownAt`），不做服务端同步。

---

## 3. 设计系统约束

- 风格：**shadcn Luma + zinc 基色 + 紫 `#7c3aed` primary**。禁止恢复旧版的青色/洋红霓虹、极光径向背景、orb 紫玫瑰光斑、玻璃拟态。
- 字体：只用 `--font-sans` / `--font-mono` 两个令牌（定义见 `src/index.css`）。不要引入 Inter / Oxanium。
- **`src/components/ui/**` 是 shadcn 原语，不得魔改**。需要不同外观时，在 `src/components/motion/**` 组合出新组件，或通过 `className` 局部覆盖。
- **参考组件（Arc / ReUI / 21st 等）只学功能、动画与排版，不学皮肤**：一律用 shadcn 原语 + 本站令牌重写，
  不要复刻参考站的渐变底、发光、异形圆角与阴影，也不要直接粘贴第三方组件源码。已经踩过一次：公告的 SplitButton 只借鉴
  Arc 的交互（主操作 + 下拉变体），样式仍用 `Button` / `DropdownMenu` 的组合。
- 浮层层级：`DropdownMenuContent` 走 Portal，Positioner 默认 `z-50`；sonner 的 toaster 是 `z-index: 100`。
  **从 toast 内部打开的菜单必须传 `positionerClassName="z-[200]"`**，否则会被 toast 卡片盖住。
- 动效统一走 `src/lib/motion-tokens.ts`（ArcUI 令牌）：
  - 时长 `instant 0.12 / fast 0.16 / exit 0.18 / standard 0.24 / considered 0.48`
  - 缓动 `enter [0.16,1,0.3,1]`、`exit [0.7,0,0.84,0]`、`standard [0.22,1,0.36,1]`
  - spring `snappy / smooth / morph` 三档
- 所有动效必须响应 `prefers-reduced-motion`。
- 圆角只从 `--radius` 派生；阴影只用 Luma 的 soft elevation 层级。

---

## 4. 目录与路由

| 路由 | 页面 | 备注 |
|---|---|---|
| `/` | 主页 | Hero + Spotlight 3 + Bento 5 + 页脚 |
| `/clients` | 客户端下载（按 OS 推荐） | OS 选择按钮 = ArcUI Button |
| `/clients/categories` | 内核分类（Clash / V2Ray） | 顶部 OS 筛选 Tabs；不进主导航，由 `/clients` 内按钮进入 |
| `/recommend` | 机场推荐 | 顶部「包月 / 按流量 / 年付 / 季付」Tab 作筛选 |
| `/tutorials` | 技术教程 | sitemap 驱动，Card 7 结构 |
| `/free/subscriptions` | 共享订阅 | 卡片按清单编号排序，每行最多 3 个 | |
| `/free/nodes` | 免费订阅 | |
| `/free/vpn` | 免费 VPN | |
| `/onboarding` | 新手引导 | 可重入；Stepper 为全局悬浮层 |

`basepath = '/'`（线上 `https://ladders.ctelspecu.hxcn.top/`）。任何静态资源引用都要走 `import.meta.env.BASE_URL`，禁止写死 `/flags/...` 之外的绝对路径假设。

---

## 5. 引导状态

- `localStorage` 键：`ctelspecu:onboarding`
- 结构：`{ mode: 'newbie' | 'veteran', step: number, branch?: 'paid' | 'free', doneAt?: string }`
- 首次访问无该键 → 弹首次选择 Dialog。
- 选择「新手」→ 启动 Stepper（第 1 步）；选择「老手」→ 直接进落地页，不启动 Stepper。
- Navbar「新手引导」永远可重入，重入时从第 1 步开始，但不清除 `mode`。
- Stepper 跨路由保留，不因导航重置。

---

## 5.1 统计（Umami）与自动化隔离

站点统计由 `src/lib/analytics.ts` 注入，**不得**改回 `index.html` 里的静态 `<script>` 标签。

加载条件（四者同时成立）：

1. `import.meta.env.PROD` —— 本地 dev / preview 不计；
2. `location.hostname === 'ladders.ctelspecu.hxcn.top'` —— 其它域名不计；
3. `!navigator.webdriver` —— Playwright / Puppeteer / Selenium 等自动化浏览器不计；
4. 未设置 `localStorage['umami.disabled'] === '1'` —— 尊重 Umami 官方的手动排除开关。

脚本标签同时设置 `data-domains`，作为服务端侧的第二道保险。

### 官方排除方式（站点所有者 / Agent 手动使用）

来源：<https://docs.umami.is/docs/exclude-my-own-visits>

在目标站点的开发者工具 Console 里执行，**按站点生效**，换域名需重做：

```js
localStorage.setItem('umami.disabled', 1); // 排除本浏览器
localStorage.removeItem('umami.disabled'); // 恢复统计
```

Agent 在真实浏览器里访问**生产域名**做验证前，必须先设置该 flag；本地 `127.0.0.1` 由条件 1 与 2 直接拦住，无需额外操作。

规则：

- **Agent 巡检、截图、E2E 一律不得污染统计。** 不要为了「让页面看起来正常」而移除外层 guard。
- 不要用 `--disable-blink-features=AutomationControlled` 之类的启动参数伪装成真人；如果确实需要绕过 `navigator.webdriver`，必须同时把访问域名指向非生产域名。
- 需要验证统计是否生效时，用 Umami 面板确认，或临时构建后在**非生产域名**验证；临时改动不得提交。
- 新增页面不需要自己上报 pageview —— 根路由已按 pathname 统一调用 `trackPageview`。
- 统计调用必须包在 try/catch 里，失败不得影响页面渲染。

---

## 6. 提交前自检

```bash
bun run typecheck     # tsc --noEmit
bun run lint          # eslint
bun run test          # vitest run
bun run sync:tutorials # 见第 1 节，退出码必须为 0
```

任一项失败不得推送。

**推送前还要检查公告**：跑一下 `expiredAnnouncements()`（或直接看 `src/data/announcements.json` 的 `expiresAt`）。
有已过期的条目时**先 ask 用户是否清理**；确认后删掉过期条目，并把剩余条目的 `order` 依次前移补齐（1、2、3…）。

---

## 7. 禁止事项

- 不要新增 Vue 文件或改回 Vue —— 旧实现已归档到 `backup/vue3-legacy-2026-10-26`。
- 不要把 `api.allorigins.win` 的流量查询换成没有降级方案的直连（订阅源无 CORS）。
- 不要在 `src/data/tutorials.json` 里写 slug 生成的英文标题。
- 不要为「长期订阅」重新加回价格字段。
- 不要把 `src/components/ui/**` 当业务组件改样式；参考站的设计稿只用来抄交互，不抄皮。
- 不要往根目录 `data/` 或 `public/` 里新增数据文件，统一放 `src/data/`。


---

## 8. 部署与缓存

生产环境：**Cloudflare，域名根路径** `https://ladders.ctelspecu.hxcn.top/`。
Vite `base` 必须是 `/`；任何静态资源引用都要走 `import.meta.env.BASE_URL`，不要写死项目子路径。

**构建环境必须 Node ≥ 20.19**（Vite 8 的 rolldown 用到 `node:util.styleText`）。
仓库用 `.node-version` / `.nvmrc` 锁定 22；若 Pages 仍回落到 18，去项目的
Environment variables 里显式设 `NODE_VERSION=22`。

构建产物里已包含两个 Cloudflare 约定文件（源码在 `public/`，随构建复制到 `dist/`）：

| 文件 | 作用 |
|---|---|
| `_redirects` | `/*  /index.html  200` —— SPA 深链刷新回退 |
| `_headers` | 缓存与安全头：`/assets/*` 永久缓存（文件名带 hash），`/index.html` 不缓存，`/flags/*` 与 `/icon.svg` 7 天；附 `nosniff` / `Referrer-Policy` / `Permissions-Policy` / `X-Frame-Options` |

`bun run deploy`（gh-pages）是旧 GitHub Pages 流程，**不是**现在的发布方式；除非明确要回退，不要用它覆盖线上。

发布前自检：

```bash
bun run build
bunx vite preview --port 5181     # 逐页点一遍深链，确认刷新不 404
```

## 9. 已知限制

- **共享订阅的实时流量目前拿不到**：订阅端点直接访问返回 403，`allorigins` 代理返回 522，唯一 200 的订阅体为空、没有 `subscription-userinfo` 响应头。代码路径已保留（拿得到就会显示），页面会明确标注「流量不可用」。要真正启用，需要一个能带自定义 UA 并回传响应头的服务端代理（例如同域 Cloudflare Worker），然后改 `src/lib/data/subscriptions.ts` 里的 `PROXY`。
- 教程页的摘要与标签为空：文章页会同时渲染多个文章容器，首段无法可靠归属，宁缺勿错。需要时手工补 `data/tutorials.json` 的 `summary`。


---

## 10. 项目结构

```
src/
  routes/                       # TanStack Router file-based，一个文件一个路由
    __root.tsx                  # 主题 + 引导 Provider、Navbar、Footer、全局 Dialog/Stepper
    index.tsx                   # 主页
    clients/index.tsx           # 客户端下载（按系统）
    clients/categories.tsx      # 内核分类（Clash / V2Ray / 其他）+ 系统筛选
    recommend.tsx               # 机场推荐（?billing=monthly|traffic）
    tutorials.tsx               # 技术教程（sitemap 驱动）
    free.tsx                    # 免费专区外壳（标题 + 滑动 Tab + Outlet）
    free/index.tsx              # 选择页（插画 + 三张入口卡）
    free/subscriptions.tsx      # 共享订阅
    free/nodes.tsx              # 免费订阅
    free/vpn.tsx                # 免费 VPN
    onboarding.tsx              # 新手引导说明页（可重入）
  components/
    brand/                      # SiteIcon（站点图标）、OsIcon（8 个系统图标）
    ui/                         # shadcn 原语（Base UI 底座，禁止魔改）
    motion/                     # 动效组件：gooey-nav / theme-toggle / sliding-tabs / os-switcher
    layout/                     # navbar / app-footer
    cards/                      # client-card / star-rating
    onboarding/                 # provider（状态机）、first-visit-dialog、stepper
    illustrations/              # choice-illustration / welcome-illustration / hero-visual
  lib/
    data/                       # clients / providers / free / subscriptions（zod 校验）
    theme.tsx                   # 主题（class + View Transitions）
    tutorials.ts                # sitemap 拉取 + 本地标题合并
    analytics.ts                # Umami 注入与 pageview
    use-subscriptions.ts        # 订阅 + 流量 hook
    motion-tokens.ts            # ArcUI 动效令牌
    nav.ts                      # 导航与 Tab 配置（单一来源）
    utils.ts                    # cn()
  index.css                     # Luma 令牌、字体、语义变量
  data/                         # 全部数据文件（clients / providers / tutorials / subscriptions / announcements …）
public/
  flags/                        # 国家/地区旗帜（20×13，@2x）
  logos/clients/                # 客户端图标（webp / png）
  logos/providers/              # 机场图标（svg / png / ico）
  logos/vpn/                    # 免费 VPN 图标
scripts/
  sync-tutorials.mjs            # 教程索引同步（--refresh 全量）
  fetch-vpn-logos.mjs           # VPN 图标抓取
  fetch-flags.mjs               # 旗帜资源
```

### 数据流

`JSON → zod（src/lib/data/*）→ 页面组件`。所有外部数据在模块顶层 `parse`，字段缺失直接抛错而不是静默降级；新增字段一律给默认值或标 `optional()`。

- 客户端：`clients.json` 的 `platforms` 决定它出现在哪些系统下；`recommendedByOs` 决定排序。
- 机场：`billing` 允许 `monthly | traffic | yearly | quarterly`（包月 / 按流量 / 年付 / 季付）；`regions` 是 ISO 3166-1 alpha-2，
  **解析层强制过滤 `tw`**，并按 `hk, jp, sg, us, gb, my` 优先排序（其余保持数据顺序）。
- 教程：sitemap 提供 URL 与 lastmod，`src/data/tutorials.json` 提供标题；`ignored` 数组里的 slug 不渲染。
- 公告：见下节。

---

## 11. 组件设计

### 分层

| 层 | 位置 | 规则 |
|---|---|---|
| 原语 | `components/ui/**` | shadcn 生成物，**不改**；需改外观时通过 `className` 或在外层组合 |
| 动效 | `components/motion/**` | 一个组件一种交互，动效参数只从 `lib/motion-tokens.ts` 取 |
| 业务卡 | `components/cards/**` | 只接收数据 + 渲染，不自己取数 |
| 布局 | `components/layout/**` | 导航与页脚，数据来自 `lib/nav.ts` |
| 插画 | `components/illustrations/**` | 纯 SVG，颜色只用 `var(--*)`，深浅色自动适配 |

### 关键组件

| 组件 | 职责 | 交互约束 |
|---|---|---|
| `GooeyNav` | 主导航导轨 | 未激活项共用一条 muted 轨道；激活项由 gap 推开、用 SVG「粘液颈」连接，**不共享轨道底色**；spring 200/28 |
| `ThemeToggle` | 深浅色切换 | View Transitions `circle-blur`，700ms，从按钮位置圆形揭开；无 API 或 `prefers-reduced-motion` 时瞬时切换 |
| `SlidingTabs` | 路由型 / 状态型 Tab | 共用一个 `layoutId` 指示器，切换时平移；支持 `to`（导航）与 `value`（回调） |
| `OsSwitcher` | 系统选择 | 复刻 ArcUI ExpandingButtonGroup：**只有点击（选中）才展开标签**，hover 不展开；8 个系统 |
| `FirstVisitDialog` | 首访分流 | 顶部插画；两枚按钮写入 localStorage；关闭视为老手 |
| `OnboardingStepper` | 5 步引导 | 桌面右下角悬浮、移动端顶部可折叠（**默认展开**）；线性前进、可回看、可最小化；跨路由保留；第 3 步选择计费方式后跳 `/recommend?billing=` |
| `ClientCard` | 客户端卡（Card 5） | logo + 名称 + 平台大字位 + ✓ 清单 + 贴底按钮；无规格行 |
| `ProviderCard` | 机场卡 | 顶部图标 + 名称；标签白名单见下；特性列表下方可有一行 `summary`；地区最多两行，超出时右上角「查看全部节点」打开 Dialog。宽度测量用隐藏 ghost chip（不请求旗帜图片），225 个地区也只加载可见的几张旗 |
| `StarRating` | 星级 | `role="img"` + `aria-label` |
| `SplitButton` | 主操作 + 下拉变体 | 两段式按钮，主按钮跑默认动作、chevron 开 `DropdownMenu`；从 toast 内使用时传 `positionerClassName="z-[200]"` |
| `AnnouncementHost` | 公告队列 | 首访弹窗关闭后启动，按 `order` 逐条 `toast.custom`，关闭/超时才弹下一条；免打扰写 localStorage |
| `Toaster`（`ui/sonner`） | 轻提示 | sonner v2 封装，挂在 `__root`；右上角、5s 自动关闭、带关闭按钮、最多同时 3 条堆叠、`offset=84` 避开悬浮导航；配色走 `--popover/--border` |
| `RotatingText` | 轮播文字（hero 标题的目标人群） | 3s 一换；所有候选叠在同一网格单元，宽度取最宽项，切换只做淡入淡出，不引起排版跳动；非当前项 `aria-hidden`；`prefers-reduced-motion` 时取消位移 |
| `EntryArt` | 首页「从这里开始」入口插画 | 弥散光斑 + 细点阵 + 虚线环 + 图标胶囊，6 个 variant 各一组主题色；纯装饰、`aria-hidden` |

### 视觉约束（硬性）

- **卡片不做 hover 上浮、不加 `--shadow-lift` 大阴影**；只保留 `transition-colors` 与 `hover:border-primary/45`。
- **机场标签只有白名单加强调色**：`纯净IP` `性价比高` `性价比最高` `家宽` `大流量`
  用 `border-tag-border` + `bg-tag-bg` + `text-tag-fg`（浅色紫，深色浅紫），其余标签（`高速` `稳定` `中转` `直连`
  `BPG` `蜂窝网络` `星链网络` `节日优惠`）保持 `bg-muted` 灰色。白名单在 `src/routes/recommend.tsx` 的
  `EMPHASIZED_TAGS`，新增标签先决定是否进白名单。
- 颜色只走语义令牌（`bg-card` / `text-muted-foreground` / `border-border` / `text-primary`）；新增色必须先改 `index.css` 的 `:root` 与 `.dark`。
- 圆角从 `--radius` 派生；动效时长用 `--duration-*` 或 motion tokens。
- 所有图标：系统图标用 `OsIcon`（Iconify 单路径），业务图标用 lucide，站点标识用 `SiteIcon`。


---

## 12. 内容红线（再次强调）

| 规则 | 落点 |
|---|---|
| 不展示台湾节点 / 地区 | `src/lib/data/providers.ts` 的 `EXCLUDED_REGIONS`（`tw`），解析后过滤；渲染层不再兜底 |
| 不编造能力描述 | 客户端描述取自 huarun.win 的官方简介；机场特性由 badges 映射，不写「全球加速」这类空话 |
| 拿不到的数据要说明 | 共享订阅流量取 `subscription-userinfo`，接口不返回就显示「流量不可用」，不填假数字 |
