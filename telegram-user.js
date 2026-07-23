(function initOwlJoyAccount() {
  const telegramApp = window.Telegram?.WebApp;
  const apiUrl = window.OWLJOY_CONFIG?.apiUrl?.trim();
  const previewChildKey = "owljoyChildProfile";
  const previewChildrenKey = "owljoyChildProfiles";
  const previewMedicineKey = "owljoyMedicineReminders";
  const previewIntakesKey = "owljoyMedicineIntakes";
  const previewQuickLogsKey = "owljoyCareQuickLogs";

  const account = {
    currentUser: null,
    currentChild: null,
    childProfiles: [],
    favoritePoemIds: [],
    homeShortcutIds: null,
    medicineReminders: [],
    medicineIntakes: [],
    careQuickLogs: [],
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

  function readPreviewArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
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
      account.childProfiles = readPreviewChildren();
      account.currentChild = account.childProfiles[0] || null;
      account.medicineReminders = readPreviewArray(previewMedicineKey);
      account.medicineIntakes = readPreviewArray(previewIntakesKey);
      account.careQuickLogs = readPreviewArray(previewQuickLogsKey);
      account.homeShortcutIds = localStorage.getItem("owljoyHomeShortcuts") === null
        ? null
        : readPreviewArray("owljoyHomeShortcuts");
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
      account.homeShortcutIds = Array.isArray(payload.homeShortcutIds) ? payload.homeShortcutIds : null;
      account.medicineReminders = payload.medicineReminders || [];
      account.medicineIntakes = payload.medicineIntakes || [];
      account.careQuickLogs = payload.careQuickLogs || [];
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

  async function saveMedicineReminder(values) {
    if (account.status === "authenticated") {
      const payload = await request("medicine.save", values);
      const reminder = payload.medicineReminder;
      const index = account.medicineReminders.findIndex((item) => item.id === reminder.id);
      if (index >= 0) account.medicineReminders.splice(index, 1, reminder);
      else account.medicineReminders.push(reminder);
      return reminder;
    }
    if (account.status === "error") throw account.error || new Error("Не вдалося підключитися до OwlJoy");

    const reminder = {
      id: values.reminderId || `preview-medicine-${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`,
      child_id: values.childId,
      title: values.title,
      schedule_group_id: values.scheduleGroupId || values.reminderId || `preview-group-${Date.now()}`,
      dose_amount: values.doseAmount,
      dose_unit: values.doseUnit,
      meal_relation: values.mealRelation || "none",
      reminder_time: `${values.reminderTime}:00`,
      days_of_week: values.daysOfWeek,
      start_date: values.startDate,
      end_date: values.endDate,
      note: values.note,
      timezone: values.timezone,
      is_active: true
    };
    const index = account.medicineReminders.findIndex((item) => item.id === reminder.id);
    if (index >= 0) account.medicineReminders.splice(index, 1, reminder);
    else account.medicineReminders.push(reminder);
    localStorage.setItem(previewMedicineKey, JSON.stringify(account.medicineReminders));
    return reminder;
  }

  async function deleteMedicineReminder(reminderId) {
    if (account.status === "authenticated") {
      await request("medicine.delete", { reminderId });
    } else if (account.status === "error") {
      throw account.error || new Error("Не вдалося підключитися до OwlJoy");
    }
    account.medicineReminders = account.medicineReminders.filter((item) => item.id !== reminderId);
    account.medicineIntakes = account.medicineIntakes.filter((item) => (item.reminder_id || item.reminderId) !== reminderId);
    if (account.status !== "authenticated") {
      localStorage.setItem(previewMedicineKey, JSON.stringify(account.medicineReminders));
      localStorage.setItem(previewIntakesKey, JSON.stringify(account.medicineIntakes));
    }
  }

  async function logMedicineIntake(values) {
    if (account.status === "authenticated") {
      const payload = await request("medicine.intake", values);
      const intake = payload.medicineIntake;
      const index = account.medicineIntakes.findIndex((item) =>
        (item.reminder_id || item.reminderId) === intake.reminder_id &&
        (item.scheduled_date || item.scheduledDate) === intake.scheduled_date
      );
      if (index >= 0) account.medicineIntakes.splice(index, 1, intake);
      else account.medicineIntakes.push(intake);
      return intake;
    }
    if (account.status === "error") throw account.error || new Error("Не вдалося підключитися до OwlJoy");

    const intake = {
      id: `preview-intake-${Date.now()}`,
      reminder_id: values.reminderId,
      child_id: values.childId,
      scheduled_date: values.scheduledDate,
      scheduled_time: `${values.scheduledTime}:00`,
      status: values.status,
      recorded_at: new Date().toISOString()
    };
    const index = account.medicineIntakes.findIndex((item) =>
      (item.reminder_id || item.reminderId) === values.reminderId &&
      (item.scheduled_date || item.scheduledDate) === values.scheduledDate
    );
    if (index >= 0) account.medicineIntakes.splice(index, 1, intake);
    else account.medicineIntakes.push(intake);
    localStorage.setItem(previewIntakesKey, JSON.stringify(account.medicineIntakes));
    return intake;
  }

  async function deleteMedicineIntake(values) {
    if (account.status === "authenticated") {
      await request("medicine.intake.delete", values);
    } else if (account.status === "error") {
      throw account.error || new Error("Не вдалося підключитися до OwlJoy");
    }
    account.medicineIntakes = account.medicineIntakes.filter((item) =>
      (item.reminder_id || item.reminderId) !== values.reminderId
      || (item.scheduled_date || item.scheduledDate) !== values.scheduledDate
    );
    if (account.status !== "authenticated") {
      localStorage.setItem(previewIntakesKey, JSON.stringify(account.medicineIntakes));
    }
    return { ok: true };
  }

  async function setMedicineNotifications(enabled) {
    if (account.status === "authenticated") {
      return request("medicine.notifications", { enabled: Boolean(enabled) });
    }
    return { ok: true };
  }

  async function saveCareQuickLog(values) {
    if (account.status === "authenticated") {
      const payload = await request("quicklog.save", values);
      account.careQuickLogs.unshift(payload.careQuickLog);
      account.careQuickLogs = account.careQuickLogs.slice(0, 200);
      return payload.careQuickLog;
    }
    if (account.status === "error") throw account.error || new Error("Не вдалося підключитися до OwlJoy");

    const careQuickLog = {
      id: `preview-quick-log-${Date.now()}`,
      child_id: values.childId,
      event_type: values.eventType,
      event_action: values.eventAction,
      value: values.value === "" || values.value === null ? null : Number(values.value),
      unit: values.unit || null,
      note: values.note || null,
      occurred_at: values.occurredAt || new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    account.careQuickLogs.unshift(careQuickLog);
    account.careQuickLogs = account.careQuickLogs.slice(0, 200);
    localStorage.setItem(previewQuickLogsKey, JSON.stringify(account.careQuickLogs));
    return careQuickLog;
  }

  async function deleteCareQuickLog(quickLogId) {
    if (account.status === "authenticated") {
      await request("quicklog.delete", { quickLogId });
    } else if (account.status === "error") {
      throw account.error || new Error("Не вдалося підключитися до OwlJoy");
    }
    account.careQuickLogs = account.careQuickLogs.filter((item) => item.id !== quickLogId);
    if (account.status !== "authenticated") {
      localStorage.setItem(previewQuickLogsKey, JSON.stringify(account.careQuickLogs));
    }
  }

  async function setHomeShortcuts(shortcutIds) {
    const cleanIds = Array.isArray(shortcutIds) ? shortcutIds.slice(0, 12) : [];
    account.homeShortcutIds = cleanIds;
    localStorage.setItem("owljoyHomeShortcuts", JSON.stringify(cleanIds));
    if (account.status === "authenticated") {
      return request("home.shortcuts", { shortcutIds: cleanIds });
    }
    return { ok: true };
  }

  async function prepareReportDownload(values) {
    if (account.status !== "authenticated") {
      throw account.error || new Error("Завантаження через Telegram доступне лише в боті");
    }
    return request("report.prepareDownload", values);
  }

  account.request = request;
  account.saveChildProfile = saveChildProfile;
  account.deleteChildProfile = deleteChildProfile;
  account.saveMedicineReminder = saveMedicineReminder;
  account.deleteMedicineReminder = deleteMedicineReminder;
  account.logMedicineIntake = logMedicineIntake;
  account.deleteMedicineIntake = deleteMedicineIntake;
  account.setMedicineNotifications = setMedicineNotifications;
  account.saveCareQuickLog = saveCareQuickLog;
  account.deleteCareQuickLog = deleteCareQuickLog;
  account.setHomeShortcuts = setHomeShortcuts;
  account.prepareReportDownload = prepareReportDownload;
  account.ready = bootstrap();
  window.owlJoyAccount = account;
})();
