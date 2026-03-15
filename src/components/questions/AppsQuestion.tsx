"use client";

import { useState } from "react";
import type { AppsQuestion as AppsQ } from "@/types";
import { THEME } from "@/lib/theme";

interface Props {
  question: AppsQ;
  selected: string | null;
  textValue: string;
  onSelect: (value: string) => void;
  onTextChange: (value: string) => void;
}

const APP_COLORS: Record<string, string> = {
  "Kirana Store": "#ffd166",
  "Supermarket":  "#06d6a0",
  "Blinkit":      "#ffd60a",
  "Zepto":        "#ff006e",
  "Instamart":    "#ff7a3c",
  "BigBasket":    "#4cc9f0",
  "Other":        "#dfe6e9",
};

export default function AppsQuestion({ question, selected, textValue, onSelect, onTextChange }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "8px",
        }}
      >
        {question.opts.map((opt, i) => {
          const isSel  = selected === opt.nm;
          const isHov  = hovered === opt.nm;
          const accent = APP_COLORS[opt.nm] ?? THEME.primary;

          return (
            <button
              key={opt.nm}
              onClick={() => onSelect(opt.nm)}
              onMouseEnter={() => setHovered(opt.nm)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex flex-col items-center justify-center text-center rounded-2xl cursor-pointer border-none overflow-hidden"
              style={{
                padding: "14px 8px 12px",
                minHeight: "76px",
                background: isSel ? `${accent}20` : "var(--opt-bg)",
                border: `1.5px solid ${isSel ? accent : isHov ? `${accent}55` : "var(--border)"}`,
                boxShadow: isSel ? `0 6px 20px ${accent}35` : "none",
                transform: isSel ? "translateY(-3px) scale(1.05)" : isHov ? "translateY(-1px)" : "none",
                transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                animation: `cardIn 0.35s ${i * 0.04}s cubic-bezier(0.34,1.4,0.64,1) both`,
              }}
            >
              {/* Glow */}
              {isSel && (
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `radial-gradient(circle at 50% 40%, ${accent}30 0%, transparent 70%)`,
                }} />
              )}

              <span
                className="relative z-10 leading-none select-none"
                style={{
                  fontSize: "26px",
                  marginBottom: "6px",
                  display: "inline-block",
                  transform: isSel ? "scale(1.2) rotate(-8deg)" : "scale(1)",
                  filter: isSel ? `drop-shadow(0 4px 8px ${accent}88)` : "none",
                  transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {opt.em}
              </span>

              <span
                className="relative z-10 font-extrabold leading-tight"
                style={{
                  fontSize: "10px",
                  color: isSel ? accent : "var(--text2)",
                  transition: "color 0.2s",
                }}
              >
                {opt.nm}
              </span>

              {/* Bottom bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px]"
                style={{
                  background: accent,
                  transform: isSel ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Why did you choose? */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
            💬 What made you choose?
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg"
            style={{ background: THEME.tag.xpBg, border: `1.5px solid ${THEME.tag.xpBorder}`, color: THEME.tag.xpText }}>
            +40 XP
          </span>
        </div>
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          rows={2}
          placeholder="e.g. Blinkit is the closest to my area, never disappoints…"
          className="w-full rounded-xl px-3.5 py-3 text-[13px] font-semibold resize-none outline-none"
          style={{ background: "var(--opt-bg)", border: "2px solid var(--border)", color: "var(--text)" }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(232,104,10,0.4)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>
    </div>
  );
}