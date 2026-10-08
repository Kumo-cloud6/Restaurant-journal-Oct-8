# Restaurant Journal

A mobile-first restaurant discovery and dining journal for food lovers who find places on TikTok and Instagram but can't tell which ones are genuinely good. Instead of star ratings, it surfaces **friends who've been**, their notes, and experience tags, with a "hyped vs. verified" indicator. Logging a meal is quick enough (photo, a few taps, optional note) that the log becomes the source of those signals.

Initial scope: Boston, Asian restaurants and cafes.

> **Status:** the front end is connected to Supabase (Postgres, Auth, Storage). `parseSocialLink` is still a mock heuristic; real TikTok/Instagram scraping isn't built.

## Set up the back end (once)

1. In your Supabase project, open **SQL Editor → New query**, paste [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), and run it. It creates the tables, row-level security, a profile-on-sign-up trigger, and the `visit-photos` storage bucket.
2. Run [`supabase/seed.sql`](supabase/seed.sql) the same way to load the starter Boston places and experience tags.
3. Copy your **Project URL** and **anon public key** (Project Settings → API) into `.env.local` (see `.env.example`).
4. Optional, for quick testing: **Authentication → Providers → Email**, turn off "Confirm email" so new accounts can sign in immediately.

## Run it

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                     |
| ------------------- | -------------------------------- |
| `npm run dev`       | Vite dev server                  |
| `npm run build`     | Type-check + production build    |
| `npm run typecheck` | `tsc -b --noEmit`                |
| `npm run lint`      | ESLint (incl. architecture rule) |
| `npm run format`    | Prettier                         |

Create an account on the welcome screen, then add friends by handle on the Circle page. A friend's logs only verify places for you once they've accepted your request.

## Stack

React 19, TypeScript (strict), Vite, React Router, Tailwind CSS v4, TanStack Query, Supabase, ESLint 9 + Prettier. Fonts (Fraunces and Instrument Sans) are bundled locally. ESLint is on v9 because `eslint-plugin-jsx-a11y` does not support v10 yet.

## Screens and routes

| Route              | Screen                                                            |
| ------------------ | ----------------------------------------------------------------- |
| `/welcome`         | Onboarding / sign in (mock)                                       |
| `/`                | Discover: place cards with trust signals                          |
| `/places/:placeId` | Place detail: photos, friend logs, save and log actions           |
| `/add`             | Add: `?mode=log` (default) or `?mode=save`; `&placeId=` prefills  |
| `/journal`         | My Journal: timeline with filters, and wishlist (`?tab=wishlist`) |
| `/circle`          | Friends and their recent logs                                     |
| `/profile`         | Profile and settings placeholder                                  |

## How trust works

The API layer labels each place for the current user:

- **Verified**: you or someone in your circle has logged a visit
- **Hyped**: it is buzzing on social, but nobody you know has logged it
- **Unlogged**: no logs and no buzz (a blank slate or hidden gem)

## Architecture

```
src/
  app/          router, providers, app shell
  components/   shared UI (ui/, layout/), PhotoImage, QueryBoundary
  features/     auth, places, add, journal, circle, profile (pages + TanStack Query hooks)
  lib/api/      data access layer: the ONLY code that touches Supabase
  types/        entity types shaped like the database tables
supabase/       migrations (schema, RLS, storage) and seed data
```

Data flows one way: **component → query hook → `src/lib/api/` → Supabase**. Nothing outside `src/lib/api/` may import `@supabase/supabase-js` (ESLint enforces this). See [CLAUDE.md](CLAUDE.md) for conventions.

**Privacy** is enforced by row-level security, not the UI: you see your own visits and those of accepted friends; wishlists are private; you can only write rows as yourself.

**How trust works** (computed in `src/lib/api/internal.ts`): _verified_ = you or a friend logged a visit; _hyped_ = buzzing online but nobody you know has logged it; _unlogged_ = no logs and no buzz.

## What's still mocked or simple

- `parseSocialLink` resolves links with a heuristic. Replace it with an Edge Function that reads the post.
- Reads load a snapshot of everything you can see and build summaries in the browser. Fine for a few hundred places; move to SQL views or RPCs when it grows.
- Profiles are readable by any signed-in user so friends can be found by handle.
- Taste preferences on the welcome screen and the Profile toggles aren't saved.
