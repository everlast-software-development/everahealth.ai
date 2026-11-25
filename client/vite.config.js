import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  // The API's port comes from server/.env (PORT), so the two always agree; 5000 when it is not set
  const { PORT = '5000' } = loadEnv(mode, fileURLToPath(new URL('../server', import.meta.url)), 'PORT');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      // During development, every /api request is forwarded to the Node server
      proxy: { '/api': `http://localhost:${PORT}` },
    },
  };
});
