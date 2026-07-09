import { useParams } from 'react-router-dom'
import { DataTable, EmptyState } from '@geonode/ui'
import { useGroupMembers } from '../../api.js'
import { groups as t } from '../../messages.js'

const columns = [
  { key: 'username', header: t.username },
  { key: 'email', header: t.memberEmail },
]

export function Component() {
  const { groupId } = useParams()
  const { data, isLoading } = useGroupMembers(groupId)
  const members = Array.isArray(data) ? data : []

  return (
    <DataTable
      columns={columns}
      data={members}
      getRowId={(row) => row.pk ?? row.id ?? row.username}
      loading={isLoading}
      empty={<EmptyState title={t.noMembers} description={t.noMembersDesc} />}
    />
  )
}
