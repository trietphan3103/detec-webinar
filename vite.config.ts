import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.APP_URL': JSON.stringify(env.APP_URL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/analytics': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/api/analytics/ads': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/api/submit': {
          target: env.DETEC_API_URL || 'https://detec-webinar.mona.academy',
          changeOrigin: true,
          rewrite: () => '/api/users',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('X-API-Key', env.DETEC_API_KEY || '');
              proxyReq.setHeader('Content-Type', 'application/json');
            });
          },
        },
      },
    },
  };
});
