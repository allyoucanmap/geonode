import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Badge, Button, Checkbox, DescriptionList, Field, TextInput } from '@geonode/ui'
import { useUpdateUser, useUser } from '../../api.js'
import { users as t } from '../../messages.js'

const formStyle = { maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 'var(--gn-space-3, 0.75rem)' }
const rowEnd = { display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--gn-space-3, 0.75rem)' }
const actionsStyle = { display: 'flex', gap: 'var(--gn-space-2, 0.5rem)' }

function Roles({ user }) {
  if (user.is_superuser) return <Badge variant="primary">{t.superuser}</Badge>
  if (user.is_staff) return <Badge variant="info">{t.staff}</Badge>
  return t.user
}

function EditForm({ user, userId, onDone }) {
  const update = useUpdateUser(userId)
  const [form, setForm] = useState({
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
    email: user.email ?? '',
    password: '',
    is_staff: !!user.is_staff,
    is_superuser: !!user.is_superuser,
  })
  const setValue = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  const setChecked = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.checked }))

  const onSubmit = (e) => {
    e.preventDefault()
    const body = {
      first_name: form.first_name,
      last_name: form.last_name,
      is_staff: form.is_staff,
      is_superuser: form.is_superuser,
    }
    // Send email only when changed
    if (form.email && form.email !== user.email) body.email = form.email
    if (form.password) body.password = form.password
    update.mutate(body, { onSuccess: onDone })
  }

  return (
    <form onSubmit={onSubmit} style={formStyle}>
      {update.isError && (
        <Alert variant="danger" title={t.couldNotSave}>
          {String(update.error?.message ?? '')}
        </Alert>
      )}
      <Field label={t.firstName}>
        {(props) => <TextInput {...props} value={form.first_name} onChange={setValue('first_name')} />}
      </Field>
      <Field label={t.lastName}>
        {(props) => <TextInput {...props} value={form.last_name} onChange={setValue('last_name')} />}
      </Field>
      <Field label={t.email} required>
        {(props) => <TextInput {...props} type="email" value={form.email} onChange={setValue('email')} required />}
      </Field>
      <Field label={t.newPassword} hint={t.keepPasswordHint}>
        {(props) => (
          <TextInput
            {...props}
            type="password"
            value={form.password}
            onChange={setValue('password')}
            autoComplete="new-password"
          />
        )}
      </Field>
      <Checkbox label={t.staff} checked={form.is_staff} onChange={setChecked('is_staff')} />
      <Checkbox label={t.superuser} checked={form.is_superuser} onChange={setChecked('is_superuser')} />
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
  const { userId } = useParams()
  const { data } = useUser(userId)
  const user = data?.user ?? data ?? {}
  const [editing, setEditing] = useState(false)

  if (editing) return <EditForm user={user} userId={userId} onDone={() => setEditing(false)} />

  return (
    <>
      <div style={rowEnd}>
        <Button size="sm" onClick={() => setEditing(true)}>
          {t.edit}
        </Button>
      </div>
      <DescriptionList
        items={[
          { label: t.username, value: user.username },
          { label: t.email, value: user.email },
          { label: t.firstName, value: user.first_name },
          { label: t.lastName, value: user.last_name },
          { label: t.role, value: <Roles user={user} /> },
        ]}
      />
    </>
  )
}
