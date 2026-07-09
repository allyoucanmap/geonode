import styles from './Card.module.css'

/**
 * Surface container; a header row appears only when title or actions is set.
 * @param {import('react').ReactNode} [props.title]
 * @param {import('react').ReactNode} [props.actions]
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.className]
 */
export function Card({
  title,
  actions,
  children,
  className,
  ...rest
}) {
  return (
    <section className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      {(title || actions) && (
        <header className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  )
}
