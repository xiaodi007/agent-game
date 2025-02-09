import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow external access
    port: 5173,       // Specify the port (default is 5173)
    proxy: {
      '/api/': {
        target: 'http://47.109.181.169:11030', // 目标服务器
        // target: 'http://47.109.83.232:3037', // 目标服务器
        changeOrigin: true,
      }
    },
    cors: true
  }
})
