alter table public.calendar_sync_event_links
add column if not exists source_item_id text;
