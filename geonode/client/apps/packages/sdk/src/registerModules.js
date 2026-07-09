import { SDK_VERSION } from './version.js'

function isValid(manifest) {
  return (
    manifest &&
    typeof manifest.id === 'string' &&
    manifest.id.length > 0 &&
    manifest.routes &&
    typeof manifest.routes === 'object'
  )
}

export async function registerModules(sources = [], ctx = {}) {
  const fullCtx = { sdkVersion: SDK_VERSION, ...ctx }
  const byId = new Map()
  for (const source of sources) {
    let resolved
    try {
      resolved = typeof source === 'function' ? await source(fullCtx) : source
    } catch (error) {
      console.error('[geonode] module factory threw; skipping', error)
      continue
    }
    for (const manifest of Array.isArray(resolved) ? resolved : [resolved]) {
      if (!isValid(manifest)) {
        console.error('[geonode] invalid module manifest (needs a non-empty id and routes); skipping', manifest)
        continue
      }
      if (byId.has(manifest.id)) {
        console.warn(`[geonode] duplicate module id "${manifest.id}"; keeping the first registration, skipping the rest`)
        continue
      }
      byId.set(manifest.id, { requiredPermissions: [], ...manifest })
    }
  }
  return [...byId.values()]
}
