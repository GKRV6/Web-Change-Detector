import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Multi-page app: both HorizonX dashboard and Axon landing
  build: {
    rollupOptions: {
      input: {
        main: import.meta.dirname + '/index.html',
        axon: import.meta.dirname + '/axon.html',
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/screenshots': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
