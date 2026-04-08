create table if not exists public.calendar_sync_connections (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null,
  status text not null default 'needs_setup',
  external_account_email text,
  external_calendar_id text,
  external_calendar_name text,
  sync_appointments boolean not null default true,
  sync_reminders boolean not null default true,
  sync_dated_todos boolean not null default false,
  last_synced_at timestamptz,
  last_error text,
  connected_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint calendar_sync_connections_provider_check
    check (provider in ('google')),
  constraint calendar_sync_connections_status_check
    check (status in ('needs_setup', 'ready', 'syncing', 'error', 'disabled')),
  constraint calendar_sync_connections_user_provider_unique
    unique (user_id, provider)
);

create index if not exists calendar_sync_connections_user_idx
on public.calendar_sync_connections (user_id, provider);

alter table public.calendar_sync_connections enable row level security;

drop policy if exists "users can view their own calendar sync connections" on public.calendar_sync_connections;
create policy "users can view their own calendar sync connections"
on public.calendar_sync_connections
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert their own calendar sync connections" on public.calendar_sync_connections;
create policy "users can insert their own calendar sync connections"
on public.calendar_sync_connections
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update their own calendar sync connections" on public.calendar_sync_connections;
create policy "users can update their own calendar sync connections"
on public.calendar_sync_connections
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete their own calendar sync connections" on public.calendar_sync_connections;
create policy "users can delete their own calendar sync connections"
on public.calendar_sync_connections
for delete
to authenticated
using (auth.uid() = user_id);

create table if not exists public.calendar_sync_event_links (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null,
  source_type text not null,
  source_record_id text not null,
  external_calendar_id text,
  external_event_id text,
  sync_status text not null default 'pending',
  source_updated_at timestamptz,
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint calendar_sync_event_links_provider_check
    check (provider in ('google')),
  constraint calendar_sync_event_links_source_type_check
    check (source_type in ('appointment', 'todo')),
  constraint calendar_sync_event_links_status_check
    check (sync_status in ('pending', 'synced', 'failed', 'deleted')),
  constraint calendar_sync_event_links_unique_source
    unique (user_id, provider, source_type, source_record_id)
);

create index if not exists calendar_sync_event_links_user_idx
on public.calendar_sync_event_links (user_id, provider, sync_status);

alter table public.calendar_sync_event_links enable row level security;

drop policy if exists "users can view their own calendar sync event links" on public.calendar_sync_event_links;
create policy "users can view their own calendar sync event links"
on public.calendar_sync_event_links
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert their own calendar sync event links" on public.calendar_sync_event_links;
create policy "users can insert their own calendar sync event links"
on public.calendar_sync_event_links
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update their own calendar sync event links" on public.calendar_sync_event_links;
create policy "users can update their own calendar sync event links"
on public.calendar_sync_event_links
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete their own calendar sync event links" on public.calendar_sync_event_links;
create policy "users can delete their own calendar sync event links"
on public.calendar_sync_event_links
for delete
to authenticated
using (auth.uid() = user_id);
