// Builds the shared vendor chunks (static/client/vendor).
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const CLIENT_BASE = process.env.CLIENT_BASE || '/static/client/'
const OUT = here('../static/client/vendor')

const { chunks } = JSON.parse(readFileSync(here('shared-runtime.json'), 'utf8'))
const ALL_SPECIFIERS = Object.values(chunks).flat()

const SOURCES = {
  'react.js': here('vendor/react-esm.js'),
  'react-router-dom.js': here('vendor/react-router-dom.js'),
  'react-query.js': here('vendor/react-query.js'),
  'i18n.js': here('packages/i18n/src/index.js'),
  'api.js': here('packages/api/src/index.js'),
  'ui.js': here('packages/ui/src/index.js'),
  'sdk.js': here('packages/sdk/src/index.js'),
}

let first = true
for (const [chunk, specifiers] of Object.entries(chunks)) {
  const input = SOURCES[chunk]
  if (!input) throw new Error(`shared-runtime.json: no entry source for chunk "${chunk}"`)
  const external = ALL_SPECIFIERS.filter((s) => !specifiers.includes(s))
  await build({
    configFile: false,
    logLevel: 'warn',
    plugins: [react()],
    base: CLIENT_BASE,
    build: {
      outDir: OUT,
      emptyOutDir: first,
      manifest: false,
      minify: true,
      target: 'esnext',
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        input: { [chunk.replace(/\.js$/, '')]: input },
        external,
        output: {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: 'shared/[name]-[hash].js',
          assetFileNames: (asset) => (asset.name?.endsWith('.css') ? '[name][extname]' : 'shared/[name]-[hash][extname]'),
        },
      },
    },
  })
  first = false
}
console.log('VENDOR BUILD DONE')
