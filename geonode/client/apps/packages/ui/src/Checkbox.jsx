import { forwardRef, useId } from 'react'
import styles from './Checkbox.module.css'

/**
 * Native checkbox with an associated label.
 * @param {import('react').ReactNode} [props.label]
 * @param {string} [props.id] Auto-generated when omitted.
 * @param {string} [props.className]
 */
export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    id,
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <input ref={ref} id={inputId} type="checkbox" className={styles.input} {...rest} />
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  )
})
