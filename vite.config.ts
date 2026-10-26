import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  base: '/',
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 首屏把第三方依赖拆开：react/tanstack/base-ui 各自独立缓存
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'vendor-router', test: /node_modules[\\/]@tanstack[\\/]/ },
            { name: 'vendor-ui', test: /node_modules[\\/](@base-ui[\\/]react|motion|lucide-react)[\\/]/ },
          ],
        },
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5180,
  },
})
