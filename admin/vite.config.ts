import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Admin chạy trên cổng 3002 để không đụng frontend (3000) và backend (3001).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    host: true,
  },
});
