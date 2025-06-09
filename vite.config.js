import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  base: '/',
  root: './',
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'cypress/',
        'dist/',
        'public/',
      ],
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 3000,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-faker': ['@faker-js/faker'],
          'vendor-utils': [
            'crypto-js',
            'react-copy-to-clipboard',
            'react-toastify',
            'react-icons',
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-icons/fa',
      'react-toastify',
      'crypto-js',
      'react-copy-to-clipboard',
    ],
    exclude: ['@faker-js/faker/locale', '@faker-js/faker/dist/esm'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
