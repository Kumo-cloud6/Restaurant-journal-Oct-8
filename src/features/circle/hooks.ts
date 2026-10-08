import { useQuery } from '@tanstack/react-query'
import { getCircle, getFriendActivity } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'

export const useCircle = () =>
  useQuery({ queryKey: queryKeys.circle.overview, queryFn: getCircle })

export const useFriendActivity = () =>
  useQuery({ queryKey: queryKeys.circle.activity, queryFn: () => getFriendActivity() })
