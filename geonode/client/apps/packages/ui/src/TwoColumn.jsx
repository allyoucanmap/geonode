import { PageContent } from './PageContent.jsx'
import styles from './TwoColumn.module.css'

/**
 * Two-column module shell: an optional sidebar aside beside a padded content region.
 * @param {import('react').ReactNode} [props.sidebar]
 * @param {import('react').ReactNode} [props.children]
 */
export function TwoColumn({
  sidebar,
  children,
}) {
  return (
    <div className={styles.body}>
      {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
      <PageContent>{children}</PageContent>
    </div>
  )
}
