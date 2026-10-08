import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retryDelay: 400,
      refetchOnWindowFocus: false,
      // Don't retry things that will never succeed.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.code !== 'network') && failureCount < 1,
    },
  },
})
