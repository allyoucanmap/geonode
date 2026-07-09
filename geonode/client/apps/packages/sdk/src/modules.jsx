import { createContext, useContext } from 'react'

const ModulesContext = createContext(null)

export function ModulesProvider({ modules, children }) {
  return <ModulesContext.Provider value={modules}>{children}</ModulesContext.Provider>
}

export function useModules() {
  const modules = useContext(ModulesContext)
  if (!modules) throw new Error('useModules() requires a <ModulesProvider>')
  return modules
}
