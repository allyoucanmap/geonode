import { useEffect, useRef, useState } from 'react'
import { Search, X } from '@geonode/icons'
import styles from './SearchInput.module.css'

/**
 * Search box; onSearch(query) fires after delay ms idle, or immediately on clear.
 * @param {string} [props.defaultValue='']
 * @param {(query: string) => void} [props.onSearch]
 * @param {number} [props.delay=250] Debounce in ms.
 * @param {string} [props.placeholder='Search']
 * @param {string} [props.className]
 */
export function SearchInput({
  defaultValue = '',
  onSearch,
  delay = 250,
  placeholder = 'Search',
  className,
  ...rest
}) {
  const [value, setValue] = useState(defaultValue)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function push(next, immediate) {
    setValue(next)
    clearTimeout(timer.current)
    if (immediate) {
      onSearch?.(next)
    } else {
      timer.current = setTimeout(() => onSearch?.(next), delay)
    }
  }

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <Search className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => push(e.target.value, false)}
        {...rest}
      />
      {value && (
        <button type="button" className={styles.clear} onClick={() => push('', true)} aria-label="Clear search">
          <X />
        </button>
      )}
    </div>
  )
}
