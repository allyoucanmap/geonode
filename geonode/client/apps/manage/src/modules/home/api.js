import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@geonode/api'

const TOPIC_PAGE_SIZE = 100
const RESOURCE_PAGE_SIZE = 100

// Not supported facets
const HIDDEN_FACETS = new Set(['owner', 'featured'])

export const useUserInfo = () => useQuery({ queryKey: ['userinfo'], queryFn: () => apiFetch('/userinfo/') })

export const useFacets = () =>
  useQuery({
    queryKey: ['facets'],
    queryFn: () => apiFetch('/facets'),
    select: (data) => (data?.facets ?? []).filter((facet) => facet.type !== 'user' && !HIDDEN_FACETS.has(facet.name)),
  })

export const useFacetTopics = (name, ownerPk, enabled) =>
  useQuery({
    queryKey: ['home', 'facet-topics', name, ownerPk],
    queryFn: () => {
      const params = new URLSearchParams({ 'filter{owner.pk.in}': ownerPk, page_size: TOPIC_PAGE_SIZE })
      return apiFetch(`/facets/${name}?${params}`)
    },
    enabled: Boolean(enabled && ownerPk),
  })

export const useTopicResources = (filterKey, topicKey, ownerPk, enabled) =>
  useQuery({
    queryKey: ['home', 'topic-resources', filterKey, topicKey, ownerPk],
    queryFn: () => {
      const params = new URLSearchParams({
        'filter{owner.pk.in}': ownerPk,
        [filterKey]: topicKey,
        page_size: RESOURCE_PAGE_SIZE,
      })
      return apiFetch(`/resources?${params}`)
    },
    enabled: Boolean(enabled && ownerPk),
  })
