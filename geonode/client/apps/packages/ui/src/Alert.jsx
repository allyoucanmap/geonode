import { X } from '@geonode/icons'
import styles from './Alert.module.css'

/**
 * Inline banner with an optional dismiss button.
 * @param {'info'|'success'|'warning'|'danger'} [props.variant='info'] danger and warning announce as alerts.
 * @param {import('react').ReactNode} [props.title]
 * @param {import('react').ReactNode} [props.children]
 * @param {() => void} [props.onClose] Adds a dismiss button.
 * @param {string} [props.className]
 */
export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}) {
  const assertive = variant === 'danger' || variant === 'warning'
  return (
    <div
      className={[styles.alert, styles[variant], className].filter(Boolean).join(' ')}
      role={assertive ? 'alert' : 'status'}
    >
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Dismiss">
          <X />
        </button>
      )}
    </div>
  )
}
