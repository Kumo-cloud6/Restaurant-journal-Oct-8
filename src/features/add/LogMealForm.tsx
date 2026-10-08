import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Input, Textarea } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/components/ui/Toast'
import { useCircle } from '@/features/circle/hooks'
import { useExperienceTags } from '@/features/places/hooks'
import { ApiError } from '@/lib/api'
import { today } from '@/lib/format'
import { useLogVisit } from './hooks'
import { PhotoPicker } from './PhotoPicker'
import { PlacePicker } from './PlacePicker'

function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3" aria-label={title}>
      <h2 className="flex items-center gap-2.5 font-sans text-base font-semibold">
        <span className="grid size-6 place-items-center rounded-full bg-ink text-xs text-cream">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

export function LogMealForm() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const logVisit = useLogVisit()
  const tags = useExperienceTags()
  const circle = useCircle()

  const [photos, setPhotos] = useState<string[]>([])
  const [placeId, setPlaceId] = useState<string | null>(params.get('placeId'))
  const [companions, setCompanions] = useState<string[]>([])
  const [dishes, setDishes] = useState<string[]>([])
  const [dishDraft, setDishDraft] = useState('')
  const [tagIds, setTagIds] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [date, setDate] = useState(today())

  const ready = photos.length > 0 && placeId !== null

  const addDish = () => {
    const d = dishDraft.trim()
    if (d && !dishes.includes(d)) setDishes([...dishes, d])
    setDishDraft('')
  }
  const onDishKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addDish()
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!ready || !placeId) return
    // Include a dish still being typed.
    const pending = dishDraft.trim()
    logVisit.mutate(
      {
        place_id: placeId,
        visited_on: date || today(),
        photo_urls: photos,
        dishes: pending && !dishes.includes(pending) ? [...dishes, pending] : dishes,
        tag_ids: tagIds,
        companion_user_ids: companions,
        note,
      },
      {
        onSuccess: () => {
          toast.show('Meal logged to your journal')
          navigate('/journal')
        },
      },
    )
  }

  const error = logVisit.error
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? 'Something went wrong. Try again.'
        : null

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <Step n={1} title="Photo">
        <PhotoPicker photos={photos} onChange={setPhotos} />
      </Step>

      <Step n={2} title="Where did you eat?">
        <PlacePicker placeId={placeId} onChange={setPlaceId} />
      </Step>

      <Step n={3} title="Who came along?">
        <div role="group" aria-label="Companions" className="flex flex-wrap gap-2">
          {circle.isPending && (
            <span className="text-sm text-soy">Loading your circle…</span>
          )}
          {circle.isError && (
            <span className="text-sm text-soy">
              Couldn’t load friends. You can skip this.
            </span>
          )}
          {circle.data?.friends.map((f) => (
            <Chip
              key={f.user.id}
              selected={companions.includes(f.user.id)}
              onToggle={() => setCompanions(toggle(companions, f.user.id))}
            >
              {f.user.display_name.split(' ')[0]}
            </Chip>
          ))}
          {circle.data && circle.data.friends.length === 0 && (
            <span className="text-sm text-soy">Just you this time.</span>
          )}
        </div>
      </Step>

      <Step n={4} title="What did you eat?">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label="Dish"
              value={dishDraft}
              onChange={(e) => setDishDraft(e.target.value)}
              onKeyDown={onDishKey}
              placeholder="Beef noodle soup…"
              enterKeyHint="done"
              hint="Press enter to add. Add as many as you like."
            />
          </div>
          <Button
            variant="secondary"
            onClick={addDish}
            disabled={!dishDraft.trim()}
            className="mt-[1.65rem]"
            aria-label="Add dish"
          >
            <Icon name="plus" size={20} />
          </Button>
        </div>
        {dishes.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Dishes you ate">
            {dishes.map((d) => (
              <li key={d}>
                <Chip selected onToggle={() => setDishes(dishes.filter((x) => x !== d))}>
                  {d}
                  <Icon name="x" size={14} />
                  <span className="sr-only">Remove {d}</span>
                </Chip>
              </li>
            ))}
          </ul>
        )}
      </Step>

      <Step n={5} title="How was it?">
        <div role="group" aria-label="Experience tags" className="flex flex-wrap gap-2">
          {tags.isPending && <span className="text-sm text-soy">Loading tags…</span>}
          {tags.isError && <span className="text-sm text-soy">Couldn’t load tags.</span>}
          {tags.data?.map((t) => (
            <Chip
              key={t.id}
              selected={tagIds.includes(t.id)}
              onToggle={() => setTagIds(toggle(tagIds, t.id))}
            >
              {t.label}
            </Chip>
          ))}
        </div>
      </Step>

      <Step n={6} title="Anything to remember?">
        <Textarea
          label="Note"
          optional
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What would you tell a friend before they go?"
          maxLength={280}
          rows={3}
        />
        <Input
          label="Date"
          type="date"
          value={date}
          max={today()}
          onChange={(e) => setDate(e.target.value)}
        />
      </Step>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-2xl bg-blush/60 p-4 text-sm font-medium text-persimmon-deep"
        >
          {errorMessage}
        </p>
      )}

      <div className="sticky bottom-20 z-20 -mx-1 rounded-3xl bg-paper/90 p-1 backdrop-blur md:static md:bg-transparent md:p-0">
        <Button
          type="submit"
          size="lg"
          fullWidth
          icon="check"
          disabled={!ready}
          loading={logVisit.isPending}
          aria-describedby="log-hint"
        >
          Log this meal
        </Button>
        <p id="log-hint" className="mt-2 text-center text-sm text-soy">
          {ready
            ? 'Everything else is optional.'
            : 'Add a photo and pick a place to log.'}
        </p>
      </div>
    </form>
  )
}
