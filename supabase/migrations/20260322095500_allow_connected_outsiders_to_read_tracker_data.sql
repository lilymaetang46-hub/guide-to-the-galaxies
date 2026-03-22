create policy "connected outsiders can view approved tracker daily entries"
on public.daily_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.tracker_connections
    where tracker_connections.tracker_id = daily_entries.user_id
      and tracker_connections.outsider_id = auth.uid()
      and tracker_connections.status = 'approved'
  )
);

create policy "connected outsiders can view approved tracker profiles"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.tracker_connections
    where tracker_connections.tracker_id = profiles.id
      and tracker_connections.outsider_id = auth.uid()
      and tracker_connections.status = 'approved'
  )
);
