import { createClient } from "npm:@supabase/supabase-js@2";

const encoder = new TextEncoder();
const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

function corsHeaders(origin: string | null) {
  const configuredOrigins = (
    Deno.env.get("ALLOWED_ORIGINS") || "https://netyura.github.io"
  )
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const allowedOrigin =
    origin && configuredOrigins.includes(origin)
      ? origin
      : configuredOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
  });
}

function toHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function hmacSha256(key: BufferSource, value: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value));
}

async function validateTelegramInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash") || "";
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = await hmacSha256(encoder.encode("WebAppData"), botToken);
  const calculatedHash = toHex(await hmacSha256(secretKey, dataCheckString));
  if (!receivedHash || !constantTimeEqual(receivedHash, calculatedHash)) {
    throw new Error("INVALID_TELEGRAM_SIGNATURE");
  }

  const authDate = Number(params.get("auth_date"));
  const now = Math.floor(Date.now() / 1000);
  if (
    !Number.isFinite(authDate) ||
    authDate > now + 30 ||
    now - authDate > MAX_AUTH_AGE_SECONDS
  ) {
    throw new Error("EXPIRED_TELEGRAM_AUTH");
  }

  const rawUser = params.get("user");
  if (!rawUser) throw new Error("TELEGRAM_USER_MISSING");

  const user = JSON.parse(rawUser);
  if (!Number.isSafeInteger(user.id) || typeof user.first_name !== "string") {
    throw new Error("INVALID_TELEGRAM_USER");
  }

  return user as {
    id: number;
    username?: string;
    first_name: string;
    last_name?: string;
    language_code?: string;
    is_premium?: boolean;
  };
}

function childAgeInMonths(birthDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return null;
  const birth = new Date(`${birthDate}T12:00:00Z`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let months =
    (today.getUTCFullYear() - birth.getUTCFullYear()) * 12 +
    today.getUTCMonth() -
    birth.getUTCMonth();
  if (today.getUTCDate() < birth.getUTCDate()) months -= 1;
  return months;
}

// Використовуємо стабільний клієнт напряму: функція не залежить від
// експериментальної обгортки середовища виконання Supabase.
Deno.serve(async (request) => {
    const headers = corsHeaders(request.headers.get("Origin"));
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers });
    if (request.method !== "POST")
      return json({ error: "Метод не підтримується" }, 405, headers);

    try {
      const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (!botToken || !supabaseUrl || !serviceRoleKey) throw new Error("SERVER_NOT_CONFIGURED");

      const authorization = request.headers.get("Authorization") || "";
      if (!authorization.startsWith("tma "))
        return json({ error: "Потрібен вхід через Telegram" }, 401, headers);

      const telegramUser = await validateTelegramInitData(
        authorization.slice(4),
        botToken,
      );
      const body = await request.json().catch(() => ({}));

      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data: user, error } = await supabase
        .from("owljoy_users")
        .upsert(
          {
            telegram_user_id: telegramUser.id,
            username: telegramUser.username || null,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name || null,
            language_code: telegramUser.language_code || null,
            is_premium: Boolean(telegramUser.is_premium),
            last_seen_at: new Date().toISOString(),
          },
          { onConflict: "telegram_user_id" },
        )
        .select("id, first_name, language_code, created_at, last_seen_at")
        .single();

      if (error) throw error;

      if (body.action === "bootstrap") {
        const [favoritesResult, childResult, medicineResult, intakeResult, preferencesResult, quickLogsResult] = await Promise.all([
          supabase
            .from("user_favorites")
            .select("content_id")
            .eq("user_id", user.id)
            .eq("content_type", "poem"),
          supabase
            .from("child_profiles")
            .select(
              "id, nickname, birth_date, age_months, created_at, updated_at",
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: true }),
          supabase
            .from("medicine_reminders")
            .select("id, child_id, title, note, dose_amount, dose_unit, reminder_time, timezone, days_of_week, start_date, end_date, is_active, created_at, updated_at")
            .eq("user_id", user.id)
            .order("reminder_time", { ascending: true }),
          supabase
            .from("medicine_intakes")
            .select("id, reminder_id, child_id, scheduled_date, scheduled_time, status, recorded_at")
            .eq("user_id", user.id)
            .order("scheduled_date", { ascending: false })
            .limit(120),
          supabase
            .from("user_preferences")
            .select("home_shortcuts")
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("care_quick_logs")
            .select("id, child_id, event_type, event_action, value, unit, note, occurred_at, created_at")
            .eq("user_id", user.id)
            .order("occurred_at", { ascending: false })
            .limit(200),
        ]);
        const { data: favorites, error: favoritesError } = favoritesResult;
        const { data: childProfiles, error: childError } = childResult;
        const { data: medicineReminders, error: medicineError } = medicineResult;
        const { data: medicineIntakes, error: intakeError } = intakeResult;
        const { data: preferences, error: preferencesError } = preferencesResult;
        const { data: careQuickLogs, error: quickLogsError } = quickLogsResult;
        if (favoritesError) throw favoritesError;
        if (childError) throw childError;
        if (medicineError) throw medicineError;
        if (intakeError) throw intakeError;
        if (preferencesError) throw preferencesError;
        if (quickLogsError) throw quickLogsError;

        return json(
          {
            user,
            childProfile: (childProfiles || [])[0] || null,
            childProfiles: childProfiles || [],
            favoritePoemIds: favorites.map((favorite) => favorite.content_id),
            medicineReminders: medicineReminders || [],
            medicineIntakes: medicineIntakes || [],
            careQuickLogs: careQuickLogs || [],
            homeShortcutIds: preferences?.home_shortcuts || null,
          },
          200,
          headers,
        );
      }

      if (body.action === "child.save") {
        const nickname =
          typeof body.nickname === "string" ? body.nickname.trim() : "";
        const birthDate =
          typeof body.birthDate === "string" ? body.birthDate : "";
        const ageMonths = childAgeInMonths(birthDate);
        if (
          !nickname ||
          nickname.length > 40 ||
          ageMonths === null ||
          ageMonths < 0 ||
          ageMonths > 216
        ) {
          return json(
            { error: "Перевірте ім’я та дату народження" },
            400,
            headers,
          );
        }

        const profileValues = {
          nickname,
          birth_date: birthDate,
          age_months: ageMonths,
          updated_at: new Date().toISOString(),
        };
        const childId = typeof body.childId === "string" ? body.childId : null;
        if (!childId) {
          const { count, error: countError } = await supabase
            .from("child_profiles")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);
          if (countError) throw countError;
          if ((count || 0) >= 6) {
            return json({ error: "Можна додати не більше 6 дітей" }, 400, headers);
          }
        }

        const profileQuery = childId
          ? supabase
              .from("child_profiles")
              .update(profileValues)
              .eq("id", childId)
              .eq("user_id", user.id)
          : supabase
              .from("child_profiles")
              .insert({ user_id: user.id, ...profileValues });
        const { data: childProfile, error: profileError } = await profileQuery
          .select(
            "id, nickname, birth_date, age_months, created_at, updated_at",
          )
          .single();
        if (profileError) throw profileError;

        return json({ childProfile }, 200, headers);
      }

      if (body.action === "child.delete") {
        const childId = typeof body.childId === "string" ? body.childId : "";
        if (!childId) return json({ error: "Не вказано профіль дитини" }, 400, headers);

        const { count, error: countError } = await supabase
          .from("child_profiles")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (countError) throw countError;
        if ((count || 0) <= 1) {
          return json({ error: "Потрібно залишити хоча б один профіль дитини" }, 400, headers);
        }

        const { data: deletedProfile, error: deleteError } = await supabase
          .from("child_profiles")
          .delete()
          .eq("id", childId)
          .eq("user_id", user.id)
          .select("id")
          .maybeSingle();
        if (deleteError) throw deleteError;
        if (!deletedProfile) return json({ error: "Профіль не знайдено" }, 404, headers);

        return json({ ok: true, deletedChildId: childId }, 200, headers);
      }

      if (body.action === "quicklog.save") {
        const childId = typeof body.childId === "string" ? body.childId : "";
        const eventType = typeof body.eventType === "string" ? body.eventType : "";
        const eventAction = typeof body.eventAction === "string" ? body.eventAction.trim() : "";
        const note = typeof body.note === "string" ? body.note.trim() : "";
        const unit = typeof body.unit === "string" ? body.unit.trim() : "";
        const occurredAt = typeof body.occurredAt === "string" ? new Date(body.occurredAt) : new Date();
        const numericValue = body.value === "" || body.value === null || body.value === undefined
          ? null
          : Number(body.value);
        const allowedTypes = ["sleep", "feeding", "diaper", "medicine", "temperature", "note", "head-position"];

        if (
          !childId || !allowedTypes.includes(eventType) || !eventAction || eventAction.length > 80 ||
          note.length > 300 || unit.length > 20 || Number.isNaN(occurredAt.getTime()) ||
          occurredAt.getTime() > Date.now() + 5 * 60 * 1000 ||
          (numericValue !== null && (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 10000))
        ) {
          return json({ error: "Перевірте дані швидкого запису" }, 400, headers);
        }

        const { data: ownedChild, error: childLookupError } = await supabase
          .from("child_profiles")
          .select("id")
          .eq("id", childId)
          .eq("user_id", user.id)
          .maybeSingle();
        if (childLookupError) throw childLookupError;
        if (!ownedChild) return json({ error: "Профіль дитини не знайдено" }, 404, headers);

        const { data: careQuickLog, error: quickLogError } = await supabase
          .from("care_quick_logs")
          .insert({
            user_id: user.id,
            child_id: childId,
            event_type: eventType,
            event_action: eventAction,
            value: numericValue,
            unit: unit || null,
            note: note || null,
            occurred_at: occurredAt.toISOString(),
          })
          .select("id, child_id, event_type, event_action, value, unit, note, occurred_at, created_at")
          .single();
        if (quickLogError) throw quickLogError;
        return json({ careQuickLog }, 200, headers);
      }

      if (body.action === "quicklog.delete") {
        const quickLogId = typeof body.quickLogId === "string" ? body.quickLogId : "";
        if (!quickLogId) return json({ error: "Запис не вказано" }, 400, headers);
        const { data: deletedQuickLog, error: deleteError } = await supabase
          .from("care_quick_logs")
          .delete()
          .eq("id", quickLogId)
          .eq("user_id", user.id)
          .select("id")
          .maybeSingle();
        if (deleteError) throw deleteError;
        if (!deletedQuickLog) return json({ error: "Запис не знайдено" }, 404, headers);
        return json({ ok: true }, 200, headers);
      }

      if (body.action === "medicine.save") {
        const reminderId = typeof body.reminderId === "string" ? body.reminderId : null;
        const childId = typeof body.childId === "string" ? body.childId : "";
        const title = typeof body.title === "string" ? body.title.trim() : "";
        const doseAmount = typeof body.doseAmount === "string" ? body.doseAmount.trim() : "";
        const doseUnit = typeof body.doseUnit === "string" ? body.doseUnit.trim() : "";
        const reminderTime = typeof body.reminderTime === "string" ? body.reminderTime : "";
        const note = typeof body.note === "string" ? body.note.trim() : "";
        const startDate = typeof body.startDate === "string" ? body.startDate : "";
        const endDate = typeof body.endDate === "string" && body.endDate ? body.endDate : null;
        const timezone = typeof body.timezone === "string" ? body.timezone : "Europe/Kyiv";
        const allowedUnits = ["краплі", "мл", "таблетка", "мірна ложка", "доза"];
        const daysOfWeek = Array.isArray(body.daysOfWeek)
          ? [...new Set(body.daysOfWeek.map(Number))].filter((day) => Number.isInteger(day) && day >= 1 && day <= 7).sort()
          : [];
        let timezoneValid = true;
        try {
          new Intl.DateTimeFormat("uk-UA", { timeZone: timezone }).format();
        } catch {
          timezoneValid = false;
        }

        if (
          !childId || !title || title.length > 120 || !doseAmount || doseAmount.length > 20 ||
          !allowedUnits.includes(doseUnit) || !/^\d{2}:\d{2}$/.test(reminderTime) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
          (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) ||
          (endDate && endDate < startDate) || !daysOfWeek.length || !timezoneValid || note.length > 500
        ) {
          return json({ error: "Перевірте дані нагадування" }, 400, headers);
        }

        const { data: ownedChild, error: childLookupError } = await supabase
          .from("child_profiles")
          .select("id")
          .eq("id", childId)
          .eq("user_id", user.id)
          .maybeSingle();
        if (childLookupError) throw childLookupError;
        if (!ownedChild) return json({ error: "Профіль дитини не знайдено" }, 404, headers);

        const reminderValues = {
          user_id: user.id,
          child_id: childId,
          title,
          dose_amount: doseAmount,
          dose_unit: doseUnit,
          note: note || null,
          reminder_time: reminderTime,
          timezone,
          days_of_week: daysOfWeek,
          start_date: startDate,
          end_date: endDate,
          is_active: true,
          updated_at: new Date().toISOString(),
        };
        const reminderQuery = reminderId
          ? supabase.from("medicine_reminders").update(reminderValues).eq("id", reminderId).eq("user_id", user.id)
          : supabase.from("medicine_reminders").insert(reminderValues);
        const { data: medicineReminder, error: reminderError } = await reminderQuery
          .select("id, child_id, title, note, dose_amount, dose_unit, reminder_time, timezone, days_of_week, start_date, end_date, is_active, created_at, updated_at")
          .single();
        if (reminderError) throw reminderError;

        // Створення нагадування є явною згодою користувача отримувати його в Telegram.
        const { error: preferenceError } = await supabase
          .from("user_preferences")
          .upsert({
            user_id: user.id,
            notifications_enabled: true,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        if (preferenceError) throw preferenceError;

        return json({ medicineReminder }, 200, headers);
      }

      if (body.action === "medicine.delete") {
        const reminderId = typeof body.reminderId === "string" ? body.reminderId : "";
        if (!reminderId) return json({ error: "Нагадування не вказано" }, 400, headers);
        const { data: deletedReminder, error: reminderDeleteError } = await supabase
          .from("medicine_reminders")
          .delete()
          .eq("id", reminderId)
          .eq("user_id", user.id)
          .select("id")
          .maybeSingle();
        if (reminderDeleteError) throw reminderDeleteError;
        if (!deletedReminder) return json({ error: "Нагадування не знайдено" }, 404, headers);
        return json({ ok: true }, 200, headers);
      }

      if (body.action === "medicine.intake") {
        const reminderId = typeof body.reminderId === "string" ? body.reminderId : "";
        const scheduledDate = typeof body.scheduledDate === "string" ? body.scheduledDate : "";
        const scheduledTime = typeof body.scheduledTime === "string" ? body.scheduledTime : "";
        const status = body.status === "taken" || body.status === "skipped" ? body.status : "";
        if (!reminderId || !/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate) || !/^\d{2}:\d{2}$/.test(scheduledTime) || !status) {
          return json({ error: "Некоректна позначка прийому" }, 400, headers);
        }

        const { data: reminder, error: reminderLookupError } = await supabase
          .from("medicine_reminders")
          .select("id, child_id")
          .eq("id", reminderId)
          .eq("user_id", user.id)
          .maybeSingle();
        if (reminderLookupError) throw reminderLookupError;
        if (!reminder) return json({ error: "Нагадування не знайдено" }, 404, headers);

        const { data: medicineIntake, error: intakeSaveError } = await supabase
          .from("medicine_intakes")
          .upsert({
            reminder_id: reminderId,
            user_id: user.id,
            child_id: reminder.child_id,
            scheduled_date: scheduledDate,
            scheduled_time: scheduledTime,
            status,
            recorded_at: new Date().toISOString(),
          }, { onConflict: "reminder_id,scheduled_date" })
          .select("id, reminder_id, child_id, scheduled_date, scheduled_time, status, recorded_at")
          .single();
        if (intakeSaveError) throw intakeSaveError;
        return json({ medicineIntake }, 200, headers);
      }

      if (body.action === "medicine.notifications") {
        if (typeof body.enabled !== "boolean") return json({ error: "Некоректне налаштування" }, 400, headers);
        const { error: preferenceError } = await supabase
          .from("user_preferences")
          .upsert({
            user_id: user.id,
            notifications_enabled: body.enabled,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        if (preferenceError) throw preferenceError;
        return json({ ok: true }, 200, headers);
      }

      if (body.action === "home.shortcuts") {
        const allowedShortcuts = new Set([
          "game:animals", "game:objects", "game:colors", "game:families", "game:emotions",
          "game:dress-up", "game:bubbles", "game:my-face", "game:my-body",
          "games", "stories", "poems", "sleep", "quick-log", "medicine", "food",
        ]);
        const shortcutIds = Array.isArray(body.shortcutIds)
          ? [...new Set(body.shortcutIds)].filter((id) =>
            typeof id === "string" && (
              allowedShortcuts.has(id) ||
              /^story:[a-z0-9-]{1,120}$/.test(id) ||
              /^poem:[a-z0-9-]{1,120}$/.test(id) ||
              /^sleep:[a-z0-9-]{1,120}$/.test(id) ||
              /^quicklog:(sleep|feeding|diaper|medicine|temperature|note|head-position)$/.test(id)
            )
          ).slice(0, 12)
          : null;
        if (!shortcutIds) return json({ error: "Некоректні ярлики головної" }, 400, headers);
        const { error: shortcutsError } = await supabase
          .from("user_preferences")
          .upsert({
            user_id: user.id,
            home_shortcuts: shortcutIds,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        if (shortcutsError) throw shortcutsError;
        return json({ ok: true, homeShortcutIds: shortcutIds }, 200, headers);
      }

      if (body.action === "favorite.set") {
        const contentTypes = ["poem", "story", "sound", "game"];
        if (
          !contentTypes.includes(body.contentType) ||
          typeof body.contentId !== "string" ||
          body.contentId.length < 1 ||
          body.contentId.length > 120 ||
          typeof body.active !== "boolean"
        ) {
          return json({ error: "Некоректні дані обраного" }, 400, headers);
        }

        if (body.active) {
          const { error: favoriteError } = await supabase
            .from("user_favorites")
            .upsert({
              user_id: user.id,
              content_type: body.contentType,
              content_id: body.contentId,
            });
          if (favoriteError) throw favoriteError;
        } else {
          const { error: favoriteError } = await supabase
            .from("user_favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("content_type", body.contentType)
            .eq("content_id", body.contentId);
          if (favoriteError) throw favoriteError;
        }

        return json({ ok: true }, 200, headers);
      }

      return json({ error: "Невідома дія" }, 400, headers);
    } catch (error) {
      const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";
      const unauthorized = [
        "INVALID_TELEGRAM_SIGNATURE",
        "EXPIRED_TELEGRAM_AUTH",
        "TELEGRAM_USER_MISSING",
        "INVALID_TELEGRAM_USER",
      ].includes(code);
      console.error("telegram-api", code);
      return json(
        {
          error: unauthorized
            ? "Не вдалося підтвердити вхід через Telegram"
            : "Сервер тимчасово недоступний",
        },
        unauthorized ? 401 : 500,
        headers,
      );
    }
});
