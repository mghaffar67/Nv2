import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// Added import for fileURLToPath to define __dirname in an ES module environment
import { fileURLToPath } from 'url';

// Define __filename and __dirname for ESM compatibility to fix "__dirname is not defined" error
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix: __dirname is now defined for ESM
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend Command Center
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
});
