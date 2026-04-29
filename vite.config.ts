import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    // NÃO expor nenhum secret via define — usar import.meta.env diretamente
    // As variáveis VITE_* são injetadas automaticamente pelo Vite

    build: {
      target: 'es2022',
      sourcemap: mode === 'development', // sourcemap apenas em dev
      rollupOptions: {
        output: {
          // Code splitting manual para melhor cache
          manualChunks: {
            'firebase-app':  ['firebase/app'],
            'firebase-auth': ['firebase/auth'],
            'firebase-firestore': ['firebase/firestore'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['motion', 'lucide-react'],
          },
        },
      },
      // Avisar se chunk > 500kb
      chunkSizeWarningLimit: 500,
    },

    server: {
      port: 3000,
      host: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    preview: {
      port: 4173,
    },
  };
});
