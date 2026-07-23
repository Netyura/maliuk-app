import { withSupabase } from "jsr:@supabase/server@^1";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function localSchedule(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value || "";
  const date = `${value("year")}-${value("month")}-${value("day")}`;
  const time = `${value("hour")}:${value("minute")}`;
  const dayDate = new Date(`${date}T12:00:00Z`);
  const dayOfWeek = dayDate.getUTCDay() === 0 ? 7 : dayDate.getUTCDay();
  return { date, time, dayOfWeek };
}

const reminderOffsets = [0, 5, 15];

function scheduledSlot(local: ReturnType<typeof localSchedule>, offsetMinutes: number) {
  const wallClock = new Date(`${local.date}T${local.time}:00Z`);
  wallClock.setUTCMinutes(wallClock.getUTCMinutes() - offsetMinutes);
  const date = wallClock.toISOString().slice(0, 10);
  const time = wallClock.toISOString().slice(11, 16);
  const dayOfWeek = wallClock.getUTCDay() === 0 ? 7 : wallClock.getUTCDay();
  return { date, time, dayOfWeek, offsetMinutes };
}

async function telegramRequest(botToken: string, method: string, body: unknown) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.description || "TELEGRAM_SEND_FAILED");
  return payload.result;
}

export default {
  fetch: withSupabase({ auth: "none" }, async (request, context) => {
    if (request.method !== "POST") return json({ error: "Метод не підтримується" }, 405);

    const cronSecret = Deno.env.get("MEDICINE_CRON_SECRET");
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!cronSecret || !botToken) return json({ error: "Функцію не налаштовано" }, 500);
    if (request.headers.get("Authorization") !== `Bearer ${cronSecret}`) {
      return json({ error: "Доступ заборонено" }, 401);
    }

    const supabase = context.supabaseAdmin;
    const { data: reminders, error: reminderError } = await supabase
      .from("medicine_reminders")
      .select("id, user_id, child_id, title, note, meal_relation, dose_amount, dose_unit, reminder_time, timezone, days_of_week, start_date, end_date")
      .eq("is_active", true);
    if (reminderError) throw reminderError;

    const childIds = [...new Set((reminders || []).map((item) => item.child_id).filter(Boolean))];
    const [{ data: children, error: childError }, { data: familyMembers, error: familyError }] = await Promise.all([
      childIds.length
        ? supabase.from("child_profiles").select("id, user_id, nickname").in("id", childIds)
        : Promise.resolve({ data: [], error: null }),
      childIds.length
        ? supabase
          .from("child_family_members")
          .select("child_id, user_id")
          .in("child_id", childIds)
        : Promise.resolve({ data: [], error: null }),
    ]);
    if (childError) throw childError;
    if (familyError) throw familyError;

    const recipientUserIds = [...new Set([
      ...(reminders || []).map((item) => item.user_id),
      ...(children || []).map((item) => item.user_id),
      ...(familyMembers || []).map((item) => item.user_id),
    ])];
    const { data: users, error: userError } = recipientUserIds.length
      ? await supabase.from("owljoy_users").select("id, telegram_user_id").in("id", recipientUserIds)
      : { data: [], error: null };
    if (userError) throw userError;

    const userMap = new Map((users || []).map((item) => [item.id, item.telegram_user_id]));
    const childMap = new Map((children || []).map((item) => [item.id, item.nickname]));
    const childOwnerMap = new Map((children || []).map((item) => [item.id, item.user_id]));
    const familyRecipientMap = new Map<string, string[]>();
    for (const member of familyMembers || []) {
      const recipients = familyRecipientMap.get(member.child_id) || [];
      recipients.push(member.user_id);
      familyRecipientMap.set(member.child_id, recipients);
    }
    const now = new Date();
    let sent = 0;

    for (const reminder of reminders || []) {
      const local = localSchedule(now, reminder.timezone || "Europe/Kyiv");
      const reminderTime = String(reminder.reminder_time).slice(0, 5);
      const slot = reminderOffsets
        .map((offsetMinutes) => scheduledSlot(local, offsetMinutes))
        .find((candidate) => candidate.time === reminderTime);
      if (!slot) continue;
      if (reminder.start_date && slot.date < reminder.start_date) continue;
      if (reminder.end_date && slot.date > reminder.end_date) continue;
      if (!(reminder.days_of_week || []).map(Number).includes(slot.dayOfWeek)) continue;

      const { data: intake, error: intakeError } = await supabase
        .from("medicine_intakes")
        .select("id")
        .eq("reminder_id", reminder.id)
        .eq("scheduled_date", slot.date)
        .maybeSingle();
      if (intakeError) throw intakeError;
      if (intake) continue;

      const childName = childMap.get(reminder.child_id) || "Малюк";
      const dose = [reminder.dose_amount, reminder.dose_unit].filter(Boolean).join(" ");
      const mealRelation = reminder.meal_relation === "before"
        ? "до їди"
        : reminder.meal_relation === "with"
          ? "під час їди"
          : reminder.meal_relation === "after" ? "після їди" : "";
      const mealText = mealRelation ? ` · ${mealRelation}` : "";
      const note = reminder.note ? `\n${reminder.note}` : "";
      const heading = slot.offsetMinutes === 0
        ? "💊 Час дати ліки"
        : `💊 Нагадування через ${slot.offsetMinutes} хв`;
      const repeatText = slot.offsetMinutes === 0
        ? ""
        : `\nПрийом ще не позначено. Якщо ліки вже дали — натисніть «Дано».`;
      const text = `${heading}\n\n${childName} · ${reminder.title} · ${dose}${mealText}\nЗаплановано на ${reminderTime}${repeatText}${note}`;

      const directRecipients = [reminder.user_id, childOwnerMap.get(reminder.child_id)]
        .filter((userId): userId is string => Boolean(userId));
      const familyRecipients = familyRecipientMap.get(reminder.child_id) || [];
      const reminderRecipients = [...new Set([...directRecipients, ...familyRecipients])];

      for (const recipientUserId of reminderRecipients) {
        const chatId = userMap.get(recipientUserId);
        if (!chatId) continue;
        const { data: notificationLog, error: logError } = await supabase
          .from("medicine_notification_log")
          .insert({
            reminder_id: reminder.id,
            user_id: recipientUserId,
            scheduled_date: slot.date,
            notification_offset_minutes: slot.offsetMinutes,
          })
          .select("id")
          .single();
        if (logError?.code === "23505") continue;
        if (logError) throw logError;

        try {
          const message = await telegramRequest(botToken, "sendMessage", {
            chat_id: chatId,
            text,
            reply_markup: {
              inline_keyboard: [[
                { text: "✅ Дано", callback_data: `med:t:${reminder.id}:${slot.date}` },
                { text: "Пропустити", callback_data: `med:s:${reminder.id}:${slot.date}` },
              ], [{ text: "Відкрити OwlJoy", url: "https://t.me/OwlJoy_bot/OwlJoy?startapp=medicine" }]],
            },
          });
          await supabase.from("medicine_notification_log")
            .update({ telegram_message_id: message.message_id })
            .eq("id", notificationLog.id);
          await supabase.from("medicine_reminders")
            .update({ last_sent_at: now.toISOString() })
            .eq("id", reminder.id);
          sent += 1;
        } catch (error) {
          await supabase.from("medicine_notification_log")
            .delete()
            .eq("id", notificationLog.id);
          console.error("medicine reminder", reminder.id, recipientUserId, error);
        }
      }
    }

    return json({ ok: true, checked: reminders?.length || 0, sent });
  }),
};
