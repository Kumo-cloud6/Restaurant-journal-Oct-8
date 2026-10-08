import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

interface QueryBoundaryProps<T> {
  query: Pick<UseQueryResult<T>, 'data' | 'isPending' | 'isError' | 'error' | 'refetch'>
  /** Skeleton shown while the first load is in flight. */
  loading: ReactNode
  /** Return true when `data` has nothing to show. */
  isEmpty?: (data: T) => boolean
  empty?: ReactNode
  /** Used when `empty` isn't provided. */
  emptyTitle?: string
  children: (data: T) => ReactNode
}

/**
 * One place that makes every data-driven screen handle loading, error and empty states.
 */
export function QueryBoundary<T>({
  query,
  loading,
  isEmpty,
  empty,
  emptyTitle = 'Nothing here yet',
  children,
}: QueryBoundaryProps<T>) {
  if (query.isPending) {
    return (
      <div role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Loading…</span>
        {loading}
      </div>
    )
  }
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  }
  const data = query.data as T
  if (isEmpty?.(data)) return <>{empty ?? <EmptyState title={emptyTitle} />}</>
  return <>{children(data)}</>
}
