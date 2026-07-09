import styles from './Badge.module.css'

/**
 * Status pill.
 * @param {'neutral'|'primary'|'success'|'warning'|'danger'|'info'} [props.variant='neutral']
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.className]
 */
export function Badge({
  variant = 'neutral',
  children,
  className,
}) {
  return <span className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')}>{children}</span>
}
