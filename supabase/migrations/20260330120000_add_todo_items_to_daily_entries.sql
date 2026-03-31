alter table public.daily_entries
add column if not exists todo_items jsonb default '[]'::jsonb;
