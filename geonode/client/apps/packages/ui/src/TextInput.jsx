import { forwardRef } from 'react'
import styles from './controls.module.css'

/**
 * Native text input.
 * @param {boolean} [props.invalid] Applies the error border (supplied by Field).
 * @param {string} [props.className]
 * @param {string} [props.type='text']
 */
export const TextInput = forwardRef(function TextInput(
  {
    invalid,
    className,
    type = 'text',
    ...rest
  },
  ref,
) {
  const classes = [styles.control, invalid && styles.invalid, className].filter(Boolean).join(' ')
  return <input ref={ref} type={type} className={classes} {...rest} />
})
