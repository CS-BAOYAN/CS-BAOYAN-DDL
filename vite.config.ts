import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  // BASE_URL: '/' for root domain, '/CS-BAOYAN-DDL/' for GitHub Pages subpath
  base: process.env.BASE_URL || '/',
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      $lib: path.resolve('src/lib'),
      $data: path.resolve('src/data'),
      $components: path.resolve('src/components'),
    },
  },
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    sourcemap: false,
  },
  server: {
    port: 5180,
    strictPort: false,
  },
});
