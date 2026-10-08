-- Restaurant Journal — initial schema, row-level security and photo storage.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Then run supabase/seed.sql to load the starter places and experience tags.

-- ───────────────────────────── Tables ─────────────────────────────

-- One profile per auth user (the app's `User` type).
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  created_at    timestamptz not null default now(),
  display_name  text not null,
  handle        text not null unique check (handle ~ '^[a-z0-9._]{3,24}$'),
  avatar_url    text,
  avatar_color  text not null default '#c64a24',
  home_city     text not null default 'Boston, MA',
  bio           text not null default ''
);

create table public.experience_tags (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  slug        text not null unique,
  label       text not null
);

create table public.places (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  name             text not null,
  cuisine          text not null,           -- family used for filtering: Chinese, Japanese, ...
  specialty        text not null,           -- e.g. "Lanzhou noodles"
  kind             text not null check (kind in ('restaurant', 'cafe')),
  address          text not null,
  neighborhood     text not null,
  lat              double precision not null,
  lng              double precision not null,
  price_level      smallint not null check (price_level between 1 and 4),
  cover_photo_url  text,                     -- null = the app draws a placeholder
  photo_urls       text[] not null default '{}',
  description      text not null default '',
  source           text not null default 'user' check (source in ('social', 'user')),
  source_url       text,
  social_buzz      integer not null default 0
);

-- A logged meal.
create table public.visits (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  place_id    uuid not null references public.places (id) on delete cascade,
  visited_on  date not null default current_date,
  photo_urls  text[] not null default '{}',
  dishes      text[] not null default '{}',
  note        text not null default ''
);
create index visits_user_idx  on public.visits (user_id, visited_on desc);
create index visits_place_idx on public.visits (place_id);

create table public.visit_tags (
  visit_id  uuid not null references public.visits (id) on delete cascade,
  tag_id    uuid not null references public.experience_tags (id) on delete cascade,
  primary key (visit_id, tag_id)
);

create table public.visit_companions (
  visit_id  uuid not null references public.visits (id) on delete cascade,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  primary key (visit_id, user_id)
);

create table public.wishlist_items (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  place_id    uuid not null references public.places (id) on delete cascade,
  source_url  text,
  note        text not null default '',
  unique (user_id, place_id)
);

-- user_id sends the request, friend_id receives it.
create table public.friendships (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  friend_id   uuid not null references public.profiles (id) on delete cascade,
  status      text not null default 'pending' check (status in ('pending', 'accepted')),
  check (user_id <> friend_id),
  unique (user_id, friend_id)
);

-- ───────────────────────────── Helpers ─────────────────────────────

-- True when a and b have an accepted friendship (either direction).
-- SECURITY DEFINER so RLS policies can call it without recursing into friendships' own policies.
create function public.is_friend(a uuid, b uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.user_id = a and f.friend_id = b) or (f.user_id = b and f.friend_id = a))
  );
$$;

-- Create a profile whenever someone signs up. The app passes display_name and handle as
-- sign-up metadata; we fall back to the email prefix and de-duplicate the handle.
create function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  base text;
  candidate text;
begin
  base := regexp_replace(lower(coalesce(new.raw_user_meta_data ->> 'handle', split_part(new.email, '@', 1))), '[^a-z0-9._]', '', 'g');
  if length(base) < 3 then base := base || 'foodie'; end if;
  base := left(base, 20);
  candidate := base;
  while exists (select 1 from public.profiles where handle = candidate) loop
    candidate := base || floor(random() * 9000 + 1000)::int;
  end loop;

  insert into public.profiles (id, display_name, handle, avatar_color)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)),
    candidate,
    (array['#c64a24', '#5e6b3a', '#c99a4b', '#6b4f3f', '#8a5a7a', '#3f6a6a'])[1 + floor(random() * 6)::int]
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────────── Row-level security ─────────────────────────────

alter table public.profiles         enable row level security;
alter table public.experience_tags  enable row level security;
alter table public.places           enable row level security;
alter table public.visits           enable row level security;
alter table public.visit_tags       enable row level security;
alter table public.visit_companions enable row level security;
alter table public.wishlist_items   enable row level security;
alter table public.friendships      enable row level security;

-- Profiles: any signed-in user can look people up (needed to add friends by handle).
create policy "profiles readable by signed-in users" on public.profiles
  for select to authenticated using (true);
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Reference data: read-only for signed-in users.
create policy "tags readable" on public.experience_tags
  for select to authenticated using (true);
create policy "places readable" on public.places
  for select to authenticated using (true);

-- Visits: you see your own and your accepted friends'. You write only your own.
create policy "see own and friends' visits" on public.visits
  for select to authenticated
  using (user_id = auth.uid() or public.is_friend(auth.uid(), user_id));
create policy "insert own visits" on public.visits
  for insert to authenticated with check (user_id = auth.uid());
create policy "update own visits" on public.visits
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete own visits" on public.visits
  for delete to authenticated using (user_id = auth.uid());

-- Visit tags / companions follow the visit's visibility; only the visit's owner writes.
create policy "see tags of visible visits" on public.visit_tags
  for select to authenticated using (exists (select 1 from public.visits v where v.id = visit_id));
create policy "tag own visits" on public.visit_tags
  for insert to authenticated
  with check (exists (select 1 from public.visits v where v.id = visit_id and v.user_id = auth.uid()));
create policy "untag own visits" on public.visit_tags
  for delete to authenticated
  using (exists (select 1 from public.visits v where v.id = visit_id and v.user_id = auth.uid()));

create policy "see companions of visible visits" on public.visit_companions
  for select to authenticated using (exists (select 1 from public.visits v where v.id = visit_id));
create policy "add companions to own visits" on public.visit_companions
  for insert to authenticated
  with check (exists (select 1 from public.visits v where v.id = visit_id and v.user_id = auth.uid()));
create policy "remove companions from own visits" on public.visit_companions
  for delete to authenticated
  using (exists (select 1 from public.visits v where v.id = visit_id and v.user_id = auth.uid()));

-- Wishlist: private to its owner.
create policy "own wishlist" on public.wishlist_items
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Friendships: visible to both people; you send requests as yourself; only the receiver accepts.
create policy "see own friendships" on public.friendships
  for select to authenticated using (user_id = auth.uid() or friend_id = auth.uid());
create policy "send friend requests" on public.friendships
  for insert to authenticated with check (user_id = auth.uid() and status = 'pending');
create policy "accept friend requests" on public.friendships
  for update to authenticated
  using (friend_id = auth.uid()) with check (friend_id = auth.uid() and status = 'accepted');
create policy "remove own friendships" on public.friendships
  for delete to authenticated using (user_id = auth.uid() or friend_id = auth.uid());

-- ───────────────────────────── Photo storage ─────────────────────────────

-- Public bucket: anyone with the URL can view a photo; only you can upload into your own folder.
insert into storage.buckets (id, name, public)
values ('visit-photos', 'visit-photos', true)
on conflict (id) do nothing;

create policy "upload to own photo folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'visit-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "delete own photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'visit-photos' and (storage.foldername(name))[1] = auth.uid()::text);
