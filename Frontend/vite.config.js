import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'frontend/dist', // Ensure this matches the Vercel config
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
