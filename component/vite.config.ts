import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isVue = mode.includes('vue');
  const isVue3 = mode === 'vue3';
  
  return {
    plugins: isVue ? [
      vue({
        include: [/\.vue$/],
        template: {
          compilerOptions: {
            isCustomElement: (tag) => false
          }
        }
      })
    ] : [react()],
    root: isVue ? `examples/${isVue3 ? 'vue3' : 'vue'}` : 'examples/react',
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, isVue ? (isVue3 ? './src/vue3' : './src/vue') : './src/react'),
        'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    optimizeDeps: {
      include: ['vue']
    },
    build: {
      outDir: isVue ? `./dist/${isVue3 ? 'vue3' : 'vue'}` : './dist/react'
    }
  };
}); 