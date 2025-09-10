import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-slot'],
          utils: ['axios', 'clsx', 'jwt-decode'],
          animations: ['framer-motion', 'gsap'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 0, // Don't inline large assets like videos
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Node.js API server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
