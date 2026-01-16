<template>
  <div id="clients" class="guide-layout">
    <div class="page-header">
      <h1 class="page-title">
        <VueIcon class="title-icon" icon="download" />
        <span class="title-text">客户端下载</span>
      </h1>
      <p class="page-subtitle">自动识别系统，也可手动选择</p>
    </div>

    <div class="guide-content">
      <section class="os-section">
        <div class="os-grid">
          <button
            v-for="os in osOptions"
            :key="os"
            type="button"
            class="os-card"
            :class="{ active: selectedOs === os }"
            @click="selectOs(os)"
          >
            <VueIcon
              class="os-icon"
              :icon="osMeta[os]?.icon"
              :variant="osIconVariant(os)"
              :aria-label="osMeta[os]?.label"
            />
            <span class="os-label">{{ osMeta[os]?.label }}</span>
          </button>
        </div>
      </section>

      <section class="guide-section">
        <div class="section-title">
          <h2>为 {{ osMeta[selectedOs]?.label }} 推荐</h2>
          <button type="button" class="link-button" @click="goToCategory">
            按 Clash / V2Ray 分类对比
            <VueIcon class="link-icon" icon="arrow-right" />
          </button>
        </div>

        <div class="client-cards">
          <ClientCard
            v-for="client in recommendedClients"
            :key="client.id"
            :client="client"
            :os="selectedOs"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.guide-layout {
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

.guide-content {
  padding: 0 var(--spacing-md);
}

.os-section {
  margin-bottom: var(--spacing-xl);
}

.os-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-md);
}

.os-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: 16px;
  border: 1px solid var(--border-primary);
  background: var(--background-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--soft-shadow);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.os-card:hover {
  transform: translateY(-3px);
  border-color: var(--text-accent);
  box-shadow: var(--accent-shadow);
}

.os-card.active {
  border-color: var(--text-sub-accent);
  box-shadow: var(--sub-accent-shadow);
}

.os-icon {
  font-size: 1.4em;
  color: var(--text-accent);
}

.os-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.guide-section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border-primary);
}

.guide-section h2 {
  display: flex;
  align-items: center;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin: 0;
  font-weight: 600;
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

  .os-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .guide-content {
    padding: 0 var(--spacing-sm);
  }

  .os-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .os-card {
    padding: var(--spacing-md);
  }

  .section-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .link-button {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-xl);
  }
}
</style>

<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue';
import ClientCard from '../components/ClientCard.vue';
import VueIcon from '../components/VueIcon.vue';
import { getRecommendedClientsForOs, OS, osMeta } from '../data/clients.js';
import { detectOsFromUserAgent } from '../utils/platform.js';

const props = defineProps({
  initialOs: { type: String, default: '' },
});

const navigate = inject('navigate', null);

const osOptions = [OS.windows, OS.macos, OS.linux, OS.ios, OS.android];
const selectedOs = ref(OS.windows);

const recommendedClients = computed(() => getRecommendedClientsForOs(selectedOs.value));

function selectOs(os) {
  selectedOs.value = os;
  if (typeof navigate === 'function') {
    navigate('guide', { os });
  }
}

function goToCategory() {
  if (typeof navigate === 'function') {
    navigate('client-category');
  }
}

function osIconVariant(os) {
  if (os === OS.windows || os === OS.linux || os === OS.android) return 'brands';
  return 'solid';
}

onMounted(() => {
  const initial = osOptions.includes(props.initialOs) ? props.initialOs : '';
  selectedOs.value = initial || detectOsFromUserAgent(navigator.userAgent);
});

watch(
  () => props.initialOs,
  (next) => {
    if (osOptions.includes(next) && next !== selectedOs.value) {
      selectedOs.value = next;
    }
  }
);
</script>
