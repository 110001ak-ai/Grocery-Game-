"use client";

import { useGameStore } from "@/store/gameStore";
import { QUESTIONS } from "@/lib/questions";
import { THEME } from "@/lib/theme";

export default function HUD() {
  const { mode, xp, coins, currentQ } = useGameStore();
  const pct = Math.round((currentQ / QUESTIONS.length) * 100);

  return (
    <div className="w-full mb-2">
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl mb-2"
        style={{ background: "var(--hud-bg)", border: "1.5px solid var(--border)", backdropFilter: "blur(18px)", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
        <div className="flex items-center gap-2.5">
          <span className="text-3xl avatar-bob">{mode === "queen" ? "👑" : "🤴"}</span>
          <div className="font-orbitron text-[11px] font-bold tracking-widest" style={{ color: "var(--text)" }}>
            {mode === "queen" ? "QUEEN" : "KING"}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full font-bebas text-base tracking-wide"
            style={{ background: THEME.hud.coinBg, border: `1.5px solid ${THEME.hud.coinBorder}`, color: THEME.hud.coinText }}>
            🪙 {coins}
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full font-bebas text-base tracking-wide"
            style={{ background: THEME.hud.xpBg, border: `1.5px solid ${THEME.hud.xpBorder}`, color: THEME.hud.xpText }}>
            ⚡ {xp}
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-display text-[13px]" style={{ color: "var(--text2)" }}>
            Question {currentQ + 1} / {QUESTIONS.length}
          </span>
          <span className="font-orbitron text-[10px] font-bold" style={{ color: THEME.primary }}>
            {pct}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: THEME.progress.track }}>
          <div className="h-full rounded-full prog-fill"
            style={{ width: `${pct}%`, background: THEME.progress.fill, boxShadow: THEME.progress.shadow }} />
        </div>
      </div>
    </div>
  );
}