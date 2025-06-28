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
      explanationsPath: 'C:/Users/burak/Desktop/prep/DSA_Approaches/explanations'
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
