import { ref, computed, watch, onMounted } from 'vue';

// 主题配置
const THEME_STORAGE_KEY = 'ctelspecu-theme';
const THEME_CLASS = 'theme-dark';

export function useTheme() {
  // 默认深色模式
  const isDark = ref(true);
  const isInitialized = ref(false);

  // 主题相关计算属性
  const themeClass = computed(() => isDark.value ? THEME_CLASS : 'theme-light');
  const themeIcon = computed(() => isDark.value ? 'sun' : 'moon');

  // 初始化主题
  const initTheme = () => {
    try {
      // 1. 检查本地存储
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        isDark.value = savedTheme === 'dark';
      } else {
        // 2. 检查系统偏好（仅在本地没有存储时）
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDark.value = prefersDark;
      }
      
      // 3. 应用主题
      applyTheme();
      isInitialized.value = true;
    } catch (error) {
      console.warn('Failed to initialize theme:', error);
      isDark.value = true; // 默认深色模式
      applyTheme();
      isInitialized.value = true;
    }
  };

  // 应用主题
  const applyTheme = () => {
    try {
      if (isDark.value) {
        document.documentElement.classList.add(THEME_CLASS);
        document.documentElement.classList.remove('theme-light');
      } else {
        document.documentElement.classList.add('theme-light');
        document.documentElement.classList.remove(THEME_CLASS);
      }
      
      // 保存到本地存储
      localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? 'dark' : 'light');
      
      // 更新 CSS 变量
      updateCSSVariables();
    } catch (error) {
      console.warn('Failed to apply theme:', error);
    }
  };

  // 更新 CSS 变量
  const updateCSSVariables = () => {
    const root = document.documentElement;
    
    if (isDark.value) {
      // 深色模式变量
      root.style.setProperty('--background-primary', '#0f0f0f');
      root.style.setProperty('--background-primary-alt', '#1a1a1a');
      root.style.setProperty('--background-secondary', '#1e1e1e');
      root.style.setProperty('--background-secondary-alt', '#252525');
      root.style.setProperty('--background-tertiary', '#2a2a2a');
      root.style.setProperty('--background-trans', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--background-backdrop', 'rgba(15, 15, 15, 0.9)');
      root.style.setProperty('--background-glass', 'rgba(30, 30, 30, 0.7)');
      
      root.style.setProperty('--text-primary', '#e0e0e0');
      root.style.setProperty('--text-secondary', '#b0b0b0');
      root.style.setProperty('--text-tertiary', '#808080');
      root.style.setProperty('--text-quaternary', '#606060');
      
      root.style.setProperty('--text-accent', '#00d4ff');
      root.style.setProperty('--text-sub-accent', '#ff006e');
      root.style.setProperty('--text-gradient-primary', '#00d4ff');
      root.style.setProperty('--text-gradient-secondary', '#7c3aed');
      root.style.setProperty('--text-gradient-tertiary', '#ff006e');
      
      root.style.setProperty('--text-link', '#00d4ff');
      root.style.setProperty('--text-link-hover', '#00b8e6');
      root.style.setProperty('--text-link-active', '#0099cc');
      
      root.style.setProperty('--border-primary', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--border-secondary', 'rgba(255, 255, 255, 0.05)');
      
      root.style.setProperty('--glow-primary', '0 0 20px rgba(0, 212, 255, 0.3)');
      root.style.setProperty('--glow-secondary', '0 0 20px rgba(124, 58, 237, 0.3)');
      root.style.setProperty('--glow-accent', '0 0 20px rgba(255, 0, 110, 0.3)');
      
      root.style.setProperty('--accent-shadow', '0 25px 50px -12px rgba(0, 212, 255, 0.25), 0 20px 25px -5px rgba(0, 212, 255, 0.1)');
      root.style.setProperty('--sub-accent-shadow', '0 25px 50px -12px rgba(124, 58, 237, 0.25), 0 20px 25px -5px rgba(124, 58, 237, 0.1)');
      root.style.setProperty('--soft-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');
      
      // 动态渐变
      root.style.setProperty('--main-gradient', 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 35%, #ff006e 70%, #ff6b35 100%)');
      root.style.setProperty('--strong-gradient', 'linear-gradient(45deg, #00d4ff 0%, #7c3aed 50%, #ff006e 100%)');
      root.style.setProperty('--sub-gradient', 'linear-gradient(90deg, rgba(0, 212, 255, 0.2) 0%, rgba(124, 58, 237, 0.2) 50%, rgba(255, 0, 110, 0.2) 100%)');
    } else {
      // 浅色模式变量
      root.style.setProperty('--background-primary', '#ffffff');
      root.style.setProperty('--background-primary-alt', '#f8f9fa');
      root.style.setProperty('--background-secondary', '#f8f9fa');
      root.style.setProperty('--background-secondary-alt', '#e9ecef');
      root.style.setProperty('--background-tertiary', '#dee2e6');
      root.style.setProperty('--background-trans', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--background-backdrop', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--background-glass', 'rgba(255, 255, 255, 0.7)');
      
      root.style.setProperty('--text-primary', '#212529');
      root.style.setProperty('--text-secondary', '#495057');
      root.style.setProperty('--text-tertiary', '#6c757d');
      root.style.setProperty('--text-quaternary', '#adb5bd');
      
      root.style.setProperty('--text-accent', '#0066cc');
      root.style.setProperty('--text-sub-accent', '#cc0066');
      root.style.setProperty('--text-gradient-primary', '#0066cc');
      root.style.setProperty('--text-gradient-secondary', '#6633cc');
      root.style.setProperty('--text-gradient-tertiary', '#cc0066');
      
      root.style.setProperty('--text-link', '#0066cc');
      root.style.setProperty('--text-link-hover', '#0052a3');
      root.style.setProperty('--text-link-active', '#003d80');
      
      root.style.setProperty('--border-primary', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--border-secondary', 'rgba(0, 0, 0, 0.05)');
      
      root.style.setProperty('--glow-primary', '0 0 20px rgba(0, 102, 204, 0.3)');
      root.style.setProperty('--glow-secondary', '0 0 20px rgba(102, 51, 204, 0.3)');
      root.style.setProperty('--glow-accent', '0 0 20px rgba(204, 0, 102, 0.3)');
      
      root.style.setProperty('--accent-shadow', '0 25px 50px -12px rgba(0, 102, 204, 0.25), 0 20px 25px -5px rgba(0, 102, 204, 0.1)');
      root.style.setProperty('--sub-accent-shadow', '0 25px 50px -12px rgba(102, 51, 204, 0.25), 0 20px 25px -5px rgba(102, 51, 204, 0.1)');
      root.style.setProperty('--soft-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');
      
      // 浅色模式渐变
      root.style.setProperty('--main-gradient', 'linear-gradient(135deg, #0066cc 0%, #6633cc 35%, #cc0066 70%, #cc6633 100%)');
      root.style.setProperty('--strong-gradient', 'linear-gradient(45deg, #0066cc 0%, #6633cc 50%, #cc0066 100%)');
      root.style.setProperty('--sub-gradient', 'linear-gradient(90deg, rgba(0, 102, 204, 0.2) 0%, rgba(102, 51, 204, 0.2) 50%, rgba(204, 0, 102, 0.2) 100%)');
    }
  };

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme();
  };

  // 设置主题
  const setTheme = (dark) => {
    isDark.value = dark;
    applyTheme();
  };

  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // 仅当用户没有手动设置主题时才跟随系统
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === null) {
        isDark.value = e.matches;
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  };

  // 监听主题变化
  watch(isDark, (newDark) => {
    if (isInitialized.value) {
      applyTheme();
    }
  });

  // 组件挂载时初始化
  onMounted(() => {
    initTheme();
    
    // 设置系统主题监听
    const cleanup = setupSystemThemeListener();
    
    // 返回清理函数
    return cleanup;
  });

  return {
    isDark: computed(() => isDark.value),
    themeClass,
    themeIcon,
    toggleTheme,
    setTheme,
    isInitialized
  };
}