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
  },
  optimizeDeps: {
    // Исключаем documents.json из предварительной оптимизации
    exclude: ['../data/documents.json'],
  },
})

