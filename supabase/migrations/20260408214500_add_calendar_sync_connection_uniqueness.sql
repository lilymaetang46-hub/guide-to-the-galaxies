create unique index if not exists calendar_sync_connections_user_provider_unique_idx
on public.calendar_sync_connections (user_id, provider);
