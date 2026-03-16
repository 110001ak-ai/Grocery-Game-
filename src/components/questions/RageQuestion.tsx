"use client";

import { useState, useEffect } from "react";
import type { RageQuestion as RageQ } from "@/types";

interface Props {
  question: RageQ;
  selected: string | null;
  textValue: string;
  onSelect: (value: string) => void;
  onTextChange: (value: string) => void;
}

export default function RageQuestion({
  question,
  selected,
  textValue,
  onSelect,
  onTextChange,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const [widths, setWidths] = useState<number[]>(question.opts.map(() => 0));

  const handleSelect = (t: string) => {
    onSelect(t);
    if (!revealed) {
      setRevealed(true);
      // Stagger bar animations
      question.opts.forEach((opt, i) => {
        setTimeout(() => {
          setWidths((prev) => {
            const next = [...prev];
            next[i] = opt.rage;
            return next;
          });
        }, i * 80);
      });
    }
    if (navigator.vibrate) navigator.vibrate([40, 20, 40]);
  };

  return (
    <div className="flex flex-col gap-2">
      {question.opts.map((opt, i) => {
        const isSel = selected === opt.t;

        return (
          <button
            key={opt.t}
            onClick={() => handleSelect(opt.t)}
            className="group relative w-full text-left rounded-2xl cursor-pointer border-none overflow-hidden"
            style={{
              padding: "0",
              height: "60px",
              background: "var(--opt-bg)",
              border: `1.5px solid ${isSel ? opt.col : "var(--border)"}`,
              transform: isSel ? "translateX(4px)" : "none",
              boxShadow: isSel ? `0 4px 20px ${opt.col}35` : "none",
              transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              animation: `cardIn 0.35s ${i * 0.06}s cubic-bezier(0.34,1.4,0.64,1) both`,
            }}
          >
            {/* Rage fill background — floods from left */}
            <div
              className="absolute inset-y-0 left-0 pointer-events-none"
              style={{
                width: `${widths[i]}%`,
                background: `linear-gradient(90deg, ${opt.col}22, ${opt.col}08)`,
                transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                borderRight: revealed ? `1px solid ${opt.col}33` : "none",
              }}
            />

            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{
                background: opt.col,
                transform: isSel ? "scaleY(1)" : "scaleY(0.3)",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                borderRadius: "2px 0 0 2px",
              }}
            />

            {/* Content row */}
            <div className="relative z-10 flex items-center gap-3 px-4 h-full">
              <span
                className="text-2xl flex-shrink-0"
                style={{
                  transform: isSel ? "scale(1.15) rotate(-6deg)" : "scale(1)",
                  transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                  display: "inline-block",
                }}
              >
                {opt.em}
              </span>

              <span
                className="font-extrabold text-[13px] flex-1 text-left leading-tight"
                style={{ color: isSel ? "var(--text)" : "var(--text2)" }}
              >
                {opt.t}
              </span>

              {/* Rage percentage — animates in */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {revealed && (
                  <div
                    className="flex items-center gap-1"
                    style={{
                      animation:
                        "cardIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both",
                    }}
                  >
                    {/* Mini bar */}
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ width: "40px", background: "var(--border2)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${widths[i]}%`,
                          background: opt.col,
                          transition:
                            "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                        }}
                      />
                    </div>
                    <span
                      className="font-bebas text-[13px] w-7 text-right"
                      style={{ color: isSel ? opt.col : "var(--text3)" }}
                    >
                      {opt.rage}%
                    </span>
                  </div>
                )}

                {isSel && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{ background: opt.col }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}

      {/* Rage summary — after selection */}
      {selected && revealed && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl mt-1"
          style={{
            background: "rgba(255,45,110,0.06)",
            border: "1.5px solid rgba(255,45,110,0.2)",
            animation: "cardIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both",
          }}
        >
          <span className="text-xl">📊</span>
          <div>
            <div
              className="font-extrabold text-[12px]"
              style={{ color: "#ff6b95" }}
            >
              {question.opts.find((o) => o.t === selected)?.rage}% of shoppers
              agree
            </div>
            <div
              className="text-[10px] font-semibold mt-0.5"
              style={{ color: "var(--text3)" }}
            >
              You&apos;re not alone in this frustration
            </div>
          </div>
        </div>
      )}

      {/* Free-text bonus */}
      <div className="mt-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[11px] font-extrabold uppercase tracking-widest"
            style={{ color: "var(--text3)" }}
          >
            💬 Got a grocery horror story?
          </span>
          <span
            className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1.5px solid rgba(124,58,237,0.22)",
              color: "#a78bfa",
            }}
          >
            +40 XP
          </span>
        </div>
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          rows={2}
          placeholder="e.g. Ordered milk, got condensed milk. Three times."
          className="w-full rounded-xl px-3.5 py-3 text-[13px] font-semibold resize-none outline-none"
          style={{
            background: "var(--opt-bg)",
            border: "2px solid var(--border)",
            color: "var(--text)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(255,45,110,0.4)";

            /* ensures textarea stays visible when keyboard opens */
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
