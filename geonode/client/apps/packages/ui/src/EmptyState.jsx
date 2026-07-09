import styles from './EmptyState.module.css'

/**
 * Placeholder for empty states; the copy distinguishes no-data from no-results.
 * @param {import('react').ReactNode} [props.icon]
 * @param {import('react').ReactNode} [props.title]
 * @param {import('react').ReactNode} [props.description]
 * @param {import('react').ReactNode} [props.action]
 * @param {string} [props.className]
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={[styles.empty, className].filter(Boolean).join(' ')}>
      {icon && <div className={styles.icon}>{icon}</div>}
      {title && <p className={styles.title}>{title}</p>}
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
