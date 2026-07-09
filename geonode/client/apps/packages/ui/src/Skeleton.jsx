import styles from './Skeleton.module.css'

/**
 * Placeholder block shown while content loads.
 * @param {string|number} [props.width='100%']
 * @param {string|number} [props.height='1em']
 * @param {string|number} [props.radius]
 * @param {string} [props.className]
 */
export function Skeleton({
  width = '100%',
  height = '1em',
  radius,
  className,
}) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}
