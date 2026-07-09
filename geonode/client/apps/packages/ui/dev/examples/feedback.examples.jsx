import { Alert, EmptyState, Skeleton, Spinner, Button } from '../../src/index.js'
import { Search, Plus } from '@geonode/icons'

const Stack = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gn-space-3)', maxWidth: 520 }}>{children}</div>
)

export default {
  title: 'Feedback',
  order: 3,
  scenarios: [
    {
      name: 'alerts',
      render: () => (
        <Stack>
          <Alert variant="info" title="Heads up">
            This dataset is still processing.
          </Alert>
          <Alert variant="success" title="Saved" onClose={() => {}}>
            Your changes have been published.
          </Alert>
          <Alert variant="warning" title="Missing metadata">
            Add an abstract before publishing.
          </Alert>
          <Alert variant="danger" title="Upload failed" onClose={() => {}}>
            The file exceeds the size limit.
          </Alert>
        </Stack>
      ),
    },
    {
      name: 'empty state',
      render: () => (
        <EmptyState
          icon={<Search size="2em" />}
          title="No datasets found"
          description="Try adjusting your filters or add a new dataset."
          action={
            <Button variant="primary">
              <Plus size="1em" /> New dataset
            </Button>
          }
        />
      ),
    },
    {
      name: 'loading',
      render: () => (
        <Stack>
          <Spinner label="Loading…" />
          <Skeleton width="60%" />
          <Skeleton width="90%" />
          <Skeleton width="40%" />
        </Stack>
      ),
    },
  ],
}
