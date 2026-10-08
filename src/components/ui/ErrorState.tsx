import { ApiError } from '@/lib/api'
import { Button } from './Button'
import { Icon } from './Icon'

export function ErrorState({
  error,
  onRetry,
  title = 'Something went sideways',
}: {
  error?: unknown
  onRetry?: () => void
  title?: string
}) {
  const message =
    error instanceof ApiError ? error.message : 'We couldn’t load this. Please try again.'
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-sm flex-col items-center px-6 py-14 text-center"
    >
      <span className="mb-5 grid size-16 place-items-center rounded-full bg-blush/60 text-persimmon-deep">
        <Icon name="alert" size={30} />
      </span>
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-2 text-soy">{message}</p>
      {onRetry && (
        <Button className="mt-6" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
