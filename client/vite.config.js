import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // During development, every /api request is forwarded to the Node server
    proxy: { '/api': 'http://localhost:5000' },
  },
});
