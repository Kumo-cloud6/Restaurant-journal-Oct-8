import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getJournal,
  getWishlist,
  removeFromWishlist,
  saveToWishlist,
  type JournalFilters,
  type SaveToWishlistInput,
} from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'

export const useJournal = (filters: JournalFilters) =>
  useQuery({
    queryKey: queryKeys.journal.list(filters),
    queryFn: () => getJournal(filters),
    placeholderData: keepPreviousData,
  })

export const useWishlist = () =>
  useQuery({ queryKey: queryKeys.wishlist, queryFn: getWishlist })

export function useSaveToWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SaveToWishlistInput) => saveToWishlist(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.wishlist })
      void qc.invalidateQueries({ queryKey: queryKeys.places.all })
    },
  })
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (placeId: string) => removeFromWishlist(placeId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.wishlist })
      void qc.invalidateQueries({ queryKey: queryKeys.places.all })
    },
  })
}
