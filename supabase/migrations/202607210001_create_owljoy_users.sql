create extension if not exists pgcrypto;

create table if not exists public.owljoy_users (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint not null unique,
  username text,
  first_name text not null,
  last_name text,
  language_code text,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.owljoy_users(id) on delete cascade,
  nickname text,
  age_months smallint check (age_months between 0 and 216),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.owljoy_users(id) on delete cascade,
  selected_age_group text check (selected_age_group in ('6-12', '12-18', '18-24', '24-36')),
  notifications_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.medicine_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.owljoy_users(id) on delete cascade,
  child_id uuid,
  title text not null check (char_length(title) between 1 and 120),
  note text check (char_length(note) <= 500),
  reminder_time time not null,
  timezone text not null default 'Europe/Kyiv',
  days_of_week smallint[] not null default array[1,2,3,4,5,6,7]::smallint[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (child_id, user_id) references public.child_profiles(id, user_id) on delete cascade
);

create table if not exists public.user_favorites (
  user_id uuid not null references public.owljoy_users(id) on delete cascade,
  content_type text not null check (content_type in ('poem', 'story', 'sound', 'game')),
  content_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, content_type, content_id)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.owljoy_users(id) on delete cascade,
  product_code text not null,
  amount_stars integer not null check (amount_stars > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'refunded', 'failed')),
  telegram_payment_charge_id text unique,
  provider_payment_charge_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists child_profiles_user_id_idx on public.child_profiles(user_id);
create index if not exists medicine_reminders_user_id_idx on public.medicine_reminders(user_id);
create index if not exists purchases_user_id_idx on public.purchases(user_id);

alter table public.owljoy_users enable row level security;
alter table public.child_profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.medicine_reminders enable row level security;
alter table public.user_favorites enable row level security;
alter table public.purchases enable row level security;

-- Політики навмисно не створюємо: браузер не має прямого доступу до таблиць.
-- Усі операції проходять через Edge Function після перевірки підпису Telegram.
