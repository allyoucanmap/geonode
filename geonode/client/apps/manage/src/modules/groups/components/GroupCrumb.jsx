import { useParams } from 'react-router-dom'
import { useGroup } from '../api.js'

export function GroupCrumb() {
  const { groupId } = useParams()
  const { data } = useGroup(groupId)
  const group = data?.group_profile ?? data
  return <>{group?.title ?? '…'}</>
}
