import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContent, PageHeader, DataTable, SearchInput, Pagination, Button } from '@geonode/ui'
import { useUsers } from '../api.js'
import { USERS_PATHS } from '../users.routes.js'
import { users as t } from '../messages.js'

const PAGE_SIZE = 10
const SEARCH_FIELDS = ['username', 'email', 'first_name', 'last_name']

const columns = [
  { key: 'username', header: t.username, sortable: true },
  { key: 'email', header: t.email, sortable: true },
  { key: 'first_name', header: t.firstName, sortable: true },
  { key: 'last_name', header: t.lastName, sortable: true },
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
  const { data, isLoading } = useUsers(params)
  const users = data?.users ?? []
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))

  return (
    <PageContent>
      <PageHeader
        title={t.title}
        actions={
          <div style={{ display: 'flex', gap: 'var(--gn-space-2, 0.5rem)', alignItems: 'center' }}>
            <SearchInput
              placeholder={t.searchUsers}
              onSearch={(q) => {
                setPage(1)
                setSearch(q)
              }}
            />
            <Button variant="primary" onClick={() => navigate(USERS_PATHS.create())}>
              {t.newUser}
            </Button>
          </div>
        }
      />
      <DataTable
        columns={columns}
        data={users}
        getRowId={(row) => row.pk ?? row.id}
        loading={isLoading}
        sort={sort}
        onSortChange={(next) => {
          setPage(1)
          setSort(next)
        }}
        rowActions={(row) => (
          <Button size="sm" variant="ghost" onClick={() => navigate(USERS_PATHS.detail(row.pk ?? row.id))}>
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
