import { Fragment } from 'react'
import styles from './DescriptionList.module.css'

/**
 * Key/value grid; falsy items are dropped.
 * @param {{label: import('react').ReactNode, value: import('react').ReactNode}[]} props.items
 * @param {string} [props.className]
 */
export function DescriptionList({
  items,
  className,
}) {
  const rows = items.filter(Boolean)
  return (
    <dl className={[styles.grid, className].filter(Boolean).join(' ')}>
      {rows.map((row) => (
        <Fragment key={row.label}>
          <dt className={styles.label}>{row.label}</dt>
          <dd className={styles.value}>{row.value}</dd>
        </Fragment>
      ))}
    </dl>
  )
}
