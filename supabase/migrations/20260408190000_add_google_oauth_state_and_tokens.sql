alter table public.calendar_sync_connections
add column if not exists oauth_state text,
add column if not exists oauth_state_expires_at timestamptz,
add column if not exists oauth_return_url text;

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

alter table public.calendar_sync_google_tokens enable row level security;
