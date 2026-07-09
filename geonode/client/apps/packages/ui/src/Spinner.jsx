import styles from './Spinner.module.css'

/**
 * Loading indicator; a label makes it an announced status.
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {import('react').ReactNode} [props.label]
 * @param {string} [props.className]
 */
export function Spinner({
  size = 'md',
  label,
  className,
}) {
  const classes = [styles.spinner, styles[size], className].filter(Boolean).join(' ')
  return (
    <span className={classes} role={label ? 'status' : undefined} aria-hidden={label ? undefined : true}>
      {label && <span className={styles.label}>{label}</span>}
    </span>
  )
}
