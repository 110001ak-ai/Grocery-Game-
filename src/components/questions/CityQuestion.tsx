"use client";

import { useState } from "react";
import type { CityQuestion as CityQ } from "@/types";

interface Props {
  question: CityQ;
  selected: string | null;
  onSelect: (value: string) => void;
}

const CITY: Record<string, { accent: string; glow: string; bg: string }> = {
  Delhi:     { accent: "#ff7c3a", glow: "rgba(255,124,58,0.22)",  bg: "rgba(255,124,58,0.08)"  },
  Bengaluru: { accent: "#2ecc9a", glow: "rgba(46,204,154,0.20)",  bg: "rgba(46,204,154,0.07)"  },
  Mumbai:    { accent: "#4a9eff", glow: "rgba(74,158,255,0.22)",  bg: "rgba(74,158,255,0.08)"  },
  Elsewhere: { accent: "#e8c840", glow: "rgba(232,200,64,0.22)",  bg: "rgba(232,200,64,0.07)"  },
};

export default function CityQuestion({ question, selected, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes emojiFloat {
          0%, 100% { transform: translateY(0px) rotate(-4deg) scale(1.18); }
          50%       { transform: translateY(-6px) rotate(-7deg) scale(1.22); }
        }
        @keyframes borderGlow {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @keyframes dotBlink {
          0%,100% { opacity:0.3; transform:scale(0.8); }
          50%      { opacity:1;   transform:scale(1.1); }
        }
      `}</style>

      <div className="grid grid-cols-2 gap-2.5">
        {question.opts.map((opt, i) => {
          const c     = CITY[opt.nm] ?? CITY.Elsewhere;
          const isSel = selected === opt.nm;
          const isHov = hovered  === opt.nm;

          return (
            <button
              key={opt.nm}
              onClick={() => { onSelect(opt.nm); if (navigator.vibrate) navigator.vibrate(12); }}
              onMouseEnter={() => setHovered(opt.nm)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex flex-col items-center justify-center text-center rounded-2xl cursor-pointer border-none overflow-hidden"
              style={{
                minHeight: "132px",
                padding: "20px 12px 16px",
                background: isSel ? c.bg : "var(--opt-bg)",
                border: `1.5px solid ${isSel ? c.accent : isHov ? c.accent + "55" : "var(--border)"}`,
                boxShadow: isSel ? `0 8px 28px ${c.glow}` : "none",
                transform: isSel ? "translateY(-4px)" : isHov ? "translateY(-1px)" : "none",
                transition: "all 0.3s cubic-bezier(0.34,1.4,0.64,1)",
                animation: `cardIn 0.35s ${i * 0.08}s cubic-bezier(0.34,1.4,0.64,1) both`,
              }}
            >
              {/* Subtle top bar */}
              <div className="absolute top-0 left-0 right-0" style={{
                height: "2px",
                background: c.accent,
                opacity: isSel ? 0.9 : 0,
                transition: "opacity 0.3s",
              }} />

              {/* Emoji */}
              <span className="relative z-10 select-none" style={{
                fontSize: "40px",
                marginBottom: "10px",
                display: "inline-block",
                animation: isSel ? "emojiFloat 2.4s ease-in-out infinite" : "none",
                transform: !isSel ? (isHov ? "scale(1.08)" : "scale(1)") : undefined,
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                filter: isSel ? `drop-shadow(0 4px 10px ${c.glow})` : "none",
              }}>
                {opt.em}
              </span>

              {/* Name */}
              <div className="relative z-10 font-display text-[16px] leading-none" style={{
                color: isSel ? c.accent : "var(--text)",
                transition: "color 0.2s",
              }}>
                {opt.nm}
              </div>

              {/* Tag */}
              <div className="relative z-10 text-[10px] font-semibold mt-1.5 leading-tight" style={{ color: "var(--text3)" }}>
                {opt.tg}
              </div>

              {/* Selected dot indicator */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                {question.opts.map((_, di) => (
                  <div key={di} style={{
                    width: di === i ? "14px" : "4px",
                    height: "4px",
                    borderRadius: "4px",
                    background: isSel && di === i ? c.accent : "var(--border)",
                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    animation: isSel && di === i ? "dotBlink 1.8s ease-in-out infinite" : "none",
                  }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}