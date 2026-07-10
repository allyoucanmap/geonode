import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { configureApi } from '@geonode/api'
import { loadExtensions, registerModules, ModulesProvider } from '@geonode/sdk'
import { createQueryClient } from './core/queryClient.js'
import { modules as coreModules } from './modules/index.js'
import { buildRouter } from './router.jsx'
import { API_BASE, BASENAME, EXTENSIONS, APP_ID } from './config.js'

configureApi({ baseUrl: API_BASE })
const queryClient = createQueryClient()

async function bootstrap() {
  const external = await loadExtensions(EXTENSIONS)
  const modules = await registerModules([...coreModules, ...external], { app: APP_ID })
  const router = buildRouter(modules, BASENAME)
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ModulesProvider modules={modules}>
          <RouterProvider router={router} />
        </ModulesProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}

bootstrap()
