import { useId, useState, type ChangeEvent } from 'react'
import { Icon } from '@/components/ui/Icon'
import { fileToDataUrl } from './imageFile'

export function PhotoPicker({
  photos,
  onChange,
}: {
  photos: string[]
  onChange: (photos: string[]) => void
}) {
  const id = useId()
  const [error, setError] = useState<string | null>(null)
  const [reading, setReading] = useState(false)

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith('image/'),
    )
    e.target.value = ''
    if (files.length === 0) return
    setError(null)
    setReading(true)
    try {
      const urls = await Promise.all(files.map((f) => fileToDataUrl(f)))
      onChange([...photos, ...urls].slice(0, 4))
    } catch {
      setError('We couldn’t read that photo. Try another one.')
    } finally {
      setReading(false)
    }
  }

  return (
    <div>
      <div className="-mt-3 flex gap-3 overflow-x-auto pt-3 pr-3 pb-1">
        {photos.map((src, i) => (
          <div key={i} className="relative size-28 shrink-0 md:size-32">
            <img
              src={src}
              alt={`Your meal, ${i + 1} of ${photos.length}`}
              className="size-full rounded-2xl object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(photos.filter((_, j) => j !== i))}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute -top-2 -right-2 grid size-9 place-items-center rounded-full bg-ink text-cream shadow"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
        {photos.length < 4 && (
          <div className={photos.length === 0 ? 'relative flex-1' : 'relative'}>
            <input
              id={id}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => void onFiles(e)}
              className="peer sr-only"
            />
            <label
              htmlFor={id}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-persimmon/60 bg-blush/30 text-center text-sm font-medium text-persimmon-deep transition peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-persimmon hover:bg-blush/50 ${
                photos.length === 0 ? 'h-44 w-full md:h-52' : 'size-28 md:size-32'
              }`}
            >
              <Icon name="camera" size={photos.length === 0 ? 34 : 26} />
              {reading
                ? 'Reading…'
                : photos.length === 0
                  ? 'Add a photo of your meal'
                  : 'Add'}
            </label>
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-persimmon-deep">
          {error}
        </p>
      )}
    </div>
  )
}
