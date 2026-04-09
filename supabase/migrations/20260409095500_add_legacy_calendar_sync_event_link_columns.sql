alter table public.calendar_sync_event_links
add column if not exists source_kind text,
add column if not exists source_id text;
