import { useParams } from 'react-router-dom'
import { DataTable, EmptyState } from '@geonode/ui'
import { useGroupManagers } from '../../api.js'
import { groups as t } from '../../messages.js'

const columns = [
  { key: 'username', header: t.username },
  { key: 'email', header: t.memberEmail },
]

export function Component() {
  const { groupId } = useParams()
  const { data, isLoading } = useGroupManagers(groupId)
  const managers = Array.isArray(data) ? data : []

  return (
    <DataTable
      columns={columns}
      data={managers}
      getRowId={(row) => row.pk ?? row.id ?? row.username}
      loading={isLoading}
      empty={<EmptyState title={t.noManagers} description={t.noManagersDesc} />}
    />
  )
}
