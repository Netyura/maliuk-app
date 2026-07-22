create table if not exists public.care_quick_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.owljoy_users(id) on delete cascade,
  child_id uuid not null,
  event_type text not null check (event_type in ('sleep', 'feeding', 'diaper', 'medicine', 'temperature')),
  event_action text not null check (char_length(event_action) between 1 and 80),
  value numeric(8, 2),
  unit text check (unit is null or char_length(unit) <= 20),
  note text check (note is null or char_length(note) <= 300),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (child_id, user_id) references public.child_profiles(id, user_id) on delete cascade
);

create index if not exists care_quick_logs_user_child_time_idx
  on public.care_quick_logs (user_id, child_id, occurred_at desc);

alter table public.care_quick_logs enable row level security;
revoke all on public.care_quick_logs from anon, authenticated;
grant select, insert, update, delete on public.care_quick_logs to service_role;

comment on table public.care_quick_logs is
  'Швидкі записи про сон, годування, підгузки, ліки та температуру дитини.';
