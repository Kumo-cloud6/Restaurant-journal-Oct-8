import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhotoImage } from '@/components/PhotoImage'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import { useSaveToWishlist } from '@/features/journal/hooks'
import { TrustBadge } from '@/features/places/TrustBadge'
import { ApiError } from '@/lib/api'
import { compactCount } from '@/lib/format'
import { useParseLink } from './hooks'

export function SaveSpotForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const parse = useParseLink()
  const save = useSaveToWishlist()
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')

  const parsed = parse.data
  const parseError =
    parse.error instanceof ApiError
      ? parse.error.message
      : parse.error
        ? 'Couldn’t read that link. Try again.'
        : null

  const onParse = (e: FormEvent) => {
    e.preventDefault()
    if (url.trim()) parse.mutate(url)
  }

  const onSave = () => {
    if (!parsed) return
    save.mutate(
      { place_id: parsed.place.id, source_url: parsed.url, note },
      {
        onSuccess: () => {
          toast.show(`Saved ${parsed.place.name} to your wishlist`)
          navigate('/journal?tab=wishlist')
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onParse} className="space-y-3" noValidate>
        <Input
          label="TikTok or Instagram link"
          type="url"
          inputMode="url"
          autoComplete="off"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (parse.data || parse.error) parse.reset()
          }}
          placeholder="https://www.tiktok.com/@…"
          error={parseError}
          hint="We’ll figure out which place the post is about."
        />
        <Button
          type="submit"
          variant={parsed ? 'secondary' : 'primary'}
          icon="link"
          loading={parse.isPending}
          disabled={!url.trim()}
        >
          {parse.isPending ? 'Reading the post…' : 'Find the spot'}
        </Button>
      </form>

      {parsed && (
        <section
          aria-labelledby="parsed-heading"
          className="animate-rise space-y-5 rounded-[var(--radius-card)] bg-cream p-4 shadow-[var(--shadow-card)] md:p-5"
        >
          <h2 id="parsed-heading" className="label-caps font-sans text-soy">
            We found it
          </h2>
          <div className="flex gap-4">
            <PhotoImage
              src={parsed.place.cover_photo_url}
              alt={`${parsed.place.name}: ${parsed.place.specialty}`}
              className="size-24 shrink-0 rounded-2xl md:size-28"
            />
            <div className="min-w-0 space-y-2">
              <TrustBadge summary={parsed.summary} />
              <p className="font-display text-2xl leading-tight font-medium">
                {parsed.place.name}
              </p>
              <p className="text-sm text-soy">
                {parsed.place.specialty} · {parsed.place.neighborhood}
              </p>
            </div>
          </div>
          <p className="rounded-2xl bg-paper p-3 text-sm text-soy">
            <span className="font-semibold text-ink">
              {parsed.platform === 'tiktok' ? 'TikTok' : 'Instagram'} · @{parsed.creator}
            </span>
            <br />“{parsed.caption}”
            {parsed.place.social_buzz > 0 && (
              <> · {compactCount(parsed.place.social_buzz)} views</>
            )}
          </p>
          {parsed.summary.trust === 'hyped' && (
            <p className="text-sm text-soy">
              <span className="font-semibold text-ink">Heads up:</span> no one in your
              circle has logged this yet, so it’s still unverified.
            </p>
          )}
          <Textarea
            label="Why do you want to try it?"
            optional
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Friend recommended, craving khao soi, birthday dinner idea…"
            maxLength={200}
            rows={3}
          />
          {save.isError && (
            <p role="alert" className="text-sm font-medium text-persimmon-deep">
              Couldn’t save this spot. Try again.
            </p>
          )}
          <Button
            size="lg"
            fullWidth
            icon="bookmark"
            onClick={onSave}
            loading={save.isPending}
          >
            Save to wishlist
          </Button>
        </section>
      )}
    </div>
  )
}
