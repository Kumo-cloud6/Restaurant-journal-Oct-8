import { useToast } from '@/components/ui/Toast'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { useRemoveFromWishlist, useSaveToWishlist } from '@/features/journal/hooks'

/** Round bookmark toggle used on cards. */
export function WishlistIconButton({
  placeId,
  placeName,
  saved,
  className,
}: {
  placeId: string
  placeName: string
  saved: boolean
  className?: string
}) {
  const save = useSaveToWishlist()
  const remove = useRemoveFromWishlist()
  const toast = useToast()
  const busy = save.isPending || remove.isPending

  const toggle = () => {
    if (saved) {
      remove.mutate(placeId, {
        onSuccess: () => toast.show(`Removed ${placeName} from wishlist`),
      })
    } else {
      save.mutate(
        { place_id: placeId },
        { onSuccess: () => toast.show(`Saved ${placeName} to your wishlist`) },
      )
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={
        saved ? `Remove ${placeName} from wishlist` : `Save ${placeName} to wishlist`
      }
      className={cn(
        'relative z-10 grid size-11 place-items-center rounded-full bg-cream/90 text-ink shadow-sm backdrop-blur transition hover:bg-cream active:scale-90 disabled:opacity-60',
        saved && 'text-persimmon-deep',
        className,
      )}
    >
      <Icon name="bookmark" size={22} filled={saved} />
    </button>
  )
}
