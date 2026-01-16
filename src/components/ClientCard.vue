<template>
  <div class="client-card">
    <div class="card-header">
      <h3 class="client-title">{{ client.name }}</h3>
      <span v-if="isRecommended" class="recommend-badge">推荐</span>
    </div>

    <p v-if="client.description" class="description">{{ client.description }}</p>

    <div v-if="client.platforms?.length" class="platform-badges">
      <span v-for="os in client.platforms" :key="os" class="platform-badge">
        {{ osMeta[os]?.label ?? os }}
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

<script setup>
import { computed } from 'vue';
import { osMeta } from '../data/clients.js';

const props = defineProps({
  client: { type: Object, required: true },
  os: { type: String, default: '' },
});

const tutorialUrl = computed(() => {
  if (!props.os) return '';
  return props.client?.tutorials?.[props.os] ?? '';
});

const isRecommended = computed(() => {
  if (!props.os) return false;
  return (props.client?.recommended ?? []).includes(props.os);
});
</script>

<style scoped>
.client-card {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 14px;
  padding: var(--spacing-lg);
  color: var(--text-primary);
  box-shadow: var(--soft-shadow);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.client-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.recommend-badge {
  background: var(--main-gradient);
  color: var(--text-bright);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  flex-shrink: 0;
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

