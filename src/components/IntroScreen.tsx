"use client";

import { useGameStore } from "@/store/gameStore";
import Button from "@/components/ui/Button";
import type { GameMode } from "@/types";

export default function IntroScreen() {
  const { mode, setMode, startGame } = useGameStore();

  const cards: { m: GameMode; em: string; label: string; desc: string; cls: string }[] = [
    { m: "queen", em: "👑", label: "Queen Mode", desc: "She who decides what gets cooked", cls: "#c084fc" },
    { m: "king",  em: "🤴", label: "King Mode",  desc: "He who silently reorders snacks",  cls: "var(--gold)" },
  ];

  return (
    <div className="w-full pt-6 pb-5" style={{ animation: "cardIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both" }}>
      {/* Hero */}
      <div className="text-center mb-6">
        <span className="text-6xl block mb-2" style={{ animation: "splashFloat 2.5s ease-in-out infinite", filter: "drop-shadow(0 0 20px rgba(255,122,0,0.5))" }}>
          🛒
        </span>
        <h2
          className="font-display mb-1.5"
          style={{
            fontSize: "clamp(28px,8vw,38px)",
            background: "linear-gradient(135deg,var(--primary),var(--gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Pick Your Mode
        </h2>
        <p className="text-sm font-semibold" style={{ color: "var(--text2)" }}>
          Who runs your kitchen? Choose wisely…
        </p>
      </div>

      {/* Mode cards */}
      <p className="font-orbitron text-[10px] font-bold tracking-[0.18em] uppercase text-center mb-3" style={{ color: "var(--text3)" }}>
        Choose Your Mode
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {cards.map(({ m, em, label, desc, cls }) => {
          const isSelected = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative flex flex-col items-center text-center pt-8 pb-5 px-3 rounded-2xl cursor-pointer border-none transition-all duration-300 min-h-[130px]"
              style={{
                background: isSelected ? `${cls}18` : "var(--opt-bg)",
                border: `2px solid ${isSelected ? cls : "var(--border)"}`,
                boxShadow: isSelected ? `0 0 0 1px ${cls} inset, 0 8px 24px ${cls}30` : "none",
                transform: isSelected ? "scale(1.04)" : "scale(1)",
              }}
            >
              {/* Crown drop */}
              <span
                className="absolute left-1/2 -translate-x-1/2 text-2xl pointer-events-none transition-all duration-400"
                style={{
                  top: isSelected ? "4px" : "-28px",
                  opacity: isSelected ? 1 : 0,
                  filter: "drop-shadow(0 0 8px gold)",
                  transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                👑
              </span>

              <span
                className="text-[40px] mb-1.5 block transition-transform duration-300"
                style={{ transform: isSelected ? "scale(1.15) rotate(-5deg)" : "scale(1)" }}
              >
                {em}
              </span>
              <div className="font-display text-base mb-1" style={{ color: "var(--text)" }}>{label}</div>
              <div className="text-[11px] font-semibold leading-snug" style={{ color: "var(--text2)" }}>{desc}</div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <Button variant={mode ? "primary" : "ghost"} fullWidth onClick={startGame} disabled={!mode} className="text-xl py-5">
        {mode ? "Continue →" : "Select a mode to continue"}
      </Button>
    </div>
  );
}
