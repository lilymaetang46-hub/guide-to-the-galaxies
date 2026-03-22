create policy "outsider can update own unapproved connection rows"
on public.tracker_connections
for update
to authenticated
using (
  auth.uid() = outsider_id
  and approved_at is null
  and status <> 'approved'
)
with check (
  auth.uid() = outsider_id
  and approved_at is null
  and status <> 'approved'
);
