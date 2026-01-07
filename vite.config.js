import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler') || id.includes('@remix-run')) {
              return 'react-core';
            }
            if (id.includes('framer-motion') || id.includes('react-icons') || id.includes('react-toastify') || id.includes('sweetalert2')) {
              return 'ui-libs';
            }
            return 'vendor';
          }
        },
      },
    },
  },
})
