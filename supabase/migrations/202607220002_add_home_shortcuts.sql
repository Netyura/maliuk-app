alter table public.user_preferences
  add column if not exists home_shortcuts text[] not null default array[
    'game:animals',
    'stories',
    'sleep',
    'medicine'
  ]::text[];

comment on column public.user_preferences.home_shortcuts is
  'До 12 ярликів, які користувач закріпив на головному екрані OwlJoy.';
