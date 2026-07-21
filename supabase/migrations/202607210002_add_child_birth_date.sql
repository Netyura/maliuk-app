alter table public.child_profiles
  add column if not exists birth_date date;

-- Для старих тестових профілів приблизно відновлюємо дату збереженого віку.
update public.child_profiles
set birth_date = (current_date - make_interval(months => age_months))::date
where birth_date is null and age_months is not null;

comment on column public.child_profiles.birth_date is
  'Дата народження для автоматичного розрахунку вікової групи дитини.';
