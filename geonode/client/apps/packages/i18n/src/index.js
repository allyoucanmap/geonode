// Thin wrapper over the globals defined by Django's JavaScriptCatalog
export const gettext = (s) => (window.gettext ? window.gettext(s) : s)

export const ngettext = (s, p, n) => (window.ngettext ? window.ngettext(s, p, n) : n === 1 ? s : p)

// Django's interpolate expects Python-style %(name)s placeholders + named=true.
export const interpolate = (fmt, vars) => (window.interpolate ? window.interpolate(fmt, vars, true) : fmt)

// Number/date localization is intentionally NOT handled here for now.
// When needed, use the native Intl API keyed by document.documentElement.lang
// (Django sets <html lang="...">), e.g.
//   new Intl.NumberFormat(document.documentElement.lang).format(value)
// Django's get_format() exposes the locale's separators too, if exact parity
// with server-rendered numbers is ever required.
