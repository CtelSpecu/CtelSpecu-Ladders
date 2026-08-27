<template>
  <div id="client-categories" class="category-layout">
    <div class="page-header">
      <h1 class="page-title">
        <VueIcon class="title-icon" icon="layer-group" />
        <span class="title-text">客户端分类</span>
      </h1>
      <p class="page-subtitle">按 Clash / V2Ray 分类，对比不同客户端支持的系统与下载渠道</p>
    </div>

    <div class="content">
      <section class="filter-section">
        <div class="filters">
          <button
            type="button"
            class="filter-pill"
            :class="{ active: selectedOs === '' }"
            @click="selectedOs = ''"
          >全部系统</button>
          <button
            v-for="os in osOptions"
            :key="os"
            type="button"
            class="filter-pill"
            :class="{ active: selectedOs === os }"
            @click="selectedOs = os"
          >{{ osMeta[os]?.label }}</button>
        </div>

        <button type="button" class="link-button" @click="goToGuide">
          返回按系统选择
          <VueIcon class="link-icon" icon="arrow-right" />
        </button>
      </section>

      <section v-for="category in categories" :key="category" class="category-section">
        <div class="category-header">
          <div class="category-title">
            <VueIcon class="category-icon" :icon="categoryMeta[category]?.icon" />
            <h2>{{ categoryMeta[category]?.label }}</h2>
          </div>
          <p class="category-desc">{{ categoryMeta[category]?.description }}</p>
        </div>

        <div class="client-cards">
          <ClientCard
            v-for="client in filteredClientsByCategory(category)"
            :key="client.id"
            :client="client"
            :os="selectedOs"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import ClientCard from '../components/ClientCard.vue';
import VueIcon from '../components/VueIcon.vue';
import { CLIENT_CATEGORY, getClientsByCategory, OS, osMeta, categoryMeta } from '../data/clients';

const navigate = inject('navigate', null) as any;

const osOptions = [OS.windows, OS.macos, OS.linux, OS.ios, OS.android];
const selectedOs = ref('');

const categories = computed(() => [CLIENT_CATEGORY.clash, CLIENT_CATEGORY.v2ray]);

function filteredClientsByCategory(category: string): any[] {
  const list = getClientsByCategory(category as any);
  if (!selectedOs.value) return list;
  return list.filter((client) => (client.platforms ?? []).includes(selectedOs.value as any));
}

function goToGuide() {
  if (typeof navigate === 'function') {
    navigate('guide');
  }
}
</script>

<style scoped>
.category-layout {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}
.page-header {
  text-align: center;
  margin-bottom: clamp(18px, 2.4vw, 32px);
}

.page-title {
  margin: 0 0 var(--spacing-sm);
  font-size: clamp(26px, 3.2vw, 36px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 1vw, 12px);
}

.title-icon {
  font-size: 1.1em;
  color: var(--text-accent);
  filter: drop-shadow(0 2px 8px rgba(var(--accent-rgb), 0.3));
}

.title-text {
  color: var(--text-title-h1);
  background: var(--main-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: clamp(13px, 1.35vw, 15px);
  margin: 0 auto;
  line-height: 1.6;
  max-width: 720px;
}

.content {
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

.filter-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(12px, 1.6vw, 20px);
  margin-bottom: clamp(18px, 2.2vw, 28px);
  flex-wrap: wrap;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 1vw, 12px);
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-primary);
  background: var(--background-secondary);
  color: var(--text-primary);
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: 600;
  font-size: var(--font-size-sm);
  line-height: 1;
  white-space: nowrap;
}

.filter-pill:hover {
  border-color: var(--text-accent);
  transform: translateY(-1px);
  box-shadow: var(--soft-shadow);
  color: var(--text-primary);
}

.filter-pill.active {
  background: var(--main-gradient);
  color: var(--text-bright);
  border-color: transparent;
  box-shadow: var(--accent-shadow);
}

.link-button {
  border: 1px solid var(--border-primary);
  background: var(--background-tertiary);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  padding: 10px 16px;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  font-size: var(--font-size-sm);
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: var(--soft-shadow);
}

.link-button:hover {
  transform: translateY(-2px);
  border-color: var(--text-accent);
  box-shadow: var(--soft-shadow);
  color: var(--text-bright);
  background: var(--background-trans);
}

.link-icon {
  font-size: 0.9em;
}

.category-section {
  margin-bottom: clamp(22px, 2.6vw, 36px);
}

.category-header {
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.8vw, 8px);
  margin-bottom: clamp(14px, 1.6vw, 20px);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border-primary);
}

.category-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 0.9vw, 10px);
}

.category-icon {
  color: var(--text-accent);
  filter: drop-shadow(0 1px 6px rgba(var(--accent-rgb), 0.22));
}

.category-header h2 {
  margin: 0;
  font-size: clamp(18px, 1.8vw, 22px);
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.category-desc {
  margin: 0;
  color: var(--text-secondary);
  text-align: center;
  font-size: clamp(13px, 1.2vw, 14px);
  line-height: 1.6;
}

.client-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(14px, 1.8vw, 22px);
  width: 100%;
  align-items: stretch;
}

.client-cards :deep(.client-card) {
  border-radius: var(--card-radius);
  box-shadow: var(--soft-shadow);
}

@media (max-width: 992px) {
  .client-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .link-button {
    width: 100%;
    justify-content: space-between;
  }

  .page-title {
    font-size: clamp(22px, 5vw, 28px);
  }
}
</style>

