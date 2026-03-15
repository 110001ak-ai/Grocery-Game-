"use client";

import type { NightQuestion as NightQ } from "@/types";
import { NIGHT_PATTERNS } from "@/lib/questions";

interface Props {
  question: NightQ;
  selected: string | null;
  onSelect: (value: string) => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function NightCalendar({ optionText }: { optionText: string }) {
  const cfg = NIGHT_PATTERNS[optionText] ?? NIGHT_PATTERNS["Random chaos"];
  return (
    <div className="rounded-xl overflow-hidden mt-1"
      style={{ border: "1.5px solid var(--border)" }}>
      <div className="flex items-center gap-2 px-3.5 py-2.5"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
        <span className="text-[18px]">🌙</span>
        <span className="font-display text-sm" style={{ color: "var(--accent)" }}>{cfg.title}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 px-2.5 py-3"
        style={{ background: "var(--opt-bg)" }}>
        {DAYS.map((d, i) => {
          const isActive = cfg.active.includes(i);
          const em = cfg.snacks[i] ?? "";
          return (
            <div key={d}
              className={`aspect-square flex flex-col items-center justify-center rounded-md gap-px ${isActive ? "night-day-active" : ""}`}
              style={isActive ? { background: "rgba(192,132,252,0.14)" } : {}}>
              <span className="text-sm leading-none">{em || "·"}</span>
              <span className="text-[8px] font-extrabold"
                style={{ color: isActive ? "#c084fc" : "var(--text3)" }}>{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NightQuestion({ question, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2.5">
        {question.opts.map((opt) => {
          const isSel = selected === opt.t;
          return (
            <button
              key={opt.t}
              onClick={() => onSelect(opt.t)}
              className="flex flex-col items-center gap-1.5 text-center py-4 px-3 rounded-2xl cursor-pointer border-none transition-all active:scale-95"
              style={{
                background: isSel ? "rgba(124,58,237,0.12)" : "var(--opt-bg)",
                // ── Always visible border — solid in both themes ──
                border: `1.5px solid ${isSel ? "var(--accent)" : "var(--border)"}`,
                boxShadow: isSel ? "0 0 0 1px var(--accent) inset, 0 0 20px rgba(124,58,237,0.18)" : "none",
                transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                transform: isSel ? "translateY(-2px)" : "none",
              }}
            >
              <span className="text-3xl transition-all duration-300" style={{
                transform: isSel ? "scale(1.2) rotate(-5deg)" : "scale(1)",
                filter: isSel ? "drop-shadow(0 2px 8px rgba(124,58,237,0.6))" : "none",
              }}>
                {opt.em}
              </span>
              <div className="font-extrabold text-[13px]"
                style={{ color: isSel ? "var(--accent)" : "var(--text)" }}>
                {opt.t}
              </div>
              <div className="text-[11px] font-semibold"
                style={{ color: "var(--text3)" }}>
                {opt.s}
              </div>
            </button>
          );
        })}
      </div>

      {selected && <NightCalendar optionText={selected} />}
    </div>
  );
}