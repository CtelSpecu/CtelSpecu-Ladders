<template>
  <div class="theme-test-page">
    <div class="test-container">
      <h1 class="page-title">主题测试页面</h1>
      <p class="test-description">这个页面用于测试深色/浅色主题切换功能。</p>
      
      <div class="theme-info">
        <div class="info-card">
          <h3>当前主题</h3>
          <p>{{ isDark ? '深色模式' : '浅色模式' }}</p>
          <p class="theme-name">{{ themeClass }}</p>
        </div>
        
        <div class="info-card">
          <h3>主题图标</h3>
          <p>{{ themeIcon === 'sun' ? '太阳图标' : '月亮图标' }}</p>
        </div>
      </div>
      
      <div class="test-sections">
        <div class="test-section">
          <h2>文本颜色测试</h2>
          <p class="primary-text">这是主要文本颜色</p>
          <p class="secondary-text">这是次要文本颜色</p>
          <p class="tertiary-text">这是第三级文本颜色</p>
          <a href="#" class="test-link">这是一个测试链接</a>
        </div>
        
        <div class="test-section">
          <h2>背景和卡片测试</h2>
          <div class="test-card">
            <h3>卡片标题</h3>
            <p>这是卡片内容，测试背景色和边框</p>
            <button class="btn-primary">主要按钮</button>
            <button class="btn-secondary">次要按钮</button>
          </div>
        </div>
        
        <div class="test-section">
          <h2>渐变效果测试</h2>
          <div class="gradient-test">
            <div class="gradient-box main-gradient">主渐变</div>
            <div class="gradient-box strong-gradient">强渐变</div>
            <div class="gradient-box sub-gradient">子渐变</div>
          </div>
        </div>
        
        <div class="test-section">
          <h2>交互元素测试</h2>
          <div class="interactive-elements">
            <button class="btn-primary" @click="showMessage">点击测试</button>
            <input type="text" placeholder="测试输入框" class="test-input" />
            <select class="test-select">
              <option>测试选择框</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="test-controls">
        <h2>主题控制</h2>
        <div class="control-buttons">
          <button @click="setTheme(true)" :class="{ active: isDark }">
            深色模式
          </button>
          <button @click="setTheme(false)" :class="{ active: !isDark }">
            浅色模式
          </button>
          <button @click="toggleTheme">
            切换主题
          </button>
          <button @click="clearPreference">
            清除偏好
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js';

const { isDark, themeClass, themeIcon, toggleTheme, setTheme } = useTheme();

const showMessage = () => {
  alert(`当前主题: ${isDark.value ? '深色' : '浅色'}`);
};

const clearPreference = () => {
  localStorage.removeItem('ctelspecu-theme');
  location.reload();
};
</script>

<style scoped>
.theme-test-page {
  min-height: 100vh;
  padding: var(--spacing-xl);
  background: var(--background-primary);
  color: var(--text-primary);
}

.test-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.test-description {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.theme-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.info-card {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: var(--spacing-lg);
  text-align: center;
  transition: all var(--transition-normal);
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--soft-shadow);
}

.info-card h3 {
  color: var(--text-accent);
  margin-bottom: var(--spacing-sm);
}

.info-card p {
  color: var(--text-secondary);
}

.theme-name {
  color: var(--text-quaternary);
  font-size: var(--font-size-sm);
}

.test-sections {
  display: grid;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.test-section {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: var(--spacing-xl);
}

.test-section h2 {
  color: var(--text-accent);
  margin-bottom: var(--spacing-lg);
}

.test-section p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.primary-text {
  color: var(--text-primary);
}

.secondary-text {
  color: var(--text-secondary);
}

.tertiary-text {
  color: var(--text-tertiary);
}

.test-link {
  color: var(--text-link);
  text-decoration: none;
}

.test-link:hover {
  color: var(--text-link-hover);
  text-decoration: underline;
}

.test-card {
  background: var(--background-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.test-card h3 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.gradient-test {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.gradient-box {
  flex: 1;
  min-width: 100px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.main-gradient {
  background: var(--main-gradient);
}

.strong-gradient {
  background: var(--strong-gradient);
}

.sub-gradient {
  background: var(--sub-gradient);
}

.interactive-elements {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  margin-top: var(--spacing-md);
}

.test-input, .test-select {
  background: var(--background-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: var(--spacing-sm);
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.test-input:focus, .test-select:focus {
  outline: 2px solid var(--text-accent);
  outline-offset: 2px;
}

.test-controls {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: var(--spacing-xl);
}

.control-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: var(--spacing-md);
}

.control-buttons button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  background: var(--background-tertiary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: 600;
}

.control-buttons button:hover {
  background: var(--background-trans);
  border-color: var(--text-accent);
}

.control-buttons button.active {
  background: var(--text-accent);
  color: var(--text-bright);
  border-color: var(--text-accent);
}

@media (max-width: 768px) {
  .theme-test-page {
    padding: var(--spacing-md);
  }
  
  .test-container {
    padding: 0;
  }
  
  .gradient-test {
    flex-direction: column;
  }
  
  .control-buttons {
    flex-direction: column;
  }
  
  .control-buttons button {
    width: 100%;
  }
}
</style>