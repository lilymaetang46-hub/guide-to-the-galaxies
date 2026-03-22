delete from public.daily_entries older
using public.daily_entries newer
where older.user_id = newer.user_id
  and older.entry_date = newer.entry_date
  and (
    coalesce(older.created_at, to_timestamp(0)) < coalesce(newer.created_at, to_timestamp(0))
    or (
      coalesce(older.created_at, to_timestamp(0)) = coalesce(newer.created_at, to_timestamp(0))
      and older.id < newer.id
    )
  );

alter table public.daily_entries
add constraint daily_entries_user_id_entry_date_key unique (user_id, entry_date);
