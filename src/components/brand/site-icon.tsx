import { useId } from 'react'

import { cn } from '@/lib/utils'

/**
 * 站点图标（地球 + 梯子）。
 * 已移除原稿的深色底板与背景渐变，只保留图形本体，
 * 因此深浅主题下都直接透出页面背景。
 */
export function SiteIcon({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const globe = `${uid}-globe`
  const inner = `${uid}-inner`
  const ladder = `${uid}-ladder`
  const rung = `${uid}-rung`
  const shadow = `${uid}-shadow`
  const ladderShadow = `${uid}-ladder-shadow`
  const glow = `${uid}-glow`

  return (
    <svg
      viewBox="0 0 512 512"
      role="img"
      aria-label="星空之镜"
      className={cn('block', className)}
    >
      <defs>
        <linearGradient id={globe} x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#0072FF" />
        </linearGradient>

        <radialGradient id={inner} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#0284C7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.05" />
        </radialGradient>

        <linearGradient id={ladder} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFDF00" />
          <stop offset="50%" stopColor="#FFA700" />
          <stop offset="100%" stopColor="#FF5E00" />
        </linearGradient>

        <linearGradient id={rung} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="100%" stopColor="#FF7700" />
        </linearGradient>

        <filter id={shadow} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.35" />
        </filter>

        <filter id={ladderShadow} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="-6" dy="8" stdDeviation="6" floodColor="#050814" floodOpacity="0.45" />
        </filter>

        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle cx="230" cy="270" r="190" fill={`url(#${globe})`} opacity="0.08" />

      <ellipse
        cx="230"
        cy="270"
        rx="195"
        ry="65"
        fill="none"
        stroke={`url(#${globe})`}
        strokeWidth="3"
        strokeDasharray="8 8"
        opacity="0.4"
        transform="rotate(-28 230 270)"
      />

      <g filter={`url(#${shadow})`} transform="translate(230, 270)">
        <circle cx="0" cy="0" r="145" fill={`url(#${inner})`} stroke={`url(#${globe})`} strokeWidth="10" />

        <ellipse cx="0" cy="0" rx="60" ry="145" fill="none" stroke={`url(#${globe})`} strokeWidth="6.5" opacity="0.85" />
        <ellipse cx="0" cy="0" rx="112" ry="145" fill="none" stroke={`url(#${globe})`} strokeWidth="5.5" opacity="0.6" />

        <rect x="-3.25" y="-145" width="6.5" height="290" fill={`url(#${globe})`} opacity="0.85" />
        <rect x="-145" y="-3.25" width="290" height="6.5" fill={`url(#${globe})`} opacity="0.85" />

        <path d="M -126 -70 Q 0 -42 126 -70" fill="none" stroke={`url(#${globe})`} strokeWidth="6.5" opacity="0.85" />
        <path d="M -126 70 Q 0 42 126 70" fill="none" stroke={`url(#${globe})`} strokeWidth="6.5" opacity="0.85" />

        <g filter={`url(#${glow})`}>
          <circle cx="-60" cy="0" r="9" fill="#FFFFFF" stroke="#00F2FE" strokeWidth="4" />
          <circle cx="0" cy="-56" r="8" fill="#FFFFFF" stroke="#00F2FE" strokeWidth="4" />
          <circle cx="55" cy="56" r="8" fill="#FFFFFF" stroke="#00F2FE" strokeWidth="4" />
          <circle cx="-102" cy="-65" r="7" fill="#00F2FE" />
          <circle cx="-98" cy="64" r="7" fill="#00F2FE" />
          <circle cx="0" cy="56" r="6" fill="#00F2FE" />
        </g>
      </g>

      <g filter={`url(#${ladderShadow})`} transform="translate(345, 255) rotate(22)">
        <g fill={`url(#${rung})`}>
          <rect x="-36" y="-117" width="72" height="14" rx="7" />
          <rect x="-36" y="-62" width="72" height="14" rx="7" />
          <rect x="-36" y="-7" width="72" height="14" rx="7" />
          <rect x="-36" y="48" width="72" height="14" rx="7" />
          <rect x="-36" y="103" width="72" height="14" rx="7" />
        </g>

        <g fill="#FFF6B7" opacity="0.55">
          <rect x="-26" y="-115" width="52" height="3" rx="1.5" />
          <rect x="-26" y="-60" width="52" height="3" rx="1.5" />
          <rect x="-26" y="-5" width="52" height="3" rx="1.5" />
          <rect x="-26" y="50" width="52" height="3" rx="1.5" />
          <rect x="-26" y="105" width="52" height="3" rx="1.5" />
        </g>

        <rect x="-43" y="-174" width="18" height="348" rx="9" fill={`url(#${ladder})`} />
        <rect x="25" y="-174" width="18" height="348" rx="9" fill={`url(#${ladder})`} />

        <rect x="-39" y="-160" width="3.5" height="320" rx="1.75" fill="#FFF6B7" opacity="0.65" />
        <rect x="29" y="-160" width="3.5" height="320" rx="1.75" fill="#FFF6B7" opacity="0.65" />
      </g>

      <g transform="translate(415, 85)" filter={`url(#${glow})`}>
        <path d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z" fill="#FFF6B7" />
        <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
      </g>
      <circle cx="350" cy="70" r="4" fill="#00F2FE" opacity="0.8" filter={`url(#${glow})`} />
      <circle cx="445" cy="145" r="5" fill="#FFA700" opacity="0.8" filter={`url(#${glow})`} />
    </svg>
  )
}
