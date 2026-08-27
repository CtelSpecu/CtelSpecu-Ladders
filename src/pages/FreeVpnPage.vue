<template>
  <div class="free-vpn-page">
    <h1 class="page-title">
      <VueIcon class="title-icon" icon="lock" aria-label="免费VPN推荐" />
      <span class="title-text">免费VPN推荐</span>
    </h1>
    <div class="free-vpn-content">
      <div class="free-vpn-grid">
        <section
          v-for="(section, sIdx) in sections"
          :key="sIdx"
          class="free-vpn-section"
        >
          <h2>
            <VueIcon class="section-icon" :icon="section.icon" :aria-label="section.title" />
            {{ section.title }}
          </h2>
          <div class="free-vpn-btn-group">
            <div
              v-for="item in section.items"
              :key="item.url"
              class="vpn-item"
            >
              <a :href="item.url" target="_blank" class="free-vpn-btn">
                {{ item.name }}
                <span class="rating">
                  <i
                    v-for="i in 5"
                    :key="i"
                    :class="i <= item.rating ? 'fas fa-star' : 'far fa-star'"
                  ></i>
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueIcon from '../components/VueIcon.vue';
import freeVpnsData from '../data/freeVpns.json';

interface VpnItem {
  name: string
  url: string
  rating: number
}

interface VpnSection {
  title: string
  icon: string
  items: VpnItem[]
}

const sections = (freeVpnsData as { sections: VpnSection[] }).sections;
</script>

<style scoped>
.free-vpn-page {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}
.page-title {
  margin: 0;
  font-size: clamp(26px, 2.6vw, 32px);
  font-weight: 800;
  letter-spacing: -0.025em;
  text-align: center;
  margin-bottom: clamp(18px, 2vw, 28px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: 1.05em;
  color: var(--text-accent);
  filter: drop-shadow(0 2px 8px rgba(var(--accent-rgb), 0.18));
}

.title-text {
  color: var(--text-title-h1);
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-bottom: 2px;
}

.section-icon {
  color: var(--text-accent);
}

.free-vpn-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(16px, 1.8vw, 22px);
  width: 100%;
}

.free-vpn-section {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius);
  padding: clamp(18px, 2vw, 24px);
  color: var(--text-primary);
  box-shadow: var(--soft-shadow);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-spring);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  min-height: 280px;
}

.free-vpn-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sub-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: -1;
}

.free-vpn-section:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
  border-color: rgba(var(--accent-rgb), 0.18);
}

.free-vpn-section:hover::before {
  opacity: 0.06;
}

.free-vpn-section h2 {
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -0.015em;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.free-vpn-btn-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.vpn-item {
  width: 100%;
}


.free-vpn-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius);
  padding: 12px 16px;
  width: 100%;
  min-height: 64px;
  height: 64px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: var(--soft-shadow);
  overflow: hidden;
  transition: all 0.5s;
  text-align: left;
  box-sizing: border-box;
}

.free-vpn-btn::before {
  content: '';
  position: absolute;
  width: 48px;
  height: 48px;
  right: 4px;
  top: 4px;
  background: var(--orb-violet);
  border-radius: 9999px;
  filter: blur(12px);
  opacity: var(--orb-opacity);
  z-index: 1;
  transition: all 0.5s;
}

.free-vpn-btn::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  right: 32px;
  top: 12px;
  background: var(--orb-rose);
  border-radius: 9999px;
  filter: blur(16px);
  opacity: calc(var(--orb-opacity) * 0.9);
  z-index: 1;
  transition: all 0.5s;
}

.free-vpn-btn > * {
  position: relative;
  z-index: 2;
}

.free-vpn-btn:hover {
  border-color: rgb(var(--orb-rose-rgb));
  color: rgb(var(--orb-rose-rgb));
  transform: translateY(-1px);
  box-shadow: var(--card-shadow);
}

.free-vpn-btn:hover::before {
  right: 48px;
  top: auto;
  bottom: -32px;
  filter: blur(14px);
  box-shadow: 20px 20px 20px 30px #a21caf;
}

.free-vpn-btn:hover::after {
  right: -32px;
}

.free-vpn-btn .rating {
  margin-left: auto;
  display: flex;
  gap: 4px;
  align-items: center;
}

.free-vpn-btn:hover .rating {
  color: rgb(var(--orb-rose-rgb));
}

.free-vpn-btn .rating {
  margin-left: auto;
  display: flex;
  gap: 4px;
  align-items: center;
}

.free-vpn-btn:hover .rating {
  color: rgb(var(--orb-rose-rgb));
}

.rating {
  display: flex;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-accent);
  font-weight: normal;
}
.rating i {
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
}

.rating i:hover {
  transform: scale(1.1);
}

@media (max-width: 1200px) {
  .free-vpn-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .free-vpn-grid {
    grid-template-columns: 1fr;
  }

  .free-vpn-section {
    min-height: auto;
    padding: var(--spacing-lg);
  }

  .page-title {
    font-size: var(--font-size-xl);
  }
}
</style>
