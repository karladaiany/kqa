import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: id => {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') &&
              !id.includes('react-icons') &&
              !id.includes('react-toastify') &&
              !id.includes('react-copy')
            ) {
              return 'vendor-react';
            }
            if (id.includes('@faker-js/faker')) {
              if (id.includes('/locale/')) {
                return 'vendor-faker-locales';
              }
              if (id.includes('/modules/')) {
                return 'vendor-faker-modules';
              }
              return 'vendor-faker-core';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('react-toastify')) {
              return 'vendor-toast';
            }
            if (id.includes('react-copy-to-clipboard')) {
              return 'vendor-clipboard';
            }
            if (id.includes('crypto-js')) {
              return 'vendor-crypto';
            }
            return 'vendor-misc';
          }

          if (id.includes('src/components/ComplementaryData')) {
            return 'comp-complementary';
          }
          if (id.includes('src/components/FileGenerator')) {
            return 'comp-file-generator';
          }
          if (id.includes('src/generators/person')) {
            return 'gen-person';
          }
          if (id.includes('src/generators/document')) {
            return 'gen-document';
          }
          if (id.includes('src/generators/company')) {
            return 'gen-company';
          }
          if (id.includes('src/generators/product')) {
            return 'gen-product';
          }
          if (id.includes('src/generators')) {
            return 'generators-misc';
          }
          if (
            id.includes('src/hooks/use') &&
            (id.includes('Performance') ||
              id.includes('Debounce') ||
              id.includes('Throttle'))
          ) {
            return 'hooks-performance';
          }
          if (id.includes('src/hooks')) {
            return 'hooks-main';
          }
          if (id.includes('src/utils/security')) {
            return 'utils-security';
          }
          if (id.includes('src/utils/analytics')) {
            return 'utils-analytics';
          }
          if (id.includes('src/utils/accessibility')) {
            return 'utils-accessibility';
          }
          if (id.includes('src/utils/performance')) {
            return 'utils-performance';
          }
          if (id.includes('src/utils')) {
            return 'utils-main';
          }
        },
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.js', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: assetInfo => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash].${ext}`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
        entryFileNames: `js/[name]-[hash].js`,
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          'console.log',
          'console.info',
          'console.debug',
          'console.warn',
        ],
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
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
