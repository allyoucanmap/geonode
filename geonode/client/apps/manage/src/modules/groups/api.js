import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@geonode/api'

const qs = (params = {}) => {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) value.forEach((v) => sp.append(key, v))
    else sp.append(key, value)
  }
  const search = sp.toString()
  return search ? `?${search}` : ''
}

export const useGroups = (params = {}) =>
  useQuery({ queryKey: ['groups', 'list', params], queryFn: () => apiFetch(`/groups${qs(params)}`) })

export const useGroup = (id) =>
  useQuery({ queryKey: ['groups', 'detail', id], queryFn: () => apiFetch(`/groups/${id}`), enabled: Boolean(id) })

export const useGroupMembers = (id) =>
  useQuery({
    queryKey: ['groups', 'members', id],
    queryFn: () => apiFetch(`/groups/${id}/members`),
    enabled: Boolean(id),
  })

export const useGroupManagers = (id) =>
  useQuery({
    queryKey: ['groups', 'managers', id],
    queryFn: () => apiFetch(`/groups/${id}/managers`),
    enabled: Boolean(id),
  })

export const useGroupResources = (id, params = {}) =>
  useQuery({
    queryKey: ['groups', 'resources', id, params],
    queryFn: () => apiFetch(`/groups/${id}/resources${qs(params)}`),
    enabled: Boolean(id),
  })

export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body) => apiFetch('/groups', { method: 'POST', body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups', 'list'] }),
  })
}

export const useUpdateGroup = (id) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body) => apiFetch(`/groups/${id}`, { method: 'PATCH', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'detail', id] })
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
    },
  })
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => apiFetch(`/groups/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups', 'list'] }),
  })
}
