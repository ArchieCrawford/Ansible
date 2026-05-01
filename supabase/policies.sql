-- Permissive policies for the anon (and authenticated) role.
-- WARNING: This makes all rows in `items` and `maintenance_records`
-- readable AND writable by anyone holding the anon key (i.e. anyone
-- who can view the site source). Only use for personal/demo apps.
-- For multi-user data, add Supabase Auth and scope by auth.uid().

alter table items enable row level security;
alter table maintenance_records enable row level security;

-- items
drop policy if exists "items_select_all" on items;
create policy "items_select_all"
  on items for select
  to anon, authenticated
  using (true);

drop policy if exists "items_insert_all" on items;
create policy "items_insert_all"
  on items for insert
  to anon, authenticated
  with check (true);

drop policy if exists "items_update_all" on items;
create policy "items_update_all"
  on items for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "items_delete_all" on items;
create policy "items_delete_all"
  on items for delete
  to anon, authenticated
  using (true);

-- maintenance_records
drop policy if exists "mr_select_all" on maintenance_records;
create policy "mr_select_all"
  on maintenance_records for select
  to anon, authenticated
  using (true);

drop policy if exists "mr_insert_all" on maintenance_records;
create policy "mr_insert_all"
  on maintenance_records for insert
  to anon, authenticated
  with check (true);

drop policy if exists "mr_update_all" on maintenance_records;
create policy "mr_update_all"
  on maintenance_records for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "mr_delete_all" on maintenance_records;
create policy "mr_delete_all"
  on maintenance_records for delete
  to anon, authenticated
  using (true);
