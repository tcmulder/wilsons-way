import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure all assets are properly referenced
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Base path for static assets (use './' for relative paths)
  base: './',
})
