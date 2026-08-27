<template>
  <div class="recommend-page">
    <div class="rec-header">
      <h1 class="rec-title">
        <VueIcon class="rec-title-icon" icon="rocket" aria-label="机场推荐" />
        <span class="rec-title-text">机场推荐</span>
        <span class="rec-title-count">{{ providers.length }} 家精选</span>
      </h1>
      <p class="rec-subtitle">剔除噱头，只留稳定与性价比 — 按需选择，卡片即入口</p>
    </div>

    <div class="bento-grid">
      <a
        v-for="(provider, idx) in providers"
        :key="provider.name"
        :href="provider.url"
        target="_blank"
        rel="noopener noreferrer"
        class="bento-card group"
        :style="{ '--enter-delay': idx * 70 + 'ms' }"
        :aria-label="provider.displayName + ' 官网'"
      >
        <div class="bento-card__overlay" aria-hidden="true"></div>
        <!-- 可上移的内容组：标题+badge+Marquee（按用户要求一起上移） -->
        <div class="bento-card__shift">
          <div class="bento-card__head">
            <h3 class="bento-card__title">{{ provider.displayName }}</h3>
          </div>

          <div class="bento-card__billing">
            <span
              v-for="b in provider.billing"
              :key="b.label"
              class="billing-pill"
              :class="billingClass(b.type)"
              :title="b.type + ' ' + b.label"
            >
              <span class="billing-type">{{ b.type }}</span>
              <span class="billing-sep">·</span>
              <span class="billing-label">￥{{ b.label }}</span>
            </span>
          </div>

          <div class="bento-card__badges">
            <span
              v-for="badge in provider.badges"
              :key="badge"
              class="badge"
              :class="badgeVariant(badge)"
            >{{ badge }}</span>
          </div>

          <div class="bento-card__regions">
            <div class="marquee" :aria-label="provider.regions.map(displayRegion).join('、')">
              <div class="marquee__track">
                <span
                  v-for="(region, rIdx) in duplicatedRegions(provider.regions)"
                  :key="region + '-' + rIdx"
                  class="marquee__item"
                >
                  <span class="marquee__flag">
                    <img
                      :src="flagSrc(region)"
                      :srcset="flagSrcSet(region)"
                      :alt="region"
                      width="20"
                      height="15"
                      loading="lazy"
                      decoding="async"
                      class="flag-img"
                      @error="onFlagError"
                    />
                  </span>
                  <span class="marquee__name">{{ displayRegion(region) }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="bento-card__foot" aria-hidden="true">
          <div class="foot-price" v-if="lowestBilling(provider)">
            <span class="foot-price-currency">￥</span><span class="foot-price-num">{{ lowestBilling(provider).price }}</span><span class="foot-price-unit">/{{ lowestBilling(provider).traffic }}</span><span class="foot-price-from">起</span>
          </div>
          <div class="foot-cta">
            <span class="cta-text">访问官网</span>
            <VueIcon icon="arrow-right" class="cta-icon" />
          </div>
        </div>
      </a>
    </div>

    <p class="rec-footnote">
      价格随套餐与活动浮动，以官网为准。建议先按量小额试用，再转周期订阅。
    </p>
  </div>
</template>

<script setup lang="ts">
import VueIcon from '../components/VueIcon.vue';
import providersData from '../data/providers.json';

interface Billing {
  type: string
  label: string
  price: number
  traffic: string
}

interface Provider {
  name: string
  displayName: string
  url: string
  billing: Billing[]
  badges: string[]
  regions: string[]
}

const providers = providersData as Provider[];

// ISO 3166-1 alpha-2 直用于存储，展示时通过 Intl 本地化为中文
const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['zh-CN'], { type: 'region' })
  } catch {
    return null
  }
})()

function displayRegion(iso: string): string {
  if (regionNames) {
    try {
      const name = regionNames.of(iso.toUpperCase())
      if (name) return name
    } catch {}
  }
  return iso.toUpperCase()
}

function flagSrc(iso: string): string {
  if (!iso) return ''
  return `https://flagcdn.com/w20/${iso.toLowerCase()}.png`
}

function flagSrcSet(iso: string): string {
  if (!iso) return ''
  return `https://flagcdn.com/w40/${iso.toLowerCase()}.png 2x`
}

function onFlagError(e: Event): void {
  const target = e.target as HTMLElement
  if (target) target.style.display = 'none'
}

function lowestBilling(provider: Provider): Billing | null {
  if (!provider.billing || provider.billing.length === 0) return null
  return [...provider.billing].sort((a, b) => a.price - b.price)[0]
}

function billingClass(type: string): string {
  if (type.includes('按量')) return 'billing-pill--traffic'
  return 'billing-pill--cycle'
}

function badgeVariant(badge: string): string {
  if (['纯净IP', '家宽', 'BGP', 'BPG'].includes(badge)) return 'badge--accent'
  return ''
}

function duplicatedRegions(regions: string[]): string[] {
  return [...regions, ...regions]
}
</script>

<style scoped>
.recommend-page {
  width: 100%;
  max-width: var(--page-max-w);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
  box-sizing: border-box;
}

/* ---- Header ---- */
.rec-header {
  text-align: center;
  margin-bottom: clamp(22px, 3vw, 36px);
}

.rec-title {
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 12px;
  font-size: clamp(26px, 2.8vw, 34px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.rec-title-icon {
  font-size: 0.95em;
  color: var(--text-accent);
  filter: drop-shadow(0 2px 10px rgba(var(--accent-rgb), 0.22));
}

.rec-title-text {
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-bottom: 2px;
}

.rec-title-count {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.02em;
  color: var(--text-tertiary);
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  box-shadow: var(--soft-shadow);
}

.rec-subtitle {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: clamp(13.5px, 1.4vw, 15px);
  line-height: 1.6;
  letter-spacing: 0.01em;
}

/* ---- Bento Grid — magicui: grid w-full auto-rows-[22rem] grid-cols-3 gap-4 ---- */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;
}

@media (max-width: 1100px) {
  .bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}

/* ---- Card — Uiverse fuzzy-rabbit-3 + magicui BentoCard, fully token-based for light/dark ---- */
.bento-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 268px;
  padding: 20px 20px 0 20px;
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  overflow: hidden;
  text-decoration: none !important;
  isolation: isolate;
  transform: translateZ(0);
  box-shadow: var(--soft-shadow);
  transition:
    transform 500ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 500ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 500ms cubic-bezier(0.4, 0, 0.2, 1),
    color 500ms cubic-bezier(0.4, 0, 0.2, 1);
  animation: bento-enter 560ms cubic-bezier(0.23, 1, 0.32, 1) both;
  animation-delay: var(--enter-delay, 0ms);
  will-change: transform;
}

/* light/dark via tokens already, but keep magicui dark inset for depth */
.bento-card {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05),
    var(--soft-shadow);
}

:global(.theme-light) .bento-card {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
  .bento-card {
    box-shadow:
      0 -20px 80px -20px rgba(255, 255, 255, 0.08) inset,
      var(--soft-shadow);
  }
}

.bento-card,
.bento-card:hover,
.bento-card:focus-visible {
  text-decoration: none !important;
}

.bento-card::before,
.bento-card::after {
  text-decoration: none !important;
}

/* Orb blobs — pixel-perfect Uiverse, behind content */
.bento-card::before,
.bento-card::after {
  content: '';
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
  z-index: 0;
  transition:
    right 500ms cubic-bezier(0.4, 0, 0.2, 1),
    top 500ms cubic-bezier(0.4, 0, 0.2, 1),
    bottom 500ms cubic-bezier(0.4, 0, 0.2, 1),
    filter 500ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 500ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card::before {
  width: 48px;
  height: 48px;
  right: 4px;
  top: 4px;
  background: #8b5cf6;
  filter: blur(16px);
  opacity: var(--orb-opacity, 0.92);
}

.bento-card::after {
  width: 80px;
  height: 80px;
  right: 32px;
  top: 12px;
  background: #fda4af;
  filter: blur(16px);
  opacity: calc(var(--orb-opacity, 0.92) * 0.9);
}

.bento-card:hover {
  border-color: #fda4af;
}

.bento-card:hover::before {
  right: 48px;
  top: auto;
  bottom: -32px;
  filter: blur(8px);
  box-shadow: 20px 20px 20px 30px #a21caf;
}

.bento-card:hover::after {
  right: -32px;
}

/* magicui overlay — token-aware */
.bento-card__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: transparent;
  transition: background 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card:hover .bento-card__overlay {
  background: var(--surface-hover);
}

.bento-card:focus-visible {
  outline: 2px solid rgba(var(--accent-rgb), 0.55);
  outline-offset: 2px;
  border-color: rgba(var(--accent-rgb), 0.45);
}

@keyframes bento-enter {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ---- Shiftable content — title+badge+Marquee一起上移，整体下移使hover后与原非hover齐平 ---- */
.bento-card__shift {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
  transform: translateY(28px);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card:hover .bento-card__shift {
  transform: translateY(18px);
}

@media (max-width: 1023px) {
  .bento-card__shift {
    transform: translateY(28px);
  }
  .bento-card:hover .bento-card__shift,
  .bento-card:focus-within .bento-card__shift {
    transform: translateY(18px);
  }
}

.bento-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

/* Title — 非hover单色，hover红蓝渐变 270deg */
.bento-card__title {
  margin: 0;
  font-size: clamp(16.5px, 1.55vw, 19px);
  font-weight: 850;
  letter-spacing: -0.025em;
  line-height: 1.25;
  color: var(--text-primary);
  min-width: 0;
  word-break: keep-all;
  overflow-wrap: break-word;
  text-wrap: balance;
  transition: color 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card:hover .bento-card__title {
  background: linear-gradient(270deg, #ef4444 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

/* ---- Billing pills ---- */
.bento-card__billing {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.billing-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
  border: 1px solid var(--border-primary);
  background: var(--background-trans);
  color: var(--text-secondary);
  backdrop-filter: blur(6px);
}

.billing-type { font-weight: 750; letter-spacing: 0.02em; }
.billing-sep { opacity: 0.45; }

.billing-pill--cycle {
  background: rgba(var(--accent-rgb), 0.08);
  border-color: rgba(var(--accent-rgb), 0.18);
  color: var(--text-accent);
}

.billing-pill--traffic {
  background: rgba(var(--sub-accent-rgb), 0.07);
  border-color: rgba(var(--sub-accent-rgb), 0.16);
  color: var(--text-sub-accent);
}

/* ---- Badges ---- */
.bento-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 26px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 5.5px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 620;
  line-height: 1;
  letter-spacing: 0.015em;
  border: 1px solid var(--border-primary);
  background: var(--background-secondary);
  color: var(--text-secondary);
}

.badge--accent {
  background: rgba(var(--orb-violet-rgb, 139, 92, 246), 0.10);
  border-color: rgba(var(--orb-violet-rgb, 139, 92, 246), 0.18);
  color: rgb(var(--orb-violet-rgb, 139, 92, 246));
}

/* ---- Regions marquee ---- */
.bento-card__regions {
  position: relative;
  z-index: 2;
  margin-top: 10px;
  margin-left: -20px;
  margin-right: -20px;
  border-top: 1px solid var(--border-secondary);
  background: linear-gradient(90deg, transparent 0%, var(--surface-hover) 22%, var(--surface-hover) 78%, transparent 100%);
  padding: 11px 0;
  overflow: hidden;
}

.marquee {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%);
}

.marquee__track {
  display: flex;
  width: max-content;
  align-items: center;
  gap: 0;
  will-change: transform;
  animation: marquee-scroll 56s linear infinite;
}

.bento-card:hover .marquee__track {
  animation-play-state: paused;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  flex-shrink: 0;
  white-space: nowrap;
  border-right: 1px solid var(--border-secondary);
  line-height: 1;
}

.marquee__flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 15px;
  flex-shrink: 0;
  border-radius: 2px;
  overflow: hidden;
  background: var(--background-tertiary);
  box-shadow: 0 0 0 1px var(--border-secondary);
}

.flag-img {
  width: 20px;
  height: 15px;
  object-fit: cover;
  display: block;
  border-radius: 2px;
}

.marquee__name {
  font-size: 12.4px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--text-secondary);
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ---- Foot ---- */
.bento-card__foot {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding-bottom: 14px;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.bento-card:hover .bento-card__foot,
.bento-card:focus-within .bento-card__foot {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.foot-price {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--background-tertiary);
  border: 1px solid var(--border-primary);
  box-shadow: var(--soft-shadow);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.foot-price-currency {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-tertiary);
  margin-right: 1px;
}

.foot-price-num {
  font-size: 14px;
  font-weight: 850;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  line-height: 1;
}

.foot-price-unit {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-tertiary);
}

.foot-price-from {
  margin-left: 5px;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-quaternary);
  background: var(--background-secondary);
  border: 1px solid var(--border-secondary);
  padding: 2px 6px;
  border-radius: 999px;
}

.foot-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--text-tertiary);
  white-space: nowrap;
  transition: color 500ms cubic-bezier(0.4, 0, 0.2, 1), gap 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card:hover .foot-cta {
  color: #fda4af;
  gap: 10px;
}

.cta-icon {
  font-size: 11px;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card:hover .cta-icon {
  transform: translateX(3px);
}

@media (max-width: 640px) {
  .bento-card {
    min-height: 254px;
    padding: 18px 18px 0 18px;
  }
  .bento-card__regions {
    margin-left: -18px;
    margin-right: -18px;
  }
  .marquee__track {
    animation-duration: 44s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bento-card,
  .bento-card::before,
  .bento-card::after,
  .bento-card__shift,
  .bento-card__foot,
  .foot-cta,
  .cta-icon {
    transition: none !important;
    animation: none !important;
  }
  .marquee__track {
    animation: none;
    transform: none !important;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }
  .bento-card__foot {
    opacity: 1;
    transform: none;
  }
  .bento-card__shift {
    transform: none !important;
  }
}

.rec-footnote {
  margin: 22px 0 0;
  text-align: center;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-quaternary);
}
</style>
