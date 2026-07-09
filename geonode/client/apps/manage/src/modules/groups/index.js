import { groupsRoutes, GROUPS_PATHS } from './groups.routes.js'
import { groups as t } from './messages.js'

export const groupsModule = {
  id: 'groups',
  navEntry: { label: t.title, path: GROUPS_PATHS.root, order: 20 },
  requiredPermissions: [],
  routes: groupsRoutes,
}
