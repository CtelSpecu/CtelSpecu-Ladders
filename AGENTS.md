# AGENTS.md

本仓库是「星空之镜 / CtelSpecu Ladders」导航站。技术栈：**React 19 + Vite + TanStack Router（file-based）+ Tailwind 4 + shadcn/ui（Base UI 底座）+ motion**。

`spec.md` 是唯一需求真相源；`DESIGN.md` 记录的是**旧 Vue 版本**的设计系统，仅作历史参考，**不要照它实现**。

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
| `data/tutorials.json` | 教程 slug → 标题 / 摘要 / 标签 / 日期 | 脚本生成 + 人工修正 |
| `src/data/clients.json` | 客户端（分类、平台、下载、教程链接） | 手工 |
| `src/data/providers.json` | 机场（计费、特性、地区 ISO 码） | 手工 |
| `src/data/freeNodes.json` | 免费订阅链接分组 | 手工 |
| `src/data/freeVpns.json` | 免费 VPN 分组与评分 | 手工 |
| `public/subscriptions.json` | 共享订阅清单（运行时 fetch） | 手工 |

`providers.json` 的计费只剩两种：**包月** 与 **按流量**。长期订阅价格已按产品决定移除，不要再加回来。

---

## 3. 设计系统约束

- 风格：**shadcn Luma + zinc 基色 + 紫 `#7c3aed` primary**。禁止恢复旧版的青色/洋红霓虹、极光径向背景、orb 紫玫瑰光斑、玻璃拟态。
- 字体：只用 `--font-sans` / `--font-mono` 两个令牌（定义见 `src/index.css`）。不要引入 Inter / Oxanium。
- **`src/components/ui/**` 是 shadcn 原语，不得魔改**。需要不同外观时，在 `src/components/motion/**` 组合出新组件，或通过 `className` 局部覆盖。
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
| `/recommend` | 机场推荐 | 顶部「包月 / 按流量」Tab 作筛选 |
| `/tutorials` | 技术教程 | sitemap 驱动，Card 7 结构 |
| `/free/subscriptions` | 共享订阅 | |
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

---

## 7. 禁止事项

- 不要新增 Vue 文件或改回 Vue —— 旧实现已归档到 `backup/vue3-legacy-2026-10-26`。
- 不要把 `api.allorigins.win` 的流量查询换成没有降级方案的直连（订阅源无 CORS）。
- 不要在 `data/tutorials.json` 里写 slug 生成的英文标题。
- 不要为「长期订阅」重新加回价格字段。
- 不要把 `src/components/ui/**` 当业务组件改样式。


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
| `_headers` | 缓存与安全头：`/assets/*` 永久缓存（文件名带 hash），`/index.html` 不缓存，`/flags/*` 与 `/icon.svg` 7 天，`/subscriptions.json` 5 分钟；附 `nosniff` / `Referrer-Policy` / `Permissions-Policy` / `X-Frame-Options` |

`bun run deploy`（gh-pages）是旧 GitHub Pages 流程，**不是**现在的发布方式；除非明确要回退，不要用它覆盖线上。

发布前自检：

```bash
bun run build
bunx vite preview --port 5181     # 逐页点一遍深链，确认刷新不 404
```

## 9. 已知限制

- **共享订阅的实时流量目前拿不到**：订阅端点直接访问返回 403，`allorigins` 代理返回 522，唯一 200 的订阅体为空、没有 `subscription-userinfo` 响应头。代码路径已保留（拿得到就会显示），页面会明确标注「流量不可用」。要真正启用，需要一个能带自定义 UA 并回传响应头的服务端代理（例如同域 Cloudflare Worker），然后改 `src/lib/data/subscriptions.ts` 里的 `PROXY`。
- 教程页的摘要与标签为空：文章页会同时渲染多个文章容器，首段无法可靠归属，宁缺勿错。需要时手工补 `data/tutorials.json` 的 `summary`。
