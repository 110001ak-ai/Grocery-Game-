"use client";

import { useState, useEffect } from "react";
import type { FreqQuestion as FreqQ, FreqOption } from "@/types";

interface Props {
  question: FreqQ;
  selected: string | null;
  onSelect: (value: string) => void;
}

function buildShopDates(opt: FreqOption): Set<number> {
  const now = new Date(), year = now.getFullYear(), month = now.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const set = new Set<number>();
  if (opt.pattern === "daily") { for (let d = 1; d <= days; d++) set.add(d); }
  else if (opt.pattern === "thrice") { for (let d = 1; d <= days; d++) { const dow = new Date(year, month, d).getDay(); if (dow === 1 || dow === 3 || dow === 5) set.add(d); } }
  else if (opt.pattern === "weekly") { for (let d = 1; d <= days; d++) { if (new Date(year, month, d).getDay() === 1) set.add(d); } }
  else if (opt.pattern === "biweekly") { let cnt = 0; for (let d = 1; d <= days; d++) { if (new Date(year, month, d).getDay() === 1 && (++cnt === 1 || cnt === 3)) set.add(d); } }
  else { set.add(Math.max(1, Math.round(days * 0.2))); set.add(Math.max(1, Math.round(days * 0.72))); }
  return set;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS_SHORT = ["S","M","T","W","T","F","S"];

const CHIP_KEYFRAMES = `
@keyframes fqPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--fq-rgb), 0.0); }
  50%       { box-shadow: 0 0 0 5px rgba(var(--fq-rgb), 0.12); }
}
@keyframes fqCalDotIn {
  from { transform: scale(0) translateY(2px); opacity: 0; }
  to   { transform: scale(1) translateY(0);   opacity: 1; }
}
@keyframes fqBadgePop {
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.12); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes fqTapHint {
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-2px) scale(1.03); }
}
`;

export default function FreqQuestion({ question, selected, onSelect }: Props) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth(), today = now.getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeOpt = question.opts.find(o => o.t === selected) ?? null;
  const shopDates = activeOpt ? buildShopDates(activeOpt) : new Set<number>();

  const [visibleDates, setVisibleDates] = useState<Set<number>>(new Set());
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    setVisibleDates(new Set());
    if (!activeOpt) return;
    const dates = Array.from(buildShopDates(activeOpt)).sort((a, b) => a - b);
    dates.forEach((d, i) =>
      setTimeout(() => setVisibleDates(prev => new Set(Array.from(prev).concat(d))), i * 22)
    );
  }, [selected]);

  const blanks = Array.from({ length: firstDow });
  const days   = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <>
      <style>{CHIP_KEYFRAMES}</style>
      <div className="flex flex-col gap-3">

        {/* ── Minimal Calendar ─────────────────────────────────────────── */}
        <div style={{
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${activeOpt ? activeOpt.col + "35" : "var(--border)"}`,
          background: "var(--opt-bg)",
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: activeOpt ? `0 2px 16px ${activeOpt.col}14` : "none",
        }}>
          {/* Slim header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px 7px",
            borderBottom: `1px solid ${activeOpt ? activeOpt.col + "18" : "var(--border2)"}`,
            background: activeOpt ? `${activeOpt.col}08` : "transparent",
            transition: "background 0.3s",
          }}>
            {/* Month + year */}
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: activeOpt ? activeOpt.col : "var(--text2)",
              letterSpacing: "0.04em",
              transition: "color 0.25s",
            }}>
              {MONTHS[month].toUpperCase()} {year}
            </span>

            {/* Right side: either idle hint or animated badge */}
            {activeOpt ? (
              <span
                key={activeOpt.t}
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: 20,
                  background: activeOpt.badgeCol,
                  color: activeOpt.col,
                  border: `1px solid ${activeOpt.col}33`,
                  letterSpacing: "0.03em",
                  animation: "fqBadgePop 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
                }}
              >
                {shopDates.size} days · {activeOpt.badge}
              </span>
            ) : (
              <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600, opacity: 0.7 }}>
                pick below ↓
              </span>
            )}
          </div>

          {/* Compact grid */}
          <div style={{ padding: "6px 10px 8px" }}>
            {/* Day-of-week row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              marginBottom: 3,
            }}>
              {DAYS_SHORT.map((d, i) => (
                <div key={i} style={{
                  textAlign: "center",
                  fontSize: 8,
                  fontWeight: 800,
                  color: "var(--text3)",
                  letterSpacing: "0.06em",
                  opacity: 0.55,
                }}>{d}</div>
              ))}
            </div>

            {/* Date cells */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
            }}>
              {blanks.map((_, i) => <div key={`b${i}`} />)}
              {days.map(d => {
                const isShop = shopDates.has(d);
                const isVis  = visibleDates.has(d);
                const isTod  = d === today;

                return (
                  <div key={d} style={{
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    fontSize: 9,
                    fontWeight: isShop ? 800 : 400,
                    position: "relative",

                    background:
                      isShop && isVis
                        ? `${activeOpt!.col}1a`
                        : isTod
                        ? "var(--border)"
                        : "transparent",

                    color:
                      isShop && isVis
                        ? activeOpt!.col
                        : isTod
                        ? "var(--text)"
                        : "var(--text3)",

                    opacity: isShop && !isVis ? 0 : 1,
                    transform: isShop && isVis ? "scale(1)" : "scale(0.82)",
                    transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",

                    // today ring
                    outline: isTod
                      ? `1.5px solid ${activeOpt?.col ?? "var(--border)"}44`
                      : "none",
                    outlineOffset: 1,
                  }}>
                    {d}
                    {/* tiny dot marker under shop day */}
                    {isShop && isVis && (
                      <span style={{
                        position: "absolute",
                        bottom: 1,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: activeOpt!.col,
                        opacity: 0.7,
                        animation: "fqCalDotIn 0.2s ease-out both",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Frequency chips — strong click feel ──────────────────────── */}
        <div style={{ position: "relative" }}>
          {/* Fade edges */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 28,
            background: "linear-gradient(to right, var(--bg) 30%, transparent)",
            zIndex: 10, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 28,
            background: "linear-gradient(to left, var(--bg) 30%, transparent)",
            zIndex: 10, pointerEvents: "none",
          }} />

          {/* Scroll arrows */}
          <div style={{
            position: "absolute", left: 3, top: "50%", transform: "translateY(-50%)",
            fontSize: 12, color: "var(--text3)", zIndex: 20, pointerEvents: "none",
            fontWeight: 300,
          }}>‹</div>
          <div style={{
            position: "absolute", right: 3, top: "50%", transform: "translateY(-50%)",
            fontSize: 12, color: "var(--text3)", zIndex: 20, pointerEvents: "none",
            fontWeight: 300,
          }}>›</div>

          <div style={{
            display: "flex",
            gap: 8,
            padding: "4px 28px 6px",
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            scrollSnapType: "x mandatory",
          }}>
            {question.opts.map(opt => {
              const isSel  = selected === opt.t;
              const isPrs  = pressed === opt.t;
              // Decompose hex color to rgb for CSS variable trick
              const hex = opt.col.replace("#", "");
              const r = parseInt(hex.slice(0, 2), 16);
              const g = parseInt(hex.slice(2, 4), 16);
              const b = parseInt(hex.slice(4, 6), 16);

              return (
                <button
                  key={opt.t}
                  type="button"
                  onClick={() => onSelect(opt.t)}
                  onMouseDown={() => setPressed(opt.t)}
                  onMouseUp={() => setPressed(null)}
                  onMouseLeave={() => setPressed(null)}
                  onTouchStart={() => setPressed(opt.t)}
                  onTouchEnd={() => setPressed(null)}
                  style={{
                    // Layout
                    flexShrink: 0,
                    width: 76,
                    padding: "11px 8px 9px",
                    scrollSnapAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 18,
                    cursor: "pointer",
                    border: "none",
                    outline: "none",
                    WebkitTapHighlightColor: "transparent",

                    // Color state
                    // @ts-ignore css variable
                    "--fq-rgb": `${r},${g},${b}`,

                    background: isSel
                      ? `${opt.col}18`
                      : isPrs
                      ? `${opt.col}0e`
                      : "var(--opt-bg)",

                    // Border / ring
                    boxShadow: isSel
                      ? `0 0 0 2px ${opt.col}, 0 6px 20px ${opt.col}28`
                      : isPrs
                      ? `0 0 0 1.5px ${opt.col}99, 0 3px 10px ${opt.col}18`
                      : `0 0 0 1.5px var(--border), 0 2px 8px rgba(0,0,0,0.06)`,

                    // Lift / press
                    transform: isSel
                      ? "translateY(-5px) scale(1.07)"
                      : isPrs
                      ? "translateY(2px) scale(0.95)"
                      : "translateY(0) scale(1)",

                    // Idle tap hint animation on unselected
                    animation: !isSel && !isPrs
                      ? `fqTapHint 2.4s ${question.opts.indexOf(opt) * 0.15}s ease-in-out infinite`
                      : "none",

                    transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, background 0.18s ease",
                  } as React.CSSProperties}
                >
                  {/* Radial glow when selected */}
                  {isSel && (
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: `radial-gradient(circle at 50% 25%, ${opt.col}22, transparent 65%)`,
                    }} />
                  )}

                  {/* Pulse ring on unselected — "tap me" */}
                  {!isSel && (
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: 18,
                      animation: `fqPulse 2.4s ${question.opts.indexOf(opt) * 0.15}s ease-in-out infinite`,
                      pointerEvents: "none",
                    }} />
                  )}

                  {/* ✓ checkmark on selected */}
                  {isSel && (
                    <div style={{
                      position: "absolute", top: 7, right: 7,
                      width: 14, height: 14,
                      borderRadius: "50%",
                      background: opt.col,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 7, color: "#fff", fontWeight: 900,
                      boxShadow: `0 1px 4px ${opt.col}66`,
                      animation: "fqBadgePop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                    }}>✓</div>
                  )}

                  {/* Emoji */}
                  <span style={{
                    fontSize: 22,
                    display: "inline-block",
                    position: "relative",
                    zIndex: 1,
                    filter: isSel ? `drop-shadow(0 2px 5px ${opt.col}99)` : "none",
                    transform: isSel
                      ? "scale(1.22) rotate(-6deg)"
                      : isPrs
                      ? "scale(0.88)"
                      : "scale(1)",
                    transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), filter 0.18s ease",
                  }}>
                    {opt.em}
                  </span>

                  {/* Label */}
                  <span style={{
                    fontSize: 9,
                    fontWeight: 800,
                    textAlign: "center",
                    letterSpacing: "0.01em",
                    lineHeight: 1.2,
                    maxWidth: 64,
                    position: "relative",
                    zIndex: 1,
                    color: isSel ? opt.col : "var(--text2)",
                    transition: "color 0.18s ease",
                  }}>
                    {opt.t}
                  </span>

                  {/* Bottom accent bar */}
                  <div style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: 3,
                    borderRadius: "0 0 18px 18px",
                    background: `linear-gradient(90deg, ${opt.col}88, ${opt.col})`,
                    transform: isSel ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                    transformOrigin: "center",
                  }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <p style={{
          textAlign: "center",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text3)",
          marginTop: -4,
          opacity: 0.6,
        }}>
          ← tap to choose →
        </p>
      </div>
    </>
  );
}