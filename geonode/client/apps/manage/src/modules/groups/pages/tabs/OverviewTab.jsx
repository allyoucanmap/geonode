import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Button, DescriptionList, Field, Select, TextInput, Textarea } from '@geonode/ui'
import { useGroup, useUpdateGroup } from '../../api.js'
import { groups as t } from '../../messages.js'

const formStyle = { maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 'var(--gn-space-3, 0.75rem)' }
const rowEnd = { display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--gn-space-3, 0.75rem)' }
const actionsStyle = { display: 'flex', gap: 'var(--gn-space-2, 0.5rem)' }

const accessOptions = () => [
  { value: 'public', label: t.accessPublic },
  { value: 'public-invite', label: t.accessPublicInvite },
  { value: 'private', label: t.accessPrivate },
]

const accessLabel = (value) => accessOptions().find((o) => o.value === value)?.label ?? value
const joinSlugs = (list) => (Array.isArray(list) ? list.join(', ') : '')

function EditForm({ group, groupId, onDone }) {
  const update = useUpdateGroup(groupId)
  const [form, setForm] = useState({
    title: group.title ?? '',
    description: group.description ?? '',
    email: group.email ?? '',
    access: group.access ?? 'public',
  })
  const setValue = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    update.mutate(form, { onSuccess: onDone })
  }

  return (
    <form onSubmit={onSubmit} style={formStyle}>
      {update.isError && (
        <Alert variant="danger" title={t.couldNotSave}>
          {String(update.error?.message ?? '')}
        </Alert>
      )}
      <Field label={t.name} required>
        {(props) => <TextInput {...props} value={form.title} onChange={setValue('title')} required />}
      </Field>
      <Field label={t.description}>
        {(props) => <Textarea {...props} value={form.description} onChange={setValue('description')} rows={4} />}
      </Field>
      <Field label={t.email}>
        {(props) => <TextInput {...props} type="email" value={form.email} onChange={setValue('email')} />}
      </Field>
      <Field label={t.access}>
        {(props) => <Select {...props} options={accessOptions()} value={form.access} onChange={setValue('access')} />}
      </Field>
      <div style={actionsStyle}>
        <Button type="submit" variant="primary" loading={update.isPending}>
          {t.save}
        </Button>
        <Button type="button" variant="secondary" onClick={onDone}>
          {t.cancel}
        </Button>
      </div>
    </form>
  )
}

export function Component() {
  const { groupId } = useParams()
  const { data } = useGroup(groupId)
  const group = data?.group_profile ?? data ?? {}
  const [editing, setEditing] = useState(false)

  if (editing) return <EditForm group={group} groupId={groupId} onDone={() => setEditing(false)} />

  return (
    <>
      <div style={rowEnd}>
        <Button size="sm" onClick={() => setEditing(true)}>
          {t.edit}
        </Button>
      </div>
      <DescriptionList
        items={[
          { label: t.name, value: group.title },
          { label: t.slug, value: group.slug },
          { label: t.description, value: group.description },
          { label: t.email, value: group.email },
          { label: t.access, value: accessLabel(group.access) },
          { label: t.keywords, value: joinSlugs(group.keywords) },
          { label: t.categories, value: joinSlugs(group.categories) },
        ]}
      />
    </>
  )
}
