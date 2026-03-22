create table public.push_notification_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null,
  platform text not null check (platform in ('android', 'ios', 'web')),
  app_id text,
  environment text not null default 'production',
  enabled boolean not null default true,
  last_registered_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id, token)
);

alter table public.push_notification_devices enable row level security;

create policy "users can view own push devices"
on public.push_notification_devices
for select
to authenticated
using (auth.uid() = user_id);

create policy "users can insert own push devices"
on public.push_notification_devices
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users can update own push devices"
on public.push_notification_devices
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can delete own push devices"
on public.push_notification_devices
for delete
to authenticated
using (auth.uid() = user_id);
