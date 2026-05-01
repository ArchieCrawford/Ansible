-- Adds a free-form notes / comments field to items and maintenance_records.
alter table items
  add column if not exists notes text;

alter table maintenance_records
  add column if not exists notes text;
