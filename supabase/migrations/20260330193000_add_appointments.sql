create table if not exists public.appointments (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null default 'appointment',
  title text not null,
  event_date date not null,
  event_time time not null,
  location text,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint appointments_item_type_check check (item_type in ('appointment', 'reminder'))
);

create index if not exists appointments_user_schedule_idx
on public.appointments (user_id, event_date asc, event_time asc);

alter table public.appointments enable row level security;

drop policy if exists "users can view their own appointments" on public.appointments;
create policy "users can view their own appointments"
on public.appointments
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert their own appointments" on public.appointments;
create policy "users can insert their own appointments"
on public.appointments
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update their own appointments" on public.appointments;
create policy "users can update their own appointments"
on public.appointments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete their own appointments" on public.appointments;
create policy "users can delete their own appointments"
on public.appointments
for delete
to authenticated
using (auth.uid() = user_id);
