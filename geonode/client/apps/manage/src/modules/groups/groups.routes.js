import { createElement } from 'react'
import { GroupCrumb } from './components/GroupCrumb.jsx'
import { groups as t } from './messages.js'

export const GROUPS_PATHS = {
  root: '/groups',
  list: () => '/groups',
  create: () => '/groups/new',
  detail: (id) => `/groups/${id}`,
  members: (id) => `/groups/${id}/members`,
  managers: (id) => `/groups/${id}/managers`,
  resources: (id) => `/groups/${id}/resources`,
}

export const groupsRoutes = {
  path: 'groups',
  handle: { crumb: () => t.title },
  children: [
    { index: true, lazy: () => import('./pages/GroupsListPage.jsx') },
    { path: 'new', lazy: () => import('./pages/GroupCreatePage.jsx'), handle: { crumb: () => t.newGroup } },
    {
      path: ':groupId',
      lazy: () => import('./pages/GroupDetailPage.jsx'),
      handle: { crumb: () => createElement(GroupCrumb) },
      children: [
        { index: true, lazy: () => import('./pages/tabs/OverviewTab.jsx') },
        { path: 'members', lazy: () => import('./pages/tabs/MembersTab.jsx') },
        { path: 'managers', lazy: () => import('./pages/tabs/ManagersTab.jsx') },
        { path: 'resources', lazy: () => import('./pages/tabs/ResourcesTab.jsx') },
      ],
    },
  ],
}
