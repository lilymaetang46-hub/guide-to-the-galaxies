alter table public.calendar_sync_connections
add column if not exists status text not null default 'needs_setup',
add column if not exists external_account_email text,
add column if not exists external_calendar_id text,
add column if not exists external_calendar_name text,
add column if not exists sync_appointments boolean not null default true,
add column if not exists sync_reminders boolean not null default true,
add column if not exists sync_dated_todos boolean not null default false,
add column if not exists last_synced_at timestamptz,
add column if not exists last_error text,
add column if not exists connected_at timestamptz,
add column if not exists created_at timestamptz not null default timezone('utc', now()),
add column if not exists updated_at timestamptz not null default timezone('utc', now()),
add column if not exists oauth_state text,
add column if not exists oauth_state_expires_at timestamptz,
add column if not exists oauth_return_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calendar_sync_connections_status_check'
  ) then
    alter table public.calendar_sync_connections
    add constraint calendar_sync_connections_status_check
      check (status in ('needs_setup', 'ready', 'syncing', 'error', 'disabled'));
  end if;
end
$$;

create table if not exists public.calendar_sync_google_tokens (
  user_id uuid primary key references auth.users (id) on delete cascade,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  scope text,
  token_type text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.calendar_sync_google_tokens
add column if not exists access_token text,
add column if not exists refresh_token text,
add column if not exists expires_at timestamptz,
add column if not exists scope text,
add column if not exists token_type text,
add column if not exists created_at timestamptz not null default timezone('utc', now()),
add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table public.calendar_sync_google_tokens
alter column access_token set not null;
