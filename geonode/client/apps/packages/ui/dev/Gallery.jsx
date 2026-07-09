import { useEffect, useState } from 'react'
import styles from './Gallery.module.css'

// Drop a `*.examples.jsx` file in ./examples and it appears here - no registry
// to edit. Each module default-exports { title, order?, scenarios: [{name, render}] }.
const registry = Object.values(import.meta.glob('./examples/*.examples.jsx', { eager: true }))
  .map((mod) => mod.default)
  .filter(Boolean)
  .sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.title.localeCompare(b.title))

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const params = new URLSearchParams(window.location.search)
// ?only=Layout isolates one component; &scenario=full-page one scenario -
// deterministic, tightly-cropped targets for headless screenshots.
const only = params.get('only')
const onlyScenario = params.get('scenario')

function Stage({ id, name, render }) {
  return (
    <section className={styles.stage} id={id} data-stage={id}>
      <div className={styles.stageLabel}>{name}</div>
      <div className={styles.stageBody}>{render()}</div>
    </section>
  )
}

export function Gallery() {
  const [theme, setTheme] = useState(params.get('theme') || 'auto')

  useEffect(() => {
    // No data-theme means follow prefers-color-scheme; light/dark force it.
    if (theme === 'auto') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
  }, [theme])

  const shown = only ? registry.filter((m) => slug(m.title) === slug(only)) : registry

  return (
    <div className={styles.root}>
      <header className={styles.toolbar}>
        <span className={styles.brand}>@geonode/ui</span>
        <nav className={styles.nav}>
          {registry.map((m) => (
            <a key={m.title} href={`#${slug(m.title)}`} className={styles.navLink}>
              {m.title}
            </a>
          ))}
        </nav>
        <label className={styles.themeToggle}>
          theme
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="auto">auto</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
      </header>

      <main className={styles.content}>
        {shown.map((m) => {
          const scenarios = onlyScenario
            ? m.scenarios.filter((s) => slug(s.name) === slug(onlyScenario))
            : m.scenarios
          return (
            <article key={m.title} className={styles.group} id={slug(m.title)}>
              <h2 className={styles.groupTitle}>{m.title}</h2>
              <div className={styles.stages}>
                {scenarios.map((s) => (
                  <Stage key={s.name} id={`${slug(m.title)}--${slug(s.name)}`} name={s.name} render={s.render} />
                ))}
              </div>
            </article>
          )
        })}
      </main>
    </div>
  )
}
