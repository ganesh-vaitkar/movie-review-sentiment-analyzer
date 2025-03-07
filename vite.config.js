import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/movie-review-sentiment-analyzer/',  // Repository name with correct case
  server: {
    proxy: {
      '/api': {
        target: 'http://172.105.58.210',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
