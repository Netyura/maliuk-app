import { createClient } from "npm:@supabase/supabase-js@2";

const encoder = new TextEncoder();
const MAX_AUTH_AGE_SECONDS = 60 * 60;

function corsHeaders(origin: string | null) {
  const configuredOrigins = (Deno.env.get("ALLOWED_ORIGINS") || "https://netyura.github.io")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const allowedOrigin = origin && configuredOrigins.includes(origin) ? origin : configuredOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" }
  });
}

function toHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
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
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value));
}

async function validateTelegramInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash") || "";
  params.delete("hash");
  params.delete("signature");

  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = await hmacSha256(encoder.encode("WebAppData"), botToken);
  const calculatedHash = toHex(await hmacSha256(secretKey, dataCheckString));
  if (!receivedHash || !constantTimeEqual(receivedHash, calculatedHash)) {
    throw new Error("INVALID_TELEGRAM_SIGNATURE");
  }

  const authDate = Number(params.get("auth_date"));
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(authDate) || authDate > now + 30 || now - authDate > MAX_AUTH_AGE_SECONDS) {
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

Deno.serve(async (request) => {
  const headers = corsHeaders(request.headers.get("Origin"));
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return json({ error: "Метод не підтримується" }, 405, headers);

  try {
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!botToken || !supabaseUrl || !serviceRoleKey) throw new Error("SERVER_NOT_CONFIGURED");

    const authorization = request.headers.get("Authorization") || "";
    if (!authorization.startsWith("tma ")) return json({ error: "Потрібен вхід через Telegram" }, 401, headers);

    const telegramUser = await validateTelegramInitData(authorization.slice(4), botToken);
    const body = await request.json().catch(() => ({}));

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: user, error } = await supabase
      .from("owljoy_users")
      .upsert({
        telegram_user_id: telegramUser.id,
        username: telegramUser.username || null,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name || null,
        language_code: telegramUser.language_code || null,
        is_premium: Boolean(telegramUser.is_premium),
        last_seen_at: new Date().toISOString()
      }, { onConflict: "telegram_user_id" })
      .select("id, first_name, language_code, created_at, last_seen_at")
      .single();

    if (error) throw error;

    if (body.action === "bootstrap") {
      const { data: favorites, error: favoritesError } = await supabase
        .from("user_favorites")
        .select("content_id")
        .eq("user_id", user.id)
        .eq("content_type", "poem");
      if (favoritesError) throw favoritesError;

      return json({
        user,
        favoritePoemIds: favorites.map((favorite) => favorite.content_id)
      }, 200, headers);
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
        const { error: favoriteError } = await supabase.from("user_favorites").upsert({
          user_id: user.id,
          content_type: body.contentType,
          content_id: body.contentId
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
      "INVALID_TELEGRAM_USER"
    ].includes(code);
    console.error("telegram-api", code);
    return json(
      { error: unauthorized ? "Не вдалося підтвердити вхід через Telegram" : "Сервер тимчасово недоступний" },
      unauthorized ? 401 : 500,
      headers
    );
  }
});
