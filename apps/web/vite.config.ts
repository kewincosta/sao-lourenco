import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
