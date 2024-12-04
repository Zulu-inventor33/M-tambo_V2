import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // Django backend URL
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Strip the "/api" prefix
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react()],
})
