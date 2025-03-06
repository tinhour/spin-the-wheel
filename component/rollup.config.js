const vue = require('rollup-plugin-vue');
const typescript = require('rollup-plugin-typescript2'); 
const postcss = require('rollup-plugin-postcss');
const copy = require('rollup-plugin-copy');

const sharedConfig = {
  external: ['vue', 'react', 'react-dom', 'react/jsx-runtime'],
  plugins: [
    postcss()    
  ]
};

module.exports = [
  // Vue 2
  {
    input: 'src/vue/LuckyWheel.vue',
    output: [
      {
        file: 'dist/vue/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/vue/index.esm.js',
        format: 'es'
      }
    ],
    ...sharedConfig,
    plugins: [
      vue(),
      typescript({
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            "rootDir": "./src/vue",
            declaration: true,
            declarationDir: 'dist/vue/'
          }
        },
        useTsconfigDeclarationDir: true
      }),
      copy({
        targets: [
          { src: 'src/vue/assets/*', dest: 'dist/vue/assets' }
        ]
      }),
      ...sharedConfig.plugins
    ]
  },
  // React
  {
    input: 'src/react/LuckyWheel.tsx',
    output: [
      {
        file: 'dist/react/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/react/index.esm.js',
        format: 'es'
      }
    ],
    ...sharedConfig,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            "rootDir": "./src/react",
            declaration: true,
            declarationDir: 'dist/react/'
          }
        },
        useTsconfigDeclarationDir: true
      }),
      copy({
        targets: [
          { src: 'src/react/assets/*', dest: 'dist/react/assets' }
        ]
      }),
      ...sharedConfig.plugins
    ]
  },

  // Vue 3
  {
    input: 'src/vue3/LuckyWheel.vue',
    output: [
      {
        file: 'dist/vue3/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/vue3/index.esm.js',
        format: 'es'
      }
    ],
    ...sharedConfig,
    plugins: [
      vue({
        preprocessStyles: true,
        defaultLang: { script: 'ts' }
      }),      
      typescript({
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            "rootDir": "./src/vue3",
            declaration: true,
            declarationDir: 'dist/vue3/'
          }
        },
        useTsconfigDeclarationDir: true
      }),
      copy({
        targets: [
          { src: 'src/vue3/assets/*', dest: 'dist/vue3/assets' }
        ]
      }),
      ...sharedConfig.plugins
    ]
  },
];