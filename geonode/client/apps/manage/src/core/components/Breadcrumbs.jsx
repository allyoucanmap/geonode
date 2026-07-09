import { Link, useMatches } from 'react-router-dom'
import { Breadcrumb } from '@geonode/ui'
import styles from './MainLayout.module.css'

export function Breadcrumbs() {
  const items = useMatches()
    .filter((m) => m.handle?.crumb)
    .map((m) => ({ label: m.handle.crumb(m), to: m.pathname }))

  if (items.length <= 1) return null

  return (
    <div className={styles.crumbbar}>
      <Breadcrumb
        items={items}
        renderLink={(item, className) => (
          <Link to={item.to} className={className}>
            {item.label}
          </Link>
        )}
      />
    </div>
  )
}
