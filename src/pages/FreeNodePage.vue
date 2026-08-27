<template>
  <div class="free-node-page">
    <h1 class="page-title">
      <VueIcon class="title-icon" icon="wifi" aria-label="免费节点" />
      <span class="title-text">免费节点</span>
    </h1>
    <div class="free-node-content">
      <div class="free-node-grid">
        <section class="free-node-section note-section">
          <h2><VueIcon class="section-icon" icon="bullhorn" aria-label="注意事项" /> 注意事项</h2>
          <p class="section-note">
            免费节点资源有限且稳定性较差，如需更好体验可考虑付费节点（参见<a href="#" @click.prevent="switchToRecommend" class="inline-link">机场推荐</a>）。
          </p>
        </section>
        <section
          v-for="(section, sIdx) in sections"
          :key="sIdx"
          class="free-node-section"
        >
          <h2>
            <VueIcon class="section-icon" :icon="section.icon" :aria-label="section.title" />
            {{ section.title }}
          </h2>
          <p class="section-description">{{ section.description }}</p>
          <div class="free-node-links">
            <a
              v-for="link in section.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              class="free-node-link"
            >
              <span class="link-icon"><VueIcon :icon="link.icon" aria-label="链接" /></span>
              <span class="link-text">{{ link.name }}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import VueIcon from '../components/VueIcon.vue';
import freeNodesData from '../data/freeNodes.json';

interface FreeNodeLink {
  name: string
  url: string
  icon: string
}

interface FreeNodeSection {
  title: string
  description: string
  icon: string
  links: FreeNodeLink[]
}

const sections = (freeNodesData as { sections: FreeNodeSection[] }).sections;

// 获取切换页面的函数
const setCurrentTab = inject('setCurrentTab') as any;

// 切换到推荐页面
const switchToRecommend = (): void => {
  if (setCurrentTab) {
    setCurrentTab('recommend');
  }
};
</script>

<style scoped>
.free-node-page {
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

.free-node-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(16px, 1.8vw, 22px);
  width: 100%;
}

@media (min-width: 1080px) {
  .free-node-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .note-section {
    grid-column: 1 / -1;
  }
}
.free-node-section {
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
}

.free-node-section::before {
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

.free-node-section:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
  border-color: rgba(var(--accent-rgb), 0.18);
}

.free-node-section:hover::before {
  opacity: 0.06;
}

.free-node-section h2 {
  font-size: var(--font-size-lg);
  color: var(--text-accent);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--text-accent);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-icon {
  color: var(--text-accent);
  font-size: 1.05em;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}
.free-node-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.free-node-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius);
  padding: 16px 18px;
  text-decoration: none;
  transition: all 0.5s;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: -0.01em;
  position: relative;
  overflow: hidden;
  text-align: left;
  min-height: 52px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: var(--soft-shadow);
}
.free-node-link::before {
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

.free-node-link::after {
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

.free-node-link > * { position: relative; z-index: 2; }

.free-node-link:hover {
  border-color: rgb(var(--orb-rose-rgb));
  color: rgb(var(--orb-rose-rgb));
  transform: translateY(-1px);
  box-shadow: var(--card-shadow);
}

.free-node-link:hover::before {
  right: 48px;
  top: auto;
  bottom: -32px;
  filter: blur(14px);
  box-shadow: 20px 20px 20px 30px #a21caf;
}

.free-node-link:hover::after {
  right: -32px;
  filter: blur(18px);
}
.note-section {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-left: 3px solid var(--text-sub-accent);
  padding: clamp(16px, 1.8vw, 20px);
}

.note-section h2 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
  border-bottom: none;
  padding-bottom: 0;
  color: var(--text-sub-accent);
}

.section-note {
  color: var(--text-secondary);
  line-height: 1.6;
}
.inline-link {
  color: var(--text-link);
  text-decoration: none;
  font-weight: 600;
  position: relative;
}

.inline-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--text-link);
  transition: width var(--transition-normal);
}

.inline-link:hover::after {
  width: 100%;
}

.inline-link:hover {
  color: var(--text-link-hover);
}

@media (max-width: 768px) {
  .free-node-section {
    padding: var(--spacing-lg);
  }
  .free-node-link {
    padding: 10px 12px;
    font-size: 13px;
  }
  .link-icon {
    font-size: 1em;
  }
}
</style>
