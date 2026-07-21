(function initOwlJoyAccount() {
  const telegramApp = window.Telegram?.WebApp;
  const apiUrl = window.OWLJOY_CONFIG?.apiUrl?.trim();
  const previewChildKey = "owljoyChildProfile";
  const previewChildrenKey = "owljoyChildProfiles";

  const account = {
    currentUser: null,
    currentChild: null,
    childProfiles: [],
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

  function readPreviewChildren() {
    try {
      const profiles = JSON.parse(localStorage.getItem(previewChildrenKey) || "[]");
      if (Array.isArray(profiles) && profiles.length) return profiles;
    } catch {}
    const legacyProfile = readPreviewChild();
    return legacyProfile ? [legacyProfile] : [];
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
      account.childProfiles = readPreviewChildren();
      account.currentChild = account.childProfiles[0] || null;
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
      account.childProfiles = payload.childProfiles || (payload.childProfile ? [payload.childProfile] : []);
      account.currentChild = account.childProfiles[0] || null;
      account.favoritePoemIds = payload.favoritePoemIds || [];
      account.status = "authenticated";
    } catch (error) {
      account.status = "error";
      account.error = error;
      console.error("OwlJoy: помилка входу через Telegram", error);
    }

    return account;
  }

  async function saveChildProfile({ nickname, birthDate, childId = null }) {
    if (account.status === "authenticated") {
      const payload = await request("child.save", { nickname, birthDate, childId });
      account.currentChild = payload.childProfile;
      const profileIndex = account.childProfiles.findIndex((profile) => profile.id === payload.childProfile.id);
      if (profileIndex >= 0) account.childProfiles.splice(profileIndex, 1, payload.childProfile);
      else account.childProfiles.push(payload.childProfile);
      return account.currentChild;
    }

    if (account.status === "error") {
      throw account.error || new Error("Не вдалося підключитися до OwlJoy");
    }

    const previewProfile = {
      id: childId || `preview-child-${Date.now()}`,
      nickname,
      birth_date: birthDate
    };
    const profileIndex = account.childProfiles.findIndex((profile) => profile.id === previewProfile.id);
    if (profileIndex >= 0) account.childProfiles.splice(profileIndex, 1, previewProfile);
    else account.childProfiles.push(previewProfile);
    localStorage.setItem(previewChildrenKey, JSON.stringify(account.childProfiles));
    localStorage.removeItem(previewChildKey);
    account.currentChild = previewProfile;
    return previewProfile;
  }

  async function deleteChildProfile(childId) {
    if (!childId || account.childProfiles.length <= 1) {
      throw new Error("Потрібно залишити хоча б один профіль дитини");
    }

    if (account.status === "authenticated") {
      await request("child.delete", { childId });
    } else if (account.status === "error") {
      throw account.error || new Error("Не вдалося підключитися до OwlJoy");
    }

    account.childProfiles = account.childProfiles.filter((profile) => profile.id !== childId);
    if (account.status !== "authenticated") {
      localStorage.setItem(previewChildrenKey, JSON.stringify(account.childProfiles));
      localStorage.removeItem(previewChildKey);
    }
    if (account.currentChild?.id === childId) account.currentChild = account.childProfiles[0] || null;
    return account.currentChild;
  }

  account.request = request;
  account.saveChildProfile = saveChildProfile;
  account.deleteChildProfile = deleteChildProfile;
  account.ready = bootstrap();
  window.owlJoyAccount = account;
})();
