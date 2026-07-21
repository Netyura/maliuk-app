(function initOwlJoyAccount() {
  const telegramApp = window.Telegram?.WebApp;
  const apiUrl = window.OWLJOY_CONFIG?.apiUrl?.trim();

  const account = {
    currentUser: null,
    favoritePoemIds: [],
    status: "loading",
    error: null,
    ready: null,
    request: null
  };

  async function request(action, data = {}) {
    if (!telegramApp?.initData || !apiUrl) return null;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `tma ${telegramApp.initData}`
      },
      body: JSON.stringify({ action, ...data })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Помилка зв’язку з OwlJoy");
    return payload;
  }

  async function bootstrap() {
    if (!telegramApp?.initData) {
      account.status = "preview";
      return account;
    }

    if (!apiUrl) {
      account.status = "not-configured";
      return account;
    }

    try {
      const payload = await request("bootstrap");
      account.currentUser = payload.user;
      account.favoritePoemIds = payload.favoritePoemIds || [];
      account.status = "authenticated";
    } catch (error) {
      account.status = "error";
      account.error = error;
      console.error("OwlJoy: помилка входу через Telegram", error);
    }

    return account;
  }

  account.request = request;
  account.ready = bootstrap();
  window.owlJoyAccount = account;
})();
