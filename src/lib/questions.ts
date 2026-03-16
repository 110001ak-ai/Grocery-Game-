import type {
  Question,
  Rank,
  Personality,
  FreqOption,
} from "@/types";

// ─── RANKS ───────────────────────────────────────────────────────────────────

export const RANKS: Rank[] = [
  { min: 0,    t: "🥚 KITCHEN ROOKIE",          d: "Just cracked your first egg." },
  { min: 350,  t: "🍳 PANTRY EXPLORER",          d: "You know where the salt lives." },
  { min: 750,  t: "🛒 GROCERY GLADIATOR",        d: "You shop with purpose." },
  { min: 1200, t: "👨‍🍳 FRIDGE COMMANDER",         d: "The kitchen trembles at your strategy." },
  { min: 1600, t: "🏆 KITCHEN LEGEND",           d: "You curate groceries, not just buy them." },
  { min: 2000, t: "👑 GRANDMASTER OF GROCERIES", d: "The chosen one. The fridge bows to you." },
];

export const getRank = (xp: number): Rank =>
  [...RANKS].reverse().find((r) => xp >= r.min) ?? RANKS[0];

// ─── PERSONALITIES ────────────────────────────────────────────────────────────

export const PERSONALITIES: Personality[] = [
  { min: 0,    em: "🐌", t: "Casual Browser",      d: "Shopping is a leisurely adventure for you." },
  { min: 600,  em: "🧠", t: "Strategic Planner",   d: "You plan, list, and execute with precision." },
  { min: 1200, em: "⚡", t: "Speed Shopper",        d: "In and out — time is your most precious resource." },
  { min: 1800, em: "🏆", t: "Grocery Grandmaster",  d: "The ultimate kitchen strategist and shopper." },
];

export const getPersonality = (xp: number): Personality =>
  [...PERSONALITIES].reverse().find((p) => xp >= p.min) ?? PERSONALITIES[0];

// ─── SQUAD LABELS ────────────────────────────────────────────────────────────

export const SQUAD_LABELS: Record<number, string> = {
  // 0: "",
  1: "Super Single 🦸",
  2: "Dynamic Duo 💑",
  3: "Three's Company 🎉",
  4: "Fantastic Four 👨‍👩‍👧‍👦",
  5: "Fabulous Five 🙌",
  6: "Sweet Six Squad 🏡",
};
export const PATIALA_LABEL = "The Patiala House 🔥";

// ─── NIGHT CRAVING PATTERNS ───────────────────────────────────────────────────

export interface NightPattern {
  active: number[];
  snacks: string[];
  title: string;
}

export const NIGHT_PATTERNS: Record<string, NightPattern> = {
  Weeknights: {
    active: [0, 1, 2, 3, 4],
    snacks: ["🌙", "🍜", "🥛", "🍪", "🌙", "", ""],
    title: "Your Weeknight Cravings",
  },
  Weekends: {
    active: [5, 6],
    snacks: ["", "", "", "", "", "🍕", "🍩"],
    title: "Weekend Snack Mode",
  },
  "Every night": {
    active: [0, 1, 2, 3, 4, 5, 6],
    snacks: ["🌙", "🍕", "🍜", "🍪", "🥛", "🍩", "🌮"],
    title: "Every Night — No Rules!",
  },
  "Random chaos": {
    active: [1, 3, 6],
    snacks: ["", "🍕", "", "🌙", "", "", "🍔"],
    title: "Random Chaos Schedule",
  },
};

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
// Single source of truth. All 15 questions live here.
// To add/edit a question — only touch this file.

export const QUESTIONS: Question[] = [

  // ── Q1: Location ──────────────────────────────────────────────────────────
  {
    id: "location",
    badge: "Q1 · KITCHEN KINGDOM",
    title: "Select Your Kingdom 📍",
    sub: "Where does the magic happen?",
    tags: ["🏙️ Location"],
    type: "city",
    xp: 100,
    opts: [
      { em: "🏙️", nm: "Delhi",     tg: "The spice capital" },
      { em: "🌆", nm: "Bengaluru", tg: "Tech & filter coffee" },
      { em: "🌃", nm: "Mumbai",    tg: "Maximum city vibes" },
      { em: "🌍", nm: "Elsewhere", tg: "Represent India!" },
    ],
  },

  // ── Q2: Kitchen Roots — pill grid (replaces dropdown) ────────────────────
  // Pills handle many options without breaking layout — wraps gracefully.
  {
    id: "kitchen_roots",
    badge: "Q2 · KITCHEN ROOTS",
    title: "Kitchen Roots 🌏🍲",
    sub: "Every kitchen has its own soul. Which culinary tradition runs in your veins?",
    tags: ["🌏 Culture"],
    type: "pills",
    xp: 120,
    fu: true,
    otherLabel: "Tell us your tradition",
    opts: [
    { em: "🧈", nm: "Punjabi",            color: "#ff9f43" },
  { em: "🫓", nm: "Haryanvi",           color: "#f6b93b" },
  { em: "🥘", nm: "Rajasthani",         color: "#e17055" },
  { em: "🍛", nm: "UP / Awadhi",        color: "#fdcb6e" },
  { em: "🫕", nm: "Bihari",             color: "#f9ca24" },
  { em: "🐟", nm: "Bengali",            color: "#48dbfb" },
  { em: "🫓", nm: "Gujarati",           color: "#a29bfe" },
  { em: "🍱", nm: "Maharashtrian",      color: "#fd79a8" },
  { em: "🌶️", nm: "Tamil",              color: "#ff6b6b" },
  { em: "🍛", nm: "Telugu",             color: "#ffd166" },
  { em: "🍲", nm: "Kannada",            color: "#06d6a0" },
  { em: "🍜", nm: "North-Eastern",      color: "#00cec9" },
  { em: "🥗", nm: "Kashmiri",           color: "#74b9ff" },
  { em: "✍️", nm: "Other",              color: "#dfe6e9" }

    ],
  },

  // ── Q3: Squad / Fridge ────────────────────────────────────────────────────
  {
    id: "squad",
    badge: "Q3 · SQUAD SIZE",
    title: "Kitchen Squad Size 👨‍👩‍👧‍👦",
    sub: "How many mouths does your kitchen feed every day?",
    tags: ["👥 Squad"],
    type: "fridge",
    xp: 150,
  },

  // ── Q4: Budget ────────────────────────────────────────────────────────────
  {
    id: "budget",
    badge: "Q4 · MONEY TALK",
    title: "Monthly Grocery Budget 💰",
    sub: "Rent is already hurting — how much goes into food?",
    tags: ["💸 Budget"],
    type: "budget",
    xp: 150,
    opts: [
      { v: "<4k",     l: "Under ₹4,000" },
      { v: "4-7k",    l: "₹4,000–₹7,000" },
      { v: "7-10k",   l: "₹7,000–₹10,000" },
      { v: "10-13k",  l: "₹10,000–₹13,000" },
      { v: "13-16k",  l: "₹13,000–₹16,000" },
      { v: "16-20k",  l: "₹16,000–₹20,000" },
      { v: ">20k",    l: "₹20,000+" },
    ],
  },

  // ── Q5: Boss ──────────────────────────────────────────────────────────────
  {
    id: "boss",
    badge: "Q5 · POWER CHECK",
    title: "The Real Kitchen Boss 👑",
    sub: "Every kitchen has one true ruler. Who actually controls the cart?",
    tags: ["👑 Power"],
    type: "boss",
    xp: 120,
    opts: [
      { em: "👩", t: "The Female Boss",      s: "She runs this kitchen" },
      { em: "👨", t: "The Male Boss",        s: "He who bulk-buys everything" },
      { em: "👵", t: "Parents still rule",   s: "They always know best" },
      { em: "😅", t: "Whoever panics first", s: "Whoever spots the empty fridge" },
    ],
  },

  // ── Q6: Frequency ─────────────────────────────────────────────────────────
  {
    id: "frequency",
    badge: "Q6 · SHOPPING HABITS",
    title: "Grocery Restock Frequency 🔄",
    sub: "Your fridge is empty. How often does that actually happen?",
    tags: ["📅 Habit"],
    type: "freq",
    xp: 150,
    opts: [
      { em: "📅", t: "Almost every day",           col: "#ff2d6e", badge: "DAILY",    badgeCol: "rgba(255,45,110,.15)",  pattern: "daily" },
      { em: "🛒", t: "2–3 times a week",            col: "#ff7a3c", badge: "3×/WEEK", badgeCol: "rgba(255,122,60,.15)",  pattern: "thrice" },
      { em: "📦", t: "Once a week",                 col: "#ffd166", badge: "WEEKLY",  badgeCol: "rgba(255,209,102,.15)", pattern: "weekly" },
      { em: "🗓️", t: "Once every two weeks",        col: "#06d6a0", badge: "BIWEEKLY",badgeCol: "rgba(6,214,160,.15)",   pattern: "biweekly" },
      { em: "😬", t: "Only when the fridge is dead",col: "#b16fff", badge: "RARELY",  badgeCol: "rgba(177,111,255,.15)", pattern: "random" },
    ],
  },

  // ── Q7: Shopping Source — pills (was apps grid) ───────────────────────────
  // Using pills so it scales well and allows more options
  {
    id: "source",
    badge: "Q7 · SHOPPING SOURCE",
    title: "Where Do Your Groceries Come From? 🛍️",
    sub: "Tap your primary source — the one that fills most of your kitchen.",
    tags: ["🛍️ Source"],
    type: "pills",
    xp: 150,
    fu: true,
    otherLabel: "Name your source",
    opts: [
      { em: "🏪", nm: "Local Stores",   color: "#ffd166" },
      { em: "🏬", nm: "Supermarket",    color: "#06d6a0" },
      { em: "⚡", nm: "Blinkit",        color: "#ffd166" },
      { em: "⚡", nm: "Zepto",          color: "#ff2d6e" },
      { em: "🛵", nm: "Instamart",      color: "#ff7a3c" },
      { em: "📦", nm: "BigBasket",      color: "#4ecdc4" },
      { em: "🥬", nm: "Minutes",        color: "#06d6a0" },
      // { em: "🚜", nm: "Farm Direct",    color: "#a8e063" },
      // { em: "🏪", nm: "DMart",          color: "#0984e3" },
      { em: "🔍", nm: "The Mystery Mouse(Other)",          color: "#dfe6e9" },
    ],
  },

  // ── Q8: Night Cravings ────────────────────────────────────────────────────
  {
    id: "cravings",
    badge: "Q8 · NIGHT OPS",
    title: "Late-Night Craving Report 🌙",
    sub: "The family is asleep. The kitchen is dark. What do you do?",
    tags: ["🌙 Night Mode"],
    type: "night",
    xp: 120,
    opts: [
      { em: "🌙", t: "Weeknights",   s: "The midnight ritual" },
      { em: "🍕", t: "Weekends",     s: "Weekend warrior mode" },
      { em: "😈", t: "Every night",  s: "No rules, only snacks" },
      { em: "🤷", t: "Random chaos", s: "Unpredictable snacker" },
    ],
  },

  // ── Q9: Order Size ────────────────────────────────────────────────────────
  {
    id: "order_size",
    badge: "Q9 · CART SIZE",
    title: "Typical Online Order Value 🛒",
    sub: "When you checkout — how big does the damage usually look?",
    tags: ["🛒 Cart"],
    type: "budget",
    xp: 150,
    opts: [
      { v: "<200",      l: "Under ₹200" },
      { v: "200-400",   l: "₹200–₹400" },
      { v: "400-600",   l: "₹400–₹600" },
      { v: "600-900",   l: "₹600–₹900" },
      { v: "900-1200",  l: "₹900–₹1,200" },
      { v: "1200-1600", l: "₹1,200–₹1,600" },
      { v: ">1600",     l: "₹1,600+" },
    ],
  },

  // ── Q10: Delivery Speed ────────────────────────────────────────────────────
  {
    id: "speed",
    badge: "Q10 · SPEED RUN",
    title: "Delivery Speed Expectation 🚚",
    sub: "Order placed. Clock is ticking. How patient are you really?",
    tags: ["⚡ Speed"],
    type: "race",
    xp: 150,
    opts: [
      { em: "⚡", tm: "Under 10 min",     vb: "Need it NOW",         fill: 100, col: "#ff2d6e" },
      { em: "🚴", tm: "15–20 minutes",    vb: "Pretty quick please", fill: 72,  col: "#ff7a3c" },
      { em: "⏳", tm: "30–45 minutes",    vb: "Fairly patient",      fill: 50,  col: "#ffd166" },
      { em: "📦", tm: "Within 1–2 hours", vb: "No rush at all",      fill: 25,  col: "#4ecdc4" },
    ],
  },

  // ── Q11: QC Rating ────────────────────────────────────────────────────────
  {
    id: "qc_rating",
    badge: "Q11 · REALITY CHECK",
    title: "Quick Commerce — Hype or Hero? ⚡",
    sub: "10-minute delivery sounds great. But does it actually solve YOUR problem?",
    tags: ["⭐ Rating"],
    type: "stars",
    xp: 200,
    fu: true,
    sl: [
      '"Honestly? I can wait." Not that urgent.',
      '"Sometimes handy." Nice to have, not essential.',
      '"Pretty convenient." Saves me on busy days.',
      '"Total lifesaver." I run out of things constantly.',
      '"I LIVE by it." My fridge depends on it.',
    ],
  },

  // ── Q12: What Matters Most — pills (was 2×2 grid) ────────────────────────
  // Pills let us add more factors without cramping the layout
  {
    id: "app_factor",
    badge: "Q12 · APP WARS",
    title: "What Wins Your Order? 📱",
    sub: "One thing tips you toward an app. What is it for you?",
    tags: ["📱 Apps"],
    type: "pills",
    xp: 100,
    opts: [
      { em: "⚡", nm: "Fastest delivery",       color: "#ff2d6e" },
      { em: "💸", nm: "Lowest prices",          color: "#ffd166" },
      { em: "🎁", nm: "Best discounts",         color: "#06d6a0" },
      { em: "🏷️", nm: "Brand I trust",          color: "#a29bfe" },
      { em: "⭐", nm: "Reliable service",       color: "#ff9f43" },
      { em: "📦", nm: "Widest selection",       color: "#4ecdc4" },
      { em: "🔔", nm: "Great notifications",    color: "#fd79a8" },
      { em: "🎮", nm: "Fun app experience",     color: "#b16fff" },
      { em: "🎲", nm: "Randomly / No preference", color: "#dfe6e9" },
    ],
  },

  // ── Q13: Brand Loyalty ────────────────────────────────────────────────────
  {
    id: "loyalty",
    badge: "Q13 · BRAND WARS",
    title: "Brand Loyalty: The Test 🏷️",
    sub: "Same product. Same quality. Two brands. Your existing one vs a newcomer.",
    tags: ["🏷️ Brands"],
    type: "battle",
    xp: 150,
    opts: [
      { em: "🥫", nm: "Always stick to mine",      tg: "Loyal to the core",  ch: "A" },
      { em: "👍", nm: "Prefer mine, might try",    tg: "Cautiously curious", ch: "B" },
      { em: "🤝", nm: "Either works equally",      tg: "Quality is quality", ch: "C" },
      { em: "💸", nm: "Cheaper one wins always",   tg: "Budget is king",     ch: "D" },
      { em: "🎲", nm: "I love trying new brands",  tg: "Born to explore",    ch: "E" },
    ],
  },

  // ── Q14: Frustration — now with more options ──────────────────────────────
  {
    id: "frustration",
    badge: "Q14 · RAGE MODE",
    title: "Biggest Grocery Frustration 😤",
    sub: "Be honest. What actually makes you want to delete the app?",
    tags: ["😤 Rage", "🔥 Final Boss"],
    type: "rage",
    xp: 250,
    fu: true,
    opts: [
      { em: "❌", t: "Items out of stock",         rage: 95, col: "#ff2d6e" },
      { em: "🚚", t: "Delivery always delayed",    rage: 88, col: "#ff7a3c" },
      { em: "💰", t: "Hidden charges at checkout", rage: 80, col: "#ffd166" },
      { em: "📦", t: "Wrong / missing items",      rage: 91, col: "#b16fff" },
      { em: "📱", t: "App crashes / freezes",      rage: 72, col: "#4ecdc4" },
      { em: "🛵", t: "Delivery person issues",     rage: 65, col: "#ff9f43" },
      { em: "📸", t: "Product looks nothing like the photo", rage: 78, col: "#fd79a8" },
    ],
  },

  // ── Q15: Innovation Lab ───────────────────────────────────────────────────
  {
    id: "innovation",
    badge: "Q15 · INNOVATION LAB",
    title: "The Innovation Lab 💡🚀",
    sub: "You've used every app. Now you're the CEO. What's the one feature you'd build?",
    tags: ["💡 Innovation", "🚀 Future"],
    type: "idea",
    xp: 300,
    fu: true,
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length; // 15

// ─── FREQUENCY CALENDAR HELPER ────────────────────────────────────────────────

export const getShopDays = (pattern: FreqOption["pattern"]): number[] => {
  switch (pattern) {
    case "daily":    return Array.from({ length: 28 }, (_, i) => i);
    case "thrice":   return [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26];
    case "weekly":   return [0, 7, 14, 21];
    case "biweekly": return [0, 14];
    case "random":   return [4, 19];
    default:         return [];
  }
};