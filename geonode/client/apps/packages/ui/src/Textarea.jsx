import { forwardRef } from 'react'
import styles from './controls.module.css'

/**
 * Native textarea.
 * @param {boolean} [props.invalid] Applies the error border (supplied by Field).
 * @param {string} [props.className]
 */
export const Textarea = forwardRef(function Textarea(
  {
    invalid,
    className,
    ...rest
  },
  ref,
) {
  const classes = [styles.control, styles.textarea, invalid && styles.invalid, className].filter(Boolean).join(' ')
  return <textarea ref={ref} className={classes} {...rest} />
})
