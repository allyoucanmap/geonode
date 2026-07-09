import { readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Emulate the browser import map: bare shared specifiers resolve to the built
// vendor chunks, so this test exercises the real singleton wiring.
const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const vendor = pathToFileURL(here('../../static/client/vendor/')).href
const { chunks } = JSON.parse(readFileSync(here('../shared-runtime.json'), 'utf8'))
const MAP = {}
for (const [chunk, specifiers] of Object.entries(chunks)) for (const s of specifiers) MAP[s] = vendor + chunk

export async function resolve(specifier, context, next) {
  return MAP[specifier] ? { url: MAP[specifier], shortCircuit: true } : next(specifier, context)
}
