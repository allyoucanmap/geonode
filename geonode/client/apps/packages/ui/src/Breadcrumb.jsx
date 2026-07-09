import styles from './Breadcrumb.module.css'

function defaultLink(item, className) {
  return (
    <a href={item.to} className={className}>
      {item.label}
    </a>
  )
}

/**
 * Breadcrumb trail; renders nothing with one or fewer crumbs.
 * @param {{label: import('react').ReactNode, to?: string}[]} props.items Last entry is the current page.
 * @param {(item: object, className: string) => import('react').ReactNode} [props.renderLink] Wraps navigation; defaults to an anchor.
 * @param {string} [props.className]
 */
export function Breadcrumb({
  items,
  renderLink = defaultLink,
  className,
}) {
  const crumbs = items.filter(Boolean)
  if (crumbs.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={styles.list}>
        {crumbs.map((item, i) => {
          const last = i === crumbs.length - 1
          return (
            <li key={item.to ?? item.label} aria-current={last ? 'page' : undefined}>
              {last ? item.label : renderLink(item, styles.link)}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
