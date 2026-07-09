// Thin wrapper around the GeoNode REST API v2.
// Centralizes base URL, CSRF/auth headers, and error handling
// so every app and hook shares one implementation.

let API_BASE = '/api/v2'

export function configureApi({ baseUrl } = {}) {
  if (baseUrl) API_BASE = baseUrl
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[2]) : null
}

export async function apiFetch(path, { method = 'GET', body, headers, ...rest } = {}) {
  const isMutation = method !== 'GET' && method !== 'HEAD'
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(isMutation ? { 'X-CSRFToken': getCookie('csrftoken') } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`${method} ${path} failed (${res.status}): ${detail}`)
  }

  return res.status === 204 ? null : res.json()
}
