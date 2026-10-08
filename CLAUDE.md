# Restaurant Journal

Mobile-first web app for food lovers (initial scope: Boston, Asian restaurants and cafes) who find places on TikTok/Instagram and want to know which are genuinely good vs. hyped. Trust comes from people you know ("friends who've been", their notes, experience tags) — **not star ratings**. Logging a meal must take under 30 seconds, because the log is the source of those signals.

**Current phase: front end only.** No back end, no Supabase client, no real auth. All data comes from in-memory mocks behind `src/lib/api/`.

## Stack

- React 19 + TypeScript (`strict`, `noUncheckedIndexedAccess`) + Vite
- React Router (`react-router-dom`) — plain `<Routes>`
- Tailwind CSS v4 (CSS-first tokens in `src/styles/index.css` via `@theme`; no `tailwind.config`)
- TanStack Query for all async data (wraps the API layer now, Supabase later)
- Plain React state/context for UI state. No Redux/Zustand/etc.
- ESLint 9 (flat config, incl. `jsx-a11y`) + Prettier (with Tailwind class sorting)
- Fonts: Fraunces (display serif) + Instrument Sans (UI), self-hosted via `@fontsource-variable`

## Commands

```
npm run dev         # Vite dev server
npm run typecheck   # tsc -b --noEmit
npm run lint        # eslint .
npm run build       # tsc -b && vite build
npm run format      # prettier --write .
```

Run typecheck + lint + build after every stage of work and fix errors before moving on.

## THE rule: data only flows through `src/lib/api/`

```
Component  →  query/mutation hook (features/*/hooks)  →  src/lib/api/*  →  src/mocks/* (now) / Supabase (later)
```

- Components and pages **never** import from `src/mocks/` and never call API functions directly. They use TanStack Query hooks, which call `src/lib/api/` functions.
- Only files inside `src/lib/api/` (and `src/mocks/` itself) may import `src/mocks/`. ESLint enforces this (`no-restricted-imports`).
- Every API function is `async`, returns plain typed objects, simulates latency, and throws `ApiError` on failure.
- Swapping mocks for Supabase must require changes **only inside `src/lib/api/`**. Do not leak mock-specific details (e.g. in-memory ids, delay helpers) into hooks/components.
- Query keys live in `src/lib/queryKeys.ts`. Mutations invalidate the keys they affect.
- Every data-driven screen handles **loading, empty, and error** states (use `QueryBoundary` + `Skeleton` / `EmptyState` / `ErrorState`).

## Folder structure

```
src/
  app/          App shell, router, providers, layouts
  components/   Shared UI: ui/ (primitives), layout/ (nav, page chrome), PhotoImage, QueryBoundary
  features/     One folder per area: auth, places, add, journal, circle, profile
                (each: pages, feature components, hooks.ts that wrap API calls in TanStack Query)
  lib/          api/ (data access layer), queryKeys, queryClient, format, cn
  mocks/        All mock data + in-memory "db". Private to lib/api.
  types/        Entity types shaped like relational tables
  styles/       Tailwind entry + design tokens
```

## Types

Entities (`User`, `Place`, `Visit`, `WishlistItem`, `Friendship`, `ExperienceTag`) mirror database tables: `id: string` (UUID-like), `created_at: string` (ISO), foreign keys as `<thing>_id`, snake_case fields. Join tables (`PlaceTag`, `VisitTag`) are modelled explicitly. UI-friendly composed shapes (`PlaceSummary`, `PlaceDetail`, `JournalEntry`, `FriendActivity`) are "read models" defined next to the API functions that build them — they replace the joins Supabase will do later.

## Conventions

- Import via the `@/` alias (`@/lib/api`, `@/components/ui/Button`). Use `import type` for types.
- Named exports; one component per file; file name = component name (PascalCase). Hooks `useThing`.
- Style with Tailwind utilities using design tokens (`bg-paper`, `text-ink`, `text-matcha`, `font-display`); don't hardcode hex values in components. Use `cn()` from `@/lib/cn` to compose classes.
- Mobile first: base styles = 375px, then `md:` (768px) and `lg:` (1280px). Bottom tab bar on mobile, side nav on `md+`.
- Accessibility is required: semantic elements, visible `focus-visible` ring, ≥44px touch targets, alt text on every image, labelled form controls, sufficient contrast, respect `prefers-reduced-motion`.
- No star ratings as a primary signal. Trust UI = friends who've been, friend notes, experience tags, hype-vs-verified badge.
- Browser storage is used only for mock auth state and the dev-only "simulate API failure" flag.
- Keep commits small with clear messages.

## Out of scope (for now)

Real auth, any Supabase code, image upload/storage, payments, real social-link scraping, push notifications, native apps.

## Supabase later

Env vars are documented in `.env.example` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). The client goes in `src/lib/api/client.ts` and each function in `src/lib/api/*.ts` swaps its mock body for a Supabase query. Nothing outside `src/lib/api/` should change.
