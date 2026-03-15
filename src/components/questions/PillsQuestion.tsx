"use client";

import { useState, useEffect } from "react";
import type { PillsQuestion as PillsQ } from "@/types";
import { THEME } from "@/lib/theme";

interface Props {
  question: PillsQ;
  selected: string | null;
  textValue: string;
  onSelect: (value: string) => void;
  onTextChange: (value: string) => void;
}

const PLACEHOLDERS: Record<string, string> = {
  kitchen_roots: "e.g. Butter chicken every Sunday, dal tadka is a must…",
  source:        "e.g. I switch between Blinkit and kirana depending on the item…",
  app_factor:    "e.g. ETAs that actually mean something…",
};

export default function PillsQuestion({
  question, selected, textValue, onSelect, onTextChange,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  // vegPref is stored in textValue as "veg" or "nonveg" prefix so it reaches submission
  // but NEVER shown in the visible textarea
  const [vegPref, setVegPref] = useState<"veg" | "nonveg" | null>(() => {
    if (textValue.startsWith("__veg:")) return "veg";
    if (textValue.startsWith("__nonveg:")) return "nonveg";
    return null;
  });

  const hasVegToggle = question.id === "kitchen_roots";
  // Grid is locked until veg pref chosen (only for kitchen_roots)
  const gridLocked   = hasVegToggle && !vegPref;

  const selectedOpt  = question.opts.find(o => o.nm === selected);

  const handleVegPref = (pref: "veg" | "nonveg") => {
    const next = vegPref === pref ? null : pref;
    setVegPref(next);
    // Store cleanly as hidden prefix — NOT shown to user in textarea
    const existingNote = textValue.replace(/^__(veg|nonveg):/, "");
    onTextChange(next ? `__${next}:${existingNote}` : existingNote);
    // Clear cuisine selection if pref removed
    if (!next) onSelect("");
  };

  const handleCuisineSelect = (nm: string) => {
    if (gridLocked) return;
    onSelect(nm);
  };

  // Visible textarea value strips the hidden prefix
  const visibleText = textValue.replace(/^__(veg|nonveg):/, "");

  const handleTextChange = (val: string) => {
    onTextChange(vegPref ? `__${vegPref}:${val}` : val);
  };

  return (
    <div className="flex flex-col gap-3">

      {/* ── Veg / Non-Veg toggle ──────────────────────────────────────────── */}
      {hasVegToggle && (
        <div className="flex gap-2">
          {([
            { key: "veg",    label: "Vegetarian",    em: "🥗", color: "#06d6a0" },
            { key: "nonveg", label: "Non-Vegetarian", em: "🍗", color: "#ff6b6b" },
          ] as const).map((opt) => {
            const isActive = vegPref === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleVegPref(opt.key)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl font-extrabold border-none cursor-pointer active:scale-95"
                style={{
                  padding: "11px 8px",
                  fontSize: "12px",
                  background: isActive ? `${opt.color}20` : "var(--opt-bg)",
                  border: `2px solid ${isActive ? opt.color : "var(--border)"}`,
                  color: isActive ? opt.color : "var(--text2)",
                  boxShadow: isActive ? `0 4px 16px ${opt.color}30` : "none",
                  transform: isActive ? "translateY(-1px)" : "none",
                  transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <span style={{ fontSize: "18px" }}>{opt.em}</span>
                {opt.label}
                {isActive && (
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                    style={{ background: opt.color }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Locked overlay hint ───────────────────────────────────────────── */}
      {gridLocked && (
        <div
          className="flex items-center justify-center gap-2 rounded-2xl py-3"
          style={{
            background: "var(--opt-bg)",
            border: "1.5px dashed var(--border)",
            animation: "cardIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both",
          }}
        >
          <span className="text-lg">👆</span>
          <span className="text-[12px] font-extrabold" style={{ color: "var(--text3)" }}>
            Select Veg or Non-Veg first
          </span>
        </div>
      )}

      {/* ── Selected hero banner ──────────────────────────────────────────── */}
      <div style={{
        height: selected && !gridLocked ? "52px" : "0px",
        overflow: "hidden",
        transition: "height 0.3s cubic-bezier(0.34,1.2,0.64,1)",
      }}>
        {selected && selectedOpt && !gridLocked && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{
            background: `${selectedOpt.color ?? THEME.primary}18`,
            border: `1.5px solid ${selectedOpt.color ?? THEME.primary}55`,
            animation: "cardIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both",
          }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>{selectedOpt.em}</span>
            <span className="font-extrabold text-[14px] flex-1" style={{ color: selectedOpt.color ?? THEME.primary }}>
              {selected}
            </span>
            <span className="text-[10px] font-bold" style={{ color: "var(--text3)" }}>✓ tap to change</span>
          </div>
        )}
      </div>

      {/* ── Card grid — blurred/locked until pref chosen ──────────────────── */}
      <div
        style={{
          position: "relative",
          opacity: gridLocked ? 0.3 : 1,
          pointerEvents: gridLocked ? "none" : "auto",
          filter: gridLocked ? "blur(2px)" : "none",
          transition: "opacity 0.3s, filter 0.3s",
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
          gap: "8px",
        }}>
          {question.opts.map((opt, i) => {
            const isSel  = selected === opt.nm;
            const isHov  = hovered === opt.nm;
            const accent = opt.color ?? THEME.primary;

            return (
              <button
                key={opt.nm}
                type="button"
                onClick={() => handleCuisineSelect(opt.nm)}
                onMouseEnter={() => setHovered(opt.nm)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex flex-col items-center justify-center text-center rounded-2xl cursor-pointer border-none overflow-hidden"
                style={{
                  padding: "14px 8px 12px",
                  minHeight: "82px",
                  background: isSel ? `${accent}22` : isHov ? "var(--opt-bg-h)" : "var(--opt-bg)",
                  border: `1.5px solid ${isSel ? accent : isHov ? `${accent}55` : "var(--border)"}`,
                  boxShadow: isSel ? `0 6px 22px ${accent}35` : "none",
                  transform: isSel ? "translateY(-4px) scale(1.06)"
                    : isHov ? "translateY(-2px) scale(1.02)"
                    : "translateY(0) scale(1)",
                  transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                  animation: `cardIn 0.3s ${i * 0.035}s cubic-bezier(0.34,1.4,0.64,1) both`,
                }}
              >
                {isSel && (
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: `radial-gradient(circle at 50% 35%, ${accent}30 0%, transparent 68%)`,
                  }} />
                )}

                <span className="relative z-10 leading-none select-none" style={{
                  fontSize: "26px",
                  display: "inline-block",
                  marginBottom: "7px",
                  transform: isSel ? "scale(1.28) rotate(-8deg)"
                    : isHov ? "scale(1.12) rotate(-4deg)"
                    : "scale(1) rotate(0deg)",
                  filter: isSel ? `drop-shadow(0 4px 10px ${accent}99)` : "none",
                  transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                }}>
                  {opt.em}
                </span>

                <span className="relative z-10 font-extrabold leading-tight" style={{
                  fontSize: "10px",
                  color: isSel ? accent : "var(--text2)",
                  transition: "color 0.18s",
                  maxWidth: "80px",
                }}>
                  {opt.nm}
                </span>

                <div className="absolute bottom-0 left-0 right-0" style={{
                  height: "3px",
                  background: accent,
                  borderRadius: "0 0 12px 12px",
                  transform: isSel ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }} />

                {isSel && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: accent, fontSize: "8px", color: "#fff", fontWeight: 900,
                      animation: "cardIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bonus textarea — only shows text, pref stored separately ─────── */}
      {selected && !gridLocked && question.fu && (
        <div style={{ animation: "cardIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
              💬 Anything to add?
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg" style={{
              background: THEME.tag.xpBg,
              border: `1.5px solid ${THEME.tag.xpBorder}`,
              color: THEME.tag.xpText,
            }}>+40 XP</span>
          </div>
          <textarea
            value={visibleText}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={2}
            placeholder={PLACEHOLDERS[question.id] ?? "Share more if you like…"}
            className="w-full rounded-xl px-3.5 py-3 text-[13px] font-semibold resize-none outline-none"
            style={{ background: "var(--opt-bg)", border: "2px solid var(--border)", color: "var(--text)" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(232,104,10,0.4)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      )}
    </div>
  );
}