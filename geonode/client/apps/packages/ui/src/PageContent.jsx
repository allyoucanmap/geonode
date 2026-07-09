import styles from './PageContent.module.css'

/**
 * Padded main content region; the single owner of the page gutter.
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.className]
 */
export function PageContent({
  children,
  className,
}) {
  return <main className={[styles.content, className].filter(Boolean).join(' ')}>{children}</main>
}
