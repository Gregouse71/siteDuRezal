import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep the massive XLSX library separate (already dynamic, but helps naming)
            if (id.includes('xlsx')) {
              return 'vendor_xlsx';
            }
            // Group MUI and Emotion together as they are tightly coupled
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor_mui';
            }
            // Group all other core libraries (React, Recoil, Axios, etc.) 
            // together to avoid circular dependencies between them.
            return 'vendor';
          }
        },
      },
    },
  },
})