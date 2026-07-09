import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, ConfirmDialog, DataTable, EmptyState } from '@geonode/ui'
import { useRemoveGroupManager, useUserGroups } from '../../api.js'
import { users as t } from '../../messages.js'

const rowEnd = { display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--gn-space-3, 0.75rem)' }

const columns = [
  { key: 'title', header: t.group },
  { key: 'slug', header: t.slug },
]

export function Component() {
  const { userId } = useParams()
  const { data, isLoading } = useUserGroups(userId)
  const groups = Array.isArray(data) ? data : []
  const removeManager = useRemoveGroupManager(userId)
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <div style={rowEnd}>
        <Button size="sm" variant="danger" disabled={groups.length === 0} onClick={() => setConfirming(true)}>
          {t.removeManagerAll}
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={groups}
        getRowId={(row) => row.pk ?? row.id ?? row.slug}
        loading={isLoading}
        empty={<EmptyState title={t.noGroups} description={t.noGroupsDesc} />}
      />
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={t.removeManagerTitle}
        description={t.removeManagerConfirm}
        confirmLabel={t.remove}
        loading={removeManager.isPending}
        onConfirm={() => removeManager.mutate('ALL', { onSuccess: () => setConfirming(false) })}
      />
    </>
  )
}
