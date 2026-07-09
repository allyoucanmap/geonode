import { useParams } from 'react-router-dom'
import { useUser } from '../api.js'

export function UserCrumb() {
  const { userId } = useParams()
  const { data } = useUser(userId)
  return <>{data?.user?.username ?? data?.username ?? '…'}</>
}
