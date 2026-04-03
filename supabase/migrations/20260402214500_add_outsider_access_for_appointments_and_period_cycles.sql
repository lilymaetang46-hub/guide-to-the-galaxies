create table if not exists public.period_cycle_private_notes (
  period_cycle_id bigint primary key references public.period_cycles(id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  private_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint period_cycle_private_notes_nonempty_check check (
    private_notes is null or length(btrim(private_notes)) > 0
  )
);

create index if not exists period_cycle_private_notes_user_idx
on public.period_cycle_private_notes (user_id, period_cycle_id);

insert into public.period_cycle_private_notes (period_cycle_id, user_id, private_notes, created_at, updated_at)
select id, user_id, private_notes, created_at, updated_at
from public.period_cycles
where private_notes is not null
  and length(btrim(private_notes)) > 0
on conflict (period_cycle_id) do update
set
  user_id = excluded.user_id,
  private_notes = excluded.private_notes,
  updated_at = excluded.updated_at;

alter table public.period_cycle_private_notes enable row level security;

drop policy if exists "users can view their own period cycle private notes" on public.period_cycle_private_notes;
create policy "users can view their own period cycle private notes"
on public.period_cycle_private_notes
for select
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.period_cycles
    where period_cycles.id = period_cycle_private_notes.period_cycle_id
      and period_cycles.user_id = auth.uid()
  )
);

drop policy if exists "users can insert their own period cycle private notes" on public.period_cycle_private_notes;
create policy "users can insert their own period cycle private notes"
on public.period_cycle_private_notes
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.period_cycles
    where period_cycles.id = period_cycle_private_notes.period_cycle_id
      and period_cycles.user_id = auth.uid()
  )
);

drop policy if exists "users can update their own period cycle private notes" on public.period_cycle_private_notes;
create policy "users can update their own period cycle private notes"
on public.period_cycle_private_notes
for update
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.period_cycles
    where period_cycles.id = period_cycle_private_notes.period_cycle_id
      and period_cycles.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.period_cycles
    where period_cycles.id = period_cycle_private_notes.period_cycle_id
      and period_cycles.user_id = auth.uid()
  )
);

drop policy if exists "users can delete their own period cycle private notes" on public.period_cycle_private_notes;
create policy "users can delete their own period cycle private notes"
on public.period_cycle_private_notes
for delete
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.period_cycles
    where period_cycles.id = period_cycle_private_notes.period_cycle_id
      and period_cycles.user_id = auth.uid()
  )
);

alter table public.period_cycles
drop column if exists private_notes;

drop policy if exists "approved outsiders can view shared appointments" on public.appointments;
create policy "approved outsiders can view shared appointments"
on public.appointments
for select
to authenticated
using (
  exists (
    select 1
    from public.tracker_connections
    where tracker_connections.tracker_id = appointments.user_id
      and tracker_connections.outsider_id = auth.uid()
      and tracker_connections.status = 'approved'
      and coalesce((tracker_connections.permissions ->> 'appointments')::boolean, false)
  )
);

drop policy if exists "approved outsiders can view shared period cycles" on public.period_cycles;
create policy "approved outsiders can view shared period cycles"
on public.period_cycles
for select
to authenticated
using (
  exists (
    select 1
    from public.tracker_connections
    where tracker_connections.tracker_id = period_cycles.user_id
      and tracker_connections.outsider_id = auth.uid()
      and tracker_connections.status = 'approved'
      and coalesce((tracker_connections.permissions ->> 'period')::boolean, false)
  )
);
