import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryBoundary } from '@/components/QueryBoundary'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/features/auth/AuthContext'
import { useCurrentUser } from '@/features/auth/hooks'
import { useCircle } from '@/features/circle/hooks'
import { useJournal, useWishlist } from '@/features/journal/hooks'

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl bg-cream p-4 text-center shadow-[var(--shadow-card)]">
      <p className="font-display text-3xl font-medium">{value}</p>
      <p className="label-caps mt-1 text-soy">{label}</p>
    </div>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  const labelId = useId()
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 py-2">
      <div>
        <p className="font-medium" id={labelId}>
          {label}
        </p>
        <p className="text-sm text-soy">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className="grid h-11 w-16 shrink-0 place-items-center rounded-full"
      >
        <span
          aria-hidden
          className={`relative block h-8 w-14 rounded-full transition ${checked ? 'bg-matcha' : 'bg-ink/25'}`}
        >
          <span
            className={`absolute top-1 left-1 size-6 rounded-full bg-cream shadow transition-transform ${checked ? 'translate-x-6' : ''}`}
          />
        </span>
      </button>
    </div>
  )
}

export function ProfilePage() {
  const user = useCurrentUser()
  const circle = useCircle()
  const journal = useJournal({})
  const wishlist = useWishlist()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  // Placeholder preferences (not persisted).
  const [shareLogs, setShareLogs] = useState(true)
  const [weekly, setWeekly] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    navigate('/welcome', { replace: true })
  }

  return (
    <PageContainer width="narrow">
      <PageHeader eyebrow="Profile" title="You, at the table" />

      <QueryBoundary query={user} loading={<Skeleton className="h-40" />}>
        {(u) => (
          <section className="rounded-[var(--radius-card)] bg-cream p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
              <Avatar user={u} size="lg" />
              <div className="min-w-0">
                <h2 className="text-2xl font-medium">{u.display_name}</h2>
                <p className="text-sm text-soy">
                  @{u.handle} · {u.home_city}
                </p>
              </div>
            </div>
            <p className="mt-4 text-ink/90">{u.bio}</p>
          </section>
        )}
      </QueryBoundary>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat value={journal.data?.length ?? '–'} label="Logs" />
        <Stat value={wishlist.data?.length ?? '–'} label="Saved" />
        <Stat value={circle.data?.friends.length ?? '–'} label="Friends" />
      </div>

      <section aria-labelledby="settings-heading" className="mt-8">
        <h2 id="settings-heading" className="mb-2 text-2xl font-medium">
          Settings
        </h2>
        <div className="divide-y divide-line rounded-[var(--radius-card)] bg-cream px-5 shadow-[var(--shadow-card)]">
          <Toggle
            label="Share logs with my circle"
            hint="Friends see your notes and tags."
            checked={shareLogs}
            onChange={setShareLogs}
          />
          <Toggle
            label="Weekly digest"
            hint="Placeholder — email isn’t wired up yet."
            checked={weekly}
            onChange={setWeekly}
          />
        </div>
      </section>

      <Button
        variant="secondary"
        icon="logout"
        className="mt-8"
        loading={signingOut}
        onClick={() => void handleSignOut()}
      >
        Sign out
      </Button>
    </PageContainer>
  )
}
