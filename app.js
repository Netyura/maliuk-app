const telegramApp = window.Telegram?.WebApp;

function initTelegramMiniApp() {
  if (!telegramApp) return;

  telegramApp.ready();
  telegramApp.expand();
  telegramApp.setHeaderColor("#fff8ec");
  telegramApp.setBackgroundColor("#fff8ec");
  telegramApp.BackButton.onClick(goBack);

  document.documentElement.classList.add("telegram-mini-app");
  document.documentElement.style.setProperty("--tg-safe-area-top", `${telegramApp.safeAreaInset?.top || 0}px`);
  document.documentElement.style.setProperty("--tg-safe-area-bottom", `${telegramApp.safeAreaInset?.bottom || 0}px`);
}

initTelegramMiniApp();

const words = [
  {
    id: "cat",
    name: "котик",
    ask: "котика",
    image: "cat-cutout.png",
    sfx: "cat-meow.mp3",
    sound: "няв-няв",
    parent: "Запитайте: хто це? Потім скажіть разом: котик, няв-няв."
  },
  {
    id: "dog",
    name: "песик",
    ask: "песика",
    image: "dog-cutout.png",
    sfx: "dog-bark.mp3",
    sound: "гав-гав",
    parent: "Попросіть дитину показати хвостик і сказати: гав-гав."
  },
  {
    id: "fish",
    name: "рибка",
    ask: "рибку",
    image: "fish-cutout.png",
    sfx: "fish-bubble.mp3",
    sound: "буль-буль",
    parent: "Запитайте: рибка плаває чи бігає?"
  },
  {
    id: "bee",
    name: "бджілка",
    ask: "бджілку",
    image: "bee-cutout.png",
    sfx: "bee-buzz.mp3",
    sound: "ж-ж-ж",
    parent: "Запитайте: бджілка маленька чи велика?"
  },
  {
    id: "cow",
    name: "корівка",
    ask: "корівку",
    image: "cow-cutout.png",
    sfx: "cow-moo.mp3",
    sound: "му-у",
    parent: "Запитайте: як каже корівка? Скажіть разом: му-у."
  },
  {
    id: "horse",
    name: "коник",
    ask: "коника",
    image: "horse-cutout.png",
    sfx: "horse-neigh.mp3",
    sound: "і-го-го",
    parent: "Попросіть показати, як коник стрибає."
  },
  {
    id: "duck",
    name: "качка",
    ask: "качку",
    image: "duck-cutout.png",
    sfx: "duck-quack.mp3",
    sound: "кря-кря",
    parent: "Запитайте: качка плаває чи літає?"
  },
  {
    id: "sheep",
    name: "овечка",
    ask: "овечку",
    image: "sheep-cutout.png",
    sfx: "sheep-baa.mp3",
    sound: "бе-е",
    parent: "Скажіть м'яко разом: овечка каже бе-е."
  },
  {
    id: "pig",
    name: "свинка",
    ask: "свинку",
    image: "pig-cutout.png",
    sfx: "pig-oink.mp3",
    sound: "хрю-хрю",
    parent: "Запитайте: де в свинки носик?"
  },
  {
    id: "chicken",
    name: "курочка",
    ask: "курочку",
    image: "chicken-cutout.png",
    sfx: "chicken-cluck.mp3",
    sound: "ко-ко-ко",
    parent: "Попросіть дитину показати крильця."
  },
  {
    id: "lion",
    name: "лев",
    ask: "лева",
    image: "lion-cutout.png",
    sfx: "lion-roar.mp3",
    sound: "р-р-р",
    parent: "Запитайте: лев великий чи маленький?"
  },
  {
    id: "elephant",
    name: "слоник",
    ask: "слоника",
    image: "elephant-cutout.png",
    sfx: "elephant-trumpet.mp3",
    sound: "тру-у",
    parent: "Попросіть показати рукою довгий хобот."
  },
  {
    id: "monkey",
    name: "мавпочка",
    ask: "мавпочку",
    image: "monkey-cutout.png",
    sfx: "monkey-chatter.mp3",
    sound: "у-у-а-а",
    parent: "Запитайте: мавпочка стрибає чи спить?"
  },
  {
    id: "frog",
    name: "жабка",
    ask: "жабку",
    image: "frog-cutout.png",
    sfx: "frog-ribbit.mp3",
    sound: "ква-ква",
    parent: "Попросіть показати, як жабка стрибає."
  },
  {
    id: "mouse",
    name: "мишка",
    ask: "мишку",
    image: "mouse-cutout.png",
    sfx: "mouse-squeak.mp3",
    sound: "пі-пі",
    parent: "Запитайте: мишка тиха чи гучна?"
  },
  {
    id: "bear",
    name: "ведмедик",
    ask: "ведмедика",
    image: "bear-cutout.png",
    sfx: "bear-growl.mp3",
    sound: "р-р-р",
    parent: "Попросіть показати великі лапи ведмедика."
  },
  {
    id: "goat",
    name: "коза",
    ask: "козу",
    image: "goat-cutout.png",
    sfx: "goat-bleat.mp3",
    sound: "ме-е",
    parent: "Скажіть разом: коза каже ме-е."
  },
  {
    id: "bird",
    name: "пташка",
    ask: "пташку",
    image: "bird-cutout.png",
    sfx: "bird-chirp.mp3",
    sound: "цвірінь",
    parent: "Попросіть показати, як пташка махає крильцями."
  },
  {
    id: "owl",
    name: "сова",
    ask: "сову",
    image: "owl-cutout.png",
    sfx: "owl-hoot.mp3",
    sound: "угу-угу",
    parent: "Запитайте: сова спить вдень чи вночі?"
  },
  {
    id: "snake",
    name: "змійка",
    ask: "змійку",
    image: "snake-cutout.png",
    sfx: "snake-hiss.mp3",
    sound: "с-с-с",
    parent: "Попросіть провести пальчиком хвилясту лінію, як змійка."
  }
];

const objects = [
  { id: "ball", name: "м’ячик", ask: "м’ячик", image: "objects/ball.png", voice: "ball.mp3", parent: "Покажіть, як м’ячик котиться, і повторіть разом: м’ячик." },
  { id: "spoon", name: "ложка", ask: "ложку", image: "objects/spoon.png", voice: "spoon.mp3", parent: "Запитайте, чим ми їмо кашку, і назвіть ложку." },
  { id: "cup", name: "чашка", ask: "чашку", image: "objects/cup.png", voice: "cup.mp3", parent: "Покажіть, як п’ють із чашки, і повторіть її назву." },
  { id: "book", name: "книжка", ask: "книжку", image: "objects/book.png", voice: "book.mp3", parent: "Попросіть малюка показати, як ми гортаємо книжку." },
  { id: "car", name: "машинка", ask: "машинку", image: "objects/car.png", voice: "car.mp3", parent: "Покажіть, як машинка їде, і скажіть разом: машинка." },
  { id: "lamp", name: "лампа", ask: "лампу", image: "objects/lamp.png", voice: "lamp.mp3", parent: "Запитайте, що світить у кімнаті ввечері." },
  { id: "bed", name: "ліжечко", ask: "ліжечко", image: "objects/bed.png", voice: "bed.mp3", parent: "Поговоріть про те, що в ліжечку ми відпочиваємо й спимо." },
  { id: "chair", name: "стілець", ask: "стілець", image: "objects/chair.png", voice: "chair.mp3", parent: "Попросіть показати, як ми сідаємо на стілець." },
  { id: "shoe", name: "черевичок", ask: "черевичок", image: "objects/shoe.png", voice: "shoe.mp3", parent: "Запитайте, куди ми взуваємо черевичок." },
  { id: "hat", name: "шапочка", ask: "шапочку", image: "objects/hat.png", voice: "hat.mp3", parent: "Попросіть показати голівку, на яку одягають шапочку." },
  { id: "toothbrush", name: "зубна щітка", ask: "зубну щітку", image: "objects/toothbrush.png", voice: "toothbrush.mp3", parent: "Покажіть рухами, як чистять зубки щіткою." },
  { id: "bottle", name: "пляшечка", ask: "пляшечку", image: "objects/bottle.png", voice: "bottle.mp3", parent: "Запитайте, що можна налити у пляшечку." },
  { id: "clock", name: "годинник", ask: "годинник", image: "objects/clock.png", voice: "clock.mp3", parent: "Послухайте разом: годинник може робити тік-так." },
  { id: "keys", name: "ключики", ask: "ключики", image: "objects/keys.png", voice: "keys.mp3", parent: "Покажіть, як ключиками відчиняють двері." },
  { id: "umbrella", name: "парасолька", ask: "парасольку", image: "objects/umbrella.png", voice: "umbrella.mp3", parent: "Запитайте, що ми беремо із собою, коли йде дощик." },
  { id: "backpack", name: "рюкзак", ask: "рюкзак", image: "objects/backpack.png", voice: "backpack.mp3", parent: "Покажіть спинку, на якій носять рюкзак." },
  { id: "phone", name: "телефон", ask: "телефон", image: "objects/phone.png", voice: "phone.mp3", parent: "Покажіть, як телефоном дзвонять близьким." },
  { id: "towel", name: "рушничок", ask: "рушничок", image: "objects/towel.png", voice: "towel.mp3", parent: "Покажіть рухами, як рушничком витирають ручки." },
  { id: "comb", name: "гребінець", ask: "гребінець", image: "objects/comb.png", voice: "comb.mp3", parent: "Попросіть показати, як гребінцем розчісують волосся." },
  { id: "cube", name: "кубик", ask: "кубик", image: "objects/cube.png", voice: "cube.mp3", parent: "Запропонуйте уявити, як із кубиків будують вежу." }
];

const colors = [
  { id: "red", name: "червоний", ask: "червоний", hex: "#e9544d", image: "colors/red-apple.png", voice: "red.mp3", audioKind: "color", parent: "Знайдіть разом щось червоне, наприклад яблучко." },
  { id: "blue", name: "синій", ask: "синій", hex: "#3f82d7", image: "colors/blue-ball.png", voice: "blue.mp3", audioKind: "color", parent: "Знайдіть разом щось синє, наприклад м’ячик." },
  { id: "yellow", name: "жовтий", ask: "жовтий", hex: "#f4c534", image: "colors/yellow-duck.png", voice: "yellow.mp3", audioKind: "color", parent: "Знайдіть разом щось жовте, наприклад качечку." },
  { id: "green", name: "зелений", ask: "зелений", hex: "#62ad55", image: "colors/green-leaf.png", voice: "green.mp3", audioKind: "color", parent: "Знайдіть разом щось зелене, наприклад листочок." },
  { id: "orange", name: "помаранчевий", ask: "помаранчевий", hex: "#ef872f", image: "colors/orange-carrot.png", voice: "orange.mp3", audioKind: "color", parent: "Знайдіть разом щось помаранчеве, наприклад морквинку." },
  { id: "purple", name: "фіолетовий", ask: "фіолетовий", hex: "#8b55bd", image: "colors/purple-grapes.png", voice: "purple.mp3", audioKind: "color", parent: "Знайдіть разом щось фіолетове, наприклад виноград." },
  { id: "pink", name: "рожевий", ask: "рожевий", hex: "#ec7fa8", image: "colors/pink-flower.png", voice: "pink.mp3", audioKind: "color", parent: "Знайдіть разом щось рожеве, наприклад квіточку." },
  { id: "brown", name: "коричневий", ask: "коричневий", hex: "#8a5a3b", image: "colors/brown-teddy.png", voice: "brown.mp3", audioKind: "color", parent: "Знайдіть разом щось коричневе, наприклад ведмедика." },
  { id: "black", name: "чорний", ask: "чорний", hex: "#2b2b32", image: "colors/black-boot.png", voice: "black.mp3", audioKind: "color", parent: "Знайдіть разом щось чорне, наприклад чобіток." },
  { id: "white", name: "білий", ask: "білий", hex: "#fffaf0", image: "colors/white-cloud.png", voice: "white.mp3", audioKind: "color", parent: "Знайдіть разом щось біле, наприклад хмаринку." }
];

const animalFamilies = [
  { id: "cat", mother: "Кішка", motherImage: "families/mother-cat.png", baby: "Кошеня", babyImage: "families/kitten.png", voice: "kitten.mp3" },
  { id: "dog", mother: "Собака", motherImage: "families/mother-dog.png", baby: "Цуценя", babyImage: "families/puppy.png", voice: "puppy.mp3" },
  { id: "cow", mother: "Корова", motherImage: "families/mother-cow.png", baby: "Теля", babyImage: "families/calf.png", voice: "calf.mp3" },
  { id: "chicken", mother: "Курочка", motherImage: "families/mother-chicken.png", baby: "Курчатко", babyImage: "families/chick.png", voice: "chick.mp3" },
  { id: "duck", mother: "Качка", motherImage: "families/mother-duck.png", baby: "Каченя", babyImage: "families/duckling.png", voice: "duckling.mp3" },
  { id: "sheep", mother: "Вівця", motherImage: "families/mother-sheep.png", baby: "Ягня", babyImage: "families/lamb.png", voice: "lamb.mp3" },
  { id: "goat", mother: "Коза", motherImage: "families/mother-goat.png", baby: "Козеня", babyImage: "families/kid.png", voice: "kid.mp3" },
  { id: "horse", mother: "Конячка", motherImage: "families/mother-horse.png", baby: "Лоша", babyImage: "families/foal.png", voice: "foal.mp3" },
  { id: "pig", mother: "Свинка", motherImage: "families/mother-pig.png", baby: "Порося", babyImage: "families/piglet.png", voice: "piglet.mp3" },
  { id: "rabbit", mother: "Зайчиха", motherImage: "families/mother-rabbit.png", baby: "Зайченя", babyImage: "families/bunny.png", voice: "bunny.mp3" },
  { id: "bear", mother: "Ведмедиця", motherImage: "families/mother-bear.png", baby: "Ведмежа", babyImage: "families/bear-cub.png", voice: "bear-cub.mp3" },
  { id: "elephant", mother: "Слониха", motherImage: "families/mother-elephant.png", baby: "Слоненя", babyImage: "families/elephant-calf.png", voice: "elephant-calf.mp3" }
];

const emotions = [
  { id: "happy", name: "Радісний", ask: "радісне", image: "emotions/happy.png", voice: "happy.mp3", tip: "Усміхніться одне одному й назвіть те, що вас радує." },
  { id: "sad", name: "Сумний", ask: "сумне", image: "emotions/sad.png", voice: "sad.mp3", tip: "Покажіть, як можна обійняти й підтримати того, хто сумує." },
  { id: "surprised", name: "Здивований", ask: "здивоване", image: "emotions/surprised.png", voice: "surprised.mp3", tip: "Разом скажіть «Ого!» і зробіть великі здивовані очі." },
  { id: "sleepy", name: "Сонний", ask: "сонне", image: "emotions/sleepy.png", voice: "sleepy.mp3", tip: "Позіхніть і покажіть, як голівка вкладається спати." },
  { id: "angry", name: "Сердитий", ask: "сердите", image: "emotions/angry.png", voice: "angry.mp3", tip: "Поясніть: коли сердимося, можна повільно подихати й заспокоїтися." }
];

const dressItems = [
  { id: "hat", name: "Шапочка", ask: "шапочку", image: "dress-up/hat.png", voice: "hat.mp3" },
  { id: "shirt", name: "Футболка", ask: "футболку", image: "dress-up/shirt.png", voice: "shirt.mp3" },
  { id: "pants", name: "Штанці", ask: "штанці", image: "dress-up/pants.png", voice: "pants.mp3" },
  { id: "shoes", name: "Черевички", ask: "черевички", image: "dress-up/shoes.png", voice: "shoes.mp3" }
];

const dressLookImages = {
  "": "dress-up/stage-0-aligned.png",
  "hat": "dress-up/stage-1-aligned.png",
  "shirt": "dress-up/look-shirt-aligned.png",
  "pants": "dress-up/look-pants-aligned.png",
  "shoes": "dress-up/look-shoes-aligned.png",
  "hat+shirt": "dress-up/stage-2-aligned.png",
  "hat+pants": "dress-up/look-hat-pants-aligned.png",
  "hat+shoes": "dress-up/look-hat-shoes-aligned.png",
  "shirt+pants": "dress-up/look-shirt-pants-aligned.png",
  "shirt+shoes": "dress-up/look-shirt-shoes-aligned.png",
  "pants+shoes": "dress-up/look-pants-shoes-aligned.png",
  "hat+shirt+pants": "dress-up/stage-3-aligned.png",
  "hat+shirt+shoes": "dress-up/look-hat-shirt-shoes-aligned.png",
  "hat+pants+shoes": "dress-up/look-hat-pants-shoes-aligned.png",
  "shirt+pants+shoes": "dress-up/look-shirt-pants-shoes-aligned.png",
  "hat+shirt+pants+shoes": "dress-up/stage-4-aligned.png"
};

const dressCharacters = [
  { id: "baby", name: "Малюк", target: "малюка", forWhom: "малюка", ready: "Малюк готовий!", alt: "Малюк, якого потрібно одягнути", preview: "dress-up/stage-0-aligned.png" },
  { id: "doll", name: "Ляля", target: "лялю", forWhom: "лялі", ready: "Ляля готова!", alt: "Ляля, яку потрібно одягнути", preview: "dress-up/doll-none-aligned.png" },
  { id: "bear", name: "Ведмедик", target: "ведмедика", forWhom: "ведмедика", ready: "Ведмедик готовий!", alt: "Ведмедик, якого потрібно одягнути", preview: "dress-up/bear-none-aligned.png" }
];

const generatedDressLooks = (characterId) => Object.fromEntries(
  Object.keys(dressLookImages).map((lookKey) => [
    lookKey,
    `dress-up/${characterId}-${lookKey ? lookKey.split("+").join("-") : "none"}-aligned.png`
  ])
);

const dressLooksByCharacter = {
  baby: dressLookImages,
  doll: generatedDressLooks("doll"),
  bear: generatedDressLooks("bear")
};

const sleepSounds = [
  {
    id: "light-white",
    title: "Білий шум",
    mood: "легкий рівний фон",
    description: "М'який білий шум для засинання.",
    image: "sleep-light-white-noise.png",
    audio: "light-white-noise.mp3"
  },
  {
    id: "baby-white",
    title: "Шум немовляті",
    mood: "довгий білий шум",
    description: "Рівний фон для сну без різких пауз.",
    image: "sleep-white-noise.png",
    audio: "baby-white-noise.mp3"
  },
  {
    id: "dryer",
    title: "Шум фена",
    mood: "теплий рівний фон",
    description: "Стабільний звук фена для засинання.",
    image: "sleep-dryer.png",
    audio: "hair-dryer.mp3"
  },
  {
    id: "soft-dryer",
    title: "М'який фен",
    mood: "білий шум",
    description: "Спокійний фен без різких змін.",
    image: "sleep-dryer.png",
    audio: "soft-dryer.mp3"
  },
  {
    id: "vacuum",
    title: "Пилосос",
    mood: "глибокий шум",
    description: "Рівний низький фон для сну.",
    image: "sleep-vacuum.png",
    audio: "vacuum.mp3"
  },
  {
    id: "fan",
    title: "Вентилятор",
    mood: "постійний шум",
    description: "Монотонний звук вентилятора.",
    image: "sleep-fan.png",
    audio: "fan.mp3"
  },
  {
    id: "water",
    title: "Шум води",
    mood: "м'який потік",
    description: "Тиха вода без різких сплесків.",
    image: "sleep-water.png",
    audio: "water-stream.mp3"
  },
  {
    id: "rain",
    title: "Дощ по вікну",
    mood: "затишний вечір",
    description: "Рівний дощик без грому.",
    image: "sleep-rain.png",
    audio: "soft-rain.mp3"
  },
  {
    id: "lullaby-music-box",
    title: "Музична скринька",
    mood: "ніжна колискова",
    description: "Легка мелодія, як тінь-ді-ді для сну.",
    image: "sleep-lullaby-music-box.png",
    audio: "lullaby-music-box.mp3"
  },
  {
    id: "lullaby-quiet-piano",
    title: "Тихе піаніно",
    mood: "спокійні клавіші",
    description: "М'яке піаніно з природним фоном.",
    image: "sleep-lullaby-quiet-piano.png",
    audio: "lullaby-quiet-piano.mp3"
  },
  {
    id: "lullaby-little-dreams",
    title: "Маленькі сни",
    mood: "тепла мелодія",
    description: "Ніжна музика для повільного засинання.",
    image: "sleep-lullaby-little-dreams.png",
    audio: "lullaby-little-dreams.mp3"
  },
  {
    id: "lullaby-sleepy-melody",
    title: "Сонна мелодія",
    mood: "колисковий ритм",
    description: "Спокійна мелодія для вечірнього режиму.",
    image: "sleep-lullaby-sleepy-melody.png",
    audio: "lullaby-sleepy-melody.mp3"
  },
  {
    id: "lullaby-good-dreams",
    title: "Добрі сни",
    mood: "світла колискова",
    description: "Легка позитивна музика перед сном.",
    image: "sleep-lullaby-good-dreams.png",
    audio: "lullaby-good-dreams.mp3"
  },
  {
    id: "lullaby-sleepy-star",
    title: "Сонна зірочка",
    mood: "тиха колискова",
    description: "Коротка ніжна мелодія для засинання.",
    image: "sleep-lullaby-sleepy-star.png",
    audio: "lullaby-sleepy-star.mp3"
  }
];

const poems = [
  {
    id: "bath-kotyku-vorkotyku",
    title: "Котику-воркотику",
    category: "Купання",
    categoryId: "bath",
    image: null,
    audio: null,
    preview: "Помий лапкою ротика.",
    instruction: "Під час купання забавляйтеся з іграшками й промовляйте рядки, показуючи котика, коника або песика.",
    lines: [
      "Котику-воркотику,",
      "Помий лапкою ротика.",
      "А ти, конику, заклич песика,",
      "Будем водичкою поливати,",
      "Гриву конику чесати."
    ]
  },
  {
    id: "bath-hliup-vodychenko",
    title: "Хлюп, хлюп водиченько",
    category: "Купання",
    categoryId: "bath",
    image: null,
    audio: null,
    preview: "Умий личенько.",
    instruction: "Для гри у ванній. Замість дужок назвіть ім'я дитини й лагідно вмивайте ручки, ніжки, носик.",
    lines: [
      "Хлюп, хлюп водиченько,",
      "Умий личенько,",
      "І ручки, і ніжки,",
      "І носик, і кіски.",
      "Хлюп, хлюп, хлюп!"
    ]
  },
  {
    id: "bath-vodychko",
    title: "Водичко-водичко",
    category: "Купання",
    categoryId: "bath",
    image: null,
    audio: null,
    preview: "Помий мені личко.",
    instruction: "Для вмивання. Замість “мені” можна казати ім'я дитини.",
    lines: [
      "Водичко-водичко,",
      "Помий мені личко.",
      "Рожеве та біле,",
      "Як яблучко спіле."
    ]
  },
  {
    id: "bath-toothbrush",
    title: "Щіточка зубна",
    category: "Купання",
    categoryId: "bath",
    image: null,
    audio: null,
    preview: "Чищу зуби залюбки.",
    instruction: "Коли дитина вчиться чистити зуби, показуйте рухи щіткою зверху вниз.",
    lines: [
      "У мене щіточка зубна.",
      "Подивіться, ось вона.",
      "Зверху-вниз і навпаки.",
      "Чищу зуби залюбки."
    ]
  },
  {
    id: "bath-comb",
    title: "Гребіночка зелена",
    category: "Купання",
    categoryId: "bath",
    image: null,
    audio: null,
    preview: "Сам голівку причешу.",
    instruction: "Коли причесуєте дитину, промовляйте повільно й показуйте гребіночку.",
    lines: [
      "А у мене, а у мене",
      "Є гребіночка зелена.",
      "Я нікого не прошу.",
      "Сам голівку причешу."
    ]
  },
  {
    id: "bath-grow-hair",
    title: "Рости, кісонько",
    category: "Купання",
    categoryId: "bath",
    image: null,
    audio: null,
    preview: "Рости, косо, не путайся.",
    instruction: "Примовляйте під час розчісування. Можна лагідно проводити гребінцем по волоссю.",
    lines: [
      "Рости, кісонько, до п'ят,",
      "Всі волосики уряд.",
      "Рости, косо, не путайся,",
      "Доню мами слухайся."
    ]
  },
  {
    id: "bath-three-foxes",
    title: "Три лисички",
    category: "Купання",
    categoryId: "bath",
    image: null,
    audio: null,
    preview: "Миють лапки, миють личка.",
    instruction: "Коли дитина не хоче вмиватися, покажіть, як лисички миють лапки й личка.",
    lines: [
      "Три лисички, три сестрички",
      "Миють лапки, миють личка.",
      "Не впускає тато-лис",
      "Їх немитими у ліс."
    ]
  },
  {
    id: "bath-murchyk",
    title: "Мурчик чистенький",
    category: "Купання",
    categoryId: "bath",
    image: null,
    audio: null,
    preview: "Миє ротик і животик.",
    instruction: "Коли купаєте дитину, показуйте, як котик миє ротик і животик.",
    lines: [
      "Скочив котик,",
      "Сів на плотик,",
      "Миє ротик і животик.",
      "Він маленький і чистенький,",
      "Гарний Мурчик мій маленький."
    ]
  },
  {
    id: "sleep-gray-cat",
    title: "Сіра киця",
    category: "Сон",
    categoryId: "sleep",
    image: null,
    audio: null,
    preview: "Час уже їм спати.",
    instruction: "Читайте перед сном тихим голосом, ніби шукаєте кошенят і вкладаєте їх спати.",
    lines: [
      "Сіра киця милася,",
      "У вікно дивилася,",
      "Хвостиком махала,",
      "Кошенят шукала.",
      "Де ж мої малята,",
      "Сірі кошенята?",
      "Час уже їм спати,",
      "Сірим кошенятам."
    ]
  },
  {
    id: "sleep-donia",
    title: "У моєї доні",
    category: "Сон",
    categoryId: "sleep",
    image: null,
    audio: null,
    preview: "Доня хоче спати.",
    instruction: "Для сонної дитини. Промовляйте повільно й приглушено.",
    lines: [
      "У моєї доні",
      "Оченята сонні,",
      "Рученьки мов з вати,",
      "Доня хоче спати."
    ]
  },
  {
    id: "sleep-toys",
    title: "Іграшки заснули",
    category: "Сон",
    categoryId: "sleep",
    image: null,
    audio: null,
    preview: "Це тому що малюк спить.",
    instruction: "Вірш надобраніч. У рядку з ім'ям назвіть свою дитину.",
    lines: [
      "Іграшки заснули всі,",
      "Кіт дрімає на вікні,",
      "Навіть пташечка мовчить,",
      "Це тому що малюк спить."
    ]
  },
  {
    id: "sleep-owl",
    title: "Совеня",
    category: "Сон",
    categoryId: "sleep",
    image: null,
    audio: null,
    preview: "Сни так видно краще.",
    instruction: "Можна читати перед сном або коли дитина розглядає картинки з нічними тваринками.",
    lines: [
      "Звичка є у совеняти,",
      "Коли вдень лягає спати,",
      "Одягає окуляри,",
      "Ще й одразу аж дві пари!",
      "Малюка питають: “Нащо?”",
      "Каже: “Сни так видно краще”."
    ]
  },
  {
    id: "sleep-kitten-pillow",
    title: "Котику під вушко",
    category: "Сон",
    categoryId: "sleep",
    image: null,
    audio: null,
    preview: "Принесли подушку.",
    instruction: "Коротко перед сном. На “няв-няв” можна тихо нявкнути.",
    lines: [
      "Котику під вушко",
      "Принесли подушку,",
      "Він її під хвіст поклав",
      "І подякував: “Няв, няв”."
    ]
  },
  {
    id: "food-gamu",
    title: "Мамо, гаму дай",
    category: "Їжа",
    categoryId: "food",
    image: null,
    audio: null,
    preview: "Їли кашку з молочком.",
    instruction: "Коли годуєте дитину. Можна ритмічно підносити ложечку на коротких рядках.",
    lines: [
      "Мамо, гаму дай мені,",
      "Що варили на вогні?",
      "Мамо, гаму дай, дай, дай,",
      "Біля мене тут сідай.",
      "Дала мама гаму, гам,",
      "Своїм любим діточкам,",
      "Посідали за столом,",
      "Їли кашку з молочком."
    ]
  },
  {
    id: "food-gam-gam",
    title: "Гам, гам, гам",
    category: "Їжа",
    categoryId: "food",
    image: null,
    audio: null,
    preview: "Дуже смачно зараз нам.",
    instruction: "Дуже коротка примовка під час їжі або першої ложечки.",
    lines: [
      "Гам, гам, гам,",
      "Гам, гам, гам...",
      "Дуже смачно зараз нам."
    ]
  },
  {
    id: "food-hamster",
    title: "Хом'ячок ням-ням",
    category: "Їжа",
    categoryId: "food",
    image: null,
    audio: null,
    preview: "Люблю зерно ням-ням.",
    instruction: "Читайте весело під час перекусу. На “ням-ням” дитина може повторювати.",
    lines: [
      "Я хом'ячок ням-ням,",
      "Люблю зерно ням-ням,",
      "Живу я там ням-ням,",
      "Де є воно ням-ням.",
      "Хом'ячок, хом'ячок,",
      "Покажи свій бочок!",
      "Ні, не покажу,",
      "Бо я на ньому лежу!"
    ]
  },
  {
    id: "food-kitsia-mura",
    title: "Киця Мура",
    category: "Їжа",
    categoryId: "food",
    image: null,
    audio: null,
    preview: "Їла кашку з молоком.",
    instruction: "Підійде під час каші або молока. Читайте як маленький діалог.",
    lines: [
      "Киця Мура, де ти була?",
      "Я гукав, а ти не чула.",
      "Я сиділа під столом,",
      "Їла кашку з молоком!"
    ]
  },
  {
    id: "food-cat-pie",
    title: "Миші печуть пиріг",
    category: "Їжа",
    categoryId: "food",
    image: null,
    audio: null,
    preview: "Що так пахне, смакота?",
    instruction: "Короткий веселий віршик для їжі або гри з іграшковим котиком.",
    lines: [
      "Що так пахне, смакота?",
      "Запитав кіт у кота.",
      "Кіт над ніркою приліг:",
      "Миші там печуть пиріг."
    ]
  },
  {
    id: "food-pig-borshch",
    title: "Буде борщ",
    category: "Їжа",
    categoryId: "food",
    image: null,
    audio: null,
    preview: "Буде з чого борщ варити.",
    instruction: "Можна читати під час обіду або коли дитина знайомиться з овочами.",
    lines: [
      "Порося кришило в бочку",
      "Ріпу, редьку, огірочки.",
      "А буряк — в старе корито.",
      "Буде з чого борщ варити!"
    ]
  },
  {
    id: "movement-finger-forest",
    title: "Цей пальчик в ліс пішов",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Цей пальчик гриб знайшов.",
    instruction: "Пальчики рахуємо, починаючи з мізинчика, торкаючись кожного пальчика по черзі.",
    lines: [
      "Цей пальчик в ліс пішов,",
      "Цей пальчик гриб знайшов,",
      "Цей пальчик чистив,",
      "А цей пальчик смажив,",
      "А цей пальчик усе з'їв",
      "І від того потовстів."
    ]
  },
  {
    id: "movement-family-fingers",
    title: "Цей пальчик — дідусь",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "А цей пальчик — мама.",
    instruction: "Пальчикова гра. На останньому рядку назвіть ім'я дитини.",
    lines: [
      "Цей пальчик — мій дідусь,",
      "А цей пальчик — баба,",
      "А цей пальчик — мій татусь,",
      "А цей пальчик — мама,",
      "А цей пальчик — малюк."
    ]
  },
  {
    id: "movement-head",
    title: "Кругла голова",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Очка два, вушка два.",
    instruction: "Показуйте на собі або дитині голову, очі, вушка, ніс і ротик.",
    lines: [
      "У мене кругла голова,",
      "Очка два, вушка два,",
      "Ніс один і рот маленький,",
      "І волоссячко біленьке."
    ]
  },
  {
    id: "movement-kuju",
    title: "Кую, кую чобіток",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Подай, бабо, молоток.",
    instruction: "Стукайте пальчиком по долоньці або п'яточці в ритм віршика.",
    lines: [
      "Кую, кую чобіток.",
      "Подай, бабо, молоток.",
      "Не подаш молотка —",
      "Не підкую чобітка."
    ]
  },
  {
    id: "movement-ide-pan",
    title: "Їде, їде пан",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "На конику сам.",
    instruction: "Гойдаючи дитину на колінах, промовляйте в ритм.",
    lines: [
      "Їде, їде пан, пан,",
      "На конику сам, сам.",
      "А за паном хлоп, хлоп,",
      "Черевичок лоп, лоп."
    ]
  },
  {
    id: "movement-bread",
    title: "Печу, печу хлібчик",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Дітям на обідчик.",
    instruction: "Беремо голівку в руки, легенько “перекидаємо” з руки в руку. На останніх словах піднімаємо дитинку.",
    lines: [
      "Печу, печу хлібчик",
      "Дітям на обідчик.",
      "Шусь у піч, шусь у піч.",
      "Рости, рости хлібчик!"
    ]
  },
  {
    id: "movement-hoida",
    title: "Гойда-да",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Добра в коника хода.",
    instruction: "Гойдати дитинку на колінах чи великому м'ячику, приспівуючи.",
    lines: [
      "Гойда-да, гойда-да,",
      "Добра в коника хода,",
      "Поводи шовкові,",
      "Золоті підкови,",
      "У вершника на коні",
      "Очки волошкові!"
    ]
  },
  {
    id: "movement-lolia",
    title: "Льоля",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Пальчики рахуємо.",
    instruction: "Пальчики рахуємо, починаючи з мізинчика. Наприкінці можна легенько полоскотати.",
    lines: [
      "Льоля.",
      "Боба.",
      "Дичка.",
      "Пшеничка.",
      "А ти, старий Бобисько,",
      "Фуррр за плотисько!"
    ]
  },
  {
    id: "movement-goroshok",
    title: "Горошок",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Футь, за вікно.",
    instruction: "Рахуйте пальчики. На “крутимо” покрутіть великий пальчик, а тоді весело промовте фінал.",
    lines: [
      "Горошок.",
      "Бобошок.",
      "Фасолька.",
      "Кукурузка.",
      "А ти, старий бобисько,",
      "Футь, за вікно."
    ]
  },
  {
    id: "movement-sweet-fingers",
    title: "Солодкі пальчики",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "А мізинчик найсолодший.",
    instruction: "Ми рахуємо пальчики, ніжно торкаючись кожного.",
    lines: [
      "Шоколадний,",
      "Мармеладний,",
      "Із запахом зефіру,",
      "Зі смаком пломбіру,",
      "А мізинчик самий-самий",
      "Солодкий для мами."
    ]
  },
  {
    id: "movement-hop",
    title: "Стриб, стриб",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Буду я рости, як гриб.",
    instruction: "Підійде для маленької руханки: легенько підстрибуйте або піднімайте ручки.",
    lines: [
      "Стриб, стриб, стриб,",
      "Стриб, стриб, стриб,",
      "Буду я рости, як гриб."
    ]
  },
  {
    id: "movement-hands-feet",
    title: "Ручки хлоп",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Ніжки топ, топ, топ.",
    instruction: "Показуйте всі дії: плескайте, тупайте, слухайте, нюхайте.",
    lines: [
      "Ручки хлоп, хлоп, хлоп,",
      "Ніжки топ, топ, топ.",
      "Вушка слух, слух, слух,",
      "Носик нюх, нюх, нюх."
    ]
  },
  {
    id: "movement-sleepy-fingers",
    title: "Задрімав мізинчик",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "В дитсадочок бігти час.",
    instruction: "По черзі загинаємо пальчики до долоні, потім великим пальцем “будимо” всі інші.",
    lines: [
      "Задрімав мізинчик трішки,",
      "Безіменний — стриб у ліжко,",
      "А середній там лежить,",
      "Вказівний давно вже спить.",
      "Вранці всі вони схопились враз —",
      "В дитсадочок бігти час."
    ]
  },
  {
    id: "movement-tickle-mouse",
    title: "Бігла мишка",
    category: "Руханка",
    categoryId: "movement",
    image: null,
    audio: null,
    preview: "Книшика з'їла.",
    instruction: "Лоскоталка: пальцями “біжимо” від п'яточок до шийки або під ручки, потім лоскочемо.",
    lines: [
      "Бігла мишка,",
      "Несла книшика,",
      "Не мала, де сісти,",
      "Книшика з'їсти.",
      "А тут-тут сіла,",
      "Книшика з'їла!"
    ]
  },
  {
    id: "animals-monkey",
    title: "Мавпа мавпі",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Ти — макака, я — горила.",
    instruction: "Читайте весело, але м'яко. Можна показати різні смішні мордочки.",
    lines: [
      "Мавпа мавпі говорила:",
      "Ти — макака, я — горила,",
      "Ти — горила, я — макака.",
      "Я — красива, ти — ніяка."
    ]
  },
  {
    id: "animals-mouse-cheese",
    title: "Сіра мишка",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Сіра мишка знайшла сир.",
    instruction: "Короткий веселий віршик. На “свято” можна плеснути в долоні.",
    lines: [
      "Хочеш вір, хочеш не вір,",
      "Сіра мишка знайшла сир.",
      "І не мало, й не багато,",
      "А у мишки буде свято!"
    ]
  },
  {
    id: "animals-frog-dirty",
    title: "Жабенятко",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Забруднилось, не помилось.",
    instruction: "Можна читати перед вмиванням або купанням, додаючи “ква-ква” голосом жабки.",
    lines: [
      "Жабенятко забруднилось.",
      "Забруднилось, не помилось.",
      "Жабенятко, так не гоже.",
      "Ну на кого ти похоже?",
      "Я похоже на мамуню,",
      "На мамуню ква-ква-куню."
    ]
  },
  {
    id: "animals-frog-river",
    title: "Коло річечки",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Бавить жаба жабеня.",
    instruction: "Читайте ніжно, можна накривати долонькою ручку дитини на слові “лапкою”.",
    lines: [
      "Коло річечки щодня",
      "Бавить жаба жабеня,",
      "Накриває лапкою,",
      "Називає жабкою."
    ]
  },
  {
    id: "animals-frog-family",
    title: "Жабка мама",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Жабенятко слухає.",
    instruction: "На “жабенятко слухає” можна прикласти руку до вушка.",
    lines: [
      "Жабка мама,",
      "Жабка тато",
      "Жебонять щось жабеняті.",
      "Жабенятко слухає",
      "І животик чухає."
    ]
  },
  {
    id: "animals-elephant-leg",
    title: "У слона болить нога",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Він сьогодні шкутильга.",
    instruction: "Підійде для гри в “як ходить слоник”: повільно переступайте ніжками.",
    lines: [
      "У слона болить нога,",
      "Він сьогодні шкутильга,",
      "Гостював комар у нього,",
      "Наступив йому на ногу."
    ]
  },
  {
    id: "animals-synychka",
    title: "Синиця у спідниці",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Збирала достиглі суниці.",
    instruction: "Читайте як маленьку історію про пташку й синичатко.",
    lines: [
      "Ходила синиця у синій спідниці,",
      "Збирала у кошик достиглі суниці,",
      "А синичатко, жовтенький животик,",
      "Збирало сунички не в кошик, а в ротик."
    ]
  },
  {
    id: "animals-doctor-ram",
    title: "Баранчик у лікаря",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Не плакав, не боявся.",
    instruction: "Перед візитом до лікаря. Можна разом сказати “А-а-а”, а потім весело “бе-е-е”.",
    lines: [
      "Маленький баранчик у лікаря бував,",
      "Не плакав, не боявся і ротик відкривав.",
      "І каже лікар: “Молодець, тепер прошу тебе,",
      "Скажи, будь ласка, букву А”.",
      "Баранчик каже: “Бе-е-е”."
    ]
  },
  {
    id: "animals-dragon",
    title: "Дракончик",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Сів дракончик на балкончик.",
    instruction: "Читайте весело, без страшного тону. Це смішний дракончик для гри.",
    lines: [
      "Сів дракончик на балкончик,",
      "З'їв фіранку і вазончик.",
      "Ми дракона не злякались,",
      "Тільки дзвінко засміялись.",
      "Заходь мерщій у хатку,",
      "Будем їсти мармеладку."
    ]
  },
  {
    id: "animals-butterfly",
    title: "Метелик",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Я метелика впіймаю.",
    instruction: "Під час гри можна махати ручками, ніби метелик летить.",
    lines: [
      "Я біжу, біжу по гаю,",
      "Я метелика впіймаю.",
      "А метелик не схотів,",
      "Геть від мене полетів."
    ]
  },
  {
    id: "animals-woodpecker",
    title: "Дятел",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Тук-тук-тук.",
    instruction: "На “тук-тук-тук” постукайте пальчиками по столу або долоньці.",
    lines: [
      "Дятел, дятел конопатий!",
      "Ти кому будуєш хату?",
      "Це не хата, тук-тук-тук,",
      "Під корою сидить жук.",
      "Цей шкідливий короїд",
      "Попадеться на обід."
    ]
  },
  {
    id: "animals-squirrel",
    title: "Білочка",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Де ти, білочко, живеш?",
    instruction: "Читайте як діалог: дорослий питає, дитина може повторювати “горішки”, “шишки”.",
    lines: [
      "Де ти, білочко, живеш,",
      "Що ти, білочко, гризеш?",
      "У зеленому ліску",
      "Я гризу горішки,",
      "І гриби, і шишки."
    ]
  },
  {
    id: "animals-three-bears",
    title: "Три ведмеді",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "По малину почвалали.",
    instruction: "Можна показувати великого тата, маму і маленького ведмедика різними голосами.",
    lines: [
      "Три ведмеді зранку встали,",
      "По малину почвалали,",
      "Перший йде ведмідь — то тато,",
      "Він великий і кошлатий.",
      "Слідом матінка спішить,",
      "А за нею син біжить."
    ]
  },
  {
    id: "animals-squirrel-cry",
    title: "Білочка сміється",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Більше ми не плачемо.",
    instruction: "Коли дитина плаче. Промовляйте лагідно й запропонуйте “поскакати” разом з білочкою.",
    lines: [
      "Білка скочила на гілку,",
      "Розгойдала білка гілку,",
      "Глянь, руденька білочка",
      "Скочила на гілочку.",
      "І ми з нею скачемо,",
      "Більше ми не плачемо."
    ]
  },
  {
    id: "animals-mouse-book",
    title: "Мишка і книжка",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Я найрозумніша.",
    instruction: "Короткий жартівливий віршик для гри з книжкою.",
    lines: [
      "З'їла мишка",
      "Цілу книжку,",
      "І сказала миша:",
      "“Я — найрозумніша!”"
    ]
  },
  {
    id: "animals-mouse-drawing",
    title: "Малювала мишка",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Смачний малюнок з'їла.",
    instruction: "Підійде після малювання або гри з олівцями.",
    lines: [
      "Малювала зранку мишка",
      "Три цукерки, два горішка.",
      "А в обід в куточку сіла",
      "І смачний малюнок з'їла."
    ]
  },
  {
    id: "animals-elephant-tie",
    title: "Слон і краватка",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Хоче бути як татко.",
    instruction: "Коли дитина не хоче одягатися, покажіть, як слоненя приміряє краватку.",
    lines: [
      "Слон купив собі краватку",
      "У велику жовту цятку.",
      "А маленьке слоненя",
      "Приміря її щодня.",
      "Хоче бути слонятко",
      "Ну точнісінько як татко."
    ]
  },
  {
    id: "animals-fly",
    title: "Муха-набридуха",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Жу-жу-жу.",
    instruction: "Можна читати, коли говорите про чисті ручки й чому треба митися.",
    lines: [
      "Хто не знає мухи?",
      "Мухи-набридухи?",
      "Я на місці не сиджу,",
      "Жу-жу-жу-жу.",
      "Там де бруд — я вже тут."
    ]
  },
  {
    id: "animals-chicken",
    title: "Курочка",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Ко-ко-ко.",
    instruction: "На “ко-ко-ко” можна сказати голосом курочки й покликати курчат.",
    lines: [
      "Пішла курочка на грядку,",
      "Ко-ко-ко — кричить курчаткам,",
      "Я знайшла вам черв'ячка",
      "І зеленого жучка.",
      "На обід біжать до мами",
      "Дітлахи її слухняні."
    ]
  },
  {
    id: "animals-hedgehog",
    title: "Зайчик і їжачок",
    category: "Тваринки",
    categoryId: "animals",
    image: null,
    audio: null,
    preview: "Скільки в тебе голочок?",
    instruction: "Читайте як діалог. На “вколов” можна здивовано сказати “ой!”.",
    lines: [
      "Стрівся зайцю їжачок.",
      "— Скільки в тебе голочок?",
      "Він колючого пита.",
      "— Кажуть звірі, більше ста.",
      "Лиш тоді повірив зайчик,",
      "Як вколов об голку пальчик."
    ]
  }
];

const extraStories = [
  {
    id: "kryvenka-kachechka",
    title: "Кривенька качечка",
    duration: "4 хв",
    image: "story-kryvenka-kachechka.png",
    pages: [
      { text: "Жили собі дідусь і бабуся. Одного дня знайшли вони біля лісового озера маленьку качечку з пораненою ніжкою й принесли її додому.", tip: "Покажіть, як обережно тримати маленьку пташку в долоньках." },
      { text: "Дідусь зробив качечці м'яке гніздечко, а бабуся годувала її зернятками. Незабаром качечка зміцніла й весело ходила подвір'ям.", tip: "Покажіть пальчиками, як качечка дзьобає зернятка." },
      { text: "Коли дідусь із бабусею виходили з дому, качечка перетворювалася на добру дівчину й допомагала їм: прибирала та пекла духмяний хліб.", tip: "Запитайте: «Як ти любиш допомагати вдома?»" },
      { text: "Одного дня качечка зустріла свою зграю. Вона подякувала дідусеві й бабусі за турботу та полетіла над озером, але часто поверталася до них у гості.", tip: "Помахайте руками, наче качечка крилами." }
    ]
  },
  {
    id: "pivnyk-mysheniata",
    title: "Півник і двоє мишенят",
    duration: "4 хв",
    image: "story-pivnyk-mysheniata.png",
    pages: [
      { text: "Жили разом працьовитий Півник і двоє веселих мишенят — Круть та Верть. Якось Півник знайшов на подвір'ї золотий колосок.", tip: "Попросіть дитину показати колосок і сказати: «Ко-ко-ко»." },
      { text: "Півник обмолотив колосок, змолов зерно й замісив тісто. А мишенята весь цей час гралися та відповідали: «Не ми!»", tip: "Читайте слова мишенят тоненькими веселими голосами." },
      { text: "Незабаром із печі запахло рум'яними пиріжками. Мишенята прибігли до столу, але зрозуміли, що зовсім не допомагали Півникові.", tip: "Поговоріть про те, що спочатку допомагаємо, а потім відпочиваємо." },
      { text: "Круть і Верть вибачилися та накрили на стіл. Півник поділився пиріжками, і відтоді всі троє працювали й відпочивали разом.", tip: "Назвіть разом три прості домашні справи." }
    ]
  },
  {
    id: "tsap-baran",
    title: "Цап і Баран",
    duration: "4 хв",
    image: "story-tsap-baran.png",
    pages: [
      { text: "Жили в одному дворі нерозлучні друзі — сміливий Цап і спокійний Баран. Вони завжди підтримували один одного.", tip: "Покажіть пальчиками ріжки Цапа, а руками — великі роги Барана." },
      { text: "Одного дня друзі взяли торбинку з хлібом і вирушили в мандрівку. Дорога привела їх до зеленого лісу.", tip: "Потупайте ніжками, наче йдете лісовою стежкою." },
      { text: "На галявині вони зустріли Вовчика, який заблукав і змерз. Цап і Баран не злякалися: запросили його до маленького вогнища й пригостили хлібом.", tip: "Потріть долоньки, наче грієте їх біля вогника." },
      { text: "Вовчик подякував і показав друзям дорогу додому. Так Цап і Баран переконалися: доброта та дружба допомагають бути хоробрими.", tip: "Запитайте: «Хто твій друг і що ви любите робити разом?»" }
    ]
  },
  {
    id: "lysychka-vovk",
    title: "Лисичка-сестричка і Вовк-панібрат",
    duration: "5 хв",
    image: "story-lysychka-vovk.png",
    pages: [
      { text: "Жили в лісі хитра Лисичка-сестричка та довірливий Вовк-панібрат. Лисичка часто вигадувала жарти, а Вовк вірив кожному її слову.", tip: "Покажіть хитру усмішку Лисички та здивоване личко Вовчика." },
      { text: "Якось Лисичка знайшла кошик риби й вирішила залишити все собі. Вовкові вона сказала, що рибу можна легко наловити біля замерзлого ставка.", tip: "Порахуйте рибок уявного кошика: одна, дві, три." },
      { text: "Вовк довго сидів біля ставка, але нічого не впіймав. Він зрозумів, що Лисичка його обдурила, і дуже засмутився.", tip: "Запитайте: «Чому важливо говорити друзям правду?»" },
      { text: "Лисичці стало соромно. Вона вибачилася, поділилася рибою й пообіцяла більше не хитрувати з друзями. Вони помирилися та разом повечеряли.", tip: "Скажіть разом: «Вибач, я більше так не буду»." }
    ]
  },
  {
    id: "farbovanyi-lys",
    title: "Фарбований Лис",
    kind: "Казка Івана Франка",
    duration: "5 хв",
    image: "story-farbovanyi-lys.png",
    pages: [
      { text: "Жив у лісі Лис Микита. Він дуже пишався своєю хитрістю й одного дня забіг до міста, де випадково впав у діжку із синьою фарбою.", tip: "Знайдіть на картинці синій колір." },
      { text: "Повернувся Лис до лісу — а звірі його не впізнали. Микита назвався дивовижним синім царем, і всі почали слухати його накази.", tip: "Покажіть здивовані обличчя лісових звірят." },
      { text: "Та одного вечора Лис почув знайому пісню лисичок і сам радісно заспівав. Звірі відразу впізнали його голос.", tip: "Поговоріть про те, що голос і добрі вчинки важливіші за незвичайний вигляд." },
      { text: "Микита зізнався у своїй вигадці й вибачився. Звірі пробачили його, але попросили завжди залишатися собою та говорити правду.", tip: "Скажіть дитині: «Ти чудова така, як є»." }
    ]
  },
  {
    id: "kotyhoroshko",
    title: "Котигорошко",
    duration: "6 хв",
    image: "story-kotyhoroshko.png",
    pages: [
      { text: "Покотилася одного дня зелена горошина по подвір'ю. З неї виріс хлопчик Котигорошко — маленький на зріст, але добрий і напрочуд сильний.", tip: "Покажіть маленьку горошинку двома пальчиками." },
      { text: "Котигорошко дізнався, що його брати й сестра заблукали далеко від дому. Він вирушив на пошуки та дорогою допоміг кільком мандрівникам.", tip: "Проведіть пальчиком уявну доріжку." },
      { text: "Разом із новими друзями хлопчик знайшов рідних. Він використав свою силу не для хвастощів, а щоб відчинити важкі ворота й показати всім шлях додому.", tip: "Запитайте: «Для яких добрих справ потрібна сила?»" },
      { text: "Уся родина щасливо повернулася. Котигорошко зрозумів: справжня сила живе в доброму серці та вмінні допомагати іншим.", tip: "Покладіть долоньку на серце й скажіть: «Добре серце»." }
    ]
  },
  {
    id: "letiuchyi-korabel",
    title: "Летючий корабель",
    duration: "6 хв",
    image: "story-letiuchyi-korabel.png",
    pages: [
      { text: "Жив собі добрий хлопець, який мріяв побачити світ. Одного дня старенький майстер допоміг йому збудувати дивовижний дерев'яний корабель із крилами.", tip: "Розведіть руки в боки, наче крила корабля." },
      { text: "Корабель піднявся над селом і поплив поміж білих хмар. Дорогою хлопець зустрів дивовижних людей, кожен із яких мав особливий талант.", tip: "Запитайте: «Що ти вмієш робити найкраще?»" },
      { text: "Мандрівники допомагали одне одному: хтось бачив далеко, хтось швидко бігав, а хтось умів розсмішити всіх доброю піснею.", tip: "Разом заспівайте коротку веселу пісеньку." },
      { text: "Завдяки дружбі корабель дістався далекого міста. Хлопець зрозумів: коли кожен ділиться своїм умінням, разом можна здійснити велику мрію.", tip: "Похваліть одну особливу здібність дитини." }
    ]
  },
  {
    id: "mudra-divchyna",
    title: "Мудра дівчина",
    duration: "5 хв",
    image: "story-mudra-divchyna.png",
    pages: [
      { text: "Жила в селі добра й кмітлива дівчина Маруся. Вона любила загадки, уважно слухала людей і завжди знаходила справедливі відповіді.", tip: "Скажіть: «Кмітлива — це та, що добре думає»." },
      { text: "Одного дня сільський суддя дав Марусі складне завдання: прийти до нього не пішки й не верхи, не з подарунком і не без подарунка.", tip: "Зробіть задумливе обличчя й торкніться пальчиком скроні." },
      { text: "Маруся приїхала на маленькому козлику, однією ногою торкаючись землі, а в руках принесла пташку, яка одразу полетіла. Усі здивувалися її винахідливості.", tip: "Запитайте: «Любиш відгадувати загадки?»" },
      { text: "Суддя похвалив Марусю й відтоді радився з нею у важливих справах. Її розум і добре серце допомагали людям миритися.", tip: "Поясніть: мудрість — це не лише знати, а й чинити по-доброму." }
    ]
  },
  {
    id: "kyrylo-kozhumiaka",
    title: "Кирило Кожум'яка",
    kind: "Українська легенда",
    duration: "6 хв",
    image: "story-kyrylo-kozhumiaka.png",
    pages: [
      { text: "У давньому Києві жив майстер Кирило Кожум'яка. Він працював зі шкірою, був дуже сильним, але найбільше любив мир і спокій.", tip: "Покажіть сильні ручки й стисніть кулачки." },
      { text: "Одного дня місту почав заважати великий сердитий Змій. Люди попросили Кирила допомогти, і майстер погодився захистити їх.", tip: "Поясніть, що захищати — означає допомагати тому, кому важко." },
      { text: "Кирило показав Змієві свою силу й запропонував не сваритися, а разом провести межу між полями. Змій утомився та погодився жити мирно далеко від міста.", tip: "Проведіть пальчиком довгу лінію — межу між полями." },
      { text: "Кияни подякували Кирилові. А він повернувся до майстерні, бо знав: найсильніший той, хто може встановити мир.", tip: "Скажіть разом: «Силу використовуємо для добра»." }
    ]
  },
  {
    id: "yaitse-raitse",
    title: "Яйце-райце",
    duration: "6 хв",
    image: "story-yaitse-raitse.png",
    pages: [
      { text: "Одного разу добрий парубок допоміг великій Орлиці. На знак подяки вона подарувала йому чарівне Яйце-райце й попросила відкрити його лише вдома.", tip: "Покажіть руками велике чарівне яйце." },
      { text: "Дорогою хлопець почув усередині тиху музику й не втримався — відкрив яйце на зеленій галявині. З нього з'явилися хатинка, сад і безліч добрих тваринок.", tip: "Порахуйте, скільки різних тваринок могло з'явитися." },
      { text: "Хлопець не знав, як усе повернути назад. На допомогу прилетіла Орлиця й навчила його лагідно попросити чарівний світ сховатися до яйця.", tip: "Потренуйте чарівне слово: «Будь ласка»." },
      { text: "Удома хлопець відкрив Яйце-райце разом із родиною. Чарівний сад розквітнув біля їхньої хати, і всі дбайливо доглядали за ним.", tip: "Запитайте: «Що потрібно рослинам, щоб рости?»" }
    ]
  }
];

const poemCategories = [
  {
    id: "bath",
    title: "Купання",
    lead: "Віршики для водички, піни й рушничка.",
    image: "poem-category-bath.png"
  },
  {
    id: "sleep",
    title: "Сон",
    lead: "Тихі рими перед сном і відпочинком.",
    image: "poem-category-sleep.png"
  },
  {
    id: "food",
    title: "Їжа",
    lead: "Забавлянки для кашки, ложечки й ням-ням.",
    image: "poem-category-food.png"
  },
  {
    id: "movement",
    title: "Руханки",
    lead: "Плескати, тупати, гойдатися і гратися.",
    image: "poem-category-movement.png"
  },
  {
    id: "animals",
    title: "Тваринки",
    lead: "Котики, зайчики й інші знайомі друзі.",
    image: "poem-category-animals.png"
  }
];

const ageProfiles = {
  baby: {
    label: "6–12 міс",
    mode: "Хто це?",
    type: "single",
    choices: 1,
    prompt: (word) => "Скажи, хто це",
    parent: (word) => `Покажіть картинку й запитайте малюка: хто це? Якщо важко, скажіть самі: це ${word.name}.`,
    success: (word) => `Це ${word.name}. ${word.sound}`
  },
  early: {
    label: "12–18 міс",
    mode: "Де?",
    type: "pick",
    choices: 2,
    prompt: (word) => `Де ${word.name}?`,
    parent: (word) => `Попросіть показати пальчиком. Якщо важко, назвіть ${word.name} самі.`,
    success: (word) => `Так, це ${word.name}!`
  },
  talker: {
    label: "18–24 міс",
    mode: "Покажи",
    type: "pick",
    choices: 4,
    prompt: (word) => `Покажи ${word.ask}`,
    parent: (word) => word.parent,
    success: (word) => `Правильно! ${word.sound}`
  },
  curious: {
    label: "24–36 міс",
    mode: "Так чи ні",
    type: "mixed",
    choices: 4,
    prompt: (word, shownWord, isYesNo) =>
      isYesNo ? `Це ${shownWord.name}?` : word.id === "bee" ? `Хто дзижчить: ${word.sound}?` : `Хто каже ${word.sound}?`,
    parent: (word) => `Після відповіді запитайте: що робить ${word.name}?`,
    success: (word) => `Супер! Це ${word.name}`
  }
};

const voiceFiles = {
  where: {
    cat: "where-cat.mp3",
    dog: "where-dog.mp3",
    fish: "where-fish.mp3",
    bee: "where-bee.mp3"
  },
  show: {
    cat: "show-cat.mp3",
    dog: "show-dog.mp3",
    fish: "show-fish.mp3",
    bee: "show-bee.mp3"
  },
  whoSays: {
    cat: "who-says-cat.mp3",
    dog: "who-says-dog.mp3",
    fish: "who-says-fish.mp3",
    bee: "who-says-bee.mp3"
  },
  isThis: {
    cat: "is-cat.mp3",
    dog: "is-dog.mp3",
    fish: "is-fish.mp3",
    bee: "is-bee.mp3"
  },
  super: {
    cat: "super-cat.mp3",
    dog: "super-dog.mp3",
    fish: "super-fish.mp3",
    bee: "super-bee.mp3"
  }
};

const stories = [
  {
    id: "kolobok",
    title: "Колобок",
    duration: "4 хв",
    image: "story-kolobok-v2.png",
    pages: [
    {
      text: "Жили собі дід та баба. Якось дід попросив: «Спечи мені, бабусю, колобка». Бабуся замісила тісто, спекла кругленького рум'яного Колобка й поклала його на вікно вистигати.",
      tip: "Покажіть дитині, який Колобок круглий, і намалюйте коло пальчиком у повітрі."
    },
    {
      text: "Набридло Колобкові лежати. Стрибнув він із вікна та й покотився стежкою: повз хату, через подвір'я — просто до зеленого лісу.",
      tip: "Проведіть пальчиком по стежці та скажіть разом: «Котився-котився»."
    },
    {
      text: "Назустріч Колобкові — Зайчик. «Колобку, Колобку, я тебе з'їм!» А Колобок заспівав веселу пісеньку та покотився далі. Потім зустрів Вовчика й Ведмедя — і від них теж утік.",
      tip: "Прочитайте слова Зайчика тоненьким голосом, а Ведмедя — низьким."
    },
    {
      text: "Аж ось зустрілася Колобкові хитра Лисичка. Вона лагідно похвалила його пісеньку й попросила підкотитися ближче. Колобок повірив їй — і Лисичка його з'їла.",
      tip: "Запитайте: «Чи варто підходити близько до незнайомців?» Поясніть простими словами."
    },
    {
      text: "Дідусь і бабуся чекали на Колобка та дуже сумували. От і казочці кінець. А ми пам'ятатимемо: не можна тікати з дому й довіряти незнайомцям.",
      tip: "Обійміть малюка й разом попрощайтеся з казкою: «На добраніч, Колобку!»"
    }
    ]
  },
  {
    id: "rukavychka",
    title: "Рукавичка",
    duration: "4 хв",
    image: "story-rukavychka.png",
    pages: [
      { text: "Ішов дідусь зимовим лісом та й загубив теплу рукавичку. Лежить вона на снігу — м'якенька, затишна, зовсім порожня.", tip: "Покажіть, як холодно взимку: обійміть себе руками й скажіть «бр-р-р»." },
      { text: "Прибігла Мишка: «Хто в рукавичці живе?» Ніхто не відповів — і оселилася вона там. Потім прийшли Жабка, Зайчик та Лисичка. Усім знайшлося місце.", tip: "Називайте звірят і попросіть дитину показати кожного на картинці." },
      { text: "Згодом попросилися Вовчик і Ведмідь. Стало тісненько, зате тепло й весело. Звірята посунулися та дружно сиділи разом.", tip: "Скажіть разом: «Посунься, будь ласка» — це гарна фраза для спільної гри." },
      { text: "Повернувся дідусь зі своїм песиком. Звірята вибігли в ліс, а дідусь знайшов рукавичку. Так усі дізналися: коли ділишся теплом, його вистачає кожному.", tip: "Запитайте: «З ким ти любиш ділитися іграшками?»" }
    ]
  },
  {
    id: "ripka",
    title: "Ріпка",
    duration: "3 хв",
    image: "story-ripka.png",
    pages: [
      { text: "Посадив дідусь у городі маленьку ріпку. Поливав її, доглядав — і виросла ріпка велика-превелика.", tip: "Покажіть руками: спочатку маленька ріпка, а потім — величезна." },
      { text: "Потягнув дід ріпку: тягне-потягне, а витягнути не може. Покликав бабусю, потім онучку. Тягнуть разом — не виходить.", tip: "Пограйте в «тягнемо ріпку»: повільно нахиляйтеся назад разом із дитиною." },
      { text: "Покликали песика, котика й маленьку мишку. Стали всі один за одним: мишка за котика, котик за песика — і дружно потягнули.", tip: "Перелічіть усіх героїв від найбільшого до найменшого." },
      { text: "Раз, два, три — витягли ріпку! Зварили смачну вечерю й подякували маленькій мишці. Навіть найменший може дуже допомогти.", tip: "Похваліть малюка за те, як він допомагає вдома." }
    ]
  },
  {
    id: "kurochka-ryaba",
    title: "Курочка Ряба",
    duration: "3 хв",
    image: "story-kurochka-ryaba.png",
    pages: [
      { text: "Жили собі дід та баба, а з ними — добра Курочка Ряба. Одного ранку знесла вона незвичайне яєчко: не просте, а золоте.", tip: "Попросіть дитину показати кругле яєчко та золотий колір." },
      { text: "Дід яєчко легенько стукав — не розбив. Баба стукала — теж не розбила. Поклали вони його на стіл і стали милуватися.", tip: "Постукайте пальчиком по долоньці: тихо-тихо, без сили." },
      { text: "Пробігала маленька мишка, хвостиком махнула — яєчко впало й розбилося. Засмутилися дід та баба, а мишка тихенько попросила пробачення.", tip: "Покажіть сумне личко, а потім скажіть разом: «Пробач»." },
      { text: "Курочка Ряба заспокоїла їх: «Не плачте, я знесу вам просте яєчко». Незабаром усі вже разом снідали й усміхалися.", tip: "Запитайте: «Як можна заспокоїти того, хто сумує?»" }
    ]
  },
  {
    id: "koza-dereza",
    title: "Коза-Дереза",
    duration: "4 хв",
    image: "story-koza-dereza.png",
    pages: [
      { text: "Жила в дідуся біленька Коза-Дереза. Усі її годували й доглядали, але вона любила вередувати та казала, ніби ніхто про неї не дбає.", tip: "Покажіть ріжки пальчиками й скажіть: «Ме-е-е»." },
      { text: "Якось Коза втекла до лісу й зайняла хатинку Зайчика. Зайчик чемно попросив її вийти, та Коза лише тупнула ніжкою.", tip: "Прочитайте прохання Зайчика лагідним голосом: «Вийди, будь ласка»." },
      { text: "Прийшли друзі Зайчика — Вовчик і Ведмедик. Вони не сварилися, а спокійно пояснили Козі, що чужу домівку не можна забирати.", tip: "Поясніть: якщо хочеш погратися чужою річчю, треба спочатку запитати." },
      { text: "Козі стало соромно. Вона вибачилася, повернула хатинку Зайчикові й запросила всіх на чай. Відтоді Коза говорила правду та була доброю сусідкою.", tip: "Скажіть разом: «Вибач» і «Дякую»." }
    ]
  },
  {
    id: "kotyk-pivnyk",
    title: "Котик і Півник",
    duration: "5 хв",
    image: "story-kotyk-pivnyk.png",
    pages: [
      { text: "Жили собі друзі — Котик і Півник. Котик ішов по дрова й просив Півника нікому не відчиняти двері.", tip: "Поговоріть про просте правило: двері незнайомим не відчиняємо." },
      { text: "Прийшла хитра Лисичка та заспівала гарну пісеньку. Півник визирнув у віконце, і Лисичка покликала його із собою до лісу.", tip: "Прочитайте пісеньку Лисички тихим співучим голосом." },
      { text: "Півник голосно покликав Котика. Котик почув друга, швидко прибіг і забрав його додому. Лисичка зрозуміла, що друзів не можна розлучати.", tip: "Разом голосно покличте: «Котику, допоможи!»" },
      { text: "Півник подякував Котикові й пообіцяв бути обережним. Вони міцно обійнялися та разом приготували вечерю.", tip: "Запитайте: «Хто допомагає тобі, коли потрібно?»" }
    ]
  },
  {
    id: "pan-kotskyi",
    title: "Пан Коцький",
    duration: "5 хв",
    image: "story-pan-kotskyi.png",
    pages: [
      { text: "Жив собі поважний сірий Кіт. Якось пішов він до лісу й зустрів Лисичку. Вона назвала нового друга Паном Коцьким.", tip: "Погладьте уявного котика й скажіть: «Мур-мур»." },
      { text: "Лисичка розповіла лісовим звірям, що Пан Коцький дуже важливий гість. Вовчик, Ведмідь, Кабан і Зайчик вирішили запросити його на обід.", tip: "Назвіть усіх звірів і повторіть їхні голоси." },
      { text: "За столом Кіт побачив, як заворушився листочок, і стрибнув за ним. Звірі здивувалися його спритності, а потім усі розсміялися.", tip: "Покажіть пальчиками швидкий котячий стрибок." },
      { text: "Пан Коцький виявився не страшним, а веселим і чемним котиком. Відтоді звірі часто збиралися разом на лісові гостини.", tip: "Запитайте: «Що ми кажемо гостям?» — «Ласкаво просимо!»" }
    ]
  },
  {
    id: "lysychka-zhuravel",
    title: "Лисичка та Журавель",
    duration: "4 хв",
    image: "story-lysychka-zhuravel.png",
    pages: [
      { text: "Подружилися Лисичка та Журавель. Одного дня Лисичка запросила друга в гості й подала кашу на широкій пласкій тарілці.", tip: "Покажіть руками широку тарілку." },
      { text: "Лисичка легко їла кашу, а Журавель своїм довгим дзьобом не зміг скуштувати ані ложечки. Він подякував і запросив Лисичку до себе.", tip: "Покажіть довгий дзьоб двома долоньками." },
      { text: "Журавель налив частування у високе вузьке горнятко. Тепер він їв легко, а Лисичка не могла дістати до страви.", tip: "Порівняйте: тарілка широка, а горнятко вузьке." },
      { text: "Друзі зрозуміли свою помилку, вибачилися й наступного разу поставили зручний посуд для кожного. Відтоді вони завжди думали одне про одного.", tip: "Запитайте: «Як подбати, щоб гостю було зручно?»" }
    ]
  },
  {
    id: "ivasyk-telesyk",
    title: "Івасик-Телесик",
    duration: "5 хв",
    image: "story-ivasyk-telesyk.png",
    pages: [
      { text: "Жили дідусь і бабуся, а з ними — хлопчик Івасик-Телесик. Дідусь зробив йому маленький човник, і хлопчик щодня рибалив неподалік від берега.", tip: "Погойдайте долоньку, наче човник на хвилях." },
      { text: "Коли час було обідати, мама кликала Івасика знайомою пісенькою. Він упізнавав її голос і підпливав до берега.", tip: "Назвіть дитину на ім'я так, як кличете її додому." },
      { text: "Одного разу незнайомка спробувала покликати його чужим голосом. Івасик не підплив, бо пам'ятав: слухати треба лише знайомий мамин голос.", tip: "Нагадайте: з незнайомими людьми нікуди не йдемо." },
      { text: "Білі гуси-лебеді провели човник Івасика додому. Дідусь і бабуся зраділи, обійняли хлопчика й похвалили за обережність.", tip: "Помахайте руками, як крилами лебедя." }
    ]
  },
  {
    id: "solomianyi-bychok",
    title: "Солом'яний бичок",
    duration: "5 хв",
    image: "story-solomianyi-bychok.png",
    pages: [
      { text: "Змайстрував дідусь для бабусі маленького бичка із соломи, а бочок змастив блискучою смолою. Бичок вийшов кумедний і дуже гарний.", tip: "Покажіть пальчиками ріжки та скажіть: «Му-у»." },
      { text: "Пішла бабуся з бичком на лужок. Прибіг Зайчик, торкнувся блискучого бочка й прилип лапкою. Потім так само здивувалися Вовчик і Ведмідь.", tip: "Пограйте долоньками: торкнулися — і «прилипли»." },
      { text: "Дідусь допоміг звірятам звільнитися. Вони подякували й пообіцяли принести гостинці: мед, гриби та запашні ягоди.", tip: "Попросіть дитину назвати улюблену ягоду." },
      { text: "Наступного ранку звірята виконали обіцянку. Усі сіли разом пити чай, а Солом'яний бичок став улюбленим другом лісових мешканців.", tip: "Поговоріть про те, чому важливо виконувати обіцянки." }
    ]
  },
  ...extraStories
];

const state = {
  childProfile: null,
  childProfiles: [],
  onboardingMode: "first",
  onboardingReturn: "today",
  age: null,
  gameId: "animals",
  gameItems: words,
  step: 0,
  sound: true,
  audio: null,
  transitioning: false,
  promptPlayed: false,
  deck: [],
  sleepSound: sleepSounds[0],
  sleepDuration: 10,
  sleepRemaining: 10 * 60,
  sleepTimer: null,
  sleepAudio: null,
  sleepWakeLock: null,
  bubbleTimer: null,
  bubblesPopped: 0,
  poemFilter: null,
  selectedPoem: poems[0],
  favoritePoems: new Set(JSON.parse(localStorage.getItem("favoritePoems") || "[]")),
  selectedStory: stories[0],
  storyPage: 0,
  familyStep: 0,
  familyDeck: [],
  emotionStep: 0,
  emotionDeck: [],
  dressCharacterId: "baby",
  dressWornByCharacter: {
    baby: new Set(),
    doll: new Set(),
    bear: new Set()
  },
  task: null
};

const $ = (selector) => document.querySelector(selector);
const asset = (name) => `./assets/images/${name}?v=96`;
const audioAsset = (name) => `./assets/audio/uk/${name}`;
const sfxAsset = (name) => `./assets/audio/sfx/${name}`;
const sleepAsset = (name) => `./assets/audio/sleep/${name}`;
const poemAudioAsset = (name) => `./assets/audio/poems/${name}`;
const faceAudioAsset = (name) => `./assets/audio/face/${name}`;
const bodyAudioAsset = (name) => `./assets/audio/body/${name}`;
const objectAudioAsset = (name) => `./assets/audio/objects/${name}?v=84`;
const colorAudioAsset = (name) => `./assets/audio/colors/${name}?v=85`;
const familyAudioAsset = (name) => `./assets/audio/families/${name}?v=88`;
const emotionAudioAsset = (name) => `./assets/audio/emotions/${name}?v=86`;
const dressAudioAsset = (name) => `./assets/audio/dress-up/${name}?v=86`;
const poemIds = new Set(poems.map((poem) => poem.id));

state.favoritePoems = new Set([...state.favoritePoems].filter((poemId) => poemIds.has(poemId)));
localStorage.setItem("favoritePoems", JSON.stringify([...state.favoritePoems]));

window.owlJoyAccount?.ready.then((account) => {
  if (account.status === "authenticated") {
    state.favoritePoems = new Set(account.favoritePoemIds.filter((poemId) => poemIds.has(poemId)));
    localStorage.setItem("favoritePoems", JSON.stringify([...state.favoritePoems]));
  }
  initializeChildProfile(account);
}).catch(() => showOnboarding());

function ageInMonths(birthDate) {
  const birth = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months -= 1;
  return months;
}

function pluralizeUkrainian(value, one, few, many) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function formatChildAge(birthDate) {
  const months = ageInMonths(birthDate);
  if (months === null || months < 0) return "";
  if (months < 24) return `${months} ${pluralizeUkrainian(months, "місяць", "місяці", "місяців")}`;

  const years = Math.floor(months / 12);
  const rest = months % 12;
  const yearsText = `${years} ${pluralizeUkrainian(years, "рік", "роки", "років")}`;
  if (!rest) return yearsText;
  return `${yearsText} ${rest} ${pluralizeUkrainian(rest, "місяць", "місяці", "місяців")}`;
}

function ageProfileKeyForBirthDate(birthDate) {
  const months = ageInMonths(birthDate);
  if (months === null) return null;
  if (months < 12) return "baby";
  if (months < 18) return "early";
  if (months < 24) return "talker";
  return "curious";
}

function applyChildProfile(profile) {
  if (!profile) return;
  state.childProfile = profile;
  localStorage.setItem("owljoyActiveChildId", profile.id);
  const ageLabel = formatChildAge(profile.birth_date);
  $("#homeChildLabel").textContent = `${profile.nickname}${ageLabel ? ` · ${ageLabel}` : ""}`;
  $("#homeChildLead").textContent = "Ігри, казки, сон, прикорм і турбота відповідно до віку малюка.";
  renderChildSwitcher();
}

function resetOnboardingForm() {
  $("#onboardingForm").reset();
  $("#childBirthDate").value = "";
  refreshBirthDays();
  $("#onboardingError").hidden = true;
}

function showOnboarding(mode = "first") {
  setupBirthDatePicker();
  state.onboardingMode = mode;
  resetOnboardingForm();
  closeChildSwitcher();
  const addingChild = mode === "add";
  $("#onboardingTitle").textContent = addingChild ? "Додайте ще одну дитину" : "Розкажіть про малюка";
  $("#onboardingLead").textContent = addingChild
    ? "Створимо окремий профіль для ігор, казок, сну, прикорму й нагадувань."
    : "Ігри, казки, сон, прикорм і нагадування про ліки — відповідно до віку малюка.";
  $("#onboardingSubmit").textContent = addingChild ? "Додати дитину" : "Почати";
  $("#onboardingCancel").hidden = !addingChild;
  $("#bottomNav").hidden = true;
  hideContentScreens();
  $("#onboardingScreen").hidden = false;
  updateTopBack();
}

function renderChildSwitcher() {
  [$("#childProfileList"), $("#profileHubChildList")].filter(Boolean).forEach((list) => {
  list.innerHTML = "";
  state.childProfiles.forEach((profile) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "child-profile-option";
    if (profile.id === state.childProfile?.id) button.classList.add("active");
    button.dataset.childId = profile.id;

    const avatar = document.createElement("span");
    avatar.className = "child-profile-avatar";
    avatar.textContent = (profile.nickname || "М").trim().charAt(0).toUpperCase();
    const copy = document.createElement("span");
    copy.className = "child-profile-copy";
    const name = document.createElement("strong");
    name.textContent = profile.nickname;
    const age = document.createElement("small");
    age.textContent = formatChildAge(profile.birth_date) || "Вік не вказано";
    copy.append(name, age);
    const check = document.createElement("b");
    check.textContent = profile.id === state.childProfile?.id ? "✓" : "›";
    button.append(avatar, copy, check);
    list.append(button);
  });
  });
  document.querySelectorAll("[data-action='addChild']").forEach((button) => {
    button.hidden = state.childProfiles.length >= 6;
  });
}

function openChildSwitcher() {
  renderChildSwitcher();
  setMainTab("profile");
  $("#childSwitcherOverlay").hidden = false;
}

function closeChildSwitcher() {
  const overlay = $("#childSwitcherOverlay");
  if (overlay) overlay.hidden = true;
  if (!$("#homeScreen").hidden) setMainTab("today");
}

function setMainTab(tabName) {
  document.querySelectorAll("[data-main-tab]").forEach((button) => {
    const active = button.dataset.mainTab === tabName;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function showMainNavigation(tabName) {
  $("#bottomNav").hidden = false;
  setMainTab(tabName);
}

function openDevelopmentTab() {
  hideContentScreens();
  $("#developmentHubScreen").hidden = false;
  showMainNavigation("development");
  updateTopBack();
}

function openCareTab() {
  hideContentScreens();
  $("#careHubScreen").hidden = false;
  showMainNavigation("care");
  updateTopBack();
}

function openProfileTab() {
  hideContentScreens();
  renderChildSwitcher();
  $("#profileHubScreen").hidden = false;
  showMainNavigation("profile");
  updateTopBack();
}

function selectChildProfile(childId) {
  const profile = state.childProfiles.find((item) => item.id === childId);
  if (!profile) return;
  applyChildProfile(profile);
  if (window.owlJoyAccount) window.owlJoyAccount.currentChild = profile;
  closeChildSwitcher();
  showToast(`Обрано профіль: ${profile.nickname}`);
}

const ukrainianMonths = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

let birthDatePickerReady = false;

function refreshBirthDays(preferredDay = $("#childBirthDay").value) {
  const daySelect = $("#childBirthDay");
  const month = Number($("#childBirthMonth").value);
  const year = Number($("#childBirthYear").value);
  const today = new Date();
  let dayCount = 31;

  if (month && year) {
    dayCount = new Date(year, month, 0).getDate();
    if (year === today.getFullYear() && month === today.getMonth() + 1) {
      dayCount = Math.min(dayCount, today.getDate());
    }
  }

  daySelect.innerHTML = '<option value="">—</option>';
  for (let day = 1; day <= dayCount; day += 1) {
    daySelect.add(new Option(String(day), String(day)));
  }
  if (preferredDay && Number(preferredDay) <= dayCount) daySelect.value = String(Number(preferredDay));
}

function syncBirthDateValue() {
  const day = Number($("#childBirthDay").value);
  const month = Number($("#childBirthMonth").value);
  const year = Number($("#childBirthYear").value);
  $("#childBirthDate").value = day && month && year
    ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    : "";

}

function setupBirthDatePicker() {
  if (birthDatePickerReady) return;
  birthDatePickerReady = true;
  const today = new Date();
  const monthSelect = $("#childBirthMonth");
  const yearSelect = $("#childBirthYear");

  ukrainianMonths.forEach((month, index) => monthSelect.add(new Option(month, String(index + 1))));
  for (let year = today.getFullYear(); year >= today.getFullYear() - 18; year -= 1) {
    yearSelect.add(new Option(String(year), String(year)));
  }
  refreshBirthDays();

  $("#childBirthDay").addEventListener("change", () => syncBirthDateValue());
  monthSelect.addEventListener("change", () => {
    refreshBirthDays();
    syncBirthDateValue();
  });
  yearSelect.addEventListener("change", () => {
    refreshBirthDays();
    syncBirthDateValue();
  });
}

function focusBirthDatePicker() {
  const firstEmpty = [$("#childBirthDay"), $("#childBirthMonth"), $("#childBirthYear")]
    .find((select) => !select.value);
  (firstEmpty || $("#childBirthDay")).focus();
}

function initializeChildProfile(account) {
  setupBirthDatePicker();
  state.childProfiles = account?.childProfiles || (account?.currentChild ? [account.currentChild] : []);
  if (!state.childProfiles.length) {
    showOnboarding();
    return;
  }

  const activeChildId = localStorage.getItem("owljoyActiveChildId");
  const activeChild = state.childProfiles.find((profile) => profile.id === activeChildId) || state.childProfiles[0];
  applyChildProfile(activeChild);
  if (window.owlJoyAccount) window.owlJoyAccount.currentChild = activeChild;
  backToHome();
}

async function saveOnboardingProfile(event) {
  event.preventDefault();
  const name = $("#childName").value.trim();
  const birthDate = $("#childBirthDate").value;
  const months = ageInMonths(birthDate);
  const error = $("#onboardingError");
  const submit = $("#onboardingSubmit");

  error.hidden = true;
  if (!name) {
    error.textContent = "Введіть ім’я або домашнє прізвисько малюка.";
    error.hidden = false;
    $("#childName").focus();
    return;
  }
  if (!birthDate || months === null || months < 0) {
    error.textContent = "Оберіть правильну дату народження.";
    error.hidden = false;
    focusBirthDatePicker();
    return;
  }
  if (months > 216) {
    error.textContent = "Перевірте дату народження малюка.";
    error.hidden = false;
    focusBirthDatePicker();
    return;
  }

  submit.disabled = true;
  submit.textContent = "Зберігаємо…";
  try {
    const addingChild = state.onboardingMode === "add";
    const profile = await window.owlJoyAccount.saveChildProfile({ nickname: name, birthDate });
    state.childProfiles = [...window.owlJoyAccount.childProfiles];
    applyChildProfile(profile);
    if (addingChild && state.onboardingReturn === "profile") openProfileTab();
    else backToHome();
  } catch (saveError) {
    console.error("OwlJoy: не вдалося зберегти профіль", saveError);
    error.textContent = "Не вдалося зберегти профіль. Перевірте інтернет і спробуйте ще раз.";
    error.hidden = false;
  } finally {
    submit.disabled = false;
    submit.textContent = state.onboardingMode === "add" ? "Додати дитину" : "Почати";
  }
}

$("#onboardingForm").addEventListener("submit", saveOnboardingProfile);

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function resetDeck() {
  state.deck = shuffle(state.gameItems);
}

function playLearningItem(item) {
  if (item?.audioKind === "color" && item?.voice) return playAudioFile(colorAudioAsset(item.voice));
  if (item?.voice) return playAudioFile(objectAudioAsset(item.voice));
  if (item?.sfx) return playAudioFile(sfxAsset(item.sfx));
  return Promise.resolve();
}

function speak(text) {
  if (!state.sound) return;

  const audioFile = state.task?.audio;
  if (audioFile) {
    if (state.audio) {
      state.audio.pause();
      state.audio.currentTime = 0;
    }
    state.audio = new Audio(audioAsset(audioFile));
    state.audio.play().catch(() => {});
  }
}

function playAudioFile(src) {
  if (!state.sound) return Promise.resolve();
  if (state.audio) {
    state.audio.pause();
    state.audio.currentTime = 0;
  }
  state.audio = new Audio(src);
  return state.audio.play().catch(() => {});
}

function playVoiceFile(fileName) {
  if (!fileName) return Promise.resolve();
  return playAudioFile(audioAsset(fileName));
}

function playWrongSound() {
  if (!state.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(220, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, context.currentTime + 0.22);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.24);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.25);
}

function playBubblePopSound() {
  if (!state.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(520, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(210, context.currentTime + 0.09);
  gain.gain.setValueAtTime(0.12, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.11);
  oscillator.addEventListener("ended", () => context.close());
}

function speakWithBrowser(text) {
  if (!state.sound) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "uk-UA";
  utterance.rate = 0.82;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function hideContentScreens() {
  stopBubbleGame();
  $("#onboardingScreen").hidden = true;
  $("#homeScreen").hidden = true;
  $("#developmentHubScreen").hidden = true;
  $("#careHubScreen").hidden = true;
  $("#profileHubScreen").hidden = true;
  $("#agePicker").hidden = true;
  $("#gamePicker").hidden = true;
  $("#gameArea").hidden = true;
  $("#bubbleGameScreen").hidden = true;
  $("#faceGameScreen").hidden = true;
  $("#bodyGameScreen").hidden = true;
  $("#familyGameScreen").hidden = true;
  $("#emotionGameScreen").hidden = true;
  $("#dressGameScreen").hidden = true;
  $("#sleepScreen").hidden = true;
  $("#sleepPlayerScreen").hidden = true;
  $("#poemCategoriesScreen").hidden = true;
  $("#poemsScreen").hidden = true;
  $("#poemDetailScreen").hidden = true;
  $("#storiesScreen").hidden = true;
  $("#storyReaderScreen").hidden = true;
}

function showStories() {
  hideContentScreens();
  $("#storiesScreen").hidden = false;
  renderStories();
  showMainNavigation("development");
  updateTopBack();
}

function renderStories() {
  const list = $("#storiesList");
  $("#storiesLead").textContent = "Слухайте разом або читайте дитині своїм голосом.";
  list.innerHTML = stories.map((story) => `
    <button class="story-card" data-story="${story.id}">
      <img src="${asset(story.image)}" alt="" />
      <span class="story-card-copy">
        <strong>${story.title}</strong>
        <span>${story.kind || "Українська народна казка"} · ${story.duration}</span>
      </span>
    </button>
  `).join("");
}

function showStory(storyId) {
  const story = stories.find((item) => item.id === storyId);
  if (!story) return;
  state.selectedStory = story;
  state.storyPage = 0;
  hideContentScreens();
  $("#storyReaderScreen").hidden = false;
  showMainNavigation("development");
  renderStoryPage();
  updateTopBack();
}

function renderStoryPage() {
  const story = state.selectedStory;
  const page = story.pages[state.storyPage];
  $("#storyImage").src = asset(story.image);
  $("#storyImage").alt = `Ілюстрація до казки ${story.title}`;
  $("#storyTitle").textContent = story.title;
  $("#storyKind").textContent = story.kind || "Українська народна казка";
  $("#storyText").textContent = page.text;
  $("#storyParentTip").innerHTML = `<strong>Підказка для мами</strong><span>${page.tip}</span>`;
  $("#storyPrevBtn").disabled = state.storyPage === 0;
  $("#storyNextBtn").textContent = state.storyPage === story.pages.length - 1 ? "Завершити ✓" : "Далі →";
  $("#storyDots").innerHTML = story.pages.map((_, index) => `<span class="${index === state.storyPage ? "active" : ""}"></span>`).join("");
}

function changeStoryPage(direction) {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  const nextPage = state.storyPage + direction;
  if (nextPage >= state.selectedStory.pages.length) {
    showStories();
    return;
  }
  state.storyPage = Math.max(0, nextPage);
  renderStoryPage();
}

function showAgePicker() {
  hideContentScreens();
  $("#agePicker").hidden = false;
  showMainNavigation("development");
  updateTopBack();
}

function showSleepScreen() {
  hideContentScreens();
  $("#sleepScreen").hidden = false;
  renderSleepList();
  showMainNavigation("care");
  updateTopBack();
}

function showSleepPlayer() {
  hideContentScreens();
  $("#sleepPlayerScreen").hidden = false;
  showMainNavigation("care");
  renderSleepPlayer();
  updateTopBack();
}

function showPoemCategories() {
  state.poemFilter = null;
  hideContentScreens();
  $("#poemCategoriesScreen").hidden = false;
  renderPoemCategories();
  showMainNavigation("development");
  updateTopBack();
}

function showPoemsScreen(categoryId) {
  state.poemFilter = categoryId;
  hideContentScreens();
  $("#poemsScreen").hidden = false;
  renderPoems();
  updateTopBack();
}

function showPoemDetail(poemId) {
  const poem = poems.find((item) => item.id === poemId);
  if (!poem) return;

  state.selectedPoem = poem;
  hideContentScreens();
  $("#poemDetailScreen").hidden = false;
  renderPoemDetail();
  updateTopBack();
}

function backToPoems() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  hideContentScreens();
  $("#poemsScreen").hidden = false;
  renderPoems();
  showMainNavigation("development");
  updateTopBack();
}

function startAge(age) {
  state.age = ageProfiles[age];
  $("#selectedAgeLabel").textContent = state.age.label;
  $("#bubbleGameCard").hidden = age !== "baby";
  $("#myFaceGameCard").hidden = age !== "baby";
  $("#myBodyGameCard").hidden = age !== "baby";
  $("#agePicker").hidden = true;
  $("#gamePicker").hidden = false;
  showMainNavigation("development");
  $("#gameGrid").scrollTop = 0;
  updateTopBack();
}

function startGame(game = "animals") {
  if (game === "bubbles") {
    startBubbleGame();
    return;
  }
  if (game === "my-face") {
    startFaceGame();
    return;
  }
  if (game === "my-body") {
    startBodyGame();
    return;
  }
  if (game === "families") {
    startFamilyGame();
    return;
  }
  if (game === "emotions") {
    startEmotionGame();
    return;
  }
  if (game === "dress-up") {
    startDressGame();
    return;
  }

  const gameSets = { animals: words, objects, colors };
  state.gameId = gameSets[game] ? game : "animals";
  state.gameItems = gameSets[state.gameId];
  state.step = 0;
  state.promptPlayed = false;
  resetDeck();
  $("#gamePicker").hidden = true;
  $("#gameArea").hidden = false;
  updateTopBack();
  nextTask();
}

function createBubble() {
  const field = $("#bubbleField");
  if (!field || field.children.length >= 8 || $("#bubbleGameScreen").hidden) return;

  const bubble = document.createElement("button");
  const size = Math.round(68 + Math.random() * 54);
  bubble.className = "bubble";
  bubble.type = "button";
  bubble.dataset.bubble = "true";
  bubble.setAttribute("aria-label", "Лопнути бульбашку");
  bubble.style.setProperty("--bubble-size", `${size}px`);
  bubble.style.setProperty("--bubble-x", `${Math.round(Math.random() * 72)}%`);
  bubble.style.setProperty("--bubble-hue", `${Math.round(Math.random() * 300 + 20)}`);
  bubble.style.setProperty("--bubble-duration", `${(7 + Math.random() * 4).toFixed(1)}s`);
  bubble.addEventListener("animationend", () => bubble.remove(), { once: true });
  field.appendChild(bubble);
}

function startBubbleGame() {
  state.bubblesPopped = 0;
  $("#bubbleScore").textContent = "Лусь!";
  $("#bubbleField").replaceChildren();
  $("#gamePicker").hidden = true;
  $("#bubbleGameScreen").hidden = false;
  for (let index = 0; index < 4; index += 1) {
    window.setTimeout(createBubble, index * 260);
  }
  state.bubbleTimer = window.setInterval(createBubble, 750);
  updateTopBack();
}

function stopBubbleGame() {
  window.clearInterval(state.bubbleTimer);
  state.bubbleTimer = null;
  const field = $("#bubbleField");
  if (field) field.replaceChildren();
}

function popBubble(bubble) {
  if (bubble.classList.contains("is-popping")) return;
  bubble.classList.add("is-popping");
  playBubblePopSound();
  state.bubblesPopped += 1;
  $("#bubbleScore").textContent = "Лусь!";
  window.setTimeout(() => {
    bubble.remove();
    createBubble();
  }, 180);
}

function startFaceGame() {
  $("#gamePicker").hidden = true;
  $("#faceGameScreen").hidden = false;
  $("#facePartLabel").textContent = "Торкнися личка";
  document.querySelectorAll(".face-hotspot").forEach((hotspot) => hotspot.classList.remove("is-touched"));
  updateTopBack();
}

function nameFacePart(hotspot) {
  const part = hotspot.dataset.facePart;
  const faceAudioFiles = {
    "Очі": "eyes.mp3",
    "Носик": "nose.mp3",
    "Ротик": "mouth.mp3",
    "Вушко": "ear.mp3"
  };
  document.querySelectorAll(".face-hotspot").forEach((item) => item.classList.remove("is-touched"));
  hotspot.classList.add("is-touched");

  const label = $("#facePartLabel");
  label.textContent = part;
  label.classList.remove("is-speaking");
  void label.offsetWidth;
  label.classList.add("is-speaking");

  playAudioFile(faceAudioAsset(faceAudioFiles[part]));
  window.setTimeout(() => hotspot.classList.remove("is-touched"), 650);
}

function startBodyGame() {
  $("#gamePicker").hidden = true;
  $("#bodyGameScreen").hidden = false;
  $("#bodyPartLabel").textContent = "Торкнися тіла";
  document.querySelectorAll(".body-hotspot").forEach((hotspot) => hotspot.classList.remove("is-touched"));
  updateTopBack();
}

function nameBodyPart(hotspot) {
  document.querySelectorAll(".body-hotspot").forEach((item) => item.classList.remove("is-touched"));
  hotspot.classList.add("is-touched");

  const label = $("#bodyPartLabel");
  label.textContent = hotspot.dataset.bodyPart;
  label.classList.remove("is-speaking");
  void label.offsetWidth;
  label.classList.add("is-speaking");

  playAudioFile(bodyAudioAsset(hotspot.dataset.bodyAudio));
  window.setTimeout(() => hotspot.classList.remove("is-touched"), 650);
}

function startFamilyGame() {
  state.familyStep = 0;
  state.familyDeck = shuffle(animalFamilies);
  $("#gamePicker").hidden = true;
  $("#familyGameScreen").hidden = false;
  renderFamilyRound();
  updateTopBack();
}

function renderFamilyRound() {
  const target = state.familyDeck[state.familyStep % state.familyDeck.length];
  const optionCount = state.age?.type === "single" || state.age?.choices === 2 ? 2 : 3;
  const options = shuffle([
    target,
    ...shuffle(animalFamilies.filter((item) => item.id !== target.id)).slice(0, optionCount - 1)
  ]);

  $("#familyMotherImage").src = asset(target.motherImage);
  $("#familyMotherImage").alt = target.mother;
  $("#familyMotherName").textContent = target.mother;
  $("#familyPrompt").textContent = `Знайди малюка: ${target.baby.toLowerCase()}`;

  $("#familyBabyGrid").innerHTML = options.map((item) => `
    <button class="family-baby-card" data-family-baby="${item.id}" aria-label="${item.baby}">
      <img src="${asset(item.babyImage)}" alt="${item.baby}" />
      <strong>${item.baby}</strong>
    </button>
  `).join("");
}

function chooseFamilyBaby(button, babyId) {
  if (button.classList.contains("is-correct") || button.classList.contains("is-wrong")) return;
  const target = state.familyDeck[state.familyStep % state.familyDeck.length];
  if (babyId !== target.id) {
    button.classList.add("is-wrong");
    playWrongSound();
    window.setTimeout(() => button.classList.remove("is-wrong"), 700);
    return;
  }

  button.classList.add("is-correct");
  playAudioFile(familyAudioAsset(target.voice));
  showToast(`Так, ${target.baby.toLowerCase()}!`, "correct");
  window.setTimeout(() => {
    state.familyStep += 1;
    if (state.familyStep >= animalFamilies.length) {
      state.familyStep = 0;
      state.familyDeck = shuffle(animalFamilies);
    }
    renderFamilyRound();
  }, 1300);
}

function startEmotionGame() {
  state.emotionStep = 0;
  state.emotionDeck = shuffle(emotions);
  $("#gamePicker").hidden = true;
  $("#emotionGameScreen").hidden = false;
  renderEmotionRound();
  updateTopBack();
}

function renderEmotionRound() {
  const target = state.emotionDeck[state.emotionStep % state.emotionDeck.length];
  const optionCount = state.age?.type === "single" ? 1 : state.age?.choices === 2 ? 2 : Math.min(4, emotions.length);
  const options = optionCount === 1 ? [target] : shuffle([
    target,
    ...shuffle(emotions.filter((item) => item.id !== target.id)).slice(0, optionCount - 1)
  ]);

  $("#emotionPrompt").textContent = optionCount === 1 ? target.name : `Покажи ${target.ask} личко`;
  $("#emotionParentTip").textContent = target.tip;
  $("#emotionGrid").classList.toggle("single", optionCount === 1);
  $("#emotionGrid").classList.toggle("two", optionCount === 2);
  $("#emotionGrid").innerHTML = options.map((item) => `
    <button class="emotion-card" data-emotion="${item.id}" aria-label="${item.name}">
      <img src="${asset(item.image)}" alt="${item.name} вираз обличчя" />
      <strong>${item.name}</strong>
    </button>
  `).join("");
}

function chooseEmotion(button, emotionId) {
  const target = state.emotionDeck[state.emotionStep % state.emotionDeck.length];
  if (emotionId !== target.id) {
    button.classList.add("is-wrong");
    playWrongSound();
    window.setTimeout(() => button.classList.remove("is-wrong"), 700);
    return;
  }

  button.classList.add("is-correct");
  playAudioFile(emotionAudioAsset(target.voice));
  showToast(target.name, "correct");
  window.setTimeout(() => {
    state.emotionStep += 1;
    if (state.emotionStep >= emotions.length) {
      state.emotionStep = 0;
      state.emotionDeck = shuffle(emotions);
    }
    renderEmotionRound();
  }, 1300);
}

function startDressGame() {
  state.dressCharacterId = "baby";
  state.dressWornByCharacter = {
    baby: new Set(),
    doll: new Set(),
    bear: new Set()
  };
  $("#gamePicker").hidden = true;
  $("#dressGameScreen").hidden = false;
  renderDressGame();
  updateTopBack();
}

function renderDressGame() {
  const character = dressCharacters.find((item) => item.id === state.dressCharacterId) || dressCharacters[0];
  const wornItems = state.dressWornByCharacter[character.id];
  const wornCount = wornItems.size;
  const complete = wornCount >= dressItems.length;
  $("#dressTitle").textContent = `Одягни ${character.target}`;
  $("#dressPrompt").textContent = complete
    ? `${character.ready} Торкнися речі, щоб зняти`
    : `Одягай або знімай речі для ${character.forWhom}`;

  $("#dressCharacterPicker").innerHTML = dressCharacters.map((item) => {
    const selected = item.id === character.id;
    return `
      <button class="dress-character-choice${selected ? " is-selected" : ""}" data-dress-character="${item.id}" aria-pressed="${selected}">
        <img src="${asset(item.preview)}" alt="" />
        <span>${item.name}</span>
      </button>
    `;
  }).join("");

  const lookKey = dressItems
    .filter((item) => wornItems.has(item.id))
    .map((item) => item.id)
    .join("+");
  const characterLooks = dressLooksByCharacter[character.id] || dressLookImages;
  $("#dressCharacter").src = asset(characterLooks[lookKey] || characterLooks[""]);
  $("#dressCharacter").alt = character.alt;

  $("#dressItems").innerHTML = dressItems.map((item) => {
    const isWorn = wornItems.has(item.id);
    return `
    <button class="dress-item${isWorn ? " is-worn" : ""}" data-dress-item="${item.id}" aria-pressed="${isWorn}" aria-label="${isWorn ? "Зняти" : "Одягнути"}: ${item.name}">
      <img src="${asset(item.image)}" alt="${item.name}" />
      <strong>${item.name}</strong>
      ${isWorn ? '<span aria-hidden="true">−</span>' : ""}
    </button>
  `;
  }).join("");
}

function chooseDressItem(itemId) {
  const item = dressItems.find((entry) => entry.id === itemId);
  const wornItems = new Set(state.dressWornByCharacter[state.dressCharacterId]);
  if (!item) return;

  const removing = wornItems.has(itemId);
  if (removing) {
    wornItems.delete(itemId);
    showToast(`Знято: ${item.name}`);
  } else {
    wornItems.add(itemId);
    playAudioFile(dressAudioAsset(item.voice));
    showToast(item.name, "correct");
  }
  state.dressWornByCharacter[state.dressCharacterId] = wornItems;
  renderDressGame();

  if (!removing) {
    document.querySelector(`[data-dress-item="${itemId}"]`)?.classList.add("is-correct");
  }
}

function chooseDressCharacter(characterId) {
  if (!dressCharacters.some((item) => item.id === characterId)) return;
  state.dressCharacterId = characterId;
  renderDressGame();
}

function backToAges() {
  state.age = null;
  state.step = 0;
  state.promptPlayed = false;
  $("#gamePicker").hidden = true;
  $("#gameArea").hidden = true;
  $("#agePicker").hidden = false;
  updateTopBack();
}

function backToHome() {
  state.age = null;
  state.step = 0;
  state.promptPlayed = false;
  state.transitioning = false;
  stopSleep();
  if (state.audio) {
    state.audio.pause();
    state.audio.currentTime = 0;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  hideContentScreens();
  $("#homeScreen").hidden = false;
  showMainNavigation("today");
  updateTopBack();
}

function backToGames() {
  if (!state.age) {
    backToAges();
    return;
  }

  if (state.audio) {
    state.audio.pause();
    state.audio.currentTime = 0;
  }

  state.step = 0;
  state.promptPlayed = false;
  state.transitioning = false;
  $("#gameArea").hidden = true;
  $("#bubbleGameScreen").hidden = true;
  $("#faceGameScreen").hidden = true;
  $("#bodyGameScreen").hidden = true;
  $("#familyGameScreen").hidden = true;
  $("#emotionGameScreen").hidden = true;
  $("#dressGameScreen").hidden = true;
  stopBubbleGame();
  $("#gamePicker").hidden = false;
  updateTopBack();
}

function goBack() {
  if (!$("#dressGameScreen").hidden) {
    backToGames();
    return;
  }

  if (!$("#emotionGameScreen").hidden) {
    backToGames();
    return;
  }

  if (!$("#familyGameScreen").hidden) {
    backToGames();
    return;
  }

  if (!$("#bodyGameScreen").hidden) {
    backToGames();
    return;
  }

  if (!$("#faceGameScreen").hidden) {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    backToGames();
    return;
  }

  if (!$("#bubbleGameScreen").hidden) {
    backToGames();
    return;
  }

  if (!$("#storyReaderScreen").hidden) {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    showStories();
    return;
  }

  if (!$("#storiesScreen").hidden) {
    openDevelopmentTab();
    return;
  }

  if (!$("#poemDetailScreen").hidden) {
    backToPoems();
    return;
  }

  if (!$("#poemsScreen").hidden) {
    showPoemCategories();
    return;
  }

  if (!$("#poemCategoriesScreen").hidden) {
    openDevelopmentTab();
    return;
  }

  if (!$("#sleepPlayerScreen").hidden) {
    pauseSleep();
    $("#sleepPlayerScreen").hidden = true;
    $("#sleepScreen").hidden = false;
    renderSleepList();
    updateTopBack();
    return;
  }

  if (!$("#sleepScreen").hidden) {
    openCareTab();
    return;
  }

  if (!$("#gameArea").hidden) {
    backToGames();
    return;
  }

  if (!$("#gamePicker").hidden) {
    if (state.childProfile?.birth_date) {
      openDevelopmentTab();
    } else {
      backToAges();
    }
    return;
  }

  if (!$("#agePicker").hidden) {
    openDevelopmentTab();
  }
}

function updateTopBack() {
  const isHome = ["#homeScreen", "#onboardingScreen", "#developmentHubScreen", "#careHubScreen", "#profileHubScreen"]
    .some((selector) => $(selector).hidden === false);

  if (telegramApp) {
    if (isHome) {
      telegramApp.BackButton.hide();
    } else {
      telegramApp.BackButton.show();
    }
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function renderSleepList() {
  const list = $("#sleepList");
  list.innerHTML = "";

  sleepSounds.forEach((sound) => {
    const button = document.createElement("button");
    button.className = "sleep-card";
    button.dataset.sleep = sound.id;
    button.innerHTML = `
      <img src="${asset(sound.image)}" alt="" />
      <strong>${sound.title}</strong>
      <span>${sound.mood}</span>
    `;
    list.append(button);
  });
}

function saveFavoritePoems() {
  state.favoritePoems = new Set([...state.favoritePoems].filter((poemId) => poemIds.has(poemId)));
  localStorage.setItem("favoritePoems", JSON.stringify([...state.favoritePoems]));
}

function favoritePoemItems() {
  return poems.filter((poem) => isPoemFavorite(poem.id));
}

function isPoemFavorite(poemId) {
  return state.favoritePoems.has(poemId);
}

function togglePoemFavorite(poemId) {
  if (isPoemFavorite(poemId)) {
    state.favoritePoems.delete(poemId);
  } else {
    state.favoritePoems.add(poemId);
  }
  saveFavoritePoems();
  window.owlJoyAccount?.request("favorite.set", {
    contentType: "poem",
    contentId: poemId,
    active: isPoemFavorite(poemId)
  }).catch((error) => console.error("OwlJoy: не вдалося синхронізувати обране", error));
}

function filteredPoems() {
  if (state.poemFilter === "favorites") {
    return favoritePoemItems();
  }
  return poems.filter((poem) => poem.categoryId === state.poemFilter);
}

function renderPoemCategories() {
  const favoritesCount = favoritePoemItems().length;
  $("#favoritesFolder").hidden = favoritesCount === 0 && state.poemFilter !== "favorites";
  $("#favoritesCount").textContent = "Збережені віршики";

  const grid = $("#poemCategoryGrid");
  grid.innerHTML = "";

  poemCategories.forEach((category) => {
    const hasPoems = poems.some((poem) => poem.categoryId === category.id);
    const button = document.createElement("button");
    button.className = "poem-category-card";
    button.dataset.poemCategory = category.id;
    button.innerHTML = `
      <img src="${asset(category.image)}" alt="" />
      <strong>${category.title}</strong>
      <span>${category.lead}</span>
      <small>${hasPoems ? "Відкрити добірку" : "Додаємо скоро"}</small>
    `;
    grid.append(button);
  });
}

function renderPoems() {
  const category = state.poemFilter === "favorites"
    ? { title: "Улюблені", lead: "Віршики, які ви зберегли сердечком.", image: "home-poems.png" }
    : poemCategories.find((item) => item.id === state.poemFilter) || poemCategories[0];

  $("#poemListTitle").textContent = category.title;
  $("#poemListLead").textContent = category.lead;
  $("#poemListImage").src = asset(category.image);
  $("#poemListKicker").textContent = state.poemFilter === "favorites" ? "Ваша папка" : "Віршики";

  const list = $("#poemsList");
  const items = filteredPoems();
  list.innerHTML = "";

  if (!items.length) {
    const emptyText = state.poemFilter === "favorites"
      ? "Натисніть сердечко на віршику, і він з'явиться в улюблених."
      : "Сюди додамо віршики з цієї теми наступним кроком.";
    list.innerHTML = `
      <div class="poems-empty">
        <strong>Тут поки тихо</strong>
        <span>${emptyText}</span>
      </div>
    `;
    return;
  }

  items.forEach((poem) => {
    const button = document.createElement("button");
    button.className = `poem-card${poem.image ? "" : " no-image"}`;
    button.dataset.poem = poem.id;
    button.innerHTML = `
      ${poem.image ? `<img src="${asset(poem.image)}" alt="" />` : ""}
      <strong>${poem.title}</strong>
      <span>${poem.preview}</span>
      <small>${poem.category}</small>
      <span class="poem-heart${isPoemFavorite(poem.id) ? " active" : ""}" data-poem-fav="${poem.id}" aria-label="Улюблене">♥</span>
    `;
    list.append(button);
  });
}

function renderPoemDetail() {
  const poem = state.selectedPoem;
  $(".poem-art").hidden = !poem.image;
  if (poem.image) $("#poemImage").src = asset(poem.image);
  $("#poemTitle").hidden = true;
  $("#poemCategory").hidden = true;
  $("#poemText").innerHTML = poem.lines.map((line) => `<p>${line}</p>`).join("");
  $("#poemInstruction").hidden = !poem.instruction;
  $("#poemInstruction").textContent = poem.instruction || "";
  $("#poemFavoriteBtn").textContent = isPoemFavorite(poem.id) ? "♥" : "♡";
  $("#poemFavoriteBtn").classList.toggle("active", isPoemFavorite(poem.id));
}

function playSelectedPoem() {
  const poem = state.selectedPoem;
  if (!poem) return;
  const text = `${poem.title}. ${poem.lines.join(" ")}`;

  if (poem.audio) {
    playAudioFile(poemAudioAsset(poem.audio));
    return;
  }

  speakWithBrowser(text);
}

function renderSleepPlayer() {
  $("#sleepImage").src = asset(state.sleepSound.image);
  $("#sleepTitle").textContent = state.sleepSound.title;
  $("#sleepMood").textContent = state.sleepSound.mood;
  $("#sleepDescription").textContent = state.sleepSound.description;
  $("#sleepTimerText").textContent = formatTime(state.sleepRemaining);
  $("#sleepPlayBtn").textContent = state.sleepAudio && !state.sleepAudio.paused ? "Ⅱ Пауза" : "▶ Увімкнути";
  document.querySelectorAll("[data-timer]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.timer) === state.sleepDuration);
  });
}

function selectSleepSound(id) {
  const nextSound = sleepSounds.find((sound) => sound.id === id);
  if (!nextSound) return;

  stopSleep(false);
  state.sleepSound = nextSound;
  state.sleepRemaining = state.sleepDuration * 60;
  showSleepPlayer();
}

function setSleepTimer(minutes) {
  state.sleepDuration = minutes;
  state.sleepRemaining = minutes * 60;
  document.querySelectorAll("[data-timer]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.timer) === minutes);
  });
  $("#sleepTimerText").textContent = formatTime(state.sleepRemaining);
}

async function keepSleepScreenAwake() {
  if (!("wakeLock" in navigator) || state.sleepWakeLock) return;

  try {
    state.sleepWakeLock = await navigator.wakeLock.request("screen");
    state.sleepWakeLock.addEventListener("release", () => {
      state.sleepWakeLock = null;
    });
  } catch (error) {
    console.warn("Не вдалося залишити екран увімкненим:", error);
  }
}

async function allowSleepScreenToTurnOff() {
  const wakeLock = state.sleepWakeLock;
  state.sleepWakeLock = null;
  if (wakeLock) await wakeLock.release().catch(() => {});
}

function startSleep() {
  if (!state.sound) return;

  if (!state.sleepAudio) {
    state.sleepAudio = new Audio(sleepAsset(state.sleepSound.audio));
    state.sleepAudio.loop = true;
    state.sleepAudio.volume = 0.82;
  }

  state.sleepAudio.play()
    .then(() => keepSleepScreenAwake())
    .catch(() => {});
  window.clearInterval(state.sleepTimer);
  state.sleepTimer = window.setInterval(() => {
    state.sleepRemaining = Math.max(0, state.sleepRemaining - 1);
    if (state.sleepAudio) {
      state.sleepAudio.volume = state.sleepRemaining <= 10 ? Math.max(0.05, state.sleepRemaining / 12) : 0.82;
    }
    $("#sleepTimerText").textContent = formatTime(state.sleepRemaining);
    if (state.sleepRemaining === 0) stopSleep();
  }, 1000);
  renderSleepPlayer();
}

function pauseSleep() {
  window.clearInterval(state.sleepTimer);
  if (state.sleepAudio) state.sleepAudio.pause();
  allowSleepScreenToTurnOff();
  if ($("#sleepPlayerScreen") && !$("#sleepPlayerScreen").hidden) renderSleepPlayer();
}

function stopSleep(resetTime = true) {
  window.clearInterval(state.sleepTimer);
  state.sleepTimer = null;
  if (state.sleepAudio) {
    state.sleepAudio.pause();
    state.sleepAudio.currentTime = 0;
    state.sleepAudio = null;
  }
  allowSleepScreenToTurnOff();
  if (resetTime) state.sleepRemaining = state.sleepDuration * 60;
  if ($("#sleepPlayerScreen") && !$("#sleepPlayerScreen").hidden) renderSleepPlayer();
}

function toggleSleep() {
  if (state.sleepAudio && !state.sleepAudio.paused) {
    pauseSleep();
    return;
  }

  startSleep();
}

document.addEventListener("visibilitychange", () => {
  if (
    document.visibilityState === "visible" &&
    state.sleepAudio &&
    !state.sleepAudio.paused
  ) {
    keepSleepScreenAwake();
  }
});

function createTask() {
  const profile = state.age;
  const items = state.gameItems;
  const isObjects = state.gameId === "objects";
  const isColors = state.gameId === "colors";
  if (state.step % items.length === 0) resetDeck();
  const target = state.deck[state.step % items.length];
  const visibleStep = (state.step % items.length) + 1;

  if (profile.type === "single") {
    return {
      mode: isColors ? "Колір" : isObjects ? "Що це?" : profile.mode,
      prompt: isColors ? "Який колір?" : isObjects ? "Що це?" : profile.prompt(target),
      target,
      audio: null,
      parent: (isObjects || isColors) ? target.parent : profile.parent(target),
      choices: [{ ...target, label: target.name, correct: true, reveal: true }],
      progress: visibleStep
    };
  }

  if (profile.type === "mixed" && state.step % 2 === 1) {
    const shownWord = Math.random() > 0.45 ? target : shuffle(items.filter((word) => word.id !== target.id))[0];
    const isTrue = shownWord.id === target.id;
    return {
      mode: "Так чи ні",
      prompt: isColors ? `Колір — ${shownWord.name}?` : `Це ${shownWord.name}?`,
      target,
      answerItem: shownWord,
      audio: null,
      parent: (isObjects || isColors) ? shownWord.parent : profile.parent(target),
      choices: [
        { id: "yes", label: "Так", image: shownWord.image, correct: isTrue },
        { id: "no", label: "Ні", image: shownWord.image, correct: !isTrue }
      ],
      progress: visibleStep
    };
  }

  const optionCount = Math.min(profile.choices, items.length);
  const options = shuffle([
    target,
    ...shuffle(items.filter((word) => word.id !== target.id)).slice(0, optionCount - 1)
  ]);

  return {
    mode: isColors ? "Знайди колір" : profile.type === "mixed" ? (isObjects ? "Знайди" : "Звук") : profile.mode,
    prompt: isColors
      ? `${profile.type === "mixed" ? "Знайди" : "Покажи"} ${target.ask} колір`
      : profile.type === "mixed"
        ? (isObjects ? `Знайди ${target.ask}` : profile.prompt(target, null, false))
        : profile.prompt(target),
    target,
    audio: null,
    parent: (isObjects || isColors) ? target.parent : profile.parent(target),
    choices: options.map((word) => ({ ...word, label: word.name, correct: word.id === target.id })),
    progress: visibleStep
  };
}

function render() {
  const task = state.task;

  $("#modeLabel").textContent = task.mode;
  $("#promptText").textContent = task.prompt;
  $("#parentPrompt").textContent = task.parent;
  $(".control-panel").classList.toggle("simple-prompt", state.age.type === "single" || task.mode === task.prompt);
  $(".next-btn").disabled = false;
  $(".next-btn").textContent = state.age.type === "single" ? "Наступна картинка" : "Далі";

  const choices = $("#choices");
  choices.classList.toggle("single-choice", state.age.type === "single");
  choices.innerHTML = "";

  task.choices.forEach((choice) => {
    const button = document.createElement("button");
    const showColorSwatch = state.gameId === "colors" && (state.age.type === "single" || state.age.choices === 2);
    button.className = `choice-card${state.age.type === "single" ? " single" : ""}${state.gameId === "colors" ? " color-choice" : ""}`;
    if (state.age.type === "single" && (choice.sfx || choice.voice)) {
      button.setAttribute("aria-label", `Послухати: ${choice.name}`);
    }
    button.innerHTML = `
      <span class="art-frame">
        ${showColorSwatch
          ? `<span class="color-swatch${choice.id === "white" ? " is-white" : ""}" style="--swatch: ${choice.hex}" aria-hidden="true"></span>`
          : `<img src="${asset(choice.image)}" alt="${choice.label}" />`}
        ${state.age.type === "single" && (choice.sfx || choice.voice) ? '<span class="sound-cue" aria-hidden="true">🔊</span>' : ""}
      </span>
      <strong>${choice.label}</strong>
    `;
    button.addEventListener("click", () => answer(button, choice));
    choices.append(button);
  });

}

function nextTask() {
  state.task = createTask();
  state.transitioning = false;
  render();
  state.step += 1;
}

function advanceTask() {
  if (state.transitioning) return;

  if (state.age?.type === "single" && (state.task?.target?.sfx || state.task?.target?.voice)) {
    state.transitioning = true;
    $(".next-btn").disabled = true;
    $(".next-btn").textContent = "Слухаємо...";
    playLearningItem(state.task.target);
    window.setTimeout(() => {
      nextTask();
    }, 1800);
    return;
  }

  nextTask();
}

function answer(button, choice) {
  if (state.age?.type === "single") {
    button.classList.add("is-playing");
    playLearningItem(state.task.target);
    window.setTimeout(() => {
      button.classList.remove("is-playing");
    }, 650);
    return;
  }

  if (state.age?.type === "pick" && state.age?.choices === 2) {
    if (choice.correct) {
      button.classList.add("is-correct");
      showToast("Класно!", "correct");
      playLearningItem(state.task.answerItem || state.task.target);
      window.setTimeout(nextTask, 1200);
      return;
    }

    button.classList.add("is-wrong");
    showToast("Не зовсім", "wrong");
    playWrongSound();
    window.setTimeout(nextTask, 850);
    return;
  }

  if (choice.correct) {
    button.classList.add("is-correct");
    showToast("Класно!", "correct");
    playLearningItem(state.task.answerItem || state.task.target);
    window.setTimeout(nextTask, 1300);
    return;
  }

  button.classList.add("is-wrong");
  showToast("Спробуй ще раз", "wrong");
  playWrongSound();
}

function showToast(text, tone = "neutral") {
  const toast = $("#toast");
  toast.textContent = text;
  toast.className = `toast ${tone}`;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1200);
}

document.addEventListener("click", (event) => {
  const mainTab = event.target.closest("[data-main-tab]")?.dataset.mainTab;
  if (mainTab === "today") {
    closeChildSwitcher();
    backToHome();
    return;
  }
  if (mainTab === "development") {
    closeChildSwitcher();
    openDevelopmentTab();
    return;
  }
  if (mainTab === "care") {
    closeChildSwitcher();
    openCareTab();
    return;
  }
  if (mainTab === "profile") {
    closeChildSwitcher();
    openProfileTab();
    return;
  }

  const selectedChildId = event.target.closest("[data-child-id]")?.dataset.childId;
  if (selectedChildId) {
    selectChildProfile(selectedChildId);
    return;
  }

  const section = event.target.closest("[data-section]")?.dataset.section;
  if (section === "games") {
    const savedAge = ageProfileKeyForBirthDate(state.childProfile?.birth_date);
    if (savedAge) {
      hideContentScreens();
      startAge(savedAge);
      showMainNavigation("development");
      updateTopBack();
    } else {
      showAgePicker();
    }
    return;
  }

  if (section === "sleep") {
    showSleepScreen();
    return;
  }

  if (section === "poems") {
    showPoemCategories();
    return;
  }

  if (section === "stories") {
    showStories();
    return;
  }

  const story = event.target.closest("[data-story]")?.dataset.story;
  if (story) {
    showStory(story);
    return;
  }

  const poemFolder = event.target.closest("[data-poem-folder]")?.dataset.poemFolder;
  if (poemFolder) {
    showPoemsScreen(poemFolder);
    return;
  }

  const poemCategory = event.target.closest("[data-poem-category]")?.dataset.poemCategory;
  if (poemCategory) {
    showPoemsScreen(poemCategory);
    return;
  }

  const poemFavorite = event.target.closest("[data-poem-fav]")?.dataset.poemFav;
  if (poemFavorite) {
    event.preventDefault();
    event.stopPropagation();
    togglePoemFavorite(poemFavorite);
    renderPoems();
    return;
  }

  const poem = event.target.closest("[data-poem]")?.dataset.poem;
  if (poem) {
    showPoemDetail(poem);
    return;
  }

  const sleep = event.target.closest("[data-sleep]")?.dataset.sleep;
  if (sleep) {
    selectSleepSound(sleep);
    return;
  }

  const timer = event.target.closest("[data-timer]")?.dataset.timer;
  if (timer) {
    setSleepTimer(Number(timer));
    return;
  }

  const age = event.target.closest("[data-age]")?.dataset.age;
  if (age) {
    startAge(age);
    return;
  }

  const game = event.target.closest("[data-game]")?.dataset.game;
  if (game) {
    startGame(game);
    return;
  }

  const bubble = event.target.closest("[data-bubble]");
  if (bubble) {
    popBubble(bubble);
    return;
  }

  const facePart = event.target.closest("[data-face-part]");
  if (facePart) {
    nameFacePart(facePart);
    return;
  }

  const bodyPart = event.target.closest("[data-body-part]");
  if (bodyPart) {
    nameBodyPart(bodyPart);
    return;
  }

  const familyBaby = event.target.closest("[data-family-baby]");
  if (familyBaby) {
    chooseFamilyBaby(familyBaby, familyBaby.dataset.familyBaby);
    return;
  }

  const emotion = event.target.closest("[data-emotion]");
  if (emotion) {
    chooseEmotion(emotion, emotion.dataset.emotion);
    return;
  }

  const dressItem = event.target.closest("[data-dress-item]");
  if (dressItem) {
    chooseDressItem(dressItem.dataset.dressItem);
    return;
  }

  const dressCharacter = event.target.closest("[data-dress-character]");
  if (dressCharacter) {
    chooseDressCharacter(dressCharacter.dataset.dressCharacter);
    return;
  }

  if (event.target.closest("[data-dress-reset]")) {
    state.dressWornByCharacter[state.dressCharacterId] = new Set();
    showToast("Увесь одяг знято");
    renderDressGame();
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "sound") {
    state.sound = !state.sound;
    event.target.textContent = state.sound ? "🔊" : "🔇";
    if (!state.sound) pauseSleep();
    if (!state.sound && "speechSynthesis" in window) window.speechSynthesis.cancel();
    showToast(state.sound ? "Звук увімкнено" : "Звук вимкнено");
  }

  if (action === "openChildSwitcher") {
    openChildSwitcher();
    return;
  }
  if (action === "closeChildSwitcher") {
    closeChildSwitcher();
    return;
  }
  if (action === "addChild") {
    state.onboardingReturn = $("#profileHubScreen").hidden ? "today" : "profile";
    showOnboarding("add");
    return;
  }
  if (action === "cancelAddChild") {
    if (state.onboardingReturn === "profile") openProfileTab();
    else backToHome();
    return;
  }

  if (action === "goBack") {
    goBack();
    return;
  }
  if (action === "next") {
    advanceTask();
    return;
  }
  if (action === "toggleSleep") {
    toggleSleep();
    return;
  }
  if (action === "dimSleepScreen") {
    $("#sleepDimOverlay").hidden = false;
    return;
  }
  if (action === "restoreSleepScreen") {
    $("#sleepDimOverlay").hidden = true;
    return;
  }
  if (action === "playPoem") {
    playSelectedPoem();
    return;
  }
  if (action === "toggleCurrentPoemFavorite") {
    togglePoemFavorite(state.selectedPoem.id);
    renderPoemDetail();
    return;
  }
  if (action === "prevStoryPage") {
    changeStoryPage(-1);
    return;
  }
  if (action === "nextStoryPage") {
    changeStoryPage(1);
    return;
  }
});
