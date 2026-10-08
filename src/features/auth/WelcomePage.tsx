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
  const { signedIn, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [step, setStep] = useState(0)
  const [tastes, setTastes] = useState<string[]>([])
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [handle, setHandle] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (signedIn) return <Navigate to={from} replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        navigate(from, { replace: true })
      } else {
        const { needsConfirmation } = await signUp({
          email,
          password,
          display_name: displayName,
          handle: handle.replace(/^@/, ''),
        })
        if (needsConfirmation) {
          setMode('signin')
          setNotice('Check your email to confirm your account, then sign in.')
        } else {
          navigate(from, { replace: true })
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setBusy(false)
    }
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
                onClick={() => {
                  setMode('signin')
                  setStep(2)
                }}
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
                (Taste preferences aren’t saved yet.)
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
              <h1 className="text-4xl font-medium">
                {mode === 'signup' ? 'Join your circle' : 'Welcome back'}
              </h1>
              <p className="mt-3 text-soy">
                {mode === 'signup'
                  ? 'Create an account, then add friends by their handle to see where they eat.'
                  : 'Sign in to pick up where you left off.'}
              </p>
              <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-5">
                {mode === 'signup' && (
                  <>
                    <Input
                      label="Your name"
                      autoComplete="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                    <Input
                      label="Handle"
                      autoComplete="username"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="mollyeats"
                      pattern="@?[a-zA-Z0-9._]{3,24}"
                      title="3–24 letters, numbers, dots or underscores"
                      hint="Friends find you with this. Letters, numbers, . and _"
                      required
                    />
                  </>
                )}
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  hint={mode === 'signup' ? 'At least 6 characters.' : undefined}
                  required
                />
                {notice && (
                  <p
                    role="status"
                    className="rounded-2xl bg-matcha-soft p-3 text-sm font-medium text-matcha-deep"
                  >
                    {notice}
                  </p>
                )}
                {error && (
                  <p
                    role="alert"
                    className="rounded-2xl bg-blush/60 p-3 text-sm font-medium text-persimmon-deep"
                  >
                    {error}
                  </p>
                )}
                <div className="flex gap-3">
                  <Button variant="secondary" type="button" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1" loading={busy}>
                    {mode === 'signup' ? 'Create account' : 'Sign in'}
                  </Button>
                </div>
              </form>
              <Button
                variant="ghost"
                fullWidth
                className="mt-3"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup')
                  setError(null)
                  setNotice(null)
                }}
              >
                {mode === 'signup'
                  ? 'I already have an account'
                  : 'New here? Create an account'}
              </Button>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
