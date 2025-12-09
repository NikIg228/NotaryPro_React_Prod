import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Разрешаем обслуживание файлов из корня проекта
      strict: false,
    },
    hmr: {
      protocol: 'ws',
    },
    middlewareMode: false,
  },
  optimizeDeps: {
    // Исключаем documents.json из предварительной оптимизации
    exclude: ['../data/documents.json'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            // React and React DOM
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            // React Router
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'vendor-forms'
            }
            // All other node_modules
            return 'vendor'
          }
        },
        // Правильные расширения для модулей
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    // Убеждаемся, что модули правильно обрабатываются
    target: 'esnext',
    modulePreload: {
      polyfill: true,
    },
    // Increase chunk size warning limit to 600kb (optional, but helps reduce noise)
    chunkSizeWarningLimit: 600,
  },
})

