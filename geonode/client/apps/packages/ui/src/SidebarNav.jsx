import styles from './SidebarNav.module.css'

function defaultLink(item, className) {
  return (
    <a href={item.to} className={className}>
      {item.label}
    </a>
  )
}

function Items({ items, renderLink }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.to ?? item.label}>{renderLink(item, styles.link)}</li>
      ))}
    </ul>
  )
}

/**
 * Sidebar navigation for a module shell. Presentational and router-agnostic; active styling keys off aria-current="page" (set by react-router NavLink).
 * @param {{label: string, to: string, end?: boolean}[]} [props.items] Top-level links.
 * @param {{title: string, items?: object[], loading?: boolean}[]} [props.sections] Grouped, optionally async sub-navigation.
 * @param {(item: object, className: string) => import('react').ReactNode} [props.renderLink] Navigation wrapper.
 */
export function SidebarNav({
  items = [],
  sections = [],
  renderLink = defaultLink,
}) {
  return (
    <nav className={styles.nav}>
      <Items items={items} renderLink={renderLink} />
      {sections.map((sec) => (
        <div key={sec.title} className={styles.section}>
          <h3 className={styles.sectionTitle}>{sec.title}</h3>
          {sec.loading ? <p className={styles.muted}>…</p> : <Items items={sec.items ?? []} renderLink={renderLink} />}
        </div>
      ))}
    </nav>
  )
}
