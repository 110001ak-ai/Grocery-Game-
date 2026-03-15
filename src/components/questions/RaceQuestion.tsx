"use client";

import { useEffect, useRef, useState } from "react";
import type { RaceQuestion as RaceQ, RaceOption } from "@/types";

interface Props {
  question: RaceQ;
  selected: string | null;
  onSelect: (value: string) => void;
}

export default function RaceQuestion({ question, selected, onSelect }: Props) {
  const [fillWidths, setFillWidths] = useState<number[]>(question.opts.map(() => 0));

  const handleSelect = (opt: RaceOption) => {
    onSelect(opt.tm);
    // Animate all bars
    setTimeout(() => {
      setFillWidths(question.opts.map((o) => o.fill));
    }, 40);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {question.opts.map((opt, i) => {
        const isSelected = selected === opt.tm;
        return (
          <button
            key={opt.tm}
            onClick={() => handleSelect(opt)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all text-left border-none relative overflow-hidden"
            style={{
              background: isSelected ? `rgba(${hexToRgb(opt.col)},0.09)` : "var(--opt-bg)",
              border: `2px solid ${isSelected ? opt.col : "var(--border)"}`,
              boxShadow: isSelected ? `0 0 20px ${opt.col}20` : "none",
              transform: isSelected ? "translateX(5px)" : "none",
            }}
          >
            {/* Left colour accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
              style={{
                background: opt.col,
                boxShadow: isSelected ? `0 0 12px ${opt.col}` : "none",
              }}
            />
            <span className="text-3xl flex-shrink-0 ml-1">{opt.em}</span>
            <div className="flex-1 min-w-0">
              <div className="font-display text-base mb-0.5" style={{ color: "var(--text)" }}>{opt.tm}</div>
              <div className="text-[11px] font-semibold mb-2" style={{ color: "var(--text2)" }}>{opt.vb}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border2)" }}>
                  <div
                    className="h-full rounded-full dfill-bar"
                    style={{ width: `${fillWidths[i]}%`, background: opt.col }}
                  />
                </div>
                <span
                  className="font-bebas text-xs flex-shrink-0 w-7 text-right transition-colors duration-300"
                  style={{ color: isSelected ? opt.col : "var(--text3)" }}
                >
                  {opt.fill}%
                </span>
              </div>
            </div>
            <span
              className="text-lg flex-shrink-0 transition-all duration-300"
              style={{ opacity: isSelected ? 1 : 0 }}
            >
              ⚡
            </span>
          </button>
        );
      })}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "255,122,0";
}
