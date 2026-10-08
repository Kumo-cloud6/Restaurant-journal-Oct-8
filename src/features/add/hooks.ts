import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logVisit, parseSocialLink, type LogVisitInput } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'

export const useParseLink = () => useMutation({ mutationFn: parseSocialLink })

export function useLogVisit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: LogVisitInput) => logVisit(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.journal.all })
      void qc.invalidateQueries({ queryKey: queryKeys.places.all })
      void qc.invalidateQueries({ queryKey: queryKeys.wishlist })
      void qc.invalidateQueries({ queryKey: queryKeys.circle.activity })
    },
  })
}
