import { Dialog as RadixDialog } from 'radix-ui'
import styles from './Dialog.module.css'

/**
 * Trigger-based modal wrapping the Radix Dialog primitive (focus trap, portal, ESC). For a controlled, trigger-less confirmation use ConfirmDialog.
 * @param {import('react').ReactElement} props.trigger Element that opens the dialog.
 * @param {import('react').ReactNode} [props.title]
 * @param {import('react').ReactNode} [props.children]
 */
export function Dialog({
  trigger,
  title,
  children,
}) {
  return (
    <RadixDialog.Root>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content className={styles.content}>
          {title && <RadixDialog.Title>{title}</RadixDialog.Title>}
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
