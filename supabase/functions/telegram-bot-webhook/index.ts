import { withSupabase } from "jsr:@supabase/server@^1";

async function telegramRequest(botToken: string, method: string, body: unknown) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

export default {
  fetch: withSupabase({ auth: "none" }, async (request, context) => {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const webhookSecret = Deno.env.get("TELEGRAM_WEBHOOK_SECRET");
    const cronSecret = Deno.env.get("MEDICINE_CRON_SECRET");
    if (!botToken || !webhookSecret) return new Response("Not configured", { status: 500 });

    const requestUrl = new URL(request.url);
    if (requestUrl.searchParams.get("setup") === "1") {
      if (!cronSecret || request.headers.get("Authorization") !== `Bearer ${cronSecret}`) {
        return new Response("Unauthorized", { status: 401 });
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      if (!supabaseUrl) return new Response("Not configured", { status: 500 });
      const webhookUrl = `${supabaseUrl}/functions/v1/telegram-bot-webhook`;
      const result = await telegramRequest(botToken, "setWebhook", {
        url: webhookUrl,
        secret_token: webhookSecret,
        allowed_updates: ["callback_query"],
        drop_pending_updates: false,
      });
      return Response.json(result);
    }

    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== webhookSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json().catch(() => ({}));
    const callback = update.callback_query;
    if (!callback?.id || !callback?.from?.id || typeof callback.data !== "string") {
      return new Response("OK");
    }

    const match = /^med:(t|s):([0-9a-f-]{36}):(\d{4}-\d{2}-\d{2})$/.exec(callback.data);
    if (!match) {
      await telegramRequest(botToken, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "Дія вже недоступна",
      });
      return new Response("OK");
    }

    const [, action, reminderId, scheduledDate] = match;
    const status = action === "t" ? "taken" : "skipped";
    const supabase = context.supabaseAdmin;
    const { data: user, error: userError } = await supabase
      .from("owljoy_users")
      .select("id")
      .eq("telegram_user_id", callback.from.id)
      .maybeSingle();
    if (userError) throw userError;
    if (!user) {
      await telegramRequest(botToken, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "Відкрийте OwlJoy і спробуйте ще раз",
        show_alert: true,
      });
      return new Response("OK");
    }

    const { data: reminder, error: reminderError } = await supabase
      .from("medicine_reminders")
      .select("id, child_id, reminder_time")
      .eq("id", reminderId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (reminderError) throw reminderError;
    if (!reminder) {
      await telegramRequest(botToken, "answerCallbackQuery", {
        callback_query_id: callback.id,
        text: "Нагадування не знайдено",
      });
      return new Response("OK");
    }

    const { error: intakeError } = await supabase.from("medicine_intakes").upsert({
      reminder_id: reminder.id,
      user_id: user.id,
      child_id: reminder.child_id,
      scheduled_date: scheduledDate,
      scheduled_time: reminder.reminder_time,
      status,
      recorded_at: new Date().toISOString(),
    }, { onConflict: "reminder_id,scheduled_date" });
    if (intakeError) throw intakeError;

    const statusText = status === "taken" ? "✅ Позначено: дано" : "➖ Позначено: пропущено";
    await telegramRequest(botToken, "answerCallbackQuery", {
      callback_query_id: callback.id,
      text: status === "taken" ? "Записано: ліки дано" : "Записано як пропущено",
    });

    if (callback.message?.chat?.id && callback.message?.message_id) {
      const originalText = String(callback.message.text || "").replace(/\n\n(?:✅|➖) Позначено:.*$/, "");
      await telegramRequest(botToken, "editMessageText", {
        chat_id: callback.message.chat.id,
        message_id: callback.message.message_id,
        text: `${originalText}\n\n${statusText}`,
        reply_markup: {
          inline_keyboard: [[{ text: "Відкрити OwlJoy", url: "https://t.me/OwlJoy_bot/OwlJoy?startapp=medicine" }]],
        },
      });
    }

    return new Response("OK");
  }),
};
