import { cn } from '@/lib/cn'

/** All photos go through here so alt text is always required and loading is consistent. */
export function PhotoImage({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={cn('bg-blush/50 object-cover', className)}
    />
  )
}
