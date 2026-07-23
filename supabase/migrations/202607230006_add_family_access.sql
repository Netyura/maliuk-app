create table if not exists public.child_family_members (
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  user_id uuid not null references public.owljoy_users(id) on delete cascade,
  role text not null check (role in ('parent', 'grandmother', 'grandfather')),
  added_by_user_id uuid not null references public.owljoy_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (child_id, user_id)
);

create table if not exists public.child_family_invitations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  invited_by_user_id uuid not null references public.owljoy_users(id) on delete cascade,
  role text not null check (role in ('parent', 'grandmother', 'grandfather')),
  code_hash text not null unique check (char_length(code_hash) = 64),
  expires_at timestamptz not null,
  accepted_by_user_id uuid references public.owljoy_users(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    (accepted_at is null and accepted_by_user_id is null)
    or (accepted_at is not null and accepted_by_user_id is not null)
  )
);

create index if not exists child_family_members_user_idx
  on public.child_family_members (user_id, child_id);
create index if not exists child_family_invitations_child_idx
  on public.child_family_invitations (child_id, expires_at desc);

alter table public.child_family_members enable row level security;
alter table public.child_family_invitations enable row level security;

revoke all on public.child_family_members from anon, authenticated;
revoke all on public.child_family_invitations from anon, authenticated;
grant select, insert, update, delete on public.child_family_members to service_role;
grant select, insert, update, delete on public.child_family_invitations to service_role;

-- Записи належать профілю дитини, а user_id зберігає автора запису або розкладу.
-- Це дає змогу членам родини бачити спільну історію та позначати прийоми.
alter table public.medicine_reminders
  drop constraint if exists medicine_reminders_child_id_user_id_fkey;
alter table public.medicine_reminders
  drop constraint if exists medicine_reminders_child_id_fkey;
alter table public.medicine_reminders
  add constraint medicine_reminders_child_id_fkey
  foreign key (child_id) references public.child_profiles(id) on delete cascade;

alter table public.care_quick_logs
  drop constraint if exists care_quick_logs_child_id_user_id_fkey;
alter table public.care_quick_logs
  drop constraint if exists care_quick_logs_child_id_fkey;
alter table public.care_quick_logs
  add constraint care_quick_logs_child_id_fkey
  foreign key (child_id) references public.child_profiles(id) on delete cascade;

create index if not exists medicine_reminders_child_id_idx
  on public.medicine_reminders (child_id, reminder_time);
create index if not exists medicine_intakes_child_date_idx
  on public.medicine_intakes (child_id, scheduled_date desc);
create index if not exists care_quick_logs_child_time_idx
  on public.care_quick_logs (child_id, occurred_at desc);

comment on table public.child_family_members is
  'Дорослі, які мають спільний доступ до профілю дитини та історії турботи.';
comment on table public.child_family_invitations is
  'Одноразові семиденні запрошення до профілю дитини; відкритий код у базі не зберігається.';
