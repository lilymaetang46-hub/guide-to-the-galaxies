create table public.support_messages (
  id bigint generated always as identity primary key,
  connection_id uuid not null references public.tracker_connections(id) on delete cascade,
  tracker_id uuid not null references public.profiles(id) on delete cascade,
  outsider_id uuid not null references public.profiles(id) on delete cascade,
  outsider_name text not null,
  message text not null,
  created_at timestamp with time zone not null default now(),
  read_at timestamp with time zone
);

alter table public.support_messages enable row level security;

create policy "trackers can view own support messages"
on public.support_messages
for select
to authenticated
using (auth.uid() = tracker_id);

create policy "trackers can update own support messages"
on public.support_messages
for update
to authenticated
using (auth.uid() = tracker_id)
with check (auth.uid() = tracker_id);

create policy "approved outsiders can create support messages"
on public.support_messages
for insert
to authenticated
with check (
  auth.uid() = outsider_id
  and exists (
    select 1
    from public.tracker_connections
    where tracker_connections.id = support_messages.connection_id
      and tracker_connections.tracker_id = support_messages.tracker_id
      and tracker_connections.outsider_id = support_messages.outsider_id
      and tracker_connections.status = 'approved'
  )
);
