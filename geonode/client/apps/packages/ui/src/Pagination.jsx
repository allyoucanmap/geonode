import { ChevronLeft, ChevronRight, MoreHorizontal } from '@geonode/icons'
import styles from './Pagination.module.css'

function pageItems(page, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const around = [page - 1, page, page + 1].filter((p) => p > 1 && p < pageCount)
  const items = [1, ...around, pageCount]
  const withGaps = []
  let prev = 0
  for (const p of items) {
    if (p - prev > 1) withGaps.push(`gap-${p}`)
    withGaps.push(p)
    prev = p
  }
  return withGaps
}

/**
 * Page navigation; renders nothing when there is a single page.
 * @param {number} props.page Current 1-based page.
 * @param {number} props.pageCount Total number of pages.
 * @param {(page: number) => void} props.onPageChange
 * @param {string} [props.className]
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
}) {
  if (pageCount <= 1) return null
  const go = (p) => p >= 1 && p <= pageCount && p !== page && onPageChange?.(p)

  return (
    <nav className={[styles.pagination, className].filter(Boolean).join(' ')} aria-label="Pagination">
      <button type="button" className={styles.arrow} onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <ChevronLeft />
      </button>
      {pageItems(page, pageCount).map((item) =>
        typeof item === 'number' ? (
          <button
            key={item}
            type="button"
            className={item === page ? `${styles.page} ${styles.active}` : styles.page}
            onClick={() => go(item)}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </button>
        ) : (
          <span key={item} className={styles.gap} aria-hidden="true">
            <MoreHorizontal />
          </span>
        ),
      )}
      <button
        type="button"
        className={styles.arrow}
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </nav>
  )
}
