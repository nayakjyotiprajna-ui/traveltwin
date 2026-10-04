import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import os from 'os'

// https://vite.dev/config/
// cacheDir is set to system temp to avoid EPERM errors from OneDrive locking files
export default defineConfig({
  plugins: [react()],
  cacheDir: path.join(os.tmpdir(), 'traveltwin-vite-cache'),
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      }
    }
  }
})
