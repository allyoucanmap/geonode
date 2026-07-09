import { Fragment } from 'react'
import styles from './Tabs.module.css'

function defaultLink(item, className) {
  return (
    <a href={item.to} className={className}>
      {item.label}
    </a>
  )
}

/**
 * Tab bar for route- or state-driven tabs; active styling keys off aria-current="page" (set by react-router NavLink).
 * @param {{key?: string, label: import('react').ReactNode, to: string}[]} props.items
 * @param {(item: object, className: string) => import('react').ReactNode} [props.renderLink] Wraps navigation; defaults to an anchor.
 * @param {string} [props.className]
 */
export function Tabs({
  items,
  renderLink = defaultLink,
  className,
}) {
  return (
    <nav className={[styles.tabs, className].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <Fragment key={item.key ?? item.to ?? i}>{renderLink(item, styles.tab)}</Fragment>
      ))}
    </nav>
  )
}
