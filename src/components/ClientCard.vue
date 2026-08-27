<template>
  <div class="client-card">
    <div class="card-header">
      <h3 class="client-title">{{ client.name }}</h3>
    </div>

    <p v-if="client.description" class="description">{{ client.description }}</p>

    <div v-if="client.platforms?.length" class="platform-badges">
      <span v-for="os in client.platforms" :key="os" class="platform-badge">
        {{ (osMeta as any)[os]?.label ?? os }}
      </span>
    </div>

    <div class="action-links">
      <a
        v-for="download in client.downloads || []"
        :key="download.url"
        :href="download.url"
        target="_blank"
        rel="noopener noreferrer"
        class="download-link"
      >{{ download.label }}</a>

      <a
        v-if="tutorialUrl"
        :href="tutorialUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="tutorial-link"
      >教程</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { osMeta } from '../data/clients';

const props = defineProps({
  client: { type: Object, required: true },
  os: { type: String, default: '' },
});

const tutorialUrl = computed(() => {
  if (!props.os) return '';
  return props.client?.tutorials?.[props.os] ?? '';
});
</script>
<style scoped>
.client-card {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--card-radius);
  padding: var(--spacing-lg);
  color: var(--text-primary);
  box-shadow: var(--soft-shadow);
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
}

.client-card::before {
  content: '';
  position: absolute;
  width: 44px;
  height: 44px;
  right: 4px;
  top: 4px;
  background: var(--orb-violet);
  border-radius: 9999px;
  filter: blur(12px);
  opacity: calc(var(--orb-opacity) * 0.85);
  z-index: 0;
  transition: all 0.5s;
}

.client-card::after {
  content: '';
  position: absolute;
  width: 72px;
  height: 72px;
  right: 28px;
  top: 10px;
  background: var(--orb-rose);
  border-radius: 9999px;
  filter: blur(15px);
  opacity: calc(var(--orb-opacity) * 0.75);
  z-index: 0;
  transition: all 0.5s;
}

.client-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--card-shadow);
  border-color: rgba(var(--orb-rose-rgb), 0.45);
}

.client-card:hover::before {
  right: 40px;
  top: auto;
  bottom: -6px;
  box-shadow: 16px 16px 24px 8px rgba(var(--orb-violet-rgb), 0.28);
}

.client-card:hover::after {
  right: -24px;
}

.client-card > * { position: relative; z-index: 1; }
.card-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.client-title {
  font-size: var(--font-size-base);
  color: var(--text-accent);
  margin: 0;
  font-weight: 600;
  text-align: left;
}

.description {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  text-align: left;
}

.platform-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.platform-badge {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-primary);
  background: var(--background-tertiary);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}

.action-links {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.action-links a {
  flex: 1;
  min-width: 80px;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  transition: all var(--transition-normal);
  font-weight: 500;
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}

.download-link {
  background: var(--background-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.download-link:hover {
  background: var(--main-gradient);
  color: var(--text-bright);
  border-color: transparent;
  transform: translateY(-2px);
}

.tutorial-link {
  background: transparent;
  color: var(--text-accent);
  border: 1px solid var(--text-accent);
}

.tutorial-link:hover {
  background: var(--text-accent);
  color: var(--text-bright);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .client-card {
    padding: var(--spacing-md);
  }

  .action-links {
    flex-direction: column;
  }

  .action-links a {
    min-width: 100%;
  }
}
</style>

