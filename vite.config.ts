/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages project sites are served at /<repo-name>/ using the repo's exact
// casing (case-sensitive), so this must match "Uhrenheld", not "uhrenheld".
export default defineConfig({
  base: '/Uhrenheld/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg', 'icon-maskable.svg', 'robots.txt'],
      manifest: {
        name: 'Uhrenheld',
        short_name: 'Uhrenheld',
        description: 'Lerne spielerisch die Uhr lesen und mit Zeit rechnen.',
        lang: 'de',
        start_url: '/Uhrenheld/',
        scope: '/Uhrenheld/',
        display: 'standalone',
        background_color: '#fff7ed',
        theme_color: '#f97316',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**'],
      reporter: ['text', 'html'],
    },
  },
});
