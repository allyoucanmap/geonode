import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { Button, ConfirmDialog, PageContent, PageHeader, Spinner, Tabs } from '@geonode/ui'
import { useDeleteGroup, useGroup } from '../api.js'
import { GROUPS_PATHS } from '../groups.routes.js'
import { groups as t } from '../messages.js'

export function Component() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGroup(groupId)
  const group = data?.group_profile ?? data
  const del = useDeleteGroup()
  const [confirming, setConfirming] = useState(false)

  if (isLoading)
    return (
      <PageContent>
        <Spinner label={t.loadingGroup} />
      </PageContent>
    )

  const tabs = [
    { key: 'overview', label: t.overview, to: GROUPS_PATHS.detail(groupId), end: true },
    { key: 'members', label: t.members, to: GROUPS_PATHS.members(groupId) },
    { key: 'managers', label: t.managers, to: GROUPS_PATHS.managers(groupId) },
    { key: 'resources', label: t.resources, to: GROUPS_PATHS.resources(groupId) },
  ]

  return (
    <PageContent>
      <PageHeader
        title={group?.title ?? t.group}
        description={group?.email}
        actions={
          <Button variant="danger" onClick={() => setConfirming(true)}>
            {t.deleteGroup}
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
        title={t.deleteGroup}
        description={t.deleteGroupConfirm}
        confirmLabel={t.delete}
        loading={del.isPending}
        onConfirm={() => del.mutate(groupId, { onSuccess: () => navigate(GROUPS_PATHS.list()) })}
      />
    </PageContent>
  )
}
