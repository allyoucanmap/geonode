import { Dialog as RadixDialog } from 'radix-ui'
import { Button } from './Button.jsx'
import dialogStyles from './Dialog.module.css'
import styles from './ConfirmDialog.module.css'

/**
 * Controlled, trigger-less confirmation modal for destructive actions (uses the Radix Dialog primitive directly).
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {import('react').ReactNode} [props.title]
 * @param {import('react').ReactNode} [props.description]
 * @param {string} [props.confirmLabel='Confirm']
 * @param {string} [props.cancelLabel='Cancel']
 * @param {'primary'|'danger'} [props.variant='danger'] Confirm button variant.
 * @param {boolean} [props.loading=false]
 * @param {() => void} props.onConfirm
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={dialogStyles.overlay} />
        <RadixDialog.Content className={dialogStyles.content}>
          {title && <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>}
          {description && <RadixDialog.Description className={styles.description}>{description}</RadixDialog.Description>}
          <div className={styles.actions}>
            <RadixDialog.Close asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </RadixDialog.Close>
            <Button variant={variant} loading={loading} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
