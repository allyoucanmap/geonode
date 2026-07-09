import { createElement } from 'react'
import { UserCrumb } from './components/UserCrumb.jsx'
import { users as t } from './messages.js'

export const USERS_PATHS = {
  root: '/users',
  list: () => '/users',
  create: () => '/users/new',
  detail: (id) => `/users/${id}`,
  groups: (id) => `/users/${id}/groups`,
  resources: (id) => `/users/${id}/resources`,
}

export const usersRoutes = {
  path: 'users',
  handle: { crumb: () => t.title },
  children: [
    { index: true, lazy: () => import('./pages/UsersListPage.jsx') },
    { path: 'new', lazy: () => import('./pages/UserCreatePage.jsx'), handle: { crumb: () => t.newUser } },
    {
      path: ':userId',
      lazy: () => import('./pages/UserDetailPage.jsx'),
      handle: { crumb: () => createElement(UserCrumb) },
      children: [
        { index: true, lazy: () => import('./pages/tabs/ProfileTab.jsx') },
        { path: 'groups', lazy: () => import('./pages/tabs/GroupsTab.jsx') },
        { path: 'resources', lazy: () => import('./pages/tabs/ResourcesTab.jsx') },
      ],
    },
  ],
}
