/**
 * Umami 统计的自托管接入。
 *
 * 只在「生产构建 + 正式域名 + 非自动化浏览器」三者同时满足时才加载脚本，
 * 避免本地开发、无头浏览器截图、CI 与 Agent 巡检污染统计数据。
 */

const UMAMI_SRC = 'https://analytics.hxcn.dev/script.js'
const UMAMI_WEBSITE_ID = 'f323c9e1-10ca-4406-a415-3f31e2aacb16'
const ALLOWED_HOSTS = ['ladders.ctelspecu.hxcn.top']

type Umami = {
  trackView?: (url: string) => void
  track?: (event: string, data?: Record<string, unknown>) => void
}

declare global {
  interface Window {
    umami?: Umami
  }
}

function isOptedOut() {
  // Umami 官方排除方式：localStorage['umami.disabled'] = 1
  // https://docs.umami.is/docs/exclude-my-own-visits
  try {
    return localStorage.getItem('umami.disabled') === '1'
  } catch {
    return false
  }
}

function shouldTrack() {
  if (!import.meta.env.PROD) return false
  if (typeof window === 'undefined') return false
  // Playwright / Puppeteer / Selenium 等自动化环境
  if (navigator.webdriver) return false
  // 站点所有者/维护者手动排除
  if (isOptedOut()) return false
  return ALLOWED_HOSTS.includes(window.location.hostname)
}

export function initAnalytics() {
  if (!shouldTrack()) return
  if (document.querySelector('script[data-website-id]')) return

  const script = document.createElement('script')
  script.defer = true
  script.src = UMAMI_SRC
  script.dataset.websiteId = UMAMI_WEBSITE_ID
  // 双保险：即使脚本被别处注入，服务端也只接受这些域名的事件
  script.dataset.domains = ALLOWED_HOSTS.join(',')
  document.head.appendChild(script)
}

/** SPA 路由切换时补记一次 pageview（脚本自身只在首屏自动上报）。 */
export function trackPageview(path: string) {
  if (!shouldTrack()) return
  try {
    window.umami?.trackView?.(path)
  } catch {
    // 统计失败不得影响页面
  }
}
