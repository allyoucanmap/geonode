import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContent, PageHeader, DataTable, SearchInput, Pagination, Button } from '@geonode/ui'
import { useGroups } from '../api.js'
import { GROUPS_PATHS } from '../groups.routes.js'
import { groups as t } from '../messages.js'

const PAGE_SIZE = 10
const SEARCH_FIELDS = ['title', 'slug', 'description']

const columns = [
  { key: 'title', header: t.name, sortable: true },
  { key: 'slug', header: t.slug, sortable: true },
  { key: 'access', header: t.access, sortable: true },
]

export function Component() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState(null)

  const params = {
    page,
    page_size: PAGE_SIZE,
    ...(search ? { search, search_fields: SEARCH_FIELDS } : {}),
    ...(sort ? { 'sort[]': `${sort.dir === 'desc' ? '-' : ''}${sort.key}` } : {}),
  }
  const { data, isLoading } = useGroups(params)
  const groups = data?.group_profiles ?? []
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))

  return (
    <PageContent>
      <PageHeader
        title={t.title}
        actions={
          <div style={{ display: 'flex', gap: 'var(--gn-space-2, 0.5rem)', alignItems: 'center' }}>
            <SearchInput
              placeholder={t.searchGroups}
              onSearch={(q) => {
                setPage(1)
                setSearch(q)
              }}
            />
            <Button variant="primary" onClick={() => navigate(GROUPS_PATHS.create())}>
              {t.newGroup}
            </Button>
          </div>
        }
      />
      <DataTable
        columns={columns}
        data={groups}
        getRowId={(row) => row.pk ?? row.id}
        loading={isLoading}
        sort={sort}
        onSortChange={(next) => {
          setPage(1)
          setSort(next)
        }}
        rowActions={(row) => (
          <Button size="sm" variant="ghost" onClick={() => navigate(GROUPS_PATHS.detail(row.pk ?? row.id))}>
            {t.view}
          </Button>
        )}
      />
      <div style={{ marginTop: 'var(--gn-space-4, 1rem)' }}>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>
    </PageContent>
  )
}
