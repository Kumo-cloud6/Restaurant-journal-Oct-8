-- handle_new_user only runs as a trigger; nobody should call it over the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
-- is_friend is used inside RLS policies for signed-in users only.
revoke execute on function public.is_friend(uuid, uuid) from public, anon;
grant execute on function public.is_friend(uuid, uuid) to authenticated;
