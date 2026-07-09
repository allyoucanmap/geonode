import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const GEONODE_BACKEND = process.env.GEONODE_BACKEND || 'http://localhost'
// For a subpath install set MANAGE_BASE to "<FORCE_SCRIPT_NAME>/static/manage/".
const MANAGE_BASE = process.env.MANAGE_BASE || '/static/manage/'

// Externalized on build (shared vendor chunks); bundled in dev for one-graph HMR.
const shared = JSON.parse(readFileSync(fileURLToPath(new URL('../shared-runtime.json', import.meta.url)), 'utf8'))
const SHARED = Object.values(shared.chunks).flat()

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: MANAGE_BASE,
  build: {
    outDir: fileURLToPath(new URL('../../static/manage', import.meta.url)),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: fileURLToPath(new URL('src/main.jsx', import.meta.url)),
      external: command === 'build' ? SHARED : [],
    },
  },
  server: {
    origin: 'http://localhost:5173',
    cors: { origin: GEONODE_BACKEND },
    proxy: {
      '/api': { target: GEONODE_BACKEND, changeOrigin: true },
      '/o': { target: GEONODE_BACKEND, changeOrigin: true },
      '/account': { target: GEONODE_BACKEND, changeOrigin: true },
    },
  },
}))
