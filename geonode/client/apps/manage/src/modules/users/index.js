import { usersRoutes, USERS_PATHS } from './users.routes.js'
import { users as t } from './messages.js'

export const usersModule = {
  id: 'users',
  navEntry: { label: t.title, path: USERS_PATHS.root, order: 30 },
  requiredPermissions: [],
  routes: usersRoutes,
}
