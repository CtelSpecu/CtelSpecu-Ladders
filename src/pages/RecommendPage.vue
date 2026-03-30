<template>
  <div class="recommend-page">
    <div class="page-header">
      <h1 class="page-title">
        <VueIcon class="title-icon" icon="rocket" aria-label="机场推荐" />
        <span class="title-text">机场推荐</span>
      </h1>
      <p class="page-subtitle">精选优质服务商，稳定高速的网络体验</p>
    </div>

    <section class="filter-section">
      <div class="filters">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="filter-pill"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          <VueIcon :icon="cat.icon" class="filter-icon" />
          <span>{{ cat.label }}</span>
        </button>
      </div>
    </section>

    <div class="category-info">
      <div class="category-header">
        <VueIcon :icon="currentCategory.icon" class="category-icon" />
        <h2>{{ currentCategory.label }}</h2>
      </div>
      <p class="category-desc">{{ currentCategory.description }}</p>
      <div class="category-tags">
        <span v-for="tag in currentCategory.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <div class="provider-cards">
      <a
        v-for="provider in filteredProviders"
        :key="provider.name"
        :href="provider.url"
        target="_blank"
        rel="noopener noreferrer"
        class="provider-card"
      >
        <div class="card-icon">
          <VueIcon :icon="provider.icon" />
        </div>
        <div class="card-content">
          <h3 class="provider-name">{{ provider.name }}</h3>
          <p v-if="provider.description" class="provider-desc">{{ provider.description }}</p>
        </div>
        <VueIcon icon="arrow-right" class="card-arrow" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueIcon from '../components/VueIcon.vue';

const categories = [
  {
    id: 'premium',
    label: '优质高速',
    icon: 'bolt',
    description: '高速、稳定、IP纯净，适合经常使用的用户',
    tags: ['高速', '稳定', 'IP纯净'],
  },
  {
    id: 'budget',
    label: '量大管饱',
    icon: 'database',
    description: '高性价比、大流量，适合下载大量文件的用户',
    tags: ['高性价比', '大流量'],
  },
  {
    id: 'periodic',
    label: '周期购买',
    icon: 'clock',
    description: '购买固定流量，适合不常用代理的用户',
    tags: ['按需购买', '灵活'],
  },
];

const providers = [
  // 优质高速 (按推荐顺序)
  { name: 'Mikasa', url: 'https://a.mikasass.pro/signup?referralCode=A9ti5mtf', icon: 'bolt', category: 'premium', order: 1 },
  { name: 'CuteCloud', url: 'https://www.cutecloud.net/register?code=WUHcCLFn', icon: 'heart', category: 'premium', order: 3 },
  { name: '狗狗加速', url: 'https://down.dginv.click/#/register?code=ammg9FA2', icon: 'dog', category: 'premium', order: 4 },
  { name: 'XSUS', url: 'https://xs-us.xyz/register?code=9usLmdvb', icon: 'plane', category: 'premium', order: 5 },
  // 量大管饱 (按推荐顺序)
  { name: 'CokeCloud', url: 'https://cokecloud.cyou/#/register?code=wvIsDmnG', icon: 'mug-hot', category: 'budget', order: 1 },
  { name: '快游戏云加速', url: 'https://www.qingzeyy.top/#/register?code=KENq3MAR', icon: 'gamepad', category: 'budget', order: 2 },
  { name: '一元机场', url: 'https://1元机场.com/#/', icon: 'dollar-sign', category: 'budget', order: 3 },
  // 周期购买 (按推荐顺序)
  { name: '魔戒', url: 'https://mojie.kim/register?aff=r3JESYAG', icon: 'ring', category: 'periodic', order: 1 },
  { name: 'CuteCloud', url: 'https://www.cutecloud.net/register?code=WUHcCLFn', icon: 'heart', category: 'periodic', order: 2, description: '支持按流量购买' },
];

const selectedCategory = ref('premium');

const currentCategory = computed(() => {
  return categories.find(c => c.id === selectedCategory.value) || categories[0];
});

const filteredProviders = computed(() => {
  return providers
    .filter(p => p.category === selectedCategory.value)
    .sort((a, b) => a.order - b.order);
});
</script>

<style scoped>
.recommend-page {
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

.filter-section {
  margin-bottom: var(--spacing-xl);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  border: 1px solid var(--border-primary);
  background: var(--background-secondary);
  color: var(--text-primary);
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.filter-pill:hover {
  border-color: var(--text-accent);
  transform: translateY(-2px);
  box-shadow: var(--soft-shadow);
}

.filter-pill.active {
  background: var(--main-gradient);
  color: var(--text-bright);
  border-color: transparent;
  box-shadow: var(--accent-shadow);
}

.filter-icon {
  font-size: 1em;
}

.category-info {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: var(--soft-shadow);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.category-icon {
  font-size: 1.5em;
  color: var(--text-accent);
}

.category-info h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  font-weight: 700;
}

.category-desc {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
}

.tag {
  display: inline-flex;
  align-items: center;
  background: var(--background-tertiary);
  color: var(--text-accent);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  border: 1px solid var(--border-primary);
}

.provider-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.provider-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 14px;
  padding: var(--spacing-lg);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-normal);
  box-shadow: var(--soft-shadow);
  position: relative;
  overflow: hidden;
}

.provider-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--main-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.provider-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--accent-shadow);
  border-color: var(--text-accent);
}

.provider-card:hover::before {
  opacity: 1;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--background-tertiary);
  border-radius: 12px;
  color: var(--text-accent);
  font-size: 1.25em;
  flex-shrink: 0;
  border: 1px solid var(--border-primary);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.provider-name {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
}

.provider-desc {
  margin: var(--spacing-xs) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.card-arrow {
  color: var(--text-tertiary);
  font-size: 0.9em;
  flex-shrink: 0;
  transition: all var(--transition-normal);
}

.provider-card:hover .card-arrow {
  color: var(--text-accent);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-pill {
    justify-content: center;
  }

  .provider-cards {
    grid-template-columns: 1fr;
  }

  .provider-card {
    padding: var(--spacing-md);
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.1em;
  }
}
</style>
