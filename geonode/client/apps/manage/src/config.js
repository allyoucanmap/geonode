// Runtime config injected by the Django shell (#manage-config)
function readConfig() {
  const el = document.getElementById('manage-config')
  if (!el) return {}
  try {
    return JSON.parse(el.textContent)
  } catch {
    return {}
  }
}

const config = readConfig()

export const APP_ID = 'manage'

export const BASENAME = config.basename || '/manage'
export const API_BASE = config.apiBase || '/api/v2'

export const EXTENSIONS = config.extensions || []
