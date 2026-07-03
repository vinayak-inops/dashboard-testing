import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Improves LCP — splits vendor code so the main app chunk stays small
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'icons': ['lucide-react'],
        },
      },
    },
    // Inline small assets to cut round-trips
    assetsInlineLimit: 4096,
    // Generate source maps for production debugging without exposing source
    sourcemap: false,
    // Target modern browsers — smaller, faster output
    target: 'es2020',
    // CSS code splitting: each chunk only loads the CSS it needs
    cssCodeSplit: true,
  },
  // Enable gzip compression hints for the dev server
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  // Preview server headers (mimics prod)
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
});
