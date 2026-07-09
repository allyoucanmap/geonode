import { Button, Badge } from '../../src/index.js'
import { Plus, Search } from '@geonode/icons'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 'var(--gn-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
)

export default {
  title: 'Button',
  order: 1,
  scenarios: [
    {
      name: 'variants',
      render: () => (
        <Row>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </Row>
      ),
    },
    {
      name: 'sizes and icons',
      render: () => (
        <Row>
          <Button size="sm" variant="primary">
            <Plus size="1em" /> Small
          </Button>
          <Button size="md" variant="primary">
            <Plus size="1em" /> Medium
          </Button>
          <Button variant="secondary">
            <Search size="1em" /> With icon
          </Button>
        </Row>
      ),
    },
    {
      name: 'states',
      render: () => (
        <Row>
          <Button variant="primary" loading>
            Saving
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Row>
      ),
    },
    {
      name: 'badges',
      render: () => (
        <Row>
          <Badge>neutral</Badge>
          <Badge variant="primary">primary</Badge>
          <Badge variant="success">success</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="danger">danger</Badge>
          <Badge variant="info">info</Badge>
        </Row>
      ),
    },
  ],
}
