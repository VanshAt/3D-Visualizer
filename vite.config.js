import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/3D-Visualizer/',
  plugins: [react()],
  server: {
    watch: {
      // Exclude static asset folders that don't affect the build
      ignored: ['**/docs/**', '**/.git/**'],
    },
  },
})
