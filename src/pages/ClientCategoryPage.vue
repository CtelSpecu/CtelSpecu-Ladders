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

<script setup>
import { computed, inject, ref } from 'vue';
import ClientCard from '../components/ClientCard.vue';
import VueIcon from '../components/VueIcon.vue';
import { CLIENT_CATEGORY, getClientsByCategory, OS, osMeta, categoryMeta } from '../data/clients.js';

const navigate = inject('navigate', null);

const osOptions = [OS.windows, OS.macos, OS.linux, OS.ios, OS.android];
const selectedOs = ref('');

const categories = computed(() => [CLIENT_CATEGORY.clash, CLIENT_CATEGORY.v2ray]);

function filteredClientsByCategory(category) {
  const list = getClientsByCategory(category);
  if (!selectedOs.value) return list;
  return list.filter((client) => (client.platforms ?? []).includes(selectedOs.value));
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
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: 1.1em;
  color: var(--text-accent);
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
  font-size: var(--font-size-base);
  margin: 0;
}

.content {
  padding: 0 var(--spacing-md);
}

.filter-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.filter-pill {
  border: 1px solid var(--border-primary);
  background: var(--background-secondary);
  color: var(--text-primary);
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.filter-pill:hover {
  border-color: var(--text-accent);
  transform: translateY(-1px);
}

.filter-pill.active {
  border-color: var(--text-sub-accent);
  box-shadow: var(--sub-accent-shadow);
}

.link-button {
  border: 1px solid var(--border-primary);
  background: var(--background-tertiary);
  color: var(--text-primary);
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
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
  margin-bottom: var(--spacing-xl);
}

.category-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border-primary);
}

.category-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.category-icon {
  color: var(--text-accent);
}

.category-header h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  font-weight: 700;
}

.category-desc {
  margin: 0;
  color: var(--text-secondary);
  text-align: center;
  font-size: var(--font-size-sm);
}

.client-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  width: 100%;
}

@media (max-width: 992px) {
  .client-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 0 var(--spacing-sm);
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .link-button {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

