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

export default function FreqQuestion({ question, selected, onSelect }: Props) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth(), today = now.getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeOpt = question.opts.find(o => o.t === selected) ?? null;
  const shopDates = activeOpt ? buildShopDates(activeOpt) : new Set<number>();

  const [visibleDates, setVisibleDates] = useState<Set<number>>(new Set());
  useEffect(() => {
    setVisibleDates(new Set());
    if (!activeOpt) return;
    const dates = Array.from(buildShopDates(activeOpt)).sort((a,b) => a-b);
    dates.forEach((d,i) => setTimeout(() =>
      setVisibleDates(prev => new Set(Array.from(prev).concat(d))), i * 30));
  }, [selected]);

  const blanks = Array.from({ length: firstDow });
  const days   = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-3">

      {/* ── Calendar ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: "var(--opt-bg)",
        border: `1.5px solid ${activeOpt ? activeOpt.col + "44" : "var(--border)"}`,
        transition: "border-color 0.3s",
      }}>
        <div className="flex items-center justify-between px-4 py-3" style={{
          background: activeOpt ? `${activeOpt.col}0e` : "transparent",
          borderBottom: "1px solid var(--border2)",
          transition: "background 0.35s",
        }}>
          <div>
            <div className="font-display text-base" style={{ color: "var(--text)" }}>
              {MONTHS[month]} {year}
            </div>
            <div className="text-[10px] font-bold mt-0.5" style={{ color: activeOpt ? activeOpt.col : "var(--text3)" }}>
              {activeOpt ? `${shopDates.size} shopping days this month` : "Select a frequency below"}
            </div>
          </div>
          {activeOpt && (
            <div className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg"
              style={{ background: activeOpt.badgeCol, color: activeOpt.col, border: `1.5px solid ${activeOpt.col}44` }}>
              {activeOpt.badge}
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 px-3 pt-2 pb-0.5">
          {DAYS_SHORT.map((d, i) => (
            <div key={i} className="text-center font-extrabold"
              style={{ fontSize: "9px", color: "var(--text3)", letterSpacing: "0.05em" }}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-[3px] px-3 pb-3 pt-1">
          {blanks.map((_, i) => <div key={`b${i}`} />)}
          {days.map(d => {
            const isShop = shopDates.has(d), isVis = visibleDates.has(d), isTod = d === today;
            return (
              <div key={d} className="aspect-square flex items-center justify-center rounded-lg" style={{
                fontSize: "10px",
                fontWeight: isShop ? 700 : 500,
                // ── Muted: translucent bg + colored text instead of solid fill ──
                background: isShop && isVis ? `${activeOpt!.col}28` : isTod ? "var(--border)" : "transparent",
                color: isShop && isVis ? activeOpt!.col : isTod ? "var(--text)" : "var(--text3)",
                transform: isShop && isVis ? "scale(1)" : "scale(0.85)",
                opacity: isShop && !isVis ? 0 : 1,
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                // subtle dot under shopping day instead of boxShadow
                borderBottom: isShop && isVis ? `2px solid ${activeOpt!.col}99` : "none",
                outline: isTod ? `2px solid ${activeOpt?.col ?? "var(--border)"}55` : "none",
                outlineOffset: "1px",
              }}>{d}</div>
            );
          })}
        </div>
      </div>

      {/* ── Swipe chips ───────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--bg), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--bg), transparent)" }} />
        <div className="absolute left-1 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-[10px]"
          style={{ color: "var(--text3)" }}>‹</div>
        <div className="absolute right-1 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-[10px]"
          style={{ color: "var(--text3)" }}>›</div>

        <div className="flex gap-2 px-4 pb-1" style={{
          overflowX: "auto", scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
          scrollSnapType: "x mandatory",
        }}>
          {question.opts.map(opt => {
            const isSel = selected === opt.t;
            return (
              <button key={opt.t} type="button" onClick={() => onSelect(opt.t)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 rounded-2xl border-none cursor-pointer active:scale-95 relative overflow-hidden"
                style={{
                  padding: "12px 10px 10px", width: "80px",
                  scrollSnapAlign: "center",
                  // ── Softer selected bg ──
                  background: isSel ? `${opt.col}14` : "var(--opt-bg)",
                  border: `1.5px solid ${isSel ? opt.col + "88" : "var(--border)"}`,
                  boxShadow: isSel ? `0 4px 14px ${opt.col}22` : "none",
                  transform: isSel ? "translateY(-3px) scale(1.06)" : "scale(1)",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}>
                {isSel && (
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: `radial-gradient(circle at 50% 30%, ${opt.col}14, transparent 70%)`,
                  }} />
                )}
                <span className="relative z-10" style={{
                  fontSize: "22px", display: "inline-block",
                  filter: isSel ? `drop-shadow(0 2px 6px ${opt.col}88)` : "none",
                  transform: isSel ? "scale(1.15) rotate(-5deg)" : "scale(1)",
                  transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}>{opt.em}</span>
                <span className="relative z-10 font-extrabold text-center leading-tight" style={{
                  fontSize: "9px",
                  color: isSel ? opt.col : "var(--text3)",
                  transition: "color 0.2s", maxWidth: "68px",
                }}>{opt.t}</span>
                <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl" style={{
                  height: "2px", background: opt.col,
                  transform: isSel ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                }} />
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[10px] font-bold tracking-widest uppercase -mt-1"
        style={{ color: "var(--text3)" }}>← swipe to see all →</p>
    </div>
  );
}