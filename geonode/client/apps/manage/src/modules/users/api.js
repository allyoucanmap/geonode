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

export const useUsers = (params = {}) =>
  useQuery({ queryKey: ['users', 'list', params], queryFn: () => apiFetch(`/users${qs(params)}`) })

export const useUser = (id) =>
  useQuery({ queryKey: ['users', 'detail', id], queryFn: () => apiFetch(`/users/${id}`), enabled: Boolean(id) })

export const useUserGroups = (id) =>
  useQuery({ queryKey: ['users', 'groups', id], queryFn: () => apiFetch(`/users/${id}/groups`), enabled: Boolean(id) })

export const useUserResources = (id, params = {}) =>
  useQuery({
    queryKey: ['users', 'resources', id, params],
    queryFn: () => apiFetch(`/users/${id}/resources${qs(params)}`),
    enabled: Boolean(id),
  })

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body) => apiFetch('/users', { method: 'POST', body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', 'list'] }),
  })
}

export const useUpdateUser = (id) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body) => apiFetch(`/users/${id}`, { method: 'PATCH', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'detail', id] })
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', 'list'] }),
  })
}

export const useRemoveGroupManager = (id) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (groups) => apiFetch(`/users/${id}/remove_from_group_manager`, { method: 'POST', body: { groups } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', 'groups', id] }),
  })
}
