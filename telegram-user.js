(function initOwlJoyAccount() {
  const telegramApp = window.Telegram?.WebApp;
  const apiUrl = window.OWLJOY_CONFIG?.apiUrl?.trim();
  const previewChildKey = "owljoyChildProfile";

  const account = {
    currentUser: null,
    currentChild: null,
    favoritePoemIds: [],
    status: "loading",
    error: null,
    ready: null,
    request: null
  };

  function readPreviewChild() {
    try {
      return JSON.parse(localStorage.getItem(previewChildKey) || "null");
    } catch {
      return null;
    }
  }

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
      account.currentChild = readPreviewChild();
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
      account.currentChild = payload.childProfile || null;
      account.favoritePoemIds = payload.favoritePoemIds || [];
      account.status = "authenticated";
    } catch (error) {
      account.status = "error";
      account.error = error;
      console.error("OwlJoy: помилка входу через Telegram", error);
    }

    return account;
  }

  async function saveChildProfile({ nickname, birthDate }) {
    if (account.status === "authenticated") {
      const payload = await request("child.save", { nickname, birthDate });
      account.currentChild = payload.childProfile;
      return account.currentChild;
    }

    if (account.status === "error") {
      throw account.error || new Error("Не вдалося підключитися до OwlJoy");
    }

    const previewProfile = {
      id: "preview-child",
      nickname,
      birth_date: birthDate
    };
    localStorage.setItem(previewChildKey, JSON.stringify(previewProfile));
    account.currentChild = previewProfile;
    return previewProfile;
  }

  account.request = request;
  account.saveChildProfile = saveChildProfile;
  account.ready = bootstrap();
  window.owlJoyAccount = account;
})();
