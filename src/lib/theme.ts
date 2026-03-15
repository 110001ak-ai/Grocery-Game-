export const THEME = {

  // ── Brand palette ──────────────────────────────────────────────────────────
  primary:  "#e8680a",
  gold:     "#e8a945",
  accent:   "#7C3AED",
  pink:     "#ff2d6e",
  teal:     "#00e5c3",
  purple:   "#b16fff",
  orange:   "#ff7a3c",

  // ── Spacing / radius ───────────────────────────────────────────────────────
  radius:    "20px",
  radiusSm:  "14px",
  radiusXs:  "10px",

  // ── Typography scale ───────────────────────────────────────────────────────
  fontDisplay: "Fredoka",
  fontBody:    "Nunito",
  fontMono:    "Orbitron",
  fontBebas:   "Bebas Neue",

  // ── Dark theme tokens ──────────────────────────────────────────────────────
  dark: {
    bg:        "#04040f",
    card:      "#0c0c22",
    border:    "rgba(255,255,255,0.09)",
    border2:   "rgba(255,255,255,0.05)",
    text:      "#ffffff",
    text2:     "rgba(255,255,255,0.55)",
    text3:     "rgba(255,255,255,0.25)",
    optBg:     "rgba(255,255,255,0.04)",
    optBgH:    "rgba(255,255,255,0.08)",
    hudBg:     "rgba(255,255,255,0.03)",
    toastBg:   "rgba(10,10,30,0.96)",
    gridLine:  "rgba(255,255,255,0.02)",
  },

  // ── Light theme tokens ─────────────────────────────────────────────────────
  light: {
    bg:        "#f0f2fc",
    card:      "#ffffff",
    border:    "rgba(0,0,0,0.09)",
    border2:   "rgba(0,0,0,0.05)",
    text:      "#1a1a2e",
    text2:     "rgba(26,26,46,0.6)",
    text3:     "rgba(26,26,46,0.35)",
    optBg:     "rgba(0,0,0,0.03)",
    optBgH:    "rgba(0,0,0,0.07)",
    hudBg:     "rgba(255,255,255,0.85)",
    toastBg:   "rgba(255,255,255,0.97)",
    gridLine:  "rgba(0,0,0,0.04)",
  },

  // ── Button: Primary CTA ────────────────────────────────────────────────────
  btn: {
    bg:      "linear-gradient(135deg, #e8680a, #c05008)",
    border:  "rgba(232,104,10,0.5)",
    borderH: "rgba(232,104,10,0.8)",
    text:    "#ffffff",
    shadow:  "0 4px 20px rgba(232,104,10,0.35)",
    shadowH: "0 8px 28px rgba(232,104,10,0.5)",
  },

  // ── Button: Secondary ─────────────────────────────────────────────────────
  btnSecondary: {
    bg:      "var(--opt-bg)",
    border:  "var(--border)",
    borderH: "rgba(232,104,10,0.35)",
    text:    "var(--text2)",
    shadow:  "none",
    shadowH: "none",
  },

  // ── Button: Danger ────────────────────────────────────────────────────────
  btnDanger: {
    bg:      "rgba(255,45,110,0.10)",
    border:  "rgba(255,45,110,0.30)",
    borderH: "rgba(255,45,110,0.55)",
    text:    "#ff6b95",
    shadow:  "none",
    shadowH: "0 4px 16px rgba(255,45,110,0.2)",
  },

  // ── Button: Ghost / Disabled ──────────────────────────────────────────────
  btnGhost: {
    bg:      "var(--opt-bg)",
    border:  "var(--border2)",
    borderH: "var(--border2)",
    text:    "var(--text3)",
    shadow:  "none",
    shadowH: "none",
  },

  // ── Button: WhatsApp ──────────────────────────────────────────────────────
  btnWhatsapp: {
    bg:      "rgba(37,211,102,0.12)",
    border:  "rgba(37,211,102,0.35)",
    borderH: "rgba(37,211,102,0.60)",
    text:    "#4ade80",
    shadow:  "none",
    shadowH: "0 4px 16px rgba(37,211,102,0.2)",
  },

  // ── Button: Purple / Share ────────────────────────────────────────────────
  btnPurple: {
    bg:      "rgba(124,58,237,0.12)",
    border:  "rgba(124,58,237,0.35)",
    borderH: "rgba(124,58,237,0.60)",
    text:    "#a78bfa",
    shadow:  "none",
    shadowH: "0 4px 16px rgba(124,58,237,0.2)",
  },

  // ── Option cards ──────────────────────────────────────────────────────────
  opt: {
    bg:             "var(--opt-bg)",
    bgH:            "var(--opt-bg-h)",
    border:         "var(--border)",
    selectedBg:     "rgba(232,104,10,0.10)",
    selectedBorder: "#e8680a",
    selectedShadow: "0 0 0 1px #e8680a inset, 0 0 20px rgba(232,104,10,0.15)",
  },

  // ── Tags / XP chips ───────────────────────────────────────────────────────
  tag: {
    primaryBg:     "rgba(232,104,10,0.09)",
    primaryBorder: "rgba(232,104,10,0.20)",
    primaryText:   "#e8680a",
    xpBg:          "rgba(124,58,237,0.10)",
    xpBorder:      "rgba(124,58,237,0.22)",
    xpText:        "#a78bfa",
  },

  // ── HUD chips ─────────────────────────────────────────────────────────────
  hud: {
    coinBg:     "rgba(232,169,69,0.08)",
    coinBorder: "rgba(232,169,69,0.22)",
    coinText:   "#e8a945",
    xpBg:       "rgba(124,58,237,0.08)",
    xpBorder:   "rgba(124,58,237,0.22)",
    xpText:     "#9d7fe8",
  },

  // ── Progress bar ──────────────────────────────────────────────────────────
  progress: {
    fill:   "linear-gradient(90deg, #e8680a, #e8a945)",
    shadow: "0 0 8px rgba(232,104,10,0.45)",
    track:  "var(--border2)",
  },

  // ── Card shell ────────────────────────────────────────────────────────────
  card: {
    bg:     "var(--card)",
    border: "1.5px solid var(--border)",
    shadow: "0 8px 40px rgba(0,0,0,0.2)",
  },

  // ── Animated stripe ───────────────────────────────────────────────────────
  stripe: "linear-gradient(90deg, #e8680a, #e8a945, #7C3AED, #e8680a)",

  // ── Splash screen tokens ──────────────────────────────────────────────────
  splash: {
    glow:     "rgba(232,104,10,0.09)",
    titleA:   "linear-gradient(135deg, #e8680a 0%, #e8a945 45%, #e8680a 100%)",
    titleB:   "linear-gradient(135deg, #e8a945 0%, #e8680a 50%, #c0392b 100%)",
    scanLine: "rgba(232,104,10,0.25)",
    heroDrop: "rgba(232,104,10,0.40)",
    heroGlow: "rgba(232,104,10,0.22)",
  },

  // ── Animation durations ───────────────────────────────────────────────────
  anim: {
    fast:   "0.18s",
    normal: "0.28s",
    slow:   "0.45s",
    spring: "cubic-bezier(0.34,1.56,0.64,1)",
    enter:  "cubic-bezier(0.34,1.4,0.64,1)",
    exit:   "cubic-bezier(0.6,0,0.8,1)",
  },

} as const;

// ─── CSS var generators ───────────────────────────────────────────────────────

export function getDarkVars(): string {
  const d = THEME.dark;
  return `
    --primary:   ${THEME.primary};
    --accent:    ${THEME.accent};
    --pink:      ${THEME.pink};
    --gold:      ${THEME.gold};
    --teal:      ${THEME.teal};
    --purple:    ${THEME.purple};
    --orange:    ${THEME.orange};
    --radius:    ${THEME.radius};
    --radius-sm: ${THEME.radiusSm};
    --bg:        ${d.bg};
    --card:      ${d.card};
    --border:    ${d.border};
    --border2:   ${d.border2};
    --text:      ${d.text};
    --text2:     ${d.text2};
    --text3:     ${d.text3};
    --opt-bg:    ${d.optBg};
    --opt-bg-h:  ${d.optBgH};
    --hud-bg:    ${d.hudBg};
    --toast-bg:  ${d.toastBg};
    --grid-line: ${d.gridLine};
  `.trim();
}

export function getLightVars(): string {
  const l = THEME.light;
  return `
    --primary:   ${THEME.primary};
    --accent:    ${THEME.accent};
    --pink:      ${THEME.pink};
    --gold:      ${THEME.gold};
    --teal:      ${THEME.teal};
    --purple:    ${THEME.purple};
    --orange:    ${THEME.orange};
    --radius:    ${THEME.radius};
    --radius-sm: ${THEME.radiusSm};
    --bg:        ${l.bg};
    --card:      ${l.card};
    --border:    ${l.border};
    --border2:   ${l.border2};
    --text:      ${l.text};
    --text2:     ${l.text2};
    --text3:     ${l.text3};
    --opt-bg:    ${l.optBg};
    --opt-bg-h:  ${l.optBgH};
    --hud-bg:    ${l.hudBg};
    --toast-bg:  ${l.toastBg};
    --grid-line: ${l.gridLine};
  `.trim();
}

// ─── Button variant helper ────────────────────────────────────────────────────
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "whatsapp" | "purple";

export function getBtnTokens(variant: ButtonVariant) {
  switch (variant) {
    case "primary":   return THEME.btn;
    case "secondary": return THEME.btnSecondary;
    case "danger":    return THEME.btnDanger;
    case "ghost":     return THEME.btnGhost;
    case "whatsapp":  return THEME.btnWhatsapp;
    case "purple":    return THEME.btnPurple;
  }
}