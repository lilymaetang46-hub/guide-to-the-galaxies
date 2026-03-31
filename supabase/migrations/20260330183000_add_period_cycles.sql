create table if not exists public.period_cycles (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  start_date date not null,
  end_date date,
  flow_level text not null default 'medium',
  symptom_tags jsonb not null default '[]'::jsonb,
  private_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint period_cycles_end_after_start check (end_date is null or end_date >= start_date),
  constraint period_cycles_flow_level_check check (flow_level in ('light', 'medium', 'heavy'))
);

create index if not exists period_cycles_user_start_idx
on public.period_cycles (user_id, start_date desc);

alter table public.period_cycles enable row level security;

drop policy if exists "users can view their own period cycles" on public.period_cycles;
create policy "users can view their own period cycles"
on public.period_cycles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert their own period cycles" on public.period_cycles;
create policy "users can insert their own period cycles"
on public.period_cycles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update their own period cycles" on public.period_cycles;
create policy "users can update their own period cycles"
on public.period_cycles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete their own period cycles" on public.period_cycles;
create policy "users can delete their own period cycles"
on public.period_cycles
for delete
to authenticated
using (auth.uid() = user_id);
