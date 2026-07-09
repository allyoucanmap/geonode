import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DataTable, EmptyState, Pagination } from '@geonode/ui'
import { useUserResources } from '../../api.js'
import { users as t } from '../../messages.js'

const PAGE_SIZE = 10

const columns = [
  { key: 'title', header: t.resourceTitle },
  { key: 'resource_type', header: t.resourceType },
]

export function Component() {
  const { userId } = useParams()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useUserResources(userId, { page, page_size: PAGE_SIZE })
  const resources = data?.resources ?? []
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))

  return (
    <>
      <DataTable
        columns={columns}
        data={resources}
        getRowId={(row) => row.pk ?? row.id}
        loading={isLoading}
        empty={<EmptyState title={t.noResources} description={t.noResourcesDesc} />}
      />
      <div style={{ marginTop: 'var(--gn-space-4, 1rem)' }}>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>
    </>
  )
}
