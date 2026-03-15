"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import Button from "@/components/ui/Button";

const BG_ICONS   = ["🛒","🥕","🧅","🍅","🧃","🥚","🧈","🫙","🍋","🥦","🧄","🍳","🛍️","🥛","🍞"];
const ORBIT_1    = ["🥕","🍅","🥦","🧃"];
const ORBIT_2    = ["🥚","🧅","🛒","🍋"];
const ORBIT_3    = ["🧈","🍳","🧄","🥛"];
const TRUST_PILLS = [
  { icon:"🔒", text:"100% Anonymous",     c:"rgba(0,229,195,0.10)",  b:"rgba(0,229,195,0.25)",  tc:"#00e5c3" },
  { icon:"💛", text:"Your answers matter", c:"rgba(232,169,69,0.10)", b:"rgba(232,169,69,0.25)", tc:"#e8a945" },
  { icon:"🎯", text:"Takes under 2 min",   c:"rgba(232,104,10,0.10)", b:"rgba(232,104,10,0.25)", tc:"#e8a070" },
];

// ── Deterministic — no Math.random() — avoids hydration mismatch ─────────────
const FLOATERS = Array.from({ length: 22 }, (_, i) => ({
  id:       i,
  icon:     BG_ICONS[i % BG_ICONS.length],
  x:        (i * 4.7) % 100,
  size:     16 + (i % 5) * 4,
  duration: 8 + (i % 5) * 2,
  delay:    -(i * 0.65),
  driftX:   -30 + (i % 7) * 10,
}));

const DOT_COLORS = ["#e8680a","#e8a945","#7C3AED","#00e5c3","#ff2d6e","#b16fff"];
const DOT_DEGS   = [0, 60, 120, 180, 240, 300];
const SPARKLES   = [
  { left:"10px",  top:"10px",    color:"#e8a945", delay:"0s"   },
  { right:"10px", top:"10px",    color:"#e8680a", delay:"0.6s" },
  { left:"10px",  bottom:"10px", color:"#7C3AED", delay:"1.2s" },
  { right:"10px", bottom:"10px", color:"#00e5c3", delay:"1.8s" },
];

// ── All keyframes in a plain <style> tag injected once ────────────────────────
const KEYFRAMES = `
  @keyframes splHeroFloat {
    0%,100% { transform:translateY(0) rotate(-4deg) scale(1); }
    33%      { transform:translateY(-18px) rotate(4deg) scale(1.06); }
    66%      { transform:translateY(-8px) rotate(-2deg) scale(1.02); }
  }
  @keyframes splPulseHalo {
    0%,100% { transform:scale(1);   opacity:0.5; }
    50%      { transform:scale(1.2); opacity:1;   }
  }
  @keyframes splPulseHalo2 {
    0%,100% { transform:scale(1);   opacity:0.3; }
    50%      { transform:scale(1.4); opacity:0.7; }
  }
  @keyframes splShimmerText {
    0%   { background-position:0%   50%; }
    50%  { background-position:100% 50%; }
    100% { background-position:0%   50%; }
  }
  @keyframes splRocketWiggle {
    0%,100% { transform:rotate(-10deg) translateY(0)   scale(1);    }
    25%      { transform:rotate(10deg)  translateY(-4px) scale(1.12); }
    75%      { transform:rotate(-5deg)  translateY(2px)  scale(0.95); }
  }
  @keyframes splFloatUp {
    0%   { transform:translateY(0) translateX(0) rotate(0deg); opacity:0; }
    8%   { opacity:0.07; }
    92%  { opacity:0.07; }
    100% { transform:translateY(-120vh) translateX(var(--spl-drift,0px)) rotate(120deg); opacity:0; }
  }
  @keyframes splScanLine {
    0%,100% { top:12%; opacity:0; }
    25%      { opacity:0.9; }
    75%      { opacity:0.9; }
    50%      { top:82%; }
  }
  @keyframes splScanLine2 {
    0%,100% { top:30%; opacity:0; }
    25%      { opacity:0.6; }
    75%      { opacity:0.6; }
    50%      { top:65%; }
  }
  @keyframes splOrbitCW  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
  @keyframes splOrbitCCW { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
  @keyframes splRingBurst {
    0%   { transform:scale(0.2); opacity:1; }
    100% { transform:scale(3.5); opacity:0; }
  }
  @keyframes splRingPulse {
    0%,100% { transform:scale(1);    opacity:0.3; }
    50%      { transform:scale(1.08); opacity:0.7; }
  }
  @keyframes splSparkle {
    0%,100% { opacity:0; transform:scale(0) rotate(0deg);   }
    45%,55% { opacity:1; transform:scale(1) rotate(180deg); }
  }
  @keyframes splDotBlink {
    0%,100% { opacity:0.25; transform:scale(0.6); }
    50%      { opacity:1;   transform:scale(1.4); }
  }
  @keyframes splGiftPulse {
    0%,100% { box-shadow:none; border-color:rgba(232,104,10,0.22); }
    50%      { box-shadow:0 0 28px 6px rgba(232,104,10,0.18); border-color:rgba(232,104,10,0.55); }
  }
  @keyframes splShimmerBar {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes splFadeSlideUp {
    0%   { opacity:0; transform:translateY(20px); }
    100% { opacity:1; transform:translateY(0);    }
  }
  @keyframes splCtaPulse {
    0%,100% { box-shadow:0 8px 32px rgba(232,104,10,0.45); }
    50%      { box-shadow:0 16px 56px rgba(232,104,10,0.8), 0 0 70px rgba(232,169,69,0.2); }
  }
  @keyframes splHeartbeat {
    0%,100% { transform:scale(1);    }
    14%      { transform:scale(1.3);  }
    28%      { transform:scale(1);    }
    42%      { transform:scale(1.18); }
    56%      { transform:scale(1);    }
  }
  @keyframes splFloatEmoji {
    0%,100% { transform:translateY(0)   scale(1);    }
    50%      { transform:translateY(-6px) scale(1.12); }
  }
  @keyframes splAuroraShift {
    0%,100% { opacity:1;   transform:scale(1);    }
    50%      { opacity:0.7; transform:scale(1.06); }
  }
  @keyframes splPillShimmer {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
`;

export default function SplashScreen() {
  const [ready,  setReady]  = useState(false); // replaces "enter" phase
  const [exiting, setExiting] = useState(false);

  const close = () => {
    setExiting(true);
    setTimeout(() => useGameStore.setState({ screen: "intro" }), 700);
  };

  // Inject keyframes once into <head>
  useEffect(() => {
    const id  = "spl-keyframes";
    if (!document.getElementById(id)) {
      const el  = document.createElement("style");
      el.id     = id;
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
    }
    // Small delay so enter transition is visible
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "var(--bg)",
        opacity:    exiting ? 0 : 1,
        transform:  exiting ? "scale(1.05) translateY(-14px)" : "scale(1) translateY(0)",
        transition: exiting
          ? "opacity 0.65s cubic-bezier(0.4,0,1,1), transform 0.65s cubic-bezier(0.4,0,1,1)"
          : "none",
      }}
    >
      {/* ── Aurora bg ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 30%, rgba(232,104,10,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 70%, rgba(124,58,237,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(232,169,69,0.04) 0%, transparent 70%)
        `,
        animation: "splAuroraShift 10s ease-in-out infinite",
      }} />

      {/* ── Floating icons ────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATERS.map((f) => (
          <span key={f.id} className="absolute select-none" style={{
            left:      `${f.x}%`,
            fontSize:  `${f.size}px`,
            opacity:   0,
            animation: `splFloatUp ${f.duration}s ${f.delay}s linear infinite`,
            ["--spl-drift" as string]: `${f.driftX}px`,
          }}>{f.icon}</span>
        ))}
      </div>

      {/* ── Scan lines ────────────────────────────────────────────────── */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{
        height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(232,104,10,0.35),transparent)",
        animation:"splScanLine 4s ease-in-out infinite",
      }} />
      <div className="absolute left-0 right-0 pointer-events-none" style={{
        height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.3),transparent)",
        animation:"splScanLine2 6s 1.5s ease-in-out infinite",
      }} />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col items-center px-6 w-full max-w-sm"
        style={{
          opacity:    ready ? 1 : 0,
          transform:  ready ? "translateY(0)" : "translateY(36px)",
          transition: "opacity 0.7s cubic-bezier(0.34,1.2,0.64,1), transform 0.7s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >

        {/* ── Hero orbit ────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-center mb-3"
          style={{ width:200, height:200, flexShrink:0 }}>

          {/* Burst rings */}
          {ready && [0,1,2,3].map((i) => (
            <div key={i} className="absolute inset-0 rounded-full pointer-events-none" style={{
              border:`2px solid ${["#e8680a","#e8a945","#7C3AED","#00e5c3"][i]}`,
              animation:`splRingBurst 1.6s ${i * 0.2}s ease-out forwards`,
            }} />
          ))}

          {/* Outer orbit CW */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ animation:"splOrbitCW 16s linear infinite" }}>
            {ORBIT_1.map((em, i) => (
              <div key={em} className="absolute" style={{
                top:"50%", left:"50%",
                width:28, height:28, marginTop:-14, marginLeft:-14,
                transform:`rotate(${i*90}deg) translateX(90px)`,
              }}>
                <span style={{
                  display:"block", fontSize:18,
                  animation:"splOrbitCCW 16s linear infinite, splFloatEmoji 2.2s ease-in-out infinite",
                }}>{em}</span>
              </div>
            ))}
          </div>

          {/* Middle orbit CCW */}
          <div className="absolute pointer-events-none"
            style={{ inset:16, animation:"splOrbitCCW 10s linear infinite" }}>
            {ORBIT_2.map((em, i) => (
              <div key={em} className="absolute" style={{
                top:"50%", left:"50%",
                width:24, height:24, marginTop:-12, marginLeft:-12,
                transform:`rotate(${i*90+45}deg) translateX(58px)`,
              }}>
                <span style={{
                  display:"block", fontSize:15, opacity:0.85,
                  animation:"splOrbitCW 10s linear infinite, splFloatEmoji 2.6s 0.5s ease-in-out infinite",
                }}>{em}</span>
              </div>
            ))}
          </div>

          {/* Inner orbit CW */}
          <div className="absolute pointer-events-none"
            style={{ inset:36, animation:"splOrbitCW 6s linear infinite" }}>
            {ORBIT_3.map((em, i) => (
              <div key={em} className="absolute" style={{
                top:"50%", left:"50%",
                width:20, height:20, marginTop:-10, marginLeft:-10,
                transform:`rotate(${i*90+22}deg) translateX(32px)`,
              }}>
                <span style={{
                  display:"block", fontSize:12, opacity:0.65,
                  animation:"splOrbitCCW 6s linear infinite, splFloatEmoji 1.8s 1s ease-in-out infinite",
                }}>{em}</span>
              </div>
            ))}
          </div>

          {/* Halos */}
          <div className="absolute rounded-full pointer-events-none" style={{
            inset:26,
            background:"radial-gradient(circle,rgba(232,104,10,0.18) 0%,transparent 70%)",
            animation:"splPulseHalo 2.2s ease-in-out infinite",
          }} />
          <div className="absolute rounded-full pointer-events-none" style={{
            inset:38,
            background:"radial-gradient(circle,rgba(232,169,69,0.12) 0%,transparent 70%)",
            animation:"splPulseHalo2 3s 0.5s ease-in-out infinite",
          }} />

          {/* Ring border */}
          <div className="absolute rounded-full pointer-events-none" style={{
            inset:18,
            border:"1.5px solid rgba(232,104,10,0.28)",
            animation:"splRingPulse 2.5s ease-in-out infinite",
          }} />

          {/* Cart emoji */}
          <span className="block select-none relative z-10" style={{
            fontSize:"80px", lineHeight:1,
            animation:"splHeroFloat 3.5s ease-in-out infinite",
            filter:"drop-shadow(0 10px 30px rgba(232,104,10,0.6))",
          }}>🛒</span>

          {/* Corner sparkles */}
          {SPARKLES.map((s, i) => (
            <div key={i} className="absolute pointer-events-none" style={{
              ...s as React.CSSProperties,
              width:8, height:8, borderRadius:"50%",
              background:s.color,
              animation:`splSparkle 2.2s ${s.delay} ease-in-out infinite`,
            }} />
          ))}

          {/* Perimeter dots */}
          {DOT_DEGS.map((deg, i) => (
            <div key={deg} className="absolute pointer-events-none" style={{
              top:"50%", left:"50%",
              width:5, height:5, marginTop:-2.5, marginLeft:-2.5,
              borderRadius:"50%",
              background:DOT_COLORS[i],
              transform:`rotate(${deg}deg) translateX(96px)`,
              animation:`splDotBlink 1.8s ${i * 0.3}s ease-in-out infinite`,
            }} />
          ))}
        </div>

        {/* ── Title ─────────────────────────────────────────────────── */}
        <div style={{
          opacity:    ready ? 1 : 0,
          transform:  ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s 0.2s ease-out, transform 0.6s 0.2s ease-out",
          marginBottom:"6px", textAlign:"center",
        }}>
          {["The Grocery","Game!"].map((line, i) => (
            <h1 key={line} className="font-display leading-none" style={{
              fontSize:"clamp(40px,11vw,60px)", letterSpacing:"-0.5px",
              background: i === 0
                ? "linear-gradient(135deg,#e8680a 0%,#e8a945 40%,#ff7a3c 70%,#e8680a 100%)"
                : "linear-gradient(135deg,#e8a945 0%,#e8680a 40%,#c0392b 80%,#e8a945 100%)",
              backgroundSize:"300% 100%",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              animation:`splShimmerText 2.5s ${i * 0.25}s ease-in-out infinite`,
            }}>{line}</h1>
          ))}
        </div>

        {/* ── Gift card ─────────────────────────────────────────────── */}
        <div
          className="w-full rounded-2xl px-4 py-3.5 mb-4 relative overflow-hidden"
          style={{
            background:"rgba(232,104,10,0.06)",
            border:"1.5px solid rgba(232,104,10,0.22)",
            animation: ready
              ? "splGiftPulse 3s ease-in-out infinite, splFadeSlideUp 0.5s 0.38s ease-out both"
              : "none",
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background:"linear-gradient(90deg,transparent,rgba(232,169,69,0.08),transparent)",
            backgroundSize:"200% 100%",
            animation:"splShimmerBar 2.5s linear infinite",
          }} />
          <div className="relative z-10 flex items-start gap-3">
            <span style={{ fontSize:28, flexShrink:0, animation:"splHeartbeat 2.5s ease-in-out infinite" }}>💝</span>
            <div>
              <div className="font-display text-[13px] mb-0.5" style={{ color:"#e8a945" }}>
                Your answers are a precious gift
              </div>
              <div className="font-body text-[11px] font-semibold leading-relaxed" style={{ color:"var(--text2)" }}>
                Please answer genuinely — your honest responses help us build something truly meaningful for you and millions of shoppers. 🙏
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust pills ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 w-full mb-5">
          {TRUST_PILLS.map(({ icon, text, c, b, tc }, idx) => (
            <div key={text}
              className="flex items-center gap-3 rounded-2xl px-4 py-2.5 relative overflow-hidden"
              style={{
                background:c, border:`1.5px solid ${b}`,
                opacity:    ready ? 1 : 0,
                transform:  ready ? "translateX(0)" : "translateX(-24px)",
                transition: `opacity 0.45s ${0.5 + idx * 0.12}s ease-out, transform 0.45s ${0.5 + idx * 0.12}s ease-out`,
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{
                background:`linear-gradient(90deg,transparent,${tc}0a,transparent)`,
                backgroundSize:"200% 100%",
                animation:`splPillShimmer 3s ${idx * 0.5}s linear infinite`,
              }} />
              <span className="text-base flex-shrink-0 relative z-10"
                style={{ animation:`splFloatEmoji 2s ${idx * 0.35}s ease-in-out infinite` }}>
                {icon}
              </span>
              <span className="text-[12px] font-extrabold relative z-10" style={{ color:tc }}>{text}</span>
            </div>
          ))}
        </div>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <div className="w-full" style={{
          opacity:    ready ? 1 : 0,
          transform:  ready ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition: "opacity 0.55s 0.78s cubic-bezier(0.34,1.56,0.64,1), transform 0.55s 0.78s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <Button
            variant="primary"
            fullWidth
            onClick={close}
            className="text-[20px] py-[17px]"
            style={{ animation:"splCtaPulse 2s ease-in-out infinite" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2.5">
              <span style={{ animation:"splRocketWiggle 1.8s ease-in-out infinite" }}>🚀</span>
              Let&rsquo;s Play
            </span>
          </Button>
          <p className="text-center text-[11px] font-semibold mt-2" style={{ color:"var(--text3)" }}>
            No login. No data sold. Ever. 🔐
          </p>
        </div>

      </div>
    </div>
  );
}