import { homeRoutes, HOME_PATHS } from './home.routes.js'
import { home as t } from './messages.js'

export const homeModule = {
  id: 'home',
  navEntry: { label: t.title, path: HOME_PATHS.root, order: 0, end: true },
  requiredPermissions: [],
  routes: homeRoutes,
}
