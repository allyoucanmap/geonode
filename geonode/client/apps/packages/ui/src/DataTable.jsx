import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, ArrowUpDown } from '@geonode/icons'
import { EmptyState } from './EmptyState.jsx'
import { Skeleton } from './Skeleton.jsx'
import styles from './DataTable.module.css'

/**
 * @typedef {object} Column
 * @property {string} key Unique per column; also the default value accessor.
 * @property {import('react').ReactNode} header
 * @property {(row: object) => import('react').ReactNode} [render] Defaults to row[key].
 * @property {boolean} [sortable]
 * @property {'left'|'center'|'right'} [align]
 * @property {string|number} [width]
 */

/**
 * Fully controlled data table; sorting and selection are plain logic and the caller owns their state.
 * @param {Column[]} props.columns
 * @param {object[]} props.data
 * @param {(row: object) => string|number} [props.getRowId] Defaults to row.id.
 * @param {{key: string, dir: 'asc'|'desc'}|null} [props.sort]
 * @param {(sort: {key: string, dir: 'asc'|'desc'}) => void} [props.onSortChange]
 * @param {boolean} [props.selectable=false]
 * @param {Array<string|number>} [props.selectedIds]
 * @param {(ids: Array<string|number>) => void} [props.onSelectionChange]
 * @param {(row: object) => import('react').ReactNode} [props.rowActions] Trailing actions cell.
 * @param {boolean} [props.loading=false] Renders skeleton rows.
 * @param {import('react').ReactNode} [props.empty] Shown when data is empty.
 * @param {boolean} [props.resizable=false] Enables drag-to-resize column widths.
 * @param {number} [props.minColumnWidth=60] Minimum width in px while resizing.
 * @param {(widths: Record<string, number>) => void} [props.onColumnWidthsChange] Notified with fixed widths (px) after a resize.
 * @param {string} [props.className]
 */
export function DataTable({
  columns,
  data,
  getRowId = (row) => row.id,
  sort,
  onSortChange,
  selectable = false,
  selectedIds,
  onSelectionChange,
  rowActions,
  loading = false,
  empty,
  resizable = false,
  minColumnWidth = 60,
  onColumnWidthsChange,
  className,
}) {
  const selected = new Set(selectedIds || [])
  const colCount = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)

  const tableRef = useRef(null)
  const [widths, setWidths] = useState({})
  const [resizing, setResizing] = useState(false)

  const layout = [
    ...(selectable ? [{ id: '__select' }] : []),
    ...columns.map((col) => ({ id: col.key })),
    ...(rowActions ? [{ id: '__actions' }] : []),
  ]

  useLayoutEffect(() => {
    if (!resizable || !tableRef.current) return
    setWidths((prev) => {
      if (Object.keys(prev).length) return prev
      const ids = [
        ...(selectable ? ['__select'] : []),
        ...columns.map((c) => c.key),
        ...(rowActions ? ['__actions'] : []),
      ]
      const ths = tableRef.current.querySelectorAll('thead th')
      const measured = {}
      ids.forEach((id, i) => {
        if (ths[i]) measured[id] = Math.round(ths[i].getBoundingClientRect().width)
      })
      return measured
    })
  }, [resizable, columns, selectable, rowActions])

  const isFixed = resizable && Object.keys(widths).length > 0
  const flexId = columns.length ? columns[columns.length - 1].key : null

  function startResize(event, id) {
    event.preventDefault()
    event.stopPropagation()
    const th = event.currentTarget.closest('th')
    const startX = event.clientX
    const startW = widths[id] ?? (th ? th.getBoundingClientRect().width : 0)
    setResizing(true)
    let latest = startW
    const onMove = (e) => {
      latest = Math.max(minColumnWidth, Math.round(startW + (e.clientX - startX)))
      setWidths((prev) => ({ ...prev, [id]: latest }))
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setResizing(false)
      if (onColumnWidthsChange) {
        const next = { ...widths, [id]: latest }
        if (flexId) delete next[flexId]
        onColumnWidthsChange(next)
      }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function toggleSort(col) {
    if (!col.sortable || !onSortChange) return
    const dir = sort?.key === col.key && sort.dir === 'asc' ? 'desc' : 'asc'
    onSortChange({ key: col.key, dir })
  }

  function toggleRow(id) {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    onSelectionChange?.([...next])
  }

  function toggleAll() {
    const allIds = data.map(getRowId)
    const allSelected = allIds.every((id) => selected.has(id))
    onSelectionChange?.(allSelected ? [] : allIds)
  }

  const allChecked = data.length > 0 && data.every((row) => selected.has(getRowId(row)))

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <table
        ref={tableRef}
        className={[styles.table, isFixed && styles.fixed, resizing && styles.resizing].filter(Boolean).join(' ')}
      >
        {isFixed && (
          <colgroup>
            {layout.map(({ id }) => (
              <col key={id} style={widths[id] && id !== flexId ? { width: `${widths[id]}px` } : undefined} />
            ))}
          </colgroup>
        )}
        <thead>
          <tr>
            {selectable && (
              <th className={styles.checkCell}>
                <input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="Select all rows" />
              </th>
            )}
            {columns.map((col) => {
              const active = sort?.key === col.key
              return (
                <th
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align }}
                  aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.sortable ? (
                    <button type="button" className={styles.sortButton} onClick={() => toggleSort(col)}>
                      {col.header}
                      <span className={active ? styles.caretActive : styles.caret} aria-hidden="true">
                        {active ? (
                          sort.dir === 'desc' ? <ChevronDown size="0.9em" /> : <ChevronUp size="0.9em" />
                        ) : (
                          <ArrowUpDown size="0.9em" />
                        )}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                  {resizable && col.key !== flexId && (
                    <span
                      className={styles.resizer}
                      onPointerDown={(event) => startResize(event, col.key)}
                      aria-hidden="true"
                    />
                  )}
                </th>
              )
            })}
            {rowActions && <th className={styles.actionsCell} aria-label="Actions" />}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }, (_, i) => (
              <tr key={`sk-${i}`}>
                {Array.from({ length: colCount }, (_, c) => (
                  <td key={c}>
                    <Skeleton width="70%" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={colCount} className={styles.emptyCell}>
                {empty || <EmptyState title="No results" />}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const id = getRowId(row)
              return (
                <tr key={id} className={selected.has(id) ? styles.selectedRow : undefined}>
                  {selectable && (
                    <td className={styles.checkCell}>
                      <input
                        type="checkbox"
                        checked={selected.has(id)}
                        onChange={() => toggleRow(id)}
                        aria-label="Select row"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {rowActions && <td className={styles.actionsCell}>{rowActions(row)}</td>}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
