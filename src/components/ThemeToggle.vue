<template>
  <button
    class="theme-toggle-btn"
    @click="toggleTheme"
    :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
    :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
  >
    <div class="theme-toggle-icon">
      <svg
        v-if="isDark"
        class="sun-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.591a.75.75 0 101.06 1.06l1.591-1.591zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.591-1.591a.75.75 0 10-1.06 1.06l1.591 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.591a.75.75 0 001.06 1.06l1.591-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.591-1.591a.75.75 0 00-1.06 1.06l1.591 1.591z" />
      </svg>
      <svg
        v-else
        class="moon-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
      </svg>
    </div>
    <span class="theme-toggle-text">{{ isDark ? '浅色' : '深色' }}</span>
    <div class="theme-toggle-bg" :class="{ 'dark': isDark }"></div>
  </button>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useTheme } from '../composables/useTheme.js';

const { isDark, toggleTheme } = useTheme();

// 添加切换动画
const addSwitchAnimation = () => {
  const button = document.querySelector('.theme-toggle-btn');
  if (button) {
    button.classList.add('switching');
    setTimeout(() => {
      button.classList.remove('switching');
    }, 500);
  }
};

// 监听主题变化并添加动画
watch(isDark, (newDark, oldDark) => {
  if (newDark !== oldDark) {
    addSwitchAnimation();
  }
});
</script>

<style scoped>
.theme-toggle-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
  min-height: 40px;
  min-width: 100px;
  justify-content: center;
  align-items: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.theme-toggle-btn::before {
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

.theme-toggle-btn:hover {
  border-color: var(--text-accent);
  transform: translateY(-1px);
  box-shadow: var(--soft-shadow);
}

.theme-toggle-btn:hover::before {
  opacity: 0.1;
}

.theme-toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: all var(--transition-normal);
}

.sun-icon, .moon-icon {
  width: 18px;
  height: 18px;
  transition: all var(--transition-normal);
}

.theme-toggle-btn:hover .sun-icon,
.theme-toggle-btn:hover .moon-icon {
  transform: scale(1.1);
}

.theme-toggle-text {
  font-weight: 600;
  color: var(--text-primary);
  transition: color var(--transition-normal);
}

.theme-toggle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: var(--main-gradient);
  border-radius: 12px;
  transition: width var(--transition-slow);
  z-index: -1;
}

.theme-toggle-bg.dark {
  width: 100%;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .theme-toggle-btn {
    min-width: 80px;
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
  
  .theme-toggle-icon {
    width: 16px;
    height: 16px;
  }
  
  .sun-icon, .moon-icon {
    width: 14px;
    height: 14px;
  }
}

/* 无障碍支持 */
.theme-toggle-btn:focus {
  outline: 2px solid var(--text-accent);
  outline-offset: 2px;
}

.theme-toggle-btn:active {
  transform: translateY(0px);
}

/* 加载动画 */
@keyframes theme-switch {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}

.theme-toggle-btn.switching {
  animation: theme-switch 0.5s ease-in-out;
}
</style>