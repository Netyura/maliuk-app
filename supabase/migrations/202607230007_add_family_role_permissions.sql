alter table public.child_family_members
  add column if not exists medicine_notifications_enabled boolean not null default true;

alter table public.child_family_members
  alter column medicine_notifications_enabled set default true;

update public.child_family_members
set medicine_notifications_enabled = true
where medicine_notifications_enabled = false;

alter table public.medicine_notification_log
  drop constraint if exists medicine_notification_log_reminder_date_offset_key;

alter table public.medicine_notification_log
  add constraint medicine_notification_log_reminder_date_offset_user_key
  unique (reminder_id, scheduled_date, notification_offset_minutes, user_id);

comment on column public.child_family_members.medicine_notifications_enabled is
  'Сімейні нагадування активні для кожного дорослого, підключеного до профілю дитини.';
