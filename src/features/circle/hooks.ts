import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  acceptFriendRequest,
  getCircle,
  getFriendActivity,
  sendFriendRequest,
} from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'

export const useCircle = () =>
  useQuery({ queryKey: queryKeys.circle.overview, queryFn: getCircle })

export const useFriendActivity = () =>
  useQuery({ queryKey: queryKeys.circle.activity, queryFn: () => getFriendActivity() })

/** Friend changes alter who counts as "verified", so refresh places and the journal feed too. */
function useInvalidateSocial() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['circle'] })
    void qc.invalidateQueries({ queryKey: queryKeys.places.all })
  }
}

export function useSendFriendRequest() {
  const invalidate = useInvalidateSocial()
  return useMutation({ mutationFn: sendFriendRequest, onSuccess: invalidate })
}

export function useAcceptFriendRequest() {
  const invalidate = useInvalidateSocial()
  return useMutation({ mutationFn: acceptFriendRequest, onSuccess: invalidate })
}
