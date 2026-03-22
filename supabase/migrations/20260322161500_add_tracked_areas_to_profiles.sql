alter table public.profiles
add column if not exists tracked_areas jsonb;
