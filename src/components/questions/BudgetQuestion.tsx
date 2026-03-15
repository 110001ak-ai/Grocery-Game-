"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { BudgetQuestion as BudgetQ } from "@/types";
import { THEME } from "@/lib/theme";

interface Props {
  question: BudgetQ;
  selected: string | null;
  onSelect: (value: string) => void;
}

const VIBES: Record<string, { emoji: string; label: string; color: string }> = {
  "<200":      { emoji: "🧃", label: "Light touch",        color: "#74b9ff" },
  "<4k":       { emoji: "🥗", label: "Minimal kitchen",    color: "#55efc4" },
  "200-400":   { emoji: "💡", label: "Smart & savvy",      color: "#a29bfe" },
  "4-7k":      { emoji: "🥘", label: "Balanced kitchen",   color: "#00cec9" },
  "400-600":   { emoji: "🛒", label: "Regular shopper",    color: "#ffeaa7" },
  "7-10k":     { emoji: "🍳", label: "Full fridge gang",   color: "#fdcb6e" },
  "600-900":   { emoji: "🏠", label: "Well-fed family",    color: "#e17055" },
  "10-13k":    { emoji: "🦸", label: "Household hero",     color: "#fd79a8" },
  "900-1200":  { emoji: "⚡", label: "Power shopper",      color: "#ff7675" },
  "13-16k":    { emoji: "🌟", label: "Premium pantry",     color: "#e84393" },
  "1200-1600": { emoji: "🛍️", label: "Big cart energy",    color: "#a29bfe" },
  "16-20k":    { emoji: "👨‍🍳", label: "Chef unlocked",      color: "#ff9f43" },
  ">1600":     { emoji: "💎", label: "Serious business",   color: "#00cec9" },
  ">20k":      { emoji: "👑", label: "Kitchen royalty",    color: "#ffd166" },
};

export default function BudgetQuestion({ question, selected, onSelect }: Props) {
  const opts     = question.opts;
  const N        = opts.length;
  const selIdx   = opts.findIndex((o) => o.v === selected);
  const [idx, setIdx] = useState(selIdx >= 0 ? selIdx : -1);

  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const vibe    = idx >= 0 ? (VIBES[opts[idx].v] ?? null) : null;
  const pct     = idx >= 0 ? (idx / (N - 1)) * 100 : 0;

  // Map pointer X position → option index
  const xToIdx = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const { left, width } = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
    return Math.round(ratio * (N - 1));
  }, [N]);

  const pick = useCallback((newIdx: number) => {
    if (newIdx === idx) return;
    setIdx(newIdx);
    onSelect(opts[newIdx].v);
    if (navigator.vibrate) navigator.vibrate(12);
  }, [idx, opts, onSelect]);

  // Pointer events on track
  const onTrackPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pick(xToIdx(e.clientX));
  };
  const onTrackPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    pick(xToIdx(e.clientX));
  };
  const onTrackPointerUp = () => { dragging.current = false; };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Big answer display ───────────────────────────────────────────── */}
      <div
        className="rounded-3xl px-5 py-5 flex items-center justify-between relative overflow-hidden"
        style={{
          background: idx >= 0
            ? `linear-gradient(135deg, ${vibe!.color}25 0%, ${vibe!.color}08 100%)`
            : "var(--opt-bg)",
          border: `2px solid ${idx >= 0 ? vibe!.color : "var(--border)"}`,
          minHeight: "88px",
          transition: "all 0.35s cubic-bezier(0.34,1.2,0.64,1)",
          boxShadow: idx >= 0 ? `0 8px 28px ${vibe!.color}28` : "none",
        }}
      >
        {idx >= 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 80% at 10% 50%, ${vibe!.color}18, transparent)`,
            }}
          />
        )}

        <div className="relative z-10">
          {idx >= 0 ? (
            <>
              <div
                className="font-display leading-none"
                style={{
                  fontSize: "clamp(22px,6vw,28px)",
                  color: vibe!.color,
                }}
              >
                {opts[idx].l}
              </div>
              <div
                className="flex items-center gap-1.5 mt-1.5"
                style={{ animation: "cardIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both" }}
              >
                <span style={{ fontSize: "14px" }}>{vibe!.emoji}</span>
                <span className="text-[12px] font-extrabold" style={{ color: "var(--text2)" }}>
                  {vibe!.label}
                </span>
              </div>
            </>
          ) : (
            <div className="font-display text-[18px]" style={{ color: "var(--text3)" }}>
              Slide to pick your range →
            </div>
          )}
        </div>

        <div
          className="relative z-10 flex-shrink-0 leading-none"
          style={{
            fontSize: "48px",
            transform: idx >= 0 ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-20deg)",
            filter: idx >= 0 ? `drop-shadow(0 4px 12px ${vibe!.color}88)` : "none",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {idx >= 0 ? vibe!.emoji : "💰"}
        </div>
      </div>

      {/* ── Slider track ─────────────────────────────────────────────────── */}
      <div className="px-2">

        {/* Labels row */}
        <div className="flex justify-between mb-3 px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
            Low
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
            High
          </span>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="relative rounded-full cursor-pointer"
          style={{ height: "44px", touchAction: "none" }}
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={onTrackPointerUp}
          onPointerLeave={onTrackPointerUp}
        >
          {/* Track base */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 rounded-full"
            style={{ height: "6px", background: "var(--border2)" }}
          />

          {/* Track fill */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 rounded-full"
            style={{
              height: "6px",
              width: idx >= 0 ? `${pct}%` : "0%",
              background: idx >= 0
                ? `linear-gradient(90deg, ${vibe!.color}aa, ${vibe!.color})`
                : THEME.progress.fill,
              transition: "width 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
              boxShadow: idx >= 0 ? `0 0 8px ${vibe!.color}66` : "none",
            }}
          />

          {/* Step dots */}
          {opts.map((opt, i) => {
            const dotPct = (i / (N - 1)) * 100;
            const isPast = i <= idx;
            const isCurrent = i === idx;
            return (
              <div
                key={opt.v}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                style={{
                  left: `${dotPct}%`,
                  width:  isCurrent ? "0px" : "8px",
                  height: isCurrent ? "0px" : "8px",
                  background: isPast && !isCurrent
                    ? (vibe?.color ?? THEME.primary)
                    : "var(--border)",
                  border: `2px solid ${isPast ? (vibe?.color ?? THEME.primary) : "var(--border)"}`,
                  transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  opacity: isCurrent ? 0 : 1,
                  zIndex: 1,
                }}
              />
            );
          })}

          {/* Thumb */}
          {idx >= 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center rounded-full font-extrabold"
              style={{
                left: `${pct}%`,
                width: "44px",
                height: "44px",
                background: vibe!.color,
                boxShadow: `0 4px 20px ${vibe!.color}55, 0 0 0 4px ${vibe!.color}22`,
                fontSize: "20px",
                transition: "left 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
                zIndex: 10,
                cursor: "grab",
              }}
            >
              {vibe!.emoji}
            </div>
          )}

          {/* Ghost thumb when nothing picked */}
          {idx < 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center justify-center rounded-full"
              style={{
                width: "44px",
                height: "44px",
                background: "var(--border)",
                fontSize: "20px",
                animation: "sliderPulse 1.5s ease-in-out infinite",
              }}
            >
              👆
            </div>
          )}
        </div>

        {/* Tick labels below track */}
        <div className="relative mt-3" style={{ height: "28px" }}>
          {opts.map((opt, i) => {
            const tickPct = (i / (N - 1)) * 100;
            const isCurrent = i === idx;
            return (
              <div
                key={opt.v}
                className="absolute -translate-x-1/2 text-center"
                style={{
                  left: `${tickPct}%`,
                  fontSize: isCurrent ? "11px" : "9px",
                  fontWeight: isCurrent ? 900 : 600,
                  color: isCurrent ? (vibe?.color ?? THEME.primary) : "var(--text3)",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  maxWidth: "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {opt.l.replace("₹", "₹").replace("–", "-").replace(",000", "k").replace(",200","k").replace(",600","k")}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick-tap chips — 3-col grid, last row spans full ───────────── */}
      {(() => {
        const cols = 3;
        const remainder = opts.length % cols;
        const lastRowStart = opts.length - (remainder === 0 ? cols : remainder);
        return (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "8px" }}>
            {opts.map((opt, i) => {
              const isSel    = i === idx;
              const cv       = VIBES[opt.v];
              const accent   = cv?.color ?? THEME.primary;
              // Last row: if remainder is 1, span all 3; if remainder is 2, each spans 1.5 (not possible) — span full instead
              const isLastRow = remainder > 0 && i >= lastRowStart;
              const spanAll   = remainder === 1 && isLastRow;
              const spanHalf  = remainder === 2 && isLastRow;

              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => pick(i)}
                  className="relative flex flex-col items-center justify-center border-none cursor-pointer active:scale-95 overflow-hidden"
                  style={{
                    padding: "10px 8px",
                    borderRadius: "12px",
                    minHeight: "60px",
                    background: isSel ? `${accent}20` : "var(--opt-bg)",
                    border: `1.5px solid ${isSel ? accent : "var(--border)"}`,
                    boxShadow: isSel ? `0 4px 16px ${accent}30` : "none",
                    transform: isSel ? "translateY(-2px)" : "scale(1)",
                    transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                    gridColumn: spanAll ? "1 / -1" : spanHalf ? "span 2" : undefined,
                  }}
                >
                  {/* Emoji */}
                  <span
                    className="leading-none mb-1"
                    style={{
                      fontSize: "18px",
                      filter: isSel ? `drop-shadow(0 2px 6px ${accent}99)` : "none",
                      transform: isSel ? "scale(1.15)" : "scale(1)",
                      display: "inline-block",
                      transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    {cv?.emoji ?? "💰"}
                  </span>

                  {/* Label */}
                  <span
                    className="font-extrabold text-center leading-tight"
                    style={{
                      fontSize: "10px",
                      color: isSel ? accent : "var(--text2)",
                      transition: "color 0.2s",
                    }}
                  >
                    {opt.l}
                  </span>

                  {/* Selected bottom bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-b-xl"
                    style={{
                      height: "2.5px",
                      background: accent,
                      transform: isSel ? "scaleX(1)" : "scaleX(0)",
                      transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        );
      })()}

      <style>{`
        @keyframes sliderPulse {
          0%,100% { opacity:0.4; transform:translateY(-50%) scale(1); }
          50%      { opacity:0.9; transform:translateY(-50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}