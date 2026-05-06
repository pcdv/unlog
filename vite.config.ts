import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html', open: false, gzipSize: true }),
  ],
  base: '/unlog/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/victory-vendor')) {
            return 'recharts'
          }
          if (id.includes('node_modules/@reduxjs') || id.includes('node_modules/react-redux') || id.includes('node_modules/reselect') || id.includes('node_modules/immer')) {
            return 'redux'
          }
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react-is') || id.includes('node_modules/scheduler')) {
            return 'react-dom'
          }
        },
      },
    },
  },
})
