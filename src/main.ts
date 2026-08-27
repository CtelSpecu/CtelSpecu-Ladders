import { createApp } from 'vue'
import './style.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/css/solid.css'
import '@fortawesome/fontawesome-free/css/brands.css'
import App from './App.vue'
import { lazyLoad, preloadCriticalAssets } from './utils/performance'

const app = createApp(App)

app.directive('lazy', lazyLoad)

preloadCriticalAssets()

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        void registration.unregister()
      }
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          }
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  })
}

app.mount('#app')
