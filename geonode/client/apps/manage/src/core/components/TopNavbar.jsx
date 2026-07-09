import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useModules } from '@geonode/sdk'
import { DropdownMenu } from '@geonode/ui'
import { Menu, ChevronDown } from '@geonode/icons'
import { usePermissions } from '../auth.js'
import { layout } from './messages.js'
import styles from './TopNavbar.module.css'

function isActive(pathname, entry) {
  if (entry.end) return pathname === entry.path
  const base = entry.path.replace(/\/$/, '')
  return pathname === entry.path || pathname.startsWith(`${base}/`)
}

export function TopNavbar() {
  const can = usePermissions()
  const { pathname } = useLocation()
  const entries = useModules()
    .filter((m) => can(m.requiredPermissions))
    .map((m) => m.navEntry)
    .filter(Boolean)
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))

  const containerRef = useRef(null)
  const measureRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(entries.length)

  const sig = entries.map((e) => `${e.path}:${e.label}`).join('|')
  useLayoutEffect(() => {
    const container = containerRef.current
    const measurer = measureRef.current
    if (!container || !measurer) return
    const items = [...measurer.querySelectorAll('[data-nav-item]')]
    const moreEl = measurer.querySelector('[data-nav-more]')
    const moreWidth = moreEl ? moreEl.offsetWidth : 0
    const gap = parseFloat(getComputedStyle(measurer).columnGap) || 0

    function recompute() {
      const avail = container.clientWidth
      let count = 0
      for (let i = 0; i < items.length; i++) {
        const right = items[i].offsetLeft + items[i].offsetWidth
        const needsMore = i < items.length - 1
        if (right + (needsMore ? gap + moreWidth : 0) <= avail) count = i + 1
        else break
      }
      setVisibleCount(count)
    }

    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(container)
    return () => ro.disconnect()
  }, [sig])

  const visible = entries.slice(0, visibleCount)
  const overflow = entries.slice(visibleCount)
  const overflowActive = overflow.some((e) => isActive(pathname, e))
  const linkClass = ({ isActive: active }) => (active ? `${styles.link} ${styles.active}` : styles.link)

  return (
    <nav className={styles.nav} ref={containerRef}>
      <div className={styles.measurer} ref={measureRef} aria-hidden="true">
        {entries.map((e) => (
          <span className={styles.link} data-nav-item key={e.path}>
            {e.label}
          </span>
        ))}
        <button type="button" tabIndex={-1} className={styles.more} data-nav-more>
          {layout.more} <ChevronDown size="0.9em" />
        </button>
      </div>

      {visible.map((e) => (
        <NavLink key={e.path} to={e.path} end={e.end} className={linkClass}>
          {e.label}
        </NavLink>
      ))}

      {overflow.length > 0 && (
        <DropdownMenu
          align="end"
          trigger={
            <button
              type="button"
              className={overflowActive ? `${styles.more} ${styles.active}` : styles.more}
              aria-label={layout.more}
            >
              {visible.length === 0 ? (
                <Menu />
              ) : (
                <>
                  {layout.more} <ChevronDown size="0.9em" />
                </>
              )}
            </button>
          }
          items={overflow.map((e) => ({ key: e.path, label: e.label, to: e.path, end: e.end }))}
          renderItem={(item, className) => (
            <NavLink to={item.to} end={item.end} className={className}>
              {item.label}
            </NavLink>
          )}
        />
      )}
    </nav>
  )
}
