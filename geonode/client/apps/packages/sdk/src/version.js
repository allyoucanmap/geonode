export const SDK_VERSION = '1.0.0'

export function isCompatible(range) {
  if (!range) return true
  const want = String(range).match(/\d+/)
  return !want || want[0] === SDK_VERSION.split('.')[0]
}
