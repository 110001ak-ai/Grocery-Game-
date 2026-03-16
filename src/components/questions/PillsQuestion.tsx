"use client";

import { useState } from "react";
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

// ── Logo size — single source of truth ────────────────────────────────────
const LOGO_W = 96;
const LOGO_H = 44;

// ── SVG Logo components ────────────────────────────────────────────────────

function InstamartLogo() {
  return (
    <svg viewBox="0 0 130 72" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="2" y="4" width="62" height="62" rx="13" fill="#E8440A"/>
      <path d="M33 10 C24 10,14 16,14 26 C14 36,24 46,33 58 C42 46,52 36,52 26 C52 16,42 10,33 10Z" fill="white"/>
      <path d="M29 19 C29 17,31 16,33 16 C35 16,37 17,37 19.5 C37 22,35 23,33 23.5 C31 24,29 25,29 27.5 C29 30,31 31,33 31 C35 31,37 30,37 27.5"
        fill="none" stroke="#E8440A" strokeWidth="2.6" strokeLinecap="round"/>
      <text x="68" y="34" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="24" fill="#E8440A" letterSpacing="-0.5">insta</text>
      <text x="68" y="60" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="24" fill="#1565C0" letterSpacing="-0.5">mart</text>
    </svg>
  );
}

function ZeptoLogo() {
  return (
    <svg viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <linearGradient id="zepto-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F05A78"/>
          <stop offset="100%" stopColor="#F5963C"/>
        </linearGradient>
      </defs>
      <text x="4" y="48"
        fontFamily="'Arial Rounded MT Bold', 'Arial Black', Arial, sans-serif"
        fontWeight="900" fontSize="48" fill="url(#zepto-grad)" letterSpacing="-1.5">
        zepto
      </text>
    </svg>
  );
}

function BlinkitLogo() {
  return (
    <svg viewBox="0 0 168 72" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="0" y="0" width="168" height="72" rx="8" fill="#F8C800"/>
      <text x="6" y="52"
        fontFamily="'Arial Black', Impact, Arial, sans-serif"
        fontWeight="900" fontSize="46" letterSpacing="-1.5">
        <tspan fill="#111111">blinki</tspan><tspan fill="#1B7B2A">t</tspan>
      </text>
    </svg>
  );
}

function BigBasketLogo() {
  return (
    <span style={{ color: "var(--color-text-primary)", width: "100%", height: "100%", display: "flex" }}>
      <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <rect x="2" y="2" width="86" height="86" rx="15" fill="#7DC41A"/>
        <text x="3" y="76" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="70" fill="#D12020">b</text>
        <text x="40" y="76" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="70" fill="#FFFFFF">b</text>
        <text x="96" y="40" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="26" fill="#D12020">big</text>
        <text x="96" y="70" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="26" fill="currentColor">basket</text>
      </svg>
    </span>
  );
}

function FlipkartMinutesLogo() {
  return (
    <svg viewBox="0 0 220 88" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="0" y="0" width="220" height="88" rx="10" fill="#C41952"/>
      <text x="14" y="34"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700" fontStyle="italic" fontSize="22"
        fill="#FFFFFF" letterSpacing="0.5">
        Flipkart
      </text>
      <text x="10" y="76"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900" fontStyle="italic" fontSize="42"
        fill="#FFE500" letterSpacing="-1">
        MINUT
      </text>
      {/* Speed-E: 3 arrow-tipped bars skewed to match italic, 27px = E letter width */}
      <g transform="translate(163, 46) skewX(-14)">
        <polygon points="0,0 21,0 27,4 21,8 0,8"     fill="#FFE500"/>
        <polygon points="0,12 16,12 22,16 16,20 0,20" fill="#FFE500"/>
        <polygon points="0,24 21,24 27,28 21,32 0,32" fill="#FFE500"/>
      </g>
      <text x="183" y="76"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900" fontStyle="italic" fontSize="42"
        fill="#FFE500" letterSpacing="-1">
        S
      </text>
    </svg>
  );
}

// ── Logo registry ──────────────────────────────────────────────────────────
const LOGOS: Record<string, () => JSX.Element> = {
  Instamart:           InstamartLogo,
  Zepto:               ZeptoLogo,
  Blinkit:             BlinkitLogo,
  BigBasket:           BigBasketLogo,
  "Flipkart Minutes":  FlipkartMinutesLogo,
  "Minutes":           FlipkartMinutesLogo,
};

// ── Shared Card component ──────────────────────────────────────────────────
function Card({
  opt,
  index,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  opt: PillsQ["opts"][0];
  index: number;
  selected: string | null;
  hovered: string | null;
  onSelect: (nm: string) => void;
  onHover: (nm: string | null) => void;
}) {
  const isSel  = selected === opt.nm;
  const isHov  = hovered === opt.nm;
  const accent = opt.color ?? THEME.primary;
  const LogoComponent = LOGOS[opt.nm];
  const hasLogo = opt.nm in LOGOS;

  return (
    <button
      type="button"
      onClick={() => onSelect(opt.nm)}
      onMouseEnter={() => onHover(opt.nm)}
      onMouseLeave={() => onHover(null)}
      className="relative flex flex-col items-center justify-center text-center rounded-2xl cursor-pointer border-none overflow-hidden"
      style={{
        padding: "14px 8px 12px",
        minHeight: "82px",
        background: isSel ? `${accent}22` : isHov ? "var(--opt-bg-h)" : "var(--opt-bg)",
        border: `1.5px solid ${isSel ? accent : isHov ? `${accent}55` : "var(--border)"}`,
        boxShadow: isSel ? `0 6px 22px ${accent}35` : "none",
        transform: isSel
          ? "translateY(-4px) scale(1.06)"
          : isHov
          ? "translateY(-2px) scale(1.02)"
          : "translateY(0) scale(1)",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        animation: `cardIn 0.3s ${index * 0.035}s cubic-bezier(0.34,1.4,0.64,1) both`,
      }}
    >
      {isSel && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(circle at 50% 35%, ${accent}30 0%, transparent 68%)`,
        }} />
      )}

      <span
        className="relative z-10 leading-none select-none"
        style={{
          width: "100%",
          maxWidth: hasLogo ? `${LOGO_W}px` : "72px",
          height: hasLogo ? `${LOGO_H}px` : "auto",
          fontSize: hasLogo ? undefined : "26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "7px",
          transform: isSel
            ? "scale(1.12) rotate(-2deg)"
            : isHov
            ? "scale(1.06) rotate(-1deg)"
            : "scale(1) rotate(0deg)",
          filter: isSel ? `drop-shadow(0 4px 10px ${accent}99)` : "none",
          transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {hasLogo ? <LogoComponent /> : opt.em}
      </span>

      {!hasLogo && (
        <span
          className="relative z-10 font-extrabold leading-tight"
          style={{
            fontSize: "10px",
            color: isSel ? accent : "var(--text2)",
            transition: "color 0.18s",
            maxWidth: "80px",
          }}
        >
          {opt.nm}
        </span>
      )}

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "3px",
          background: accent,
          borderRadius: "0 0 12px 12px",
          transform: isSel ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />

      {isSel && (
        <div
          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            background: accent,
            fontSize: "8px",
            color: "#fff",
            fontWeight: 900,
            animation: "cardIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          ✓
        </div>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function PillsQuestion({
  question, selected, textValue, onSelect, onTextChange,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const selectedOpt = question.opts.find(o => o.nm === selected);

  const COLS = 3;
  const total = question.opts.length;
  const remainder = total % COLS;
  // Split opts into full rows + last partial row
  const fullRowOpts = remainder === 0 ? question.opts : question.opts.slice(0, total - remainder);
  const lastRowOpts = remainder === 0 ? [] : question.opts.slice(total - remainder);

  return (
    <div className="flex flex-col gap-3">

      {/* ── Selected hero banner ──────────────────────────────────────────── */}
      <div style={{
        height: selected ? "56px" : "0px",
        overflow: "hidden",
        transition: "height 0.35s cubic-bezier(0.34,1.2,0.64,1)",
      }}>
        {selected && selectedOpt && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: `${selectedOpt.color ?? THEME.primary}18`,
              border: `1.5px solid ${selectedOpt.color ?? THEME.primary}55`,
              animation: "cardIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both",
            }}
          >
            <span style={{ fontSize: "22px", lineHeight: 1 }}>{selectedOpt.em}</span>
            <span className="font-extrabold text-[14px] flex-1" style={{ color: selectedOpt.color ?? THEME.primary }}>
              {selected}
            </span>
            <span className="text-[10px] font-bold" style={{ color: "var(--text3)" }}>
              ✓ selected · tap to change
            </span>
          </div>
        )}
      </div>

      {/* ── Card grid ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

        {/* Full rows — always COLS columns */}
        {fullRowOpts.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: "8px",
          }}>
            {fullRowOpts.map((opt, i) => (
              <Card
                key={opt.nm}
                opt={opt}
                index={i}
                selected={selected}
                hovered={hovered}
                onSelect={onSelect}
                onHover={setHovered}
              />
            ))}
          </div>
        )}

        {/* Last row — grid cols = number of remaining items → fills full width evenly */}
        {lastRowOpts.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${lastRowOpts.length}, 1fr)`,
            gap: "8px",
          }}>
            {lastRowOpts.map((opt, i) => (
              <Card
                key={opt.nm}
                opt={opt}
                index={fullRowOpts.length + i}
                selected={selected}
                hovered={hovered}
                onSelect={onSelect}
                onHover={setHovered}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Bonus textarea ────────────────────────────────────────────────── */}
      {selected && question.fu && (
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
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
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