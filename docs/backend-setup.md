# Облікові записи OwlJoy

## Що вже підготовлено

- автоматичний вхід за підписаними даними Telegram Mini App;
- створення або оновлення користувача за незмінним Telegram ID;
- синхронізація обраних віршиків між телефонами користувача;
- таблиці для профілю дитини, налаштувань, обраного, нагадувань про ліки та оплат;
- Row Level Security для всіх приватних таблиць;
- відсутність прямого доступу браузера до бази даних.

## Підключення Supabase

1. Створити проєкт на <https://database.new>.
2. У терміналі виконати `supabase login`.
3. Прив'язати репозиторій: `supabase link --project-ref ІДЕНТИФІКАТОР_ПРОЄКТУ`.
4. Застосувати структуру бази: `supabase db push`.
5. У Supabase Dashboard відкрити **Edge Functions → Secrets** і додати:
   - `TELEGRAM_BOT_TOKEN` — токен від BotFather;
   - `ALLOWED_ORIGINS` — `https://netyura.github.io`.
6. Розгорнути сервер: `supabase functions deploy telegram-api --use-api`.
7. Вписати адресу функції у `config.js`:
   `https://ІДЕНТИФІКАТОР_ПРОЄКТУ.supabase.co/functions/v1/telegram-api`.

Токен бота не можна надсилати в чат, додавати в `config.js`, GitHub або будь-який файл фронтенду.

## Оплати

Цифровий преміум-контент усередині Telegram потрібно продавати через Telegram Stars (`XTR`).
Сервер має записувати покупку лише після події `successful_payment`, а не після натискання кнопки оплати.

## Дані про ліки

OwlJoy зберігатиме лише нагадування, введені батьками. Застосунок не повинен самостійно призначати препарат або дозування. Перед запуском потрібні політика приватності, згода на обробку даних та функція повного видалення профілю.

## Telegram-нагадування про ліки

1. Створити два довгі випадкові значення та зберегти їх лише в **Edge Functions → Secrets**:
   - `MEDICINE_CRON_SECRET` — захист запуску планувальника;
   - `TELEGRAM_WEBHOOK_SECRET` — перевірка запитів від Telegram.
2. Розгорнути функції:
   - `supabase functions deploy telegram-api --use-api`;
   - `supabase functions deploy send-medicine-reminders --use-api`;
   - `supabase functions deploy telegram-bot-webhook --use-api`.
3. У Supabase Cron створити завдання щохвилини, яке надсилає `POST` на
   `https://ІДЕНТИФІКАТОР_ПРОЄКТУ.supabase.co/functions/v1/send-medicine-reminders`
   із заголовком `Authorization: Bearer ЗНАЧЕННЯ_MEDICINE_CRON_SECRET`.
4. Один раз зареєструвати webhook Telegram на адресу
   `https://ІДЕНТИФІКАТОР_ПРОЄКТУ.supabase.co/functions/v1/telegram-bot-webhook`
   і передати те саме значення `TELEGRAM_WEBHOOK_SECRET` у параметрі `secret_token`.

Функція планувальника враховує часовий пояс користувача та надсилає до трьох повідомлень для одного прийому: у запланований час, через 5 хвилин і через 15 хвилин. Після натискання **Дано** або **Пропустити** повторні нагадування зупиняються, а результат потрапляє в історію OwlJoy.
