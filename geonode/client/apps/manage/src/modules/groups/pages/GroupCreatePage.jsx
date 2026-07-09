import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Field, PageContent, PageHeader, Select, TextInput, Textarea } from '@geonode/ui'
import { useCreateGroup } from '../api.js'
import { GROUPS_PATHS } from '../groups.routes.js'
import { groups as t } from '../messages.js'

const formStyle = { maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 'var(--gn-space-3, 0.75rem)' }
const actionsStyle = { display: 'flex', gap: 'var(--gn-space-2, 0.5rem)' }

const accessOptions = () => [
  { value: 'public', label: t.accessPublic },
  { value: 'public-invite', label: t.accessPublicInvite },
  { value: 'private', label: t.accessPrivate },
]

export function Component() {
  const navigate = useNavigate()
  const create = useCreateGroup()
  const [form, setForm] = useState({ title: '', slug: '', access: 'public', description: '', email: '' })
  const setValue = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    create.mutate(form, {
      onSuccess: (data) => {
        const id = data?.group_profile?.pk ?? data?.pk ?? data?.group_profile?.id
        navigate(id ? GROUPS_PATHS.detail(id) : GROUPS_PATHS.list())
      },
    })
  }

  return (
    <PageContent>
      <PageHeader title={t.newGroup} />
      {create.isError && (
        <Alert variant="danger" title={t.couldNotCreate}>
          {String(create.error?.message ?? '')}
        </Alert>
      )}
      <form onSubmit={onSubmit} style={formStyle}>
        <Field label={t.name} required>
          {(props) => <TextInput {...props} value={form.title} onChange={setValue('title')} required />}
        </Field>
        <Field label={t.slug} required>
          {(props) => <TextInput {...props} value={form.slug} onChange={setValue('slug')} required />}
        </Field>
        <Field label={t.access}>
          {(props) => <Select {...props} options={accessOptions()} value={form.access} onChange={setValue('access')} />}
        </Field>
        <Field label={t.description}>
          {(props) => <Textarea {...props} value={form.description} onChange={setValue('description')} rows={4} />}
        </Field>
        <Field label={t.email}>
          {(props) => <TextInput {...props} type="email" value={form.email} onChange={setValue('email')} />}
        </Field>
        <div style={actionsStyle}>
          <Button type="submit" variant="primary" loading={create.isPending}>
            {t.createGroup}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(GROUPS_PATHS.list())}>
            {t.cancel}
          </Button>
        </div>
      </form>
    </PageContent>
  )
}
