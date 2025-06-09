import { createApp } from 'vue'
import './style.css'
// 只加载需要的图标，而不是整个FontAwesome库
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/css/solid.css'
import App from './App.vue'
import { lazyLoad, preloadCriticalAssets } from './utils/performance.js'

// 启用性能优化
const app = createApp(App)

// 添加懒加载指令
app.directive('lazy', lazyLoad)

// 预加载关键资源
preloadCriticalAssets()

// 生产环境禁用开发工具
if (import.meta.env.PROD) {
  app.config.devtools = false
  app.config.performance = false
  
  // 注册Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

app.mount('#app')
