"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { triggerConfettiBurst } from "@/components/effects/particles";
import Button from "@/components/ui/Button";
import { THEME } from "@/lib/theme";

export default function EndScreen() {
  const { xp, coins, streak, restartGame } = useGameStore();
  const [copied, setCopied]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(triggerConfettiBurst, 100);
    const t2 = setTimeout(triggerConfettiBurst, 600);
    const t3 = setTimeout(triggerConfettiBurst, 1200);
    const t4 = setTimeout(() => setVisible(true), 80);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🛒 *The Grocery Game* — I just played!\n⚡ XP: ${xp} | 🪙 Coins: ${coins}\n\nPlay here 👉 ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleShare = async () => {
    const text = `🛒 The Grocery Game\n⚡ XP: ${xp} | 🪙 Coins: ${coins}\n\nPlay now 👉 ${window.location.href}`;
    if (navigator.share) {
      try { await navigator.share({ title: "The Grocery Game", text, url: window.location.href }); }
      catch { /* cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
      catch { /* fallback */ }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="w-full flex flex-col gap-4" style={{ animation: "cardIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both" }}>
      <style>{`
        @keyframes popIn {
          0%   { opacity:0; transform: scale(0.3) rotate(-15deg); }
          65%  { transform: scale(1.15) rotate(4deg); opacity:1; }
          100% { transform: scale(1) rotate(0deg); opacity:1; }
        }
        @keyframes floatBob {
          0%,100% { transform: translateY(0px) rotate(-3deg); }
          50%      { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ringGrow {
          0%   { transform: scale(0.5); opacity:0.9; }
          100% { transform: scale(2.8); opacity:0;   }
        }
        @keyframes ringGrow2 {
          0%   { transform: scale(0.5); opacity:0.7; }
          100% { transform: scale(2.4); opacity:0;   }
        }
        @keyframes fadeUp {
          0%   { opacity:0; transform: translateY(18px); }
          100% { opacity:1; transform: translateY(0); }
        }
        @keyframes scorePopIn {
          0%   { opacity:0; transform: scale(0.5) translateY(12px); }
          70%  { transform: scale(1.08) translateY(-2px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%      { transform: scale(1.18); }
          28%      { transform: scale(1); }
          42%      { transform: scale(1.12); }
          56%      { transform: scale(1); }
        }
        @keyframes orbitSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbitSpinReverse {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes counterOrbit {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes checkIn {
          0%   { stroke-dashoffset: 60; opacity:0; }
          30%  { opacity:1; }
          100% { stroke-dashoffset:0; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 20px rgba(232,104,10,0.3); }
          50%      { box-shadow: 0 0 50px rgba(232,104,10,0.7), 0 0 80px rgba(232,169,69,0.3); }
        }
        @keyframes textGlow {
          0%,100% { text-shadow: none; }
          50%      { text-shadow: 0 0 20px rgba(232,104,10,0.5); }
        }
        @keyframes particlePop {
          0%   { transform: translate(0,0) scale(1); opacity:1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity:0; }
        }
      `}</style>

      {/* ── Main gratitude card ───────────────────────────────────────────── */}
      <div
        className="w-full rounded-[20px] overflow-hidden text-center relative"
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--border)",
          boxShadow: "0 0 80px rgba(232,104,10,0.10), 0 8px 40px rgba(0,0,0,0.3)",
          animation: "glowPulse 3s ease-in-out infinite",
        }}
      >
        <div className="card-stripe" />

        <div className="px-5 pt-8 pb-7 flex flex-col items-center">

          {/* ── Hero emoji with orbit rings ──────────────────────────────── */}
          <div className="relative flex items-center justify-center mb-5" style={{ width: 180, height: 180 }}>

            {/* Burst rings */}
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{
              border: `2px solid ${THEME.primary}`,
              animation: "ringGrow 1.2s 0.1s ease-out forwards",
            }} />
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{
              border: `2px solid ${THEME.gold}`,
              animation: "ringGrow2 1.2s 0.35s ease-out forwards",
            }} />
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{
              border: `1.5px solid ${THEME.accent}`,
              animation: "ringGrow 1.2s 0.55s ease-out forwards",
            }} />

            {/* Outer slow orbit — food emojis */}
            <div className="absolute inset-0 pointer-events-none" style={{
              animation: "orbitSpin 12s linear infinite",
            }}>
              {["🥕","🍅","🥦","🧃"].map((em, i) => (
                <div key={em} className="absolute" style={{
                  top: "50%", left: "50%",
                  width: 28, height: 28,
                  marginTop: -14, marginLeft: -14,
                  transform: `rotate(${i * 90}deg) translateX(82px)`,
                }}>
                  <span style={{
                    display: "block",
                    fontSize: 18,
                    animation: "counterOrbit 12s linear infinite",
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.3s ${i * 0.1}s`,
                  }}>{em}</span>
                </div>
              ))}
            </div>

            {/* Inner reverse orbit */}
            <div className="absolute pointer-events-none" style={{
              inset: 20,
              animation: "orbitSpinReverse 8s linear infinite",
            }}>
              {["🥚","🧅","🛒","🍋"].map((em, i) => (
                <div key={em} className="absolute" style={{
                  top: "50%", left: "50%",
                  width: 22, height: 22,
                  marginTop: -11, marginLeft: -11,
                  transform: `rotate(${i * 90 + 45}deg) translateX(52px)`,
                }}>
                  <span style={{
                    display: "block",
                    fontSize: 14,
                    animation: "orbitSpin 8s linear infinite",
                    opacity: visible ? 0.8 : 0,
                    transition: `opacity 0.3s ${0.4 + i * 0.1}s`,
                  }}>{em}</span>
                </div>
              ))}
            </div>

            {/* Glow backdrop */}
            <div className="absolute rounded-full pointer-events-none" style={{
              inset: 28,
              background: `radial-gradient(circle, rgba(232,104,10,0.18) 0%, transparent 70%)`,
              animation: "heartbeat 3s ease-in-out infinite",
            }} />

            {/* Hero emoji */}
            <span style={{
              fontSize: 72,
              display: "block",
              position: "relative",
              zIndex: 10,
              animation: "popIn 0.8s 0.1s cubic-bezier(0.34,1.56,0.64,1) both, floatBob 3s 1s ease-in-out infinite",
              filter: "drop-shadow(0 8px 24px rgba(232,104,10,0.5))",
            }}>🎉</span>
          </div>

          {/* ── ALL DONE label ────────────────────────────────────────────── */}
          <div
            className="font-orbitron text-[10px] font-bold tracking-[0.3em] uppercase mb-2"
            style={{
              color: "var(--text3)",
              animation: "fadeUp 0.5s 0.5s ease-out both",
            }}
          >
            ALL DONE!
          </div>

          {/* ── Main title ────────────────────────────────────────────────── */}
          <div
            className="font-display mb-1 leading-tight"
            style={{
              fontSize: "clamp(22px,6vw,28px)",
              background: `linear-gradient(135deg, #fff 0%, ${THEME.gold} 40%, ${THEME.primary} 70%, #fff 100%)`,
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s linear infinite, fadeUp 0.5s 0.6s ease-out both",
              animationFillMode: "both",
            }}
          >
            Thanks for playing 🛒
          </div>

          {/* ── Gratitude line ────────────────────────────────────────────── */}
          <p
            className="text-[12px] font-semibold mb-6 leading-relaxed"
            style={{
              color: "var(--text2)",
              animation: "fadeUp 0.5s 0.75s ease-out both",
            }}
          >
            You&rsquo;re awesome. Every answer helps us<br />build something great for you. 💛
          </p>

          {/* ── Score chips ───────────────────────────────────────────────── */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {[
              { icon: "⚡", val: `${xp} XP`,      bg: THEME.hud.xpBg,             border: THEME.hud.xpBorder,   color: THEME.hud.xpText,   delay: "0.85s" },
              { icon: "🪙", val: `${coins} Coins`, bg: THEME.hud.coinBg,           border: THEME.hud.coinBorder, color: THEME.hud.coinText, delay: "1.0s"  },
              { icon: "🔥", val: `${streak} Streak`, bg: "rgba(0,229,195,0.08)",   border: "rgba(0,229,195,0.22)", color: "#00e5c3",          delay: "1.15s" },
            ].map(({ icon, val, bg, border, color, delay }) => (
              <div
                key={val}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bebas text-lg"
                style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  color,
                  animation: `scorePopIn 0.5s ${delay} cubic-bezier(0.34,1.56,0.64,1) both`,
                }}
              >
                {icon} {val}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Share buttons ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-2.5"
        style={{ animation: "fadeUp 0.5s 1.3s ease-out both", opacity: 0 }}
      >
        <Button variant="whatsapp" fullWidth onClick={handleWhatsApp} className="gap-2.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Share on WhatsApp
        </Button>

        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="purple" onClick={handleShare} className="gap-2 text-base">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </Button>
          <Button variant="secondary" onClick={handleCopyLink} className="gap-2 text-base"
            style={{
              color:  copied ? "var(--teal)" : undefined,
              border: copied ? "1.5px solid var(--teal)" : undefined,
            }}
          >
            {copied ? "✓ Copied!" : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy Link
              </>
            )}
          </Button>
        </div>
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={restartGame}
        className="mb-2"
        style={{ animation: "fadeUp 0.5s 1.5s ease-out both", opacity: 0 }}
      >
        🔄 Play Again
      </Button>
    </div>
  );
}