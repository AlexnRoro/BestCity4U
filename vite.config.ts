import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Best-City-for-You/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
