alter table public.medicine_reminders
  add column if not exists schedule_group_id uuid,
  add column if not exists meal_relation text not null default 'none';

update public.medicine_reminders
set schedule_group_id = id
where schedule_group_id is null;

alter table public.medicine_reminders
  alter column schedule_group_id set not null,
  alter column schedule_group_id set default gen_random_uuid();

alter table public.medicine_reminders
  drop constraint if exists medicine_reminders_meal_relation_check;

alter table public.medicine_reminders
  add constraint medicine_reminders_meal_relation_check
  check (meal_relation in ('none', 'before', 'with', 'after'));

create index if not exists medicine_reminders_schedule_group_idx
  on public.medicine_reminders (user_id, schedule_group_id, reminder_time);

comment on column public.medicine_reminders.schedule_group_id is
  'Об’єднує кілька щоденних прийомів одного препарату.';
comment on column public.medicine_reminders.meal_relation is
  'Вказівка лікаря щодо їжі: none, before, with або after.';
