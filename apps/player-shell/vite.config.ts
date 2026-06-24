import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Workspace packages are consumed as TypeScript source (no build step) via
 * aliases. This keeps the dev loop fast and means the shell always builds the
 * theme through its package entry point — never by reaching into token files.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@mts/theme-kit': resolve(__dirname, '../../packages/theme-kit/src'),
      'theme-tenant-alpha': resolve(__dirname, '../../themes/theme-tenant-alpha/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
