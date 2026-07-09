import { useState } from 'react'
import { DataTable, Badge, Button, DropdownMenu, EmptyState } from '../../src/index.js'
import { MoreHorizontal, Search } from '@geonode/icons'

const rows = [
  { id: 1, name: 'primary_roads', type: 'Vector', status: 'published', owner: 'admin' },
  { id: 2, name: 'elevation_dem', type: 'Raster', status: 'processing', owner: 'jsmith' },
  { id: 3, name: 'admin_boundaries', type: 'Vector', status: 'published', owner: 'admin' },
  { id: 4, name: 'landuse_2024', type: 'Vector', status: 'draft', owner: 'mwong' },
]

const statusVariant = { published: 'success', processing: 'info', draft: 'neutral' }

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'type', header: 'Type', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge>,
  },
  { key: 'owner', header: 'Owner' },
]

function InteractiveTable() {
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })
  const [selectedIds, setSelectedIds] = useState([2])

  const sorted = [...rows].sort((a, b) => {
    const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]))
    return sort.dir === 'asc' ? cmp : -cmp
  })

  return (
    <DataTable
      columns={columns}
      data={sorted}
      sort={sort}
      onSortChange={setSort}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      rowActions={(row) => (
        <DropdownMenu
          align="end"
          trigger={
            <Button size="sm" variant="ghost" aria-label={`Actions for ${row.name}`}>
              <MoreHorizontal size="1em" />
            </Button>
          }
          items={[
            { label: 'Edit', onSelect: () => {} },
            { label: 'Duplicate', onSelect: () => {} },
            { label: 'Delete', onSelect: () => {} },
          ]}
        />
      )}
    />
  )
}

function ResizableTable() {
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })
  const [widths, setWidths] = useState(null)
  const sorted = [...rows].sort((a, b) => {
    const cmp = String(a[sort.key]).localeCompare(String(b[sort.key]))
    return sort.dir === 'asc' ? cmp : -cmp
  })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gn-space-3)' }}>
      <p style={{ margin: 0, fontSize: 'var(--gn-font-size-sm)', color: 'var(--gn-text-muted)' }}>
        Drag the right edge of any column header to resize. Sorting still works, and widths report back via
        onColumnWidthsChange{widths ? `: ${JSON.stringify(widths)}` : '.'}
      </p>
      <DataTable
        resizable
        columns={columns}
        data={sorted}
        sort={sort}
        onSortChange={setSort}
        onColumnWidthsChange={setWidths}
      />
    </div>
  )
}

export default {
  title: 'DataTable',
  order: 4,
  scenarios: [
    { name: 'sortable + selectable + row actions', render: () => <InteractiveTable /> },
    {
      name: 'inline action buttons',
      render: () => (
        <DataTable
          columns={columns}
          data={rows}
          rowActions={(row) => (
            <div style={{ display: 'flex', gap: 'var(--gn-space-2)', justifyContent: 'flex-end' }}>
              <Button size="sm" variant="secondary">
                Edit
              </Button>
              <Button size="sm" variant="danger" aria-label={`Delete ${row.name}`}>
                Delete
              </Button>
            </div>
          )}
        />
      ),
    },
    { name: 'resizable columns', render: () => <ResizableTable /> },
    { name: 'loading', render: () => <DataTable columns={columns} data={[]} loading /> },
    {
      name: 'empty',
      render: () => (
        <DataTable
          columns={columns}
          data={[]}
          empty={<EmptyState icon={<Search size="2em" />} title="No results" description="Try a different search." />}
        />
      ),
    },
  ],
}
