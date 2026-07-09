import { Field, TextInput, Textarea, Select, Checkbox, Button } from '../../src/index.js'

const Stack = ({ children, w = 380 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gn-space-4)', maxWidth: w }}>{children}</div>
)

export default {
  title: 'Forms',
  order: 2,
  scenarios: [
    {
      name: 'fields',
      render: () => (
        <Stack>
          <Field label="Title" required hint="Shown in listings and search results.">
            {(props) => <TextInput {...props} placeholder="e.g. Primary roads" />}
          </Field>
          <Field label="Category">
            {(props) => (
              <Select
                {...props}
                options={[
                  { value: 'vector', label: 'Vector' },
                  { value: 'raster', label: 'Raster' },
                ]}
              />
            )}
          </Field>
          <Field label="Abstract" hint="A short description of the dataset.">
            {(props) => <Textarea {...props} rows={3} />}
          </Field>
          <Checkbox label="Publish immediately" defaultChecked />
          <div style={{ display: 'flex', gap: 'var(--gn-space-2)', justifyContent: 'flex-end' }}>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save</Button>
          </div>
        </Stack>
      ),
    },
    {
      name: 'validation error',
      render: () => (
        <Stack>
          <Field label="Title" required error="Title is required.">
            {(props) => <TextInput {...props} defaultValue="" />}
          </Field>
          <Field label="Slug" required error="Only lowercase letters, numbers and hyphens.">
            {(props) => <TextInput {...props} defaultValue="Primary Roads!" />}
          </Field>
        </Stack>
      ),
    },
  ],
}
