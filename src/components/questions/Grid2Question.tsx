"use client";

import type { Grid2Question as Grid2Q } from "@/types";

interface Props {
  question: Grid2Q;
  selected: string | null;
  onSelect: (value: string) => void;
}

export default function Grid2Question({ question, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {question.opts.map((opt) => {
        const isSelected = selected === opt.t;
        return (
          <button
            key={opt.t}
            onClick={() => onSelect(opt.t)}
            className="option-btn flex items-center gap-2.5 px-3.5 py-3.5 rounded-xl cursor-pointer border-none text-left transition-all"
            style={isSelected ? {
              borderColor: "var(--primary)",
              background: "rgba(255,122,0,0.1)",
              boxShadow: "0 0 0 1px var(--primary) inset, 0 0 20px rgba(255,122,0,0.15)",
            } : {}}
          >
            <span
              className="text-2xl flex-shrink-0 transition-transform duration-300"
              style={{ transform: isSelected ? "scale(1.25) rotate(-8deg)" : "scale(1)" }}
            >
              {opt.em}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[13px] leading-tight" style={{ color: "var(--text)" }}>{opt.t}</div>
              <div className="text-[11px] font-semibold mt-0.5 leading-tight" style={{ color: "var(--text3)" }}>{opt.s}</div>
            </div>
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white transition-all duration-200"
              style={{
                background: isSelected ? "var(--primary)" : "transparent",
                border: `2px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {isSelected ? "✓" : ""}
            </div>
          </button>
        );
      })}
    </div>
  );
}
