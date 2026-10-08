# Restaurant Journal

A mobile-first restaurant discovery and dining journal for food lovers who find places on TikTok and Instagram but can't tell which ones are genuinely good. Instead of star ratings, it surfaces **friends who've been**, their notes, and experience tags, with a "hyped vs. verified" indicator. Logging a meal is quick enough (photo, a few taps, optional note) that the log becomes the source of those signals.

Initial scope: Boston, Asian restaurants and cafes.

> **Status: front end only.** There is no back end and no Supabase code yet. All data comes from in-memory mocks behind a data access layer, and a page refresh resets anything you add.

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

The app opens on a mock onboarding screen. There is no real sign-in — "Enter the journal" signs you in as the sample user (Molly) using a flag in `localStorage`.

## Stack

React 19, TypeScript (strict), Vite, React Router, Tailwind CSS v4, TanStack Query, ESLint 9 + Prettier. Fonts (Fraunces and Instrument Sans) are bundled locally. ESLint is on v9 because `eslint-plugin-jsx-a11y` does not support v10 yet.

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
  lib/api/      data access layer: the ONLY code that touches mock data
  mocks/        in-memory "database" + seed data (private to lib/api)
  types/        entity types shaped like relational tables
```

Data flows one way: **component → query hook → `src/lib/api/` → mocks**. Components never import `src/mocks/` (ESLint enforces this). See [CLAUDE.md](CLAUDE.md) for conventions.

Entities (`User`, `Place`, `Visit`, `WishlistItem`, `Friendship`, `ExperienceTag`) use `id`, `created_at`, snake_case columns and foreign keys by id, so they map directly to Supabase tables.

## Connecting Supabase later

All changes go in `src/lib/api/`:

1. `npm install @supabase/supabase-js`, copy `.env.example` to `.env.local`, and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Create `src/lib/api/client.ts` with `createClient(...)`.
3. Replace each function body with a Supabase query. Keep the signatures and the read models in `models.ts`, which stand in for the joins/views Supabase will do.
4. Delete `mockRuntime.ts` (fake latency and the failure toggle) and `src/mocks/`.

| API function                                          | Supabase equivalent                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------------------- |
| `getPlaces`, `getPlaceById`, `searchPlaces`           | `places` + `visits` / `visit_tags` aggregated (view or RPC)                 |
| `logVisit`                                            | insert `visits`, `visit_tags`, `visit_companions`; upload photos to Storage |
| `getWishlist`, `saveToWishlist`, `removeFromWishlist` | `wishlist_items`                                                            |
| `getJournal`                                          | `visits` filtered by `user_id`                                              |
| `getCircle`, `getFriendActivity`                      | `friendships` + friends' `visits`                                           |
| `getCurrentUser`, `signInWithEmail`, `signOut`        | Supabase Auth + `users`                                                     |
| `parseSocialLink`                                     | an Edge Function that resolves the post                                     |

Mock-only things to replace: photos are downscaled to data URLs in `features/add/imageFile.ts` (nothing is uploaded), and `AuthContext` is a `localStorage` flag.

## Testing error states

On the Profile page, **Developer → Simulate API failure** makes every API call fail, so you can see the error and retry states on each screen.
