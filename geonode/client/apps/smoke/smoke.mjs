import assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'
import react from '@vitejs/plugin-react'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const { chunks } = JSON.parse(readFileSync(here('../shared-runtime.json'), 'utf8'))
const SHARED = Object.values(chunks).flat()
const vendor = pathToFileURL(here('../../static/client/vendor/')).href

await build({
  configFile: false,
  logLevel: 'error',
  plugins: [react()],
  build: {
    outDir: here('dist'),
    emptyOutDir: true,
    minify: false,
    target: 'esnext',
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      input: { fixture: here('fixture.js') },
      external: SHARED,
      output: { format: 'es', entryFileNames: '[name].js' },
    },
  },
})

const sdk = await import(`${vendor}sdk.js`)
const reactNs = await import(`${vendor}react.js`)
const rq = await import(`${vendor}react-query.js`)
const fixtureUrl = pathToFileURL(here('dist/fixture.js')).href

// loadExtensions: fetch + import + version gate only; returns raw entries.
const entries = await sdk.loadExtensions([
  { id: 'smoke', url: fixtureUrl, sdkRange: '^1' },
  { id: 'bad', url: fixtureUrl, sdkRange: '^2' },
])
assert.strictEqual(entries.length, 1, 'version gate should drop the ^2 extension')
assert.strictEqual(typeof entries[0], 'function', 'loadExtensions returns the raw entry (a factory here), unresolved')

// registerModules: the shared seam - resolve factories, validate, default,
// dedup by id (first wins) - over in-repo modules and extensions alike.
const core = { id: 'core', navEntry: { label: 'Core', path: '/core' }, routes: { path: 'core' } }
const dupExternal = { id: 'core', navEntry: { label: 'Dup', path: '/dup' }, routes: { path: 'dup' } }
const invalid = { id: 'no-routes', navEntry: { label: 'X', path: '/x' } }
// One source that resolves to an array of manifests (a bundle exporting >1 module).
const pair = [
  { id: 'alpha', navEntry: { label: 'Alpha', path: '/alpha' }, routes: { path: 'alpha' } },
  { id: 'beta', navEntry: { label: 'Beta', path: '/beta' }, routes: { path: 'beta' } },
]
const modules = await sdk.registerModules([core, ...entries, dupExternal, invalid, pair], { app: 'manage' })

const fixture = await import(fixtureUrl)
const smoke = modules.find((m) => m.id === 'smoke')
assert.ok(smoke, 'a factory manifest should be resolved and registered')
assert.strictEqual(smoke.navEntry.path, '/smoke')
assert.strictEqual(smoke.routes.path, 'smoke')
assert.deepStrictEqual(smoke.requiredPermissions, [], 'requiredPermissions defaults to []')
assert.strictEqual(fixture.probe.app, 'manage', 'ctx.app must reach the factory')
assert.strictEqual(modules.filter((m) => m.id === 'core').length, 1, 'duplicate id is deduped')
assert.strictEqual(modules.find((m) => m.id === 'core').navEntry.path, '/core', 'first registration wins on dedup')
assert.ok(!modules.some((m) => m.id === 'no-routes'), 'a manifest without routes is dropped')
assert.ok(
  modules.some((m) => m.id === 'alpha') && modules.some((m) => m.id === 'beta'),
  'a source resolving to an array registers every manifest in it',
)
assert.strictEqual(fixture.probe.useState, reactNs.useState, 'React must be a single shared instance')
assert.strictEqual(fixture.probe.useQuery, rq.useQuery, 'react-query must be a single shared instance')
console.log('smoke OK: single React + react-query, version gate, registerModules (resolve/validate/dedup/array)')
