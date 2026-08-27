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
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}
.page-header {
  text-align: center;
  margin-bottom: clamp(18px, 2.4vw, 28px);
}

.page-title {
  margin: 0 0 var(--spacing-sm);
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: 1.1em;
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

.page-subtitle {
  color: var(--text-secondary);
  font-size: 15px;
  margin: 0;
  line-height: 1.5;
}

.guide-content {
  padding: 0;
}

.os-section {
  margin-bottom: clamp(20px, 2.2vw, 28px);
}

.os-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(10px, 1.4vw, 14px);
}

.os-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: clamp(14px, 1.6vw, 18px) 10px;
  border-radius: var(--card-radius);
  border: 1px solid var(--border-primary);
  background: var(--background-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-spring);
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
  background: var(--background-secondary);
}
.os-icon {
  font-size: 1.3em;
  color: var(--text-accent);
}

.os-label {
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.guide-section {
  margin-bottom: clamp(22px, 2.4vw, 32px);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-primary);
}

.guide-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -0.015em;
  color: var(--text-primary);
  margin: 0;
}

.link-button {
  border: 1px solid var(--border-primary);
  background: var(--background-tertiary);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 650;
  font-size: 13px;
  white-space: nowrap;
}

.link-button:hover {
  transform: translateY(-1px);
  border-color: rgba(var(--accent-rgb), 0.28);
  box-shadow: var(--soft-shadow);
  color: var(--text-primary);
  background: var(--surface-hover);
}

.link-icon {
  font-size: 0.9em;
}

.client-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(14px, 1.7vw, 18px);
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
    padding: 0;
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

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue';
import ClientCard from '../components/ClientCard.vue';
import VueIcon from '../components/VueIcon.vue';
import { getRecommendedClientsForOs, OS, osMeta } from '../data/clients';
import { detectOsFromUserAgent } from '../utils/platform';

const props = defineProps({
  initialOs: { type: String, default: '' },
});

const navigate = inject('navigate', null) as any;

const osOptions = [OS.windows, OS.macos, OS.linux, OS.ios, OS.android];
const selectedOs = ref<string>(OS.windows);

const recommendedClients = computed(() => getRecommendedClientsForOs(selectedOs.value as any));
function selectOs(os: string): void {
  selectedOs.value = os;
  if (typeof navigate === 'function') {
    navigate('guide', { os });
  }
}

function goToCategory(): void {
  if (typeof navigate === 'function') {
    navigate('client-category');
  }
}

function osIconVariant(os: string): string {
  if (os === OS.windows || os === OS.macos || os === OS.linux || os === OS.android) return 'brands';
  return 'solid';
}

onMounted(() => {
  const initial = osOptions.includes(props.initialOs as any) ? props.initialOs : '';
  selectedOs.value = (initial || detectOsFromUserAgent(navigator.userAgent)) as any;
});

watch(
  () => props.initialOs,
  (next) => {
    if (osOptions.includes(next as any) && next !== selectedOs.value) {
      selectedOs.value = next as string;
    }
  }
);
</script>
