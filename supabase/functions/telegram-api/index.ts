import { withSupabase } from "jsr:@supabase/server@^1";

const encoder = new TextEncoder();
const MAX_AUTH_AGE_SECONDS = 60 * 60;

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
  params.delete("signature");

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

export default {
  fetch: withSupabase({ auth: "none" }, async (request, context) => {
    const headers = corsHeaders(request.headers.get("Origin"));
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers });
    if (request.method !== "POST")
      return json({ error: "Метод не підтримується" }, 405, headers);

    try {
      const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
      if (!botToken) throw new Error("SERVER_NOT_CONFIGURED");

      const authorization = request.headers.get("Authorization") || "";
      if (!authorization.startsWith("tma "))
        return json({ error: "Потрібен вхід через Telegram" }, 401, headers);

      const telegramUser = await validateTelegramInitData(
        authorization.slice(4),
        botToken,
      );
      const body = await request.json().catch(() => ({}));

      const supabase = context.supabaseAdmin;

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
        const [favoritesResult, childResult] = await Promise.all([
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
        ]);
        const { data: favorites, error: favoritesError } = favoritesResult;
        const { data: childProfiles, error: childError } = childResult;
        if (favoritesError) throw favoritesError;
        if (childError) throw childError;

        return json(
          {
            user,
            childProfile: (childProfiles || [])[0] || null,
            childProfiles: childProfiles || [],
            favoritePoemIds: favorites.map((favorite) => favorite.content_id),
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
  }),
};
