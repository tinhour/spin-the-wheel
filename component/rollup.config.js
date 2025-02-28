const typescript = require('@rollup/plugin-typescript');
const vue = require('rollup-plugin-vue');
const { defineConfig } = require('rollup');
const postcss = require('rollup-plugin-postcss');
const copy = require('rollup-plugin-copy');
console.log('Building Vue component...');
module.exports = defineConfig([
  // Vue build
  {
    input: 'src/vue/LuckyWheel.vue',
    output: [
      {
        file: 'dist/vue/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/vue/index.esm.js',
        format: 'es',
      },
    ],
    plugins: [
      vue(),
      typescript({
        declaration: true,
        declarationDir: 'dist/vue',
        rootDir: 'src/vue',
      }),
      postcss(),
      copy({
        targets: [
          { src: 'src/vue/assets/*', dest: 'dist/vue/assets' }
        ]
      }),
    ],
    external: ['vue'],
  },
  // React build
  {
    input: 'src/react/LuckyWheel.tsx',
    output: [
      {
        file: 'dist/react/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/react/index.esm.js',
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: 'dist/react',
        rootDir: 'src/react',
      }),
      postcss(),
      copy({
        targets: [
          { src: 'src/react/assets/*', dest: 'dist/react/assets' }
        ]
      }),
    ],
    external: ['react', 'react-dom'],
  },
]);