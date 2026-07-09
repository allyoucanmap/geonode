import {
  Breadcrumb,
  Button,
  Card,
  DataTable,
  DescriptionList,
  PageHeader,
  Pagination,
  SidebarNav,
  TwoColumn,
} from '../../src/index.js'
import { Plus } from '@geonode/icons'

const crumbs = [
  { label: 'Home', to: '#' },
  { label: 'Datasets', to: '#' },
  { label: 'Roads' },
]

const nav = [
  { label: 'Overview', to: '#' },
  { label: 'Datasets', to: '#' },
  { label: 'Maps', to: '#' },
  { label: 'Documents', to: '#' },
]

const renderLink = (item, className) => (
  <a href={item.to} className={className} aria-current={item.label === 'Datasets' ? 'page' : undefined}>
    {item.label}
  </a>
)

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'type', header: 'Type' },
  { key: 'owner', header: 'Owner' },
  { key: 'updated', header: 'Updated', align: 'right' },
]

const rows = [
  { id: 1, name: 'primary_roads', type: 'Vector', owner: 'admin', updated: '2d ago' },
  { id: 2, name: 'elevation_dem', type: 'Raster', owner: 'jsmith', updated: '5d ago' },
  { id: 3, name: 'admin_boundaries', type: 'Vector', owner: 'admin', updated: '1w ago' },
]

export default {
  title: 'Layout',
  order: 0,
  scenarios: [
    {
      name: 'module page',
      render: () => (
        <div>
          <Breadcrumb items={crumbs} />
          <PageHeader
            title="Datasets"
            description="Browse and manage the datasets in this workspace."
            actions={
              <Button variant="primary">
                <Plus size="1em" /> New dataset
              </Button>
            }
          />
          <TwoColumn sidebar={<SidebarNav items={nav} renderLink={renderLink} />}>
            <Card title="Recent datasets" actions={<Button size="sm">Filter</Button>}>
              <DataTable columns={columns} data={rows} sort={{ key: 'name', dir: 'asc' }} />
              <div style={{ marginTop: 'var(--gn-space-4)', display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination page={2} pageCount={9} onPageChange={() => {}} />
              </div>
            </Card>
          </TwoColumn>
        </div>
      ),
    },
    {
      name: 'detail with description list',
      render: () => (
        <div>
          <PageHeader
            title="primary_roads"
            actions={
              <>
                <Button>Edit</Button>
                <Button variant="danger">Delete</Button>
              </>
            }
          />
          <Card>
            <DescriptionList
              items={[
                { label: 'Type', value: 'Vector (LineString)' },
                { label: 'Owner', value: 'admin' },
                { label: 'Features', value: '48,201' },
                { label: 'Updated', value: '2 days ago' },
              ]}
            />
          </Card>
        </div>
      ),
    },
  ],
}
