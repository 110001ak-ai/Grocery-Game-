"use client";

import { useEffect, useState, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import SplashScreen from "@/components/SplashScreen";
import IntroScreen from "@/components/IntroScreen";
import GameScreen from "@/components/GameScreen";
import EndScreen from "@/components/EndScreen";
import RestartModal from "@/components/ui/RestartModal";

export default function GameShell() {
  const { screen, isDark, initMeta, toggleTheme, restartGame } = useGameStore();
  const [showRestart, setShowRestart] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);

  // initMeta on mount — theme is already correct from store's getInitialTheme()
  useEffect(() => {
    initMeta();
  }, [initMeta]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 2200);
  }, []);

  const handleRestartConfirm = () => {
    setShowRestart(false);
    restartGame();
    showToast("🔄 Restarted! Fresh start.");
  };

  return (
    <>
      {/* Background layers */}
      <div className="bg-grid" aria-hidden />
      <div className="bg-aurora" aria-hidden />
      <div className="bg-scanlines" aria-hidden />

      {/* Top bar — identical on every screen */}
      <div
        className="fixed top-0 left-0 right-0 z-[9990] flex justify-between items-center px-4 py-3"
        style={{
          background: "var(--hud-bg)",
          backdropFilter: "blur(20px)",
          borderBottom: "1.5px solid var(--border)",
        }}
      >
        <span
          className="font-display text-lg cursor-default"
          style={{
            background: "linear-gradient(135deg,var(--primary),var(--gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          🛒 Grocery Game
        </span>

        <div className="flex items-center gap-2">
          {/* Theme toggle — on every screen */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer transition-all active:scale-90 border-none"
            style={{ background: "var(--opt-bg)", border: "1.5px solid var(--border)" }}
            aria-label="Toggle theme"
          >
            <span suppressHydrationWarning>{isDark ? "🌙" : "☀️"}</span>
          </button>

          {/* Restart — only during game */}
          {screen === "game" && (
            <button
              onClick={() => setShowRestart(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer transition-transform active:scale-90 border-none"
              style={{ background: "rgba(255,45,110,0.12)", border: "1.5px solid rgba(255,45,110,0.25)" }}
              aria-label="Restart game"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <main
        className="relative z-10 min-h-screen w-full flex flex-col items-center"
        style={{ paddingTop: "64px" }}
      >
        <div className="w-full max-w-md px-4 py-5 flex flex-col">
          {screen === "splash" && <SplashScreen />}
          {screen === "intro"  && <IntroScreen />}
          {screen === "game"   && <GameScreen />}
          {screen === "end"    && <EndScreen />}
        </div>
      </main>

      {/* Toast */}
      <div
        className="toast"
        style={{
          opacity: toastShow ? 1 : 0,
          transform: toastShow ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
          transition: "all 0.3s",
        }}
        aria-live="polite"
      >
        {toastMsg}
      </div>

      <RestartModal
        show={showRestart}
        onConfirm={handleRestartConfirm}
        onCancel={() => setShowRestart(false)}
      />
    </>
  );
}