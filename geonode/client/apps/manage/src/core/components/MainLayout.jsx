import { Outlet } from 'react-router-dom'
import { GeoNodeLogo } from '@geonode/icons'
import { TopNavbar } from './TopNavbar.jsx'
import { Breadcrumbs } from './Breadcrumbs.jsx'
import { layout } from './messages.js'
import styles from './MainLayout.module.css'

export function MainLayout() {
  return (
    <div className={styles.app}>
      <header className={styles.navbar}>
        <h1 className={styles.brand}>
          <GeoNodeLogo title={layout.brand} size="1.75rem" />
        </h1>
        <TopNavbar />
      </header>
      <Breadcrumbs />
      <Outlet />
    </div>
  )
}
