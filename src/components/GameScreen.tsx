"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { QUESTIONS } from "@/lib/questions";
import HUD from "@/components/ui/HUD";
import CityQuestion from "@/components/questions/CityQuestion";
import FridgeQuestion from "@/components/questions/FridgeQuestion";
import BudgetQuestion from "@/components/questions/BudgetQuestion";
import BossQuestion from "@/components/questions/BossQuestion";
import FreqQuestion from "@/components/questions/FreqQuestion";
import AppsQuestion from "@/components/questions/AppsQuestion";
import NightQuestion from "@/components/questions/NightQuestion";
import StarsQuestion from "@/components/questions/StarsQuestion";
import RaceQuestion from "@/components/questions/RaceQuestion";
import BattleQuestion from "@/components/questions/BattleQuestion";
import RageQuestion from "@/components/questions/RageQuestion";
import Grid2Question from "@/components/questions/Grid2Question";
import DropdownQuestion from "@/components/questions/DropdownQuestion";
import IdeaQuestion from "@/components/questions/IdeaQuestion";
import { triggerBigBurst, triggerCombo } from "@/components/effects/particles";
import Button from "@/components/ui/Button";
import { THEME } from "@/lib/theme";
import type {
  CityQuestion as CityQ,
  FridgeQuestion as FridgeQ,
  BudgetQuestion as BudgetQ,
  BossQuestion as BossQ,
  FreqQuestion as FreqQ,
  AppsQuestion as AppsQ,
  NightQuestion as NightQ,
  StarsQuestion as StarsQ,
  RaceQuestion as RaceQ,
  BattleQuestion as BattleQ,
  RageQuestion as RageQ,
  Grid2Question as Grid2Q,
  DropdownQuestion as DropdownQ,
  PillsQuestion as PillsQ,
} from "@/types";
import PillsQuestion from "./questions/PillsQuestion";

// ── Submission steps shown during loading ─────────────────────────────────────
const STEPS = [
  { icon: "📊", label: "Tallying your answers..."    },
  { icon: "🧠", label: "Analysing your food brain..." },
  { icon: "🏆", label: "Computing your score..."       },
  { icon: "✨", label: "Preparing your results..."    },
];

function SubmittingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <style>{`
        @keyframes overlayIn {
          0%   { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spinRing {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinRingReverse {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulseGlow {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes stepIn {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes floatEmoji {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-6px) scale(1.1); }
        }
      `}</style>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,104,10,0.07) 0%, transparent 70%)",
        animation: "pulseGlow 3s ease-in-out infinite",
      }} />

      {/* Spinner rings */}
      <div className="relative flex items-center justify-center mb-8" style={{ width: 120, height: 120 }}>

        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full" style={{
          border: "2px solid transparent",
          borderTopColor: THEME.primary,
          borderRightColor: THEME.gold,
          animation: "spinRing 1.4s linear infinite",
        }} />

        {/* Middle ring */}
        <div className="absolute rounded-full" style={{
          inset: 12,
          border: "2px solid transparent",
          borderTopColor: THEME.accent,
          borderLeftColor: THEME.pink,
          animation: "spinRingReverse 1s linear infinite",
        }} />

        {/* Inner ring */}
        <div className="absolute rounded-full" style={{
          inset: 24,
          border: "1.5px solid transparent",
          borderTopColor: THEME.teal,
          animation: "spinRing 0.7s linear infinite",
        }} />

        {/* Center emoji */}
        <span className="relative z-10 text-4xl" style={{
          animation: "floatEmoji 2s ease-in-out infinite",
          filter: `drop-shadow(0 0 12px ${THEME.primary})`,
        }}>🏆</span>
      </div>

      {/* Title */}
      <h2 className="font-display mb-1" style={{
        fontSize: "clamp(22px,6vw,28px)",
        background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.gold}, ${THEME.primary})`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "shimmer 2s linear infinite",
      }}>
        Crunching the numbers
      </h2>

      <p className="text-[13px] font-semibold mb-8" style={{ color: "var(--text3)" }}>
        Your kitchen rank is being computed...
      </p>

      {/* Steps */}
      <div className="flex flex-col gap-3 w-full max-w-[260px]">
        {STEPS.map((step, i) => (
          <div
            key={step.label}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: "var(--opt-bg)",
              border: "1.5px solid var(--border)",
              animation: `stepIn 0.4s ${i * 0.18}s cubic-bezier(0.34,1.4,0.64,1) both`,
            }}
          >
            {/* Animated dot */}
            <div className="relative flex-shrink-0" style={{ width: 8, height: 8 }}>
              <div className="absolute inset-0 rounded-full" style={{
                background: THEME.primary,
                animation: `pulseGlow 1.2s ${i * 0.3}s ease-in-out infinite`,
              }} />
            </div>

            <span className="text-lg flex-shrink-0">{step.icon}</span>

            <span className="text-[12px] font-bold" style={{ color: "var(--text2)" }}>
              {step.label}
            </span>

            {/* Shimmer bar */}
            <div className="flex-1 h-1 rounded-full overflow-hidden ml-auto" style={{
              background: "var(--border)",
              minWidth: 32,
            }}>
              <div className="h-full rounded-full" style={{
                background: `linear-gradient(90deg, transparent, ${THEME.primary}, transparent)`,
                backgroundSize: "200% 100%",
                animation: `shimmer 1.4s ${i * 0.2}s linear infinite`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GameScreen() {
  const {
    currentQ,
    answers,
    textAnswers,
    streak,
    setAnswer,
    setTextAnswer,
    nextQuestion,
    prevQuestion,
    isSubmitting,
  } = useGameStore();

  const q = QUESTIONS[currentQ];
  const cardRef = useRef<HTMLDivElement>(null);
  const currentAnswer = answers[q.id];
  const currentTextAnswer = textAnswers[q.id] ?? "";
  const hasAnswer = currentAnswer !== undefined;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && hasAnswer) handleNext();
      if ((e.key === "ArrowLeft") && currentQ > 0) prevQuestion();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAnswer, currentQ]);

  const handleSelect = useCallback((value: string | number) => {
    setAnswer(q.id, value);
    if (streak > 0 && streak % 3 === 0) triggerCombo(streak);
  }, [q.id, setAnswer, streak]);

  const handleNext = async () => {
    if (!hasAnswer) return;
    triggerBigBurst();
    await nextQuestion();
  };

  const isLast = currentQ === QUESTIONS.length - 1;

  const renderQuestion = () => {
    switch (q.type) {
      case "city":
        return <CityQuestion question={q as CityQ} selected={currentAnswer as string ?? null} onSelect={handleSelect} />;
      case "fridge":
        return <FridgeQuestion onSelect={handleSelect} currentValue={currentAnswer as string ?? null} />;
      case "budget":
        return <BudgetQuestion question={q as BudgetQ} selected={currentAnswer as string ?? null} onSelect={handleSelect} />;
      case "boss":
        return <BossQuestion question={q as BossQ} selected={currentAnswer as string ?? null} onSelect={handleSelect} />;
      case "freq":
        return <FreqQuestion question={q as FreqQ} selected={currentAnswer as string ?? null} onSelect={handleSelect} />;
      case "apps":
        return <AppsQuestion question={q as AppsQ} selected={currentAnswer as string ?? null} textValue={currentTextAnswer} onSelect={handleSelect} onTextChange={(v) => setTextAnswer(q.id, v)} />;
      case "night":
        return <NightQuestion question={q as NightQ} selected={currentAnswer as string ?? null} onSelect={handleSelect} />;
      case "stars":
        return <StarsQuestion question={q as StarsQ} selected={currentAnswer as number ?? null} textValue={currentTextAnswer} onSelect={handleSelect} onTextChange={(v) => setTextAnswer(q.id, v)} />;
      case "race":
        return <RaceQuestion question={q as RaceQ} selected={currentAnswer as string ?? null} onSelect={handleSelect} />;
      case "grid2":
        return <Grid2Question question={q as Grid2Q} selected={currentAnswer as string ?? null} onSelect={handleSelect} />;
      case "battle":
        return <BattleQuestion question={q as BattleQ} selected={currentAnswer as string ?? null} onSelect={handleSelect} />;
      case "rage":
        return <RageQuestion question={q as RageQ} selected={currentAnswer as string ?? null} textValue={currentTextAnswer} onSelect={handleSelect} onTextChange={(v) => setTextAnswer(q.id, v)} />;
      case "dropdown":
        return <DropdownQuestion question={q as DropdownQ} selected={currentAnswer as string ?? null} textValue={currentTextAnswer} onSelect={handleSelect} onTextChange={(v) => setTextAnswer(q.id, v)} />;
      case "pills":
        return <PillsQuestion question={q as PillsQ} selected={currentAnswer as string ?? null} textValue={currentTextAnswer} onSelect={handleSelect} onTextChange={(v) => setTextAnswer(q.id, v)} />;
      case "idea":
        return <IdeaQuestion textValue={currentTextAnswer} onTextChange={(v) => setTextAnswer(q.id, v)} onSelect={handleSelect} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Full screen submitting overlay */}
      {isSubmitting && <SubmittingOverlay />}

      <div className="w-full flex flex-col" style={{ animation: "cardIn 0.44s cubic-bezier(0.34,1.4,0.64,1) both" }}>
        <HUD />

        {/* Question card */}
        <div
          ref={cardRef}
          className="w-full rounded-[20px] overflow-hidden mb-3"
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div className="card-stripe" />

          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="font-orbitron text-[9px] font-black px-2 py-0.5 rounded-md"
                style={{
                  background: THEME.tag.primaryBg,
                  border: `1px solid ${THEME.tag.primaryBorder}`,
                  color: THEME.tag.primaryText,
                  letterSpacing: "0.1em",
                }}
              >
                {q.badge.split(" · ")[0]}
              </span>
              <span
                className="font-orbitron text-[9px] font-bold tracking-[0.15em] uppercase"
                style={{ color: "var(--text3)" }}
              >
                {q.badge.split(" · ").slice(1).join(" · ")}
              </span>
            </div>

            <h2
              className="font-display mb-1 leading-tight"
              style={{ fontSize: "clamp(18px,5.5vw,24px)", color: "var(--text)" }}
            >
              {q.title}
            </h2>
            <p className="text-[12px] font-semibold mb-3" style={{ color: "var(--text2)" }}>{q.sub}</p>

            <div className="flex flex-wrap gap-1.5">
              {q.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-extrabold px-2.5 py-1 rounded-full"
                  style={{
                    background: THEME.tag.primaryBg,
                    border: `1.5px solid ${THEME.tag.primaryBorder}`,
                    color: THEME.tag.primaryText,
                  }}
                >
                  {tag}
                </span>
              ))}
              <span
                className="text-[10px] font-extrabold px-2.5 py-1 rounded-full"
                style={{
                  background: THEME.tag.xpBg,
                  border: `1.5px solid ${THEME.tag.xpBorder}`,
                  color: THEME.tag.xpText,
                }}
              >
                +{q.xp} XP
              </span>
            </div>
          </div>

          <div className="px-4 pb-4">
            {renderQuestion()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2.5">
          {currentQ > 0 && (
            <Button
              variant="secondary"
              onClick={prevQuestion}
              className="px-5 text-sm flex-shrink-0"
              style={{ paddingTop: "16px", paddingBottom: "16px" }}
            >
              ← Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!hasAnswer || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Submitting…" : isLast ? "🏆 Reveal My Score!" : "Next →"}
          </Button>
        </div>
      </div>
    </>
  );
}