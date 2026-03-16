import { create } from "zustand";
import type { GameScreen, GameMode, Answers, DeviceMeta, IpMeta } from "@/types";
import { QUESTIONS } from "@/lib/questions";
import { collectDeviceMeta, sendMetaToServer } from "@/lib/metadata";
import { buildSubmissionPayload, submitSurvey } from "@/lib/submission";

interface GameStore {
  screen:        GameScreen;
  mode:          GameMode | null;
  currentQ:      number;
  answers:       Answers;
  textAnswers:   Record<string, string>;
  coins:         number;
  xp:            number;
  streak:        number;
  textBonusXp:   number;
  isDark:        boolean;
  dropdownOpen:  boolean;
  deviceMeta:    DeviceMeta | null;
  ipMeta:        IpMeta | null;
  isSubmitting:  boolean;
  submitError:   boolean; // ← new

  initMeta:        () => Promise<void>;
  setMode:         (mode: GameMode) => void;
  startGame:       () => void;
  setAnswer:       (questionId: string, value: string | number) => void;
  setTextAnswer:   (questionId: string, value: string) => void;
  nextQuestion:    () => Promise<void>;
  prevQuestion:    () => void;
  restartGame:     () => void;
  toggleTheme:     () => void;
  setDropdownOpen: (open: boolean) => void;
  retrySubmit:     () => Promise<void>; // ← new
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen:       "splash",
  mode:         null,
  currentQ:     0,
  answers:      {},
  textAnswers:  {},
  coins:        0,
  xp:           0,
  streak:       0,
  textBonusXp:  0,
  isDark:       true,
  dropdownOpen: false,
  deviceMeta:   null,
  ipMeta:       null,
  isSubmitting: false,
  submitError:  false, // ← new

  initMeta: async () => {
    const device = await collectDeviceMeta();
    set({ deviceMeta: device });
    await sendMetaToServer(device);
  },

  setMode: (mode) => set({ mode }),

  startGame: () => {
    if (!get().mode) return;
    set({ screen: "game", currentQ: 0, dropdownOpen: false });
  },

  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),

  setTextAnswer: (questionId, value) =>
    set((state) => ({ textAnswers: { ...state.textAnswers, [questionId]: value } })),

 nextQuestion: async () => {
  const state = get();
  const q = QUESTIONS[state.currentQ];

  // console.log("nextQuestion called", state.currentQ, QUESTIONS.length);  // ← add

  if (!q || state.answers[q.id] === undefined) {
    // console.log("early return — no answer");  // ← add
    return;
  }

  const textVal        = state.textAnswers[q.id] ?? "";
  const textBonus      = textVal.trim().length > 3 ? 40 : 0;
  const newXp          = state.xp + q.xp + textBonus;
  const newCoins       = state.coins + 100;
  const newStreak      = state.streak + 1;
  const newTextBonusXp = state.textBonusXp + textBonus;

  if (state.currentQ >= QUESTIONS.length - 1) {
    // console.log("LAST QUESTION — submitting");  // ← add
    set({
      xp: newXp, coins: newCoins, streak: newStreak,
      textBonusXp: newTextBonusXp, isSubmitting: true, submitError: false,
    });
    try {
      const device  = state.deviceMeta ?? await collectDeviceMeta();
      const payload = buildSubmissionPayload({
        mode:        state.mode!,
        answers:     state.answers,
        textAnswers: state.textAnswers,
        xp:          newXp,
        coins:       newCoins,
        streak:      newStreak,
        textBonusXp: newTextBonusXp,
        device,
        ip: state.ipMeta ?? { ip: null, country: null, region: null, city: null, isp: null },
      });
      // console.log("calling submitSurvey");  // ← add
      await submitSurvey(payload);
      // console.log("submitSurvey success");  // ← add
      set({ screen: "end", isSubmitting: false, submitError: false });
    } catch (err) {
      // console.error("submitSurvey threw:", err);  // ← add
      set({ isSubmitting: false, submitError: true });
    }
    return;
  }

  set({
    xp:           newXp,
    coins:        newCoins,
    streak:       newStreak,
    textBonusXp:  newTextBonusXp,
    currentQ:     state.currentQ + 1,
    dropdownOpen: false,
  });
},
  // ── Retry after failure ───────────────────────────────────────────────────
  retrySubmit: async () => {
    const state = get();
    set({ isSubmitting: true, submitError: false });
    try {
      const device  = state.deviceMeta ?? await collectDeviceMeta();
      const payload = buildSubmissionPayload({
        mode:        state.mode!,
        answers:     state.answers,
        textAnswers: state.textAnswers,
        xp:          state.xp,
        coins:       state.coins,
        streak:      state.streak,
        textBonusXp: state.textBonusXp,
        device,
        ip: state.ipMeta ?? { ip: null, country: null, region: null, city: null, isp: null },
      });
      await submitSurvey(payload);
      set({ screen: "end", isSubmitting: false, submitError: false });
    } catch {
      set({ isSubmitting: false, submitError: true });
    }
  },

  prevQuestion: () => {
    const { currentQ, xp, coins, streak } = get();
    if (currentQ === 0) return;
    const prevQ = QUESTIONS[currentQ - 1];
    set({
      currentQ:     currentQ - 1,
      xp:           Math.max(0, xp - prevQ.xp),
      coins:        Math.max(0, coins - 100),
      streak:       Math.max(0, streak - 1),
      dropdownOpen: false,
    });
  },

  restartGame: () =>
    set({
      screen:       "intro",
      mode:         null,
      currentQ:     0,
      answers:      {},
      textAnswers:  {},
      coins:        0,
      xp:           0,
      streak:       0,
      textBonusXp:  0,
      dropdownOpen: false,
      submitError:  false,
    }),

  toggleTheme: () => {
    set((state) => {
      const next = !state.isDark;
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(next ? "dark" : "light");
      return { isDark: next };
    });
  },

  setDropdownOpen: (open) => set({ dropdownOpen: open }),
}));