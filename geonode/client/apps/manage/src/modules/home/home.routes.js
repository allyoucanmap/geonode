export const HOME_PATHS = {
  root: '/',
}

export const homeRoutes = {
  index: true,
  lazy: () => import('./pages/HomePage.jsx'),
}
