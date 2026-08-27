import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
          fontawesome: ['@fortawesome/fontawesome-free'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? ''
          const ext = name.split('.').pop() ?? ''
          if (/\.(css)$/.test(name)) {
            return `css/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg|ico|webp)$/.test(name)) {
            return `img/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'],
      },
      format: {
        comments: false,
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    cssCodeSplit: true,
    cssTarget: 'chrome80',
  },
  optimizeDeps: {
    include: ['vue', 'axios'],
    exclude: [],
  },
  server: {
    fs: {
      strict: false,
    },
    hmr: {
      overlay: false,
    },
  },
  css: {
    devSourcemap: false,
  },
})
