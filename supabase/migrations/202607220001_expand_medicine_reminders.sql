alter table public.medicine_reminders
  add column if not exists dose_amount text not null default '',
  add column if not exists dose_unit text not null default '',
  add column if not exists start_date date not null default current_date,
  add column if not exists end_date date,
  add column if not exists last_sent_at timestamptz;

alter table public.medicine_reminders
  drop constraint if exists medicine_reminders_date_range_check;

alter table public.medicine_reminders
  add constraint medicine_reminders_date_range_check
  check (end_date is null or end_date >= start_date);

create table if not exists public.medicine_intakes (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.medicine_reminders(id) on delete cascade,
  user_id uuid not null references public.owljoy_users(id) on delete cascade,
  child_id uuid references public.child_profiles(id) on delete cascade,
  scheduled_date date not null,
  scheduled_time time not null,
  status text not null check (status in ('taken', 'skipped')),
  recorded_at timestamptz not null default now(),
  unique (reminder_id, scheduled_date)
);

create table if not exists public.medicine_notification_log (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.medicine_reminders(id) on delete cascade,
  user_id uuid not null references public.owljoy_users(id) on delete cascade,
  scheduled_date date not null,
  telegram_message_id bigint,
  sent_at timestamptz not null default now(),
  unique (reminder_id, scheduled_date)
);

create index if not exists medicine_reminders_due_idx
  on public.medicine_reminders (is_active, reminder_time);
create index if not exists medicine_intakes_user_date_idx
  on public.medicine_intakes (user_id, scheduled_date desc);
create index if not exists medicine_notification_log_user_date_idx
  on public.medicine_notification_log (user_id, scheduled_date desc);

alter table public.medicine_intakes enable row level security;
alter table public.medicine_notification_log enable row level security;

revoke all on public.medicine_intakes from anon, authenticated;
revoke all on public.medicine_notification_log from anon, authenticated;
grant select, insert, update, delete on public.medicine_intakes to service_role;
grant select, insert, update, delete on public.medicine_notification_log to service_role;

comment on table public.medicine_intakes is
  'Фактичні позначки батьків: ліки дано або прийом пропущено.';
comment on table public.medicine_notification_log is
  'Захист від повторного надсилання одного Telegram-нагадування.';
