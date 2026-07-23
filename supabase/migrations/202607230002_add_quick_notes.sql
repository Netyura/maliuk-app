alter table public.care_quick_logs
  drop constraint if exists care_quick_logs_event_type_check;

alter table public.care_quick_logs
  add constraint care_quick_logs_event_type_check
  check (event_type in ('sleep', 'feeding', 'diaper', 'medicine', 'temperature', 'note'));

comment on table public.care_quick_logs is
  'Швидкі записи про сон, годування, підгузки, ліки, температуру та нотатки.';
