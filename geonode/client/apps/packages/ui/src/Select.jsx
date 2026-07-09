import { forwardRef } from 'react'
import styles from './controls.module.css'

/**
 * Native single-choice select; pass options or <option> children. A rich, async, or multi-select belongs on a Radix Combobox (P1); do not grow this into one.
 * @param {boolean} [props.invalid] Applies the error border.
 * @param {string} [props.className]
 * @param {{value: string|number, label: import('react').ReactNode}[]} [props.options]
 * @param {import('react').ReactNode} [props.children]
 */
export const Select = forwardRef(function Select(
  {
    invalid,
    className,
    options,
    children,
    ...rest
  },
  ref,
) {
  const classes = [styles.control, invalid && styles.invalid, className].filter(Boolean).join(' ')
  return (
    <select ref={ref} className={classes} {...rest}>
      {options
        ? options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))
        : children}
    </select>
  )
})
