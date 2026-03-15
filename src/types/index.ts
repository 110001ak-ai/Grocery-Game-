// ─── Question option shapes ─────────────────────────────────────────────────

export interface CityOption {
  em: string;
  nm: string;
  tg: string;
}

export interface GridOption {
  em: string;
  t: string;
  s: string;
}

export interface BudgetOption {
  v: string;
  l: string;
}

export interface FreqOption {
  em: string;
  t: string;
  col: string;
  badge: string;
  badgeCol: string;
  pattern: "daily" | "thrice" | "weekly" | "biweekly" | "random";
}

export interface AppOption {
  em: string;
  nm: string;
}

export interface NightOption {
  em: string;
  t: string;
  s: string;
}

export interface RaceOption {
  em: string;
  tm: string;
  vb: string;
  fill: number;
  col: string;
}

export interface BattleOption {
  em: string;
  nm: string;
  tg: string;
  ch: string;
}

export interface RageOption {
  em: string;
  t: string;
  rage: number;
  col: string;
}

export interface DropdownOption {
  em: string;
  nm: string;
}

export interface PillOption {
  em: string;
  nm: string;
  color?: string;
  group?: string;
  vegType?: "veg" | "nonveg" | "both";
}

// ─── Question types ──────────────────────────────────────────────────────────

export type QuestionType =
  | "city"
  | "fridge"
  | "budget"
  | "boss"
  | "freq"
  | "apps"
  | "night"
  | "stars"
  | "race"
  | "battle"
  | "rage"
  | "grid2"
  | "dropdown"
  | "pills"
  | "idea";

export interface BaseQuestion {
  id: string;
  badge: string;
  title: string;
  sub: string;
  tags: string[];
  type: QuestionType;
  xp: number;
  fu?: boolean;
}

export interface CityQuestion extends BaseQuestion {
  type: "city";
  opts: CityOption[];
}

export interface FridgeQuestion extends BaseQuestion {
  type: "fridge";
}

export interface BudgetQuestion extends BaseQuestion {
  type: "budget";
  opts: BudgetOption[];
}

export interface BossQuestion extends BaseQuestion {
  type: "boss";
  opts: GridOption[];
}

export interface FreqQuestion extends BaseQuestion {
  type: "freq";
  opts: FreqOption[];
}

export interface AppsQuestion extends BaseQuestion {
  type: "apps";
  opts: AppOption[];
  fu: true;
}

export interface NightQuestion extends BaseQuestion {
  type: "night";
  opts: NightOption[];
}

export interface StarsQuestion extends BaseQuestion {
  type: "stars";
  sl: string[];
  fu: true;
}

export interface RaceQuestion extends BaseQuestion {
  type: "race";
  opts: RaceOption[];
}

export interface BattleQuestion extends BaseQuestion {
  type: "battle";
  opts: BattleOption[];
}

export interface RageQuestion extends BaseQuestion {
  type: "rage";
  opts: RageOption[];
  fu: true;
}

export interface Grid2Question extends BaseQuestion {
  type: "grid2";
  opts: GridOption[];
}

export interface DropdownQuestion extends BaseQuestion {
  type: "dropdown";
  opts: DropdownOption[];
  fu: true;
}

export interface PillsQuestion extends BaseQuestion {
  type: "pills";
  opts: PillOption[];
  fu?: boolean;
  otherLabel?: string;
}

export interface IdeaQuestion extends BaseQuestion {
  type: "idea";
  fu: true;
}

export type Question =
  | CityQuestion
  | FridgeQuestion
  | BudgetQuestion
  | BossQuestion
  | FreqQuestion
  | AppsQuestion
  | NightQuestion
  | StarsQuestion
  | RaceQuestion
  | BattleQuestion
  | RageQuestion
  | Grid2Question
  | DropdownQuestion
  | PillsQuestion
  | IdeaQuestion;

// ─── Game state ──────────────────────────────────────────────────────────────

export type GameMode = "queen" | "king";
export type GameScreen = "splash" | "intro" | "game" | "end";

export interface Answers {
  [questionId: string]: string | number;
}

export interface GameState {
  screen:      GameScreen;
  mode:        GameMode | null;
  currentQ:    number;
  answers:     Answers;
  textAnswers: Record<string, string>;
  coins:       number;
  xp:          number;
  streak:      number;
  textBonusXp: number;
  isDark:      boolean;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export interface DeviceMeta {
  // ── Browser / UA ──────────────────────────────────────────────────────────
  userAgent:        string;
  language:         string;
  languages:        string[];
  platform:         string;
  vendor:           string;
  cookieEnabled:    boolean;
  doNotTrack:       string | null;
  online:           boolean;
  pdfViewerEnabled: boolean | null;

  // ── Display ───────────────────────────────────────────────────────────────
  screenWidth:      number;
  screenHeight:     number;
  availWidth:       number;
  availHeight:      number;
  windowWidth:      number;
  windowHeight:     number;
  devicePixelRatio: number;
  colorDepth:       number;
  pixelDepth:       number;
  orientation:      string | null;
  isFullscreen:     boolean;

  // ── Hardware ──────────────────────────────────────────────────────────────
  cpuCores:         number | null;
  deviceMemoryGB:   number | null;
  maxTouchPoints:   number | null;
  gpu:              string | null;

  // ── Battery ───────────────────────────────────────────────────────────────
  batteryLevel:         number | null;   // 0–100
  batteryCharging:      boolean | null;
  batteryChargingTime:  number | null;   // seconds
  batteryDischargingTime: number | null; // seconds

  // ── Network ───────────────────────────────────────────────────────────────
  networkEffectiveType: string | null;   // '4g' | '3g' | '2g' | 'slow-2g'
  networkDownlink:      number | null;   // Mbps
  networkRtt:           number | null;   // ms
  networkSaveData:      boolean | null;

  // ── Theme / Preferences ───────────────────────────────────────────────────
  deviceTheme:          "dark" | "light";
  prefersReducedMotion: boolean;
  prefersContrast:      "more" | "none";
  forcedColors:         boolean;

  // ── Storage ───────────────────────────────────────────────────────────────
  storageQuotaMB: number | null;
  storageUsageMB: number | null;

  // ── Permissions ───────────────────────────────────────────────────────────
  permNotifications: string | null;
  permGeolocation:   string | null;
  permCamera:        string | null;
  permMicrophone:    string | null;
  permClipboard:     string | null;

  // ── Time / Locale ─────────────────────────────────────────────────────────
  timezone:         string;
  timezoneOffset:   number;
  locale:           string;
  landedAt:         string;

  // ── Page ──────────────────────────────────────────────────────────────────
  url:      string;
  referrer: string;
  title:    string;
}

export interface IpMeta {
  ip:      string | null;
  country: string | null;
  region:  string | null;
  city:    string | null;
  isp:     string | null;
}

// ─── Submission payload ──────────────────────────────────────────────────────

export interface SurveySubmission {
  submittedAt: string;
  sessionId:   string;
  mode:        GameMode;
  answers:     Answers;
  textAnswers: Record<string, string>;
  score: {
    xp:          number;
    coins:       number;
    streak:      number;
    textBonusXp: number;
    // rank:        string;
    // personality: string;
  };
  meta: {
    device: DeviceMeta;
    ip:     IpMeta;
  };
}

// ─── Rank / Personality ──────────────────────────────────────────────────────

export interface Rank {
  min: number;
  t:   string;
  d:   string;
}

export interface Personality {
  min: number;
  em:  string;
  t:   string;
  d:   string;
}