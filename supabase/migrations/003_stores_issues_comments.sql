-- Demo-mode schema: stores -> items -> issues -> comments
-- Wide-open RLS suitable for demo only.

-- 1) Stores
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  created_at timestamptz default now()
);

-- 2) Items: link to stores (nullable to avoid breaking existing rows)
alter table items
  add column if not exists store_id uuid references stores(id) on delete set null;

alter table items
  add column if not exists updated_at timestamptz default now();

-- 3) Issues
create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  item_id  uuid references items(id)  on delete set null,
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open','in_progress','resolved')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists issues_store_id_idx on issues(store_id);
create index if not exists issues_status_idx   on issues(status);

-- 4) Comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  -- demo mode: no auth, just a free-form display name
  author text not null default 'Guest',
  message text not null,
  created_at timestamptz default now()
);

create index if not exists comments_issue_id_idx on comments(issue_id);

-- 5) RLS (open for demo) ----------------------------------------------------
alter table stores   enable row level security;
alter table issues   enable row level security;
alter table comments enable row level security;

-- stores
drop policy if exists "stores_all" on stores;
create policy "stores_all" on stores
  for all to anon, authenticated using (true) with check (true);

-- issues
drop policy if exists "issues_all" on issues;
create policy "issues_all" on issues
  for all to anon, authenticated using (true) with check (true);

-- comments
drop policy if exists "comments_all" on comments;
create policy "comments_all" on comments
  for all to anon, authenticated using (true) with check (true);

-- 6) Realtime: add comments + issues to the supabase_realtime publication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'comments'
  ) then
    execute 'alter publication supabase_realtime add table public.comments';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'issues'
  ) then
    execute 'alter publication supabase_realtime add table public.issues';
  end if;
end $$;
