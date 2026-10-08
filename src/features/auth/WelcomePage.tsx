import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Input } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { useAuth } from './AuthContext'

const TASTES = [
  'Ramen & noodles',
  'Dim sum',
  'Korean home cooking',
  'Matcha & tea',
  'Kissaten cafes',
  'Vietnamese',
  'Sichuan heat',
  'Healthy bowls',
]

const STEPS = 3

function Collage() {
  return (
    <div
      aria-hidden
      className="relative h-56 overflow-hidden bg-matcha md:h-full md:min-h-dvh"
    >
      <div className="absolute -top-10 -left-10 size-56 rounded-full bg-persimmon md:size-96" />
      <div className="absolute top-24 right-6 h-48 w-32 rounded-t-full bg-miso md:top-1/3 md:right-16 md:h-80 md:w-52" />
      <div className="absolute -bottom-8 left-[45%] size-40 rounded-full bg-blush md:size-72" />
      <div className="absolute right-1/4 bottom-6 size-14 rounded-full bg-paper md:bottom-24 md:size-24" />
      <p className="absolute bottom-5 left-5 z-10 max-w-[10rem] font-display text-2xl leading-tight font-medium text-cream italic [text-shadow:0_1px_12px_rgb(43_33_24/0.45)] md:bottom-12 md:left-12 md:max-w-xs md:text-4xl">
        Trust the table, not the trend.
      </p>
    </div>
  )
}

export function WelcomePage() {
  const { signedIn, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(0)
  const [tastes, setTastes] = useState<string[]>([])
  const [email, setEmail] = useState('molly@example.com')
  const [busy, setBusy] = useState(false)

  if (signedIn) return <Navigate to="/" replace />

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    await signIn(email)
    navigate(from, { replace: true })
  }

  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      <Collage />
      <main
        id="main"
        className="flex flex-col justify-center px-6 py-10 md:px-14 lg:px-20"
      >
        <div className="mx-auto w-full max-w-md">
          <p className="mb-8 font-display text-xl font-semibold">
            Restaurant <em className="font-medium text-persimmon italic">Journal</em>
          </p>

          <ol className="mb-8 flex gap-2" aria-label={`Step ${step + 1} of ${STEPS}`}>
            {Array.from({ length: STEPS }, (_, i) => (
              <li
                key={i}
                aria-current={i === step ? 'step' : undefined}
                className={cn(
                  'h-1.5 flex-1 rounded-full',
                  i <= step ? 'bg-persimmon' : 'bg-ink/15',
                )}
              />
            ))}
          </ol>

          {step === 0 && (
            <section className="animate-rise">
              <h1 className="text-4xl font-medium md:text-5xl">
                Know which places are <em className="text-persimmon italic">actually</em>{' '}
                good.
              </h1>
              <p className="mt-4 text-lg text-soy">
                Found a spot on TikTok? See which friends have been, what they said, and
                how it felt, before you book.
              </p>
              <ul className="mt-6 space-y-3 text-[0.9375rem]">
                {[
                  'Friends’ notes and experience tags, not star ratings',
                  'Hyped vs. verified at a glance',
                  'Log a meal in under 30 seconds',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <Icon
                      name="check"
                      size={20}
                      className="mt-0.5 shrink-0 text-matcha"
                    />
                    {t}
                  </li>
                ))}
              </ul>
              <Button size="lg" fullWidth className="mt-8" onClick={() => setStep(1)}>
                Get started
              </Button>
              <Button
                variant="ghost"
                fullWidth
                className="mt-2"
                onClick={() => setStep(2)}
              >
                I already have an account
              </Button>
            </section>
          )}

          {step === 1 && (
            <section className="animate-rise">
              <h1 className="text-4xl font-medium">What are you craving?</h1>
              <p className="mt-3 text-soy">
                Pick a few. We’re starting with Boston’s Asian restaurants and cafes.
                (This only tunes your demo feed.)
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {TASTES.map((t) => (
                  <Chip
                    key={t}
                    selected={tastes.includes(t)}
                    onToggle={() =>
                      setTastes((cur) =>
                        cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t],
                      )
                    }
                  >
                    {t}
                  </Chip>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button className="flex-1" size="lg" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="animate-rise">
              <h1 className="text-4xl font-medium">Join your circle</h1>
              <p className="mt-3 text-soy">
                This is a demo, so there’s no real sign-in. Continue to explore with
                sample friends and logs.
              </p>
              <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-5">
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="flex gap-3">
                  <Button variant="secondary" type="button" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1" loading={busy}>
                    Enter the journal
                  </Button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
