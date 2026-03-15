"use client";

import { useState } from "react";
import type { BattleQuestion as BattleQ } from "@/types";

interface Props {
  question: BattleQ;
  selected: string | null;
  onSelect: (value: string) => void;
}

const OPTION_COLORS = ["#ffd166","#4ecdc4","#ff6b6b","#a29bfe","#74b9ff"];

type BrandState = "win" | "win-dim" | "normal" | "dim" | "idle";

// ── Index-based map — works regardless of opt.nm values ──────────────────────
// Index 0 = first option, 1 = second, etc.
const INDEX_MAP: Record<number, { M: BrandState; N: BrandState }> = {
  0: { M: "win",     N: "dim"     },
  1: { M: "win",     N: "normal"  },
  2: { M: "win",     N: "win"     },
  3: { M: "win-dim", N: "win-dim" },
  4: { M: "normal",  N: "win"     },
};

const SPARKLES = [
  { top:"6px",    left:"6px"   },
  { top:"6px",    right:"6px"  },
  { bottom:"6px", left:"6px"   },
  { bottom:"6px", right:"6px"  },
];

const BANNER: Record<number, { text: string; color: string }> = {
  0: { text: "🥫 Loyal — your trusted brand wins!",           color: "#e8a945" },
  1: { text: "🥫 Still yours, but open to exploring!",        color: "#e8a945" },
  2: { text: "⚖️ Both have a place in your cart!",            color: "#b16fff" },
  3: { text: "🤔 Torn between both — it depends!",            color: "#9d7fe8" },
  4: { text: "🆕 Bold move — the new brand takes the crown!", color: "#74b9ff" },
};

export default function BattleQuestion({ question, selected, onSelect }: Props) {
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [vsPopped, setVsPopped] = useState(false);

  const selectedIdx = selected
    ? question.opts.findIndex(o => o.nm === selected)
    : -1;

  const stateM: BrandState = selectedIdx !== -1 ? (INDEX_MAP[selectedIdx]?.M ?? "idle") : "idle";
  const stateN: BrandState = selectedIdx !== -1 ? (INDEX_MAP[selectedIdx]?.N ?? "idle") : "idle";
  const banner = selectedIdx !== -1 ? BANNER[selectedIdx] : null;

  const handleSelect = (nm: string) => {
    onSelect(nm);
    setVsPopped(true);
    setTimeout(() => setVsPopped(false), 500);
    if (navigator.vibrate) navigator.vibrate(15);
  };

  function BrandCard({
    state, emoji, label, sub,
    winColor, winGlow, shimmer,
  }: {
    state:    BrandState;
    emoji:    string;
    label:    string;
    sub:      string;
    winColor: string;
    winGlow:  string;
    shimmer:  string;
  }) {
    const isWin    = state === "win";
    const isWinDim = state === "win-dim";
    const isDim    = state === "dim";
    const anyWin   = isWin || isWinDim;

    return (
      <div
        className="relative rounded-2xl p-3 text-center overflow-hidden select-none"
        style={{
          background:  anyWin ? `${winColor}1A`
                     : isDim  ? "rgba(255,255,255,0.02)"
                     : "var(--opt-bg)",
          border: `2px solid ${
            isWin    ? winColor
            : isWinDim ? `${winColor}88`
            : isDim  ? "rgba(255,255,255,0.05)"
            : "var(--border)"
          }`,
          transform: isWin    ? "scale(1.08) translateY(-8px)"
                   : isWinDim ? "scale(1.04) translateY(-4px)"
                   : isDim    ? "scale(0.88) translateY(6px)"
                   : "scale(1) translateY(0)",
          opacity:    isDim    ? 0.35 : isWinDim ? 0.6 : 1,
          boxShadow:  isWin    ? `0 12px 40px ${winGlow}`
                    : isWinDim ? `0 6px 20px ${winGlow}66`
                    : "none",
          cursor:     "default",
          transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Shimmer sweep */}
        {anyWin && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `linear-gradient(90deg,transparent,${shimmer},transparent)`,
            backgroundSize: "200% 100%",
            animation: `bShimmer ${isWin ? "1.8s" : "2.8s"} linear infinite`,
          }} />
        )}

        {/* Expanding ring — full win */}
        {isWin && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
            border: `2px solid ${winColor}88`,
            animation: "bRingExpand 1.4s ease-out infinite",
          }} />
        )}

        {/* Pulse ring — win-dim */}
        {isWinDim && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
            border: `1.5px solid ${winColor}44`,
            animation: "bRingPulse 2s ease-in-out infinite",
          }} />
        )}

        {/* Crown */}
        <div style={{
          fontSize:"18px", height:"22px", marginBottom:"2px",
          opacity:    anyWin ? (isWinDim ? 0.5 : 1) : 0,
          animation:  anyWin ? "bCrownDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
          transition: "opacity 0.3s",
        }}>👑</div>

        {/* Emoji */}
        <div style={{
          fontSize:"34px", marginBottom:"6px", display:"inline-block",
          filter: isWin    ? `drop-shadow(0 4px 16px ${winGlow})`
                : isWinDim ? `drop-shadow(0 2px 10px ${winGlow}88)`
                : "none",
          animation: isWin    ? "bEmojiWin    0.6s 0.1s cubic-bezier(0.34,1.56,0.64,1) forwards"
                   : isWinDim ? "bEmojiWinDim 0.6s 0.1s cubic-bezier(0.34,1.56,0.64,1) forwards"
                   : "none",
          transition: "filter 0.3s",
        }}>{emoji}</div>

        {/* Label */}
        <div className="font-extrabold text-[11px]" style={{
          color:      isWin ? winColor : isWinDim ? `${winColor}99` : "var(--text)",
          transition: "color 0.3s",
        }}>{label}</div>
        <div className="text-[9px] font-semibold mt-0.5" style={{ color:"var(--text2)" }}>{sub}</div>

        {/* Sparkles — full win */}
        {isWin && SPARKLES.map((pos, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            ...pos as React.CSSProperties,
            width:6, height:6, borderRadius:"50%",
            background: winColor,
            animation: `bSparkle 1.6s ${i * 0.3}s ease-in-out infinite`,
          }} />
        ))}

        {/* Muted sparkles — win-dim */}
        {isWinDim && SPARKLES.slice(0,2).map((pos, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            ...pos as React.CSSProperties,
            width:5, height:5, borderRadius:"50%",
            background: `${winColor}88`,
            animation: `bSparkle 2.4s ${i * 0.5}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <style>{`
        @keyframes bBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes bCrownDrop {
          0%  { transform:translateY(-20px) scale(0.3) rotate(-20deg); opacity:0 }
          60% { transform:translateY(4px)   scale(1.2) rotate(5deg);   opacity:1 }
          80% { transform:translateY(-2px)  scale(0.95) }
          100%{ transform:translateY(0)     scale(1)    rotate(0deg);  opacity:1 }
        }
        @keyframes bEmojiWin {
          0%  { transform:scale(1)    rotate(0deg)  }
          30% { transform:scale(1.4)  rotate(-10deg)}
          60% { transform:scale(1.22) rotate(6deg)  }
          100%{ transform:scale(1.18) rotate(-4deg) }
        }
        @keyframes bEmojiWinDim {
          0%  { transform:scale(1)    rotate(0deg) }
          30% { transform:scale(1.2)  rotate(-6deg)}
          60% { transform:scale(1.1)  rotate(3deg) }
          100%{ transform:scale(1.08) rotate(-2deg)}
        }
        @keyframes bRingExpand {
          0%  { transform:scale(0.85); opacity:0.9 }
          100%{ transform:scale(1.9);  opacity:0   }
        }
        @keyframes bRingPulse {
          0%,100%{ transform:scale(1);    opacity:0.3 }
          50%    { transform:scale(1.05); opacity:0.7 }
        }
        @keyframes bShimmer {
          0%  { background-position:-200% center }
          100%{ background-position: 200% center }
        }
        @keyframes bSparkle {
          0%,100%{ opacity:0; transform:scale(0) rotate(0deg)   }
          50%    { opacity:1; transform:scale(1) rotate(180deg) }
        }
        @keyframes bVsShake {
          0%,100%{ transform:scale(1)   rotate(0deg)  }
          25%    { transform:scale(1.5) rotate(-8deg) }
          75%    { transform:scale(1.5) rotate(8deg)  }
        }
        @keyframes bBannerIn {
          0%  { opacity:0; transform:translateY(8px) scale(0.95) }
          100%{ opacity:1; transform:translateY(0)   scale(1)    }
        }
      `}</style>

      {/* ── VS Arena ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_60px_1fr] gap-2 items-center">

        <BrandCard
          state={stateM}
          emoji="🥫" label="YOUR BRAND" sub="trusted, familiar"
          winColor="#ffd166"
          winGlow="rgba(255,209,102,0.55)"
          shimmer="rgba(255,209,102,0.14)"
        />

        {/* VS */}
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="font-bebas leading-none" style={{
            fontSize: "26px",
            background: "linear-gradient(135deg,#ff2d6e,#ff7a3c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 2px 8px rgba(255,45,110,0.5))",
            animation: vsPopped ? "bVsShake 0.5s cubic-bezier(0.34,1.56,0.64,1)" : "none",
          }}>VS</div>
          <div className="flex gap-0.5" style={{
            opacity: selected ? 1 : 0.3, transition: "opacity 0.3s",
          }}>
            <span style={{ fontSize:"10px", animation:"bBob 1s ease-in-out infinite" }}>⚡</span>
            <span style={{ fontSize:"10px", animation:"bBob 1s 0.2s ease-in-out infinite" }}>⚡</span>
          </div>
        </div>

        <BrandCard
          state={stateN}
          emoji="🆕" label="NEW BRAND" sub="same quality"
          winColor="#74b9ff"
          winGlow="rgba(74,185,255,0.55)"
          shimmer="rgba(74,185,255,0.14)"
        />
      </div>

      {/* ── Result banner ─────────────────────────────────────────────────── */}
      <div className="text-center rounded-2xl py-2.5 px-4" style={{
        background: banner
          ? selectedIdx === 2 ? "rgba(124,58,237,0.10)"
          : selectedIdx === 3 ? "rgba(124,58,237,0.06)"
          : stateM === "win"  ? "rgba(255,209,102,0.10)"
          : "rgba(74,185,255,0.10)"
          : "transparent",
        border: `1.5px solid ${banner
          ? selectedIdx === 2 ? "rgba(124,58,237,0.30)"
          : selectedIdx === 3 ? "rgba(124,58,237,0.20)"
          : stateM === "win"  ? "rgba(255,209,102,0.30)"
          : "rgba(74,185,255,0.30)"
          : "transparent"
        }`,
        transition: "all 0.35s",
        minHeight:  "36px",
      }}>
        {banner ? (
          <span className="text-[11px] font-extrabold" style={{
            color: banner.color,
            animation: "bBannerIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both",
          }}>
            {banner.text}
          </span>
        ) : (
          <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase" style={{ color:"var(--text3)" }}>
            WHAT WOULD YOU DO?
          </span>
        )}
      </div>

      {/* ── Option buttons ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {question.opts.map((opt, i) => {
          const isSel  = selected === opt.nm;
          const isHov  = hovered  === opt.nm;
          const accent = OPTION_COLORS[i % OPTION_COLORS.length];
          return (
            <button key={opt.nm}
              onClick={() => handleSelect(opt.nm)}
              onMouseEnter={() => setHovered(opt.nm)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer border-none text-left overflow-hidden"
              style={{
                background:  isSel ? `${accent}16` : "var(--opt-bg)",
                border:      `1.5px solid ${isSel ? accent : isHov ? `${accent}55` : "var(--border)"}`,
                boxShadow:   isSel ? `0 4px 18px ${accent}30` : "none",
                transform:   isSel ? "translateX(6px)" : isHov ? "translateX(2px)" : "none",
                transition:  "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                animation:   `cardIn 0.35s ${i * 0.06}s cubic-bezier(0.34,1.4,0.64,1) both`,
              }}
            >
              {/* Accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{
                background: accent,
                transform:  isSel ? "scaleY(1)" : "scaleY(0)",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              }} />

              {/* Letter badge */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bebas text-base flex-shrink-0"
                style={{
                  background: isSel ? accent : "var(--opt-bg-h)",
                  color:      isSel ? "#fff" : "var(--text2)",
                  border:     `1px solid ${isSel ? "transparent" : "var(--border)"}`,
                  transition: "all 0.2s",
                }}>
                {opt.ch}
              </div>

              <span className="text-xl flex-shrink-0" style={{
                transform:  isSel ? "scale(1.2) rotate(-5deg)" : "scale(1)",
                display:    "inline-block",
                transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              }}>{opt.em}</span>

              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-[13px]" style={{ color:"var(--text)" }}>{opt.nm}</div>
                <div className="text-[11px] font-semibold mt-0.5" style={{ color:"var(--text3)" }}>{opt.tg}</div>
              </div>

              {isSel && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                  style={{ background:accent, animation:"cardIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}