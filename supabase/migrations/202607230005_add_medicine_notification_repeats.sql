alter table public.medicine_notification_log
  add column if not exists notification_offset_minutes smallint not null default 0;

alter table public.medicine_notification_log
  drop constraint if exists medicine_notification_log_reminder_id_scheduled_date_key;

alter table public.medicine_notification_log
  drop constraint if exists medicine_notification_log_offset_check;

alter table public.medicine_notification_log
  drop constraint if exists medicine_notification_log_reminder_date_offset_key;

alter table public.medicine_notification_log
  add constraint medicine_notification_log_offset_check
  check (notification_offset_minutes in (0, 5, 15));

alter table public.medicine_notification_log
  add constraint medicine_notification_log_reminder_date_offset_key
  unique (reminder_id, scheduled_date, notification_offset_minutes);

comment on column public.medicine_notification_log.notification_offset_minutes is
  'Етап Telegram-нагадування: у запланований час, через 5 або через 15 хвилин.';
