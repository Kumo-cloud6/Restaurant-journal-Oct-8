import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'

export const useCurrentUser = () =>
  useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
    staleTime: Infinity,
  })
