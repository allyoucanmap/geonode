import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Checkbox, Field, PageContent, PageHeader, TextInput } from '@geonode/ui'
import { useCreateUser } from '../api.js'
import { USERS_PATHS } from '../users.routes.js'
import { users as t } from '../messages.js'

const formStyle = { maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 'var(--gn-space-3, 0.75rem)' }
const actionsStyle = { display: 'flex', gap: 'var(--gn-space-2, 0.5rem)' }

export function Component() {
  const navigate = useNavigate()
  const create = useCreateUser()
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_staff: false,
    is_superuser: false,
  })
  const setValue = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  const setChecked = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.checked }))

  const onSubmit = (e) => {
    e.preventDefault()
    create.mutate(form, {
      onSuccess: (data) => {
        const id = data?.user?.pk ?? data?.pk ?? data?.user?.id
        navigate(id ? USERS_PATHS.detail(id) : USERS_PATHS.list())
      },
    })
  }

  return (
    <PageContent>
      <PageHeader title={t.newUser} />
      {create.isError && (
        <Alert variant="danger" title={t.couldNotCreate}>
          {String(create.error?.message ?? '')}
        </Alert>
      )}
      <form onSubmit={onSubmit} style={formStyle}>
        <Field label={t.username} required>
          {(props) => <TextInput {...props} value={form.username} onChange={setValue('username')} required />}
        </Field>
        <Field label={t.email} required>
          {(props) => <TextInput {...props} type="email" value={form.email} onChange={setValue('email')} required />}
        </Field>
        <Field label={t.firstName}>
          {(props) => <TextInput {...props} value={form.first_name} onChange={setValue('first_name')} />}
        </Field>
        <Field label={t.lastName}>
          {(props) => <TextInput {...props} value={form.last_name} onChange={setValue('last_name')} />}
        </Field>
        <Field label={t.password} required>
          {(props) => (
            <TextInput
              {...props}
              type="password"
              value={form.password}
              onChange={setValue('password')}
              autoComplete="new-password"
              required
            />
          )}
        </Field>
        <Checkbox label={t.staff} checked={form.is_staff} onChange={setChecked('is_staff')} />
        <Checkbox label={t.superuser} checked={form.is_superuser} onChange={setChecked('is_superuser')} />
        <div style={actionsStyle}>
          <Button type="submit" variant="primary" loading={create.isPending}>
            {t.createUser}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(USERS_PATHS.list())}>
            {t.cancel}
          </Button>
        </div>
      </form>
    </PageContent>
  )
}
