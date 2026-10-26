/**
 * 「选择你的情况」插画：柔和渐变光斑 + 几何色块（Luma 语言）。
 * 纯 SVG，颜色全部取自主题变量，深浅色自动适配。
 */
export function ChoiceIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 260"
      role="img"
      aria-label="三种免费资源的选择示意"
      className={className}
    >
      <defs>
        <linearGradient id="choice-blob-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="choice-blob-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--info)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--info)" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="choice-blob-c" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--success)" stopOpacity="0.26" />
          <stop offset="100%" stopColor="var(--success)" stopOpacity="0.03" />
        </linearGradient>
        <filter id="choice-soften" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="choice-soften-sm" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* 背景色块 */}
      <rect x="24" y="18" width="472" height="224" rx="28" fill="var(--muted)" opacity="0.55" />
      <rect
        x="44"
        y="38"
        width="432"
        height="184"
        rx="20"
        fill="none"
        stroke="var(--border)"
        strokeDasharray="4 6"
      />

      {/* 光斑 */}
      <circle cx="118" cy="86" r="58" fill="url(#choice-blob-a)" filter="url(#choice-soften)" />
      <circle cx="404" cy="96" r="52" fill="url(#choice-blob-b)" filter="url(#choice-soften)" />
      <circle cx="268" cy="206" r="62" fill="url(#choice-blob-c)" filter="url(#choice-soften)" />

      {/* 三个几何卡片 */}
      <g>
        <rect
          x="76"
          y="96"
          width="104"
          height="76"
          rx="14"
          fill="var(--card)"
          stroke="var(--border)"
        />
        <circle cx="98" cy="118" r="8" fill="var(--primary)" opacity="0.18" />
        <path
          d="M94 118h8M98 114v8"
          stroke="var(--primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect x="94" y="136" width="56" height="6" rx="3" fill="var(--foreground)" opacity="0.18" />
        <rect x="94" y="148" width="36" height="6" rx="3" fill="var(--foreground)" opacity="0.1" />
      </g>

      <g>
        <rect
          x="208"
          y="78"
          width="104"
          height="94"
          rx="14"
          fill="var(--card)"
          stroke="var(--primary)"
          strokeOpacity="0.45"
          strokeWidth="1.4"
        />
        <circle cx="230" cy="100" r="8" fill="var(--primary)" opacity="0.2" />
        <path
          d="M226 100a4 4 0 0 1 8 0M230 96v1"
          stroke="var(--primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect x="226" y="118" width="62" height="6" rx="3" fill="var(--foreground)" opacity="0.2" />
        <rect x="226" y="130" width="44" height="6" rx="3" fill="var(--foreground)" opacity="0.12" />
        <rect
          x="226"
          y="144"
          width="46"
          height="14"
          rx="7"
          fill="var(--primary)"
          opacity="0.16"
        />
      </g>

      <g>
        <rect
          x="340"
          y="96"
          width="104"
          height="76"
          rx="14"
          fill="var(--card)"
          stroke="var(--border)"
        />
        <circle cx="362" cy="118" r="8" fill="var(--info)" opacity="0.18" />
        <path
          d="M358 118h8M362 114v8"
          stroke="var(--info)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <rect x="358" y="136" width="56" height="6" rx="3" fill="var(--foreground)" opacity="0.18" />
        <rect x="358" y="148" width="30" height="6" rx="3" fill="var(--foreground)" opacity="0.1" />
      </g>

      {/* 连接线与节点 */}
      <path
        d="M180 134h28M312 126h28"
        stroke="var(--border)"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
      <circle cx="194" cy="134" r="3" fill="var(--primary)" />
      <circle cx="326" cy="126" r="3" fill="var(--info)" />

      {/* 几何点缀 */}
      <rect
        x="452"
        y="52"
        width="14"
        height="14"
        rx="4"
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.4"
        transform="rotate(18 459 59)"
      />
      <circle cx="66" cy="196" r="9" fill="none" stroke="var(--border)" strokeWidth="2" />
      <circle cx="468" cy="188" r="5" fill="var(--primary)" opacity="0.35" />
      <path
        d="M150 62l4.8 9.6 10.6 1.5-7.7 7.5 1.8 10.6-9.5-5-9.5 5 1.8-10.6-7.7-7.5 10.6-1.5z"
        fill="var(--primary)"
        opacity="0.22"
        filter="url(#choice-soften-sm)"
      />
    </svg>
  )
}
