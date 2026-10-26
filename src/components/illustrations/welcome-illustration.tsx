/**
 * 首次访问弹窗顶部插画：柔和渐变光斑 + 几何色块 + 一条三步路径。
 * 与首页/免费专区插画同一套语言，颜色全部取自主题变量。
 */
export function WelcomeIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 200" role="img" aria-label="三步完成配置" className={className}>
      <defs>
        <linearGradient id="welcome-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="welcome-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--info)" stopOpacity="0.26" />
          <stop offset="100%" stopColor="var(--info)" stopOpacity="0.03" />
        </linearGradient>
        <filter id="welcome-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <rect x="0" y="0" width="520" height="200" fill="var(--muted)" opacity="0.5" />
      <circle cx="96" cy="54" r="52" fill="url(#welcome-a)" filter="url(#welcome-blur)" />
      <circle cx="436" cy="150" r="58" fill="url(#welcome-b)" filter="url(#welcome-blur)" />

      {/* 路径 */}
      <path
        d="M96 132 C 176 132, 176 84, 260 84 S 344 128, 424 128"
        fill="none"
        stroke="var(--border)"
        strokeWidth="2"
        strokeDasharray="5 6"
      />

      {/* 三个节点 */}
      <g>
        <circle cx="96" cy="132" r="16" fill="var(--card)" stroke="var(--border)" />
        <circle cx="96" cy="132" r="5" fill="var(--primary)" />
      </g>
      <g>
        <circle cx="260" cy="84" r="20" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.6" />
        <path d="M255 84h10M260 79v10" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g>
        <circle cx="424" cy="128" r="16" fill="var(--card)" stroke="var(--border)" />
        <path d="M418 128l4 4 8-9" stroke="var(--primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* 小卡片与几何点缀 */}
      <rect x="150" y="34" width="76" height="34" rx="10" fill="var(--card)" stroke="var(--border)" />
      <rect x="162" y="46" width="38" height="5" rx="2.5" fill="var(--foreground)" opacity="0.16" />
      <rect x="162" y="56" width="24" height="5" rx="2.5" fill="var(--foreground)" opacity="0.09" />

      <rect x="316" y="46" width="86" height="38" rx="10" fill="var(--card)" stroke="var(--border)" />
      <rect x="328" y="58" width="46" height="5" rx="2.5" fill="var(--foreground)" opacity="0.16" />
      <rect x="328" y="68" width="30" height="5" rx="2.5" fill="var(--foreground)" opacity="0.09" />

      <rect
        x="452"
        y="52"
        width="14"
        height="14"
        rx="4"
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.4"
        transform="rotate(20 459 59)"
      />
      <circle cx="52" cy="64" r="6" fill="var(--primary)" opacity="0.3" />
      <circle cx="470" cy="96" r="4" fill="var(--info)" opacity="0.5" />
    </svg>
  )
}
