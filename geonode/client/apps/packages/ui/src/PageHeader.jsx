import styles from './PageHeader.module.css'

/**
 * Route header: title and description on the left, actions on the right.
 * @param {import('react').ReactNode} [props.title]
 * @param {import('react').ReactNode} [props.description]
 * @param {import('react').ReactNode} [props.actions]
 * @param {string} [props.className]
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
