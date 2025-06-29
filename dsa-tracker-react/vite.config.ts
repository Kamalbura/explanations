import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { viteBackendPlugin } from './src/plugins/vite-backend-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteBackendPlugin({
      port: 3001,
      explanationsPath: path.resolve('./..') // Use relative path instead of hardcoded user path
    })
  ],
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
