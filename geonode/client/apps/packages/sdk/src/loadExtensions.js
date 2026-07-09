import { SDK_VERSION, isCompatible } from './version.js'

export async function loadExtensions(descriptors = []) {
  const entries = []
  for (const { id, url, sdkRange } of descriptors) {
    if (sdkRange && !isCompatible(sdkRange)) {
      console.warn(`[geonode] extension "${id}" targets SDK ${sdkRange}, host is ${SDK_VERSION}; skipping.`)
      continue
    }
    try {
      const mod = await import(/* @vite-ignore */ url)
      const entry = mod.default ?? mod.module
      if (entry == null) {
        console.warn(`[geonode] extension "${id}" at ${url} exported no manifest; skipping.`)
        continue
      }
      entries.push(entry)
    } catch (error) {
      console.error(`[geonode] failed to load extension "${id}" from ${url}`, error)
    }
  }
  return entries
}
