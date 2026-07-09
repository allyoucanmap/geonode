import { DropdownMenu as Radix } from 'radix-ui'
import styles from './DropdownMenu.module.css'

function defaultItem(item, className) {
  return item.to ? (
    <a href={item.to} className={className}>
      {item.label}
    </a>
  ) : (
    <button type="button" className={className} onClick={item.onSelect}>
      {item.label}
    </button>
  )
}

/**
 * Dropdown menu built on the Radix primitive.
 * @param {import('react').ReactElement} props.trigger Opener element.
 * @param {{key?: string, label: import('react').ReactNode, to?: string, onSelect?: () => void}[]} props.items
 * @param {(item: object, className: string) => import('react').ReactNode} [props.renderItem] Wraps each entry; defaults to an anchor or button.
 * @param {'start'|'center'|'end'} [props.align='start']
 */
export function DropdownMenu({
  trigger,
  items,
  renderItem = defaultItem,
  align = 'start',
}) {
  return (
    <Radix.Root>
      <Radix.Trigger asChild>{trigger}</Radix.Trigger>
      <Radix.Portal>
        <Radix.Content className={styles.content} align={align} sideOffset={4}>
          {items.map((item, i) => (
            <Radix.Item key={item.key ?? item.to ?? i} asChild>
              {renderItem(item, styles.item)}
            </Radix.Item>
          ))}
        </Radix.Content>
      </Radix.Portal>
    </Radix.Root>
  )
}
