"use client";

import { useState, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { SQUAD_LABELS, PATIALA_LABEL } from "@/lib/questions";
import { THEME } from "@/lib/theme";

interface Props {
  onSelect: (value: string) => void;
  currentValue: string | null;
}

const QUEEN_FACES = ["👩","👨","👧","👦","👵","👴"];
const KING_FACES  = ["👨","👩","👦","👧","👴","👵"];

export default function FridgeQuestion({ onSelect, currentValue }: Props) {
  const { mode } = useGameStore();

  // Default to 1 instead of 0
  const [count, setCount] = useState<number>(
    currentValue ? (currentValue === "6+" ? 7 : parseInt(currentValue, 10)) : 1
  );
  const [bump, setBump] = useState(false);

  const faces = mode === "queen" ? QUEEN_FACES : KING_FACES;

  const update = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(12, n));
    setCount(clamped);
    setBump(true);
    setTimeout(() => setBump(false), 300);
    onSelect(clamped >= 7 ? "6+" : String(clamped));
    if (navigator.vibrate) navigator.vibrate(10);
  }, [onSelect]);

  // Fire initial select on mount with default 1
  useState(() => { onSelect("1"); });

  const label = count >= 7 ? PATIALA_LABEL : SQUAD_LABELS[count] ?? "";
  const displayNum = count >= 7 ? "6+" : String(count);
  const visibleFaces = faces.slice(0, Math.min(count, 6));
  const personSize = count === 1 ? "72px" : count === 2 ? "52px" : count <= 4 ? "44px" : "36px";

  return (
    <div className="flex flex-col items-center gap-4">
      <style>{`
        @keyframes personIn {
          0%   { opacity:0; transform:scale(0.2) rotate(-20deg) translateY(20px); }
          60%  { transform:scale(1.15) rotate(4deg) translateY(-4px); }
          100% { opacity:1; transform:scale(1) rotate(0) translateY(0); }
        }
        @keyframes personOut {
          0%   { opacity:1; transform:scale(1); }
          100% { opacity:0; transform:scale(0.2) rotate(15deg) translateY(20px); }
        }
        @keyframes countBump {
          0%,100% { transform:scale(1); }
          40%      { transform:scale(1.35); }
        }
        @keyframes stageGlow {
          0%,100% { box-shadow: 0 0 0 0 transparent; }
          50%      { box-shadow: 0 0 20px var(--stage-glow); }
        }
      `}</style>

      {/* ── Stage ─────────────────────────────────────────────────────────── */}
      <div
        className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 py-6 px-4"
        style={{
          minHeight: "160px",
          background: "var(--opt-bg)",
          border: `2px solid ${count >= 7 ? "#ff5252" : count > 1 ? THEME.gold + "55" : "var(--border)"}`,
          transition: "border-color 0.4s",
          ["--stage-glow" as string]: count >= 7 ? "rgba(255,82,82,0.3)" : "rgba(232,169,69,0.3)",
        }}
      >
        {/* People display */}
        <div className="flex flex-wrap gap-2 items-end justify-center">
          {visibleFaces.map((face, i) => (
            <div
              key={`${face}-${i}`}
              className="relative leading-none"
              style={{
                fontSize: personSize,
                animation: `personIn 0.45s ${i * 40}ms cubic-bezier(0.34,1.56,0.64,1) both`,
              }}
            >
              {face}
              {i === 5 && count >= 7 && (
                <span className="extra-badge">+{count - 6}</span>
              )}
            </div>
          ))}
        </div>

        {/* Squad label */}
        <div
          className="font-display text-[17px] text-center leading-tight"
          style={{
            color: count >= 7 ? "#ff5252" : "var(--gold)",
            minHeight: "24px",
            transition: "color 0.3s",
            animation: bump ? "countBump 0.3s ease-out" : "none",
          }}
        >
          {label}
        </div>
      </div>

      {/* ── +/- Controls ──────────────────────────────────────────────────── */}
      <div className="flex w-full gap-3 items-center">

        {/* Minus */}
        <button
          onClick={() => update(count - 1)}
          disabled={count <= 1}
          className="flex items-center justify-center rounded-2xl cursor-pointer border-none active:scale-90 transition-all"
          style={{
            width: "64px", height: "64px",
            background: count <= 1 ? "var(--opt-bg)" : "var(--opt-bg-h)",
            border: `2px solid ${count <= 1 ? "var(--border)" : "var(--border)"}`,
            color: count <= 1 ? "var(--text3)" : "var(--text)",
            fontSize: "26px",
            fontWeight: 900,
            opacity: count <= 1 ? 0.35 : 1,
            transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          aria-label="Remove person"
        >
          −
        </button>

        {/* Count display */}
        <div
          className="flex-1 flex items-center justify-center rounded-2xl font-bebas"
          style={{
            height: "64px",
            fontSize: "36px",
            background: "var(--opt-bg)",
            border: "2px solid var(--border)",
            color: count >= 7 ? "#ff5252" : THEME.primary,
            transition: "color 0.3s",
            animation: bump ? "countBump 0.3s cubic-bezier(0.34,1.56,0.64,1)" : "none",
          }}
        >
          {displayNum}
        </div>

        {/* Plus — big, orange, obvious */}
        <button
          onClick={() => update(count + 1)}
          disabled={count >= 12}
          className="flex items-center justify-center rounded-2xl cursor-pointer border-none active:scale-90 transition-all"
          style={{
            width: "64px", height: "64px",
            background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.gold})`,
            color: "#fff",
            fontSize: "26px",
            fontWeight: 900,
            boxShadow: count < 12 ? `0 6px 20px rgba(232,104,10,0.4)` : "none",
            opacity: count >= 12 ? 0.4 : 1,
            transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
            border: "none",
          }}
          aria-label="Add person"
        >
          +
        </button>
      </div>

      {/* ── Tap hint ──────────────────────────────────────────────────────── */}
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-center" style={{ color: "var(--text3)" }}>
        tap + to add · minimum 1
      </p>
    </div>
  );
}