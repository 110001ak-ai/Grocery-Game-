"use client";

import { useState } from "react";
import type { StarsQuestion as StarsQ } from "@/types";
import { THEME } from "@/lib/theme";

interface Props {
  question: StarsQ;
  selected: number | null;
  textValue: string;
  onSelect: (value: number) => void;
  onTextChange: (value: string) => void;
}

const STAR_COLORS = ["#ff6b6b", "#ff9f43", "#ffd166", "#26de81", "#00e5c3"];
const STAR_LABELS = ["Meh", "Okay", "Good", "Great", "Essential"];

export default function StarsQuestion({
  question,
  selected,
  textValue,
  onSelect,
  onTextChange,
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? selected ?? 0;
  const activeColor = active > 0 ? STAR_COLORS[active - 1] : "var(--border)";

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Stars */}
      <div className="flex gap-1.5 items-end">
        {[1, 2, 3, 4, 5].map((i) => {
          const isLit = i <= active;
          const color = STAR_COLORS[i - 1];
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer border-none bg-transparent p-0 flex flex-col items-center gap-1"
              style={{
                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              aria-label={`${i} star${i !== 1 ? "s" : ""}`}
            >
              {/* Height increases with each star */}
              <div
                style={{
                  fontSize: `${22 + i * 4}px`,
                  lineHeight: 1,
                  filter: isLit
                    ? `drop-shadow(0 0 ${i * 3}px ${color})`
                    : "grayscale(1) opacity(0.2)",
                  transform: isLit ? `scale(${1 + i * 0.04})` : "scale(1)",
                  transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                ⭐
              </div>
              {/* Label below each star */}
              <span
                className="font-extrabold"
                style={{
                  fontSize: "8px",
                  color: isLit ? color : "var(--text3)",
                  letterSpacing: "0.05em",
                  transition: "color 0.2s",
                }}
              >
                {STAR_LABELS[i - 1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description card */}
      <div
        className="w-full rounded-2xl px-4 py-3.5 text-center"
        style={{
          background: active > 0 ? `${activeColor}14` : "var(--opt-bg)",
          border: `1.5px solid ${active > 0 ? `${activeColor}44` : "var(--border)"}`,
          minHeight: "60px",
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          className="font-extrabold text-[13px] leading-relaxed"
          style={{ color: active > 0 ? activeColor : "var(--text3)" }}
        >
          {active > 0 ? question.sl[active - 1] : "Tap a star to rate"}
        </p>
      </div>

      {/* Visual score bar */}
      {active > 0 && (
        <div
          className="w-full flex gap-1.5"
          style={{
            animation: "cardIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both",
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: "6px", background: "var(--border2)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: i <= active ? "100%" : "0%",
                  background: STAR_COLORS[i - 1],
                  transition: `width 0.4s ${(i - 1) * 0.06}s cubic-bezier(0.34,1.56,0.64,1)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Free-text */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[11px] font-extrabold uppercase tracking-widest"
            style={{ color: "var(--text3)" }}
          >
            💭 Tell us why
          </span>
          <span
            className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg"
            style={{
              background: THEME.tag.xpBg,
              border: `1.5px solid ${THEME.tag.xpBorder}`,
              color: THEME.tag.xpText,
            }}
          >
            +40 XP
          </span>
        </div>
        <textarea
          value={textValue}
          onChange={(e) => {
            onTextChange(e.target.value);

            /* optional auto-grow */
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          rows={2}
          placeholder="e.g. Midnight Maggi emergencies are real…"
          className="w-full rounded-xl px-3.5 py-3 text-[13px] font-semibold resize-none outline-none"
          style={{
            background: "var(--opt-bg)",
            border: "2px solid var(--border)",
            color: "var(--text)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(232,104,10,0.4)";

            /* ensure field stays visible when keyboard opens */
            setTimeout(() => {
              e.target.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 250);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
          }}
        />
      </div>
    </div>
  );
}
