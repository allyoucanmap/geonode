import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { Button, ConfirmDialog, PageContent, PageHeader, Spinner, Tabs } from '@geonode/ui'
import { useDeleteUser, useUser } from '../api.js'
import { USERS_PATHS } from '../users.routes.js'
import { users as t } from '../messages.js'

export function Component() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useUser(userId)
  const user = data?.user ?? data
  const del = useDeleteUser()
  const [confirming, setConfirming] = useState(false)

  if (isLoading)
    return (
      <PageContent>
        <Spinner label={t.loadingUser} />
      </PageContent>
    )

  const tabs = [
    { key: 'profile', label: t.profile, to: USERS_PATHS.detail(userId), end: true },
    { key: 'groups', label: t.groups, to: USERS_PATHS.groups(userId) },
    { key: 'resources', label: t.resources, to: USERS_PATHS.resources(userId) },
  ]

  return (
    <PageContent>
      <PageHeader
        title={user?.username ?? t.user}
        description={user?.email}
        actions={
          <Button variant="danger" onClick={() => setConfirming(true)}>
            {t.deleteUser}
          </Button>
        }
      />
      <Tabs
        items={tabs}
        renderLink={(item, className) => (
          <NavLink to={item.to} end={item.end} className={className}>
            {item.label}
          </NavLink>
        )}
      />
      <Outlet />
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={t.deleteUser}
        description={t.deleteUserConfirm}
        confirmLabel={t.delete}
        loading={del.isPending}
        onConfirm={() => del.mutate(userId, { onSuccess: () => navigate(USERS_PATHS.list()) })}
      />
    </PageContent>
  )
}
