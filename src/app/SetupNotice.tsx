/** Shown instead of the app when the Supabase env vars are missing. */
export function SetupNotice() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-12">
      <p className="label-caps mb-3 text-persimmon-deep">Almost there</p>
      <h1 className="text-4xl font-medium">Connect your Supabase project</h1>
      <p className="mt-4 text-soy">
        Copy <code className="rounded bg-ink/10 px-1.5">.env.example</code> to{' '}
        <code className="rounded bg-ink/10 px-1.5">.env.local</code>, fill in the two
        values from your Supabase dashboard (Project Settings → API), then restart{' '}
        <code className="rounded bg-ink/10 px-1.5">npm run dev</code>.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-2xl bg-ink p-4 text-sm text-cream">
        {`VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key`}
      </pre>
    </main>
  )
}
