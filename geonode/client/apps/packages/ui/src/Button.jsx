import { forwardRef } from 'react'
import { Spinner } from './Spinner.jsx'
import styles from './Button.module.css'

/**
 * Action button; forwardRef and rest props let it act as a Radix asChild trigger.
 * @param {'primary'|'secondary'|'danger'|'ghost'} [props.variant='secondary']
 * @param {'sm'|'md'} [props.size='md']
 * @param {boolean} [props.loading=false] Shows a spinner and disables the button.
 * @param {boolean} [props.disabled]
 * @param {string} [props.type='button']
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const Button = forwardRef(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    disabled,
    type = 'button',
    children,
    className,
    ...rest
  },
  ref,
) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')
  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner size="sm" className={styles.spinner} />}
      {children}
    </button>
  )
})
