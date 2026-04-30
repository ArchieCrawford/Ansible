create table items (
  id uuid primary key default gen_random_uuid(),
  item_name text,
  purchase_date date,
  serial_number text,
  location text,
  created_at timestamp default now()
);

create table maintenance_records (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade,
  date date,
  description text,
  cost numeric,
  created_at timestamp default now()
);
