import { useId } from 'react'
import styles from './Field.module.css'

/**
 * Form field wrapper; children is a render prop receiving {id, aria-describedby, aria-invalid, invalid} so the control inherits the wiring.
 * @param {import('react').ReactNode} [props.label]
 * @param {boolean} [props.required]
 * @param {import('react').ReactNode} [props.hint] Hidden while error shows.
 * @param {import('react').ReactNode} [props.error]
 * @param {(control: object) => import('react').ReactNode} props.children Render prop wiring the control.
 * @param {string} [props.className]
 */
export function Field({
  label,
  required,
  hint,
  error,
  children,
  className,
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true"> *</span>}
        </label>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined, invalid: !!error })}
      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
