import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/background/service-worker.ts'),
      formats: ['iife'],
      name: 'VandyRMPSW',
      fileName: () => 'service-worker.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    copyPublicDir: false,
  },
});
