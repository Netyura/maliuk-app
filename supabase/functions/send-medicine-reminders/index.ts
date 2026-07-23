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

    const userIds = [...new Set((reminders || []).map((item) => item.user_id))];
    const childIds = [...new Set((reminders || []).map((item) => item.child_id).filter(Boolean))];
    const [{ data: users, error: userError }, { data: preferences, error: preferenceError }, { data: children, error: childError }] = await Promise.all([
      supabase.from("owljoy_users").select("id, telegram_user_id").in("id", userIds),
      supabase.from("user_preferences").select("user_id, notifications_enabled").in("user_id", userIds),
      childIds.length
        ? supabase.from("child_profiles").select("id, nickname").in("id", childIds)
        : Promise.resolve({ data: [], error: null }),
    ]);
    if (userError) throw userError;
    if (preferenceError) throw preferenceError;
    if (childError) throw childError;

    const userMap = new Map((users || []).map((item) => [item.id, item.telegram_user_id]));
    const preferenceMap = new Map((preferences || []).map((item) => [item.user_id, item.notifications_enabled]));
    const childMap = new Map((children || []).map((item) => [item.id, item.nickname]));
    const now = new Date();
    let sent = 0;

    for (const reminder of reminders || []) {
      if (!preferenceMap.get(reminder.user_id)) continue;
      const local = localSchedule(now, reminder.timezone || "Europe/Kyiv");
      const reminderTime = String(reminder.reminder_time).slice(0, 5);
      if (local.time !== reminderTime) continue;
      if (reminder.start_date && local.date < reminder.start_date) continue;
      if (reminder.end_date && local.date > reminder.end_date) continue;
      if (!(reminder.days_of_week || []).map(Number).includes(local.dayOfWeek)) continue;

      const { error: logError } = await supabase.from("medicine_notification_log").insert({
        reminder_id: reminder.id,
        user_id: reminder.user_id,
        scheduled_date: local.date,
      });
      if (logError?.code === "23505") continue;
      if (logError) throw logError;

      const chatId = userMap.get(reminder.user_id);
      if (!chatId) continue;
      const childName = childMap.get(reminder.child_id) || "Малюк";
      const dose = [reminder.dose_amount, reminder.dose_unit].filter(Boolean).join(" ");
      const mealRelation = reminder.meal_relation === "before"
        ? "до їди"
        : reminder.meal_relation === "with"
          ? "під час їди"
          : reminder.meal_relation === "after" ? "після їди" : "";
      const mealText = mealRelation ? ` · ${mealRelation}` : "";
      const note = reminder.note ? `\n${reminder.note}` : "";
      const text = `💊 Час дати ліки\n\n${childName} · ${reminder.title} · ${dose}${mealText}\nЗаплановано на ${reminderTime}${note}`;

      try {
        const message = await telegramRequest(botToken, "sendMessage", {
          chat_id: chatId,
          text,
          reply_markup: {
            inline_keyboard: [[
              { text: "✅ Дано", callback_data: `med:t:${reminder.id}:${local.date}` },
              { text: "Пропустити", callback_data: `med:s:${reminder.id}:${local.date}` },
            ], [{ text: "Відкрити OwlJoy", url: "https://t.me/OwlJoy_bot/OwlJoy?startapp=medicine" }]],
          },
        });
        await supabase.from("medicine_notification_log")
          .update({ telegram_message_id: message.message_id })
          .eq("reminder_id", reminder.id)
          .eq("scheduled_date", local.date);
        await supabase.from("medicine_reminders")
          .update({ last_sent_at: now.toISOString() })
          .eq("id", reminder.id);
        sent += 1;
      } catch (error) {
        await supabase.from("medicine_notification_log")
          .delete()
          .eq("reminder_id", reminder.id)
          .eq("scheduled_date", local.date);
        console.error("medicine reminder", reminder.id, error);
      }
    }

    return json({ ok: true, checked: reminders?.length || 0, sent });
  }),
};
