"use client";

import { useState } from "react";
import type { BossQuestion as BossQ } from "@/types";
import { triggerBigBurst } from "@/components/effects/particles";

interface Props {
  question: BossQ;
  selected: string | null;
  onSelect: (value: string) => void;
}

const BOSS_COLORS = ["#c084fc", "#60a5fa", "#fb923c", "#34d399"];

export default function BossQuestion({ question, selected, onSelect }: Props) {
  const [popped, setPopped] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setPopped(value);
    onSelect(value);
    setTimeout(() => triggerBigBurst(), 0);
    setTimeout(() => setPopped(null), 500);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {question.opts.map((opt, i) => {
        const isSel   = selected === opt.t;
        const isPop   = popped === opt.t;
        const accent  = BOSS_COLORS[i % BOSS_COLORS.length];

        return (
          <button
            key={opt.t}
            onClick={() => handleSelect(opt.t)}
            className="relative flex flex-col items-center text-center rounded-2xl cursor-pointer border-none overflow-hidden"
            style={{
              paddingTop: "32px",
              paddingBottom: "16px",
              paddingLeft: "12px",
              paddingRight: "12px",
              minHeight: "130px",
              background: isSel ? `${accent}18` : "var(--opt-bg)",
              border: `2px solid ${isSel ? accent : "var(--border)"}`,
              boxShadow: isSel
                ? `0 0 0 1px ${accent}55 inset, 0 8px 28px ${accent}30`
                : "none",
              transform: isPop ? "scale(0.93)" : isSel ? "scale(1.03)" : "scale(1)",
              transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              animation: `cardIn 0.35s ${i * 0.07}s cubic-bezier(0.34,1.4,0.64,1) both`,
            }}
          >
            {/* Accent corner triangle */}
            <div
              className="absolute top-0 right-0 pointer-events-none"
              style={{
                width: 0, height: 0,
                borderTop: `36px solid ${accent}33`,
                borderLeft: "36px solid transparent",
                opacity: isSel ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            />

            {/* Crown drops from above */}
            <span
              className="absolute text-xl pointer-events-none"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: isSel ? "6px" : "-30px",
                opacity: isSel ? 1 : 0,
                filter: `drop-shadow(0 0 8px ${accent})`,
                transition: "top 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
              }}
            >
              👑
            </span>

            {/* Emoji */}
            <span
              className="leading-none select-none"
              style={{
                fontSize: "40px",
                marginBottom: "8px",
                display: "inline-block",
                transform: isSel ? "scale(1.2) rotate(-6deg)" : "scale(1)",
                filter: isSel ? `drop-shadow(0 4px 12px ${accent}88)` : "none",
                transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {opt.em}
            </span>

            <div
              className="font-extrabold text-[13px] leading-tight"
              style={{ color: isSel ? accent : "var(--text)" }}
            >
              {opt.t}
            </div>
            <div
              className="text-[10px] font-semibold mt-1 leading-snug"
              style={{ color: "var(--text3)" }}
            >
              {opt.s}
            </div>

            {/* Bottom accent bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                background: accent,
                transform: isSel ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                borderRadius: "0 0 10px 10px",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}