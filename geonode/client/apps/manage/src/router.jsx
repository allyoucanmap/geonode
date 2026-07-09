import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from './core/components/MainLayout.jsx'
import { layout } from './core/components/messages.js'

export function buildRouter(modules, basename) {
  return createBrowserRouter(
    [
      {
        path: '/',
        element: <MainLayout />,
        handle: { crumb: () => layout.home },
        children: modules.map((m) => m.routes),
      },
    ],
    { basename },
  )
}
