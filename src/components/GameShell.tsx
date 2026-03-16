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

      {/* Floating action buttons — always visible, no appbar */}
      <div
        className="fixed z-[9990] flex items-center gap-2"
        style={{
          top: "env(safe-area-inset-top, 16px)",
          right: 16,
          marginTop: 16,
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer transition-all active:scale-90 border-none"
          style={{
            background: "var(--opt-bg)",
            border: "1.5px solid var(--border)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}
          aria-label="Toggle theme"
        >
          <span suppressHydrationWarning>{isDark ? "🌙" : "☀️"}</span>
        </button>

        {/* Restart — only during game */}
        {screen === "game" && (
          <button
            onClick={() => setShowRestart(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer transition-transform active:scale-90 border-none"
            style={{
              background: "rgba(255,45,110,0.12)",
              border: "1.5px solid rgba(255,45,110,0.25)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 4px 16px rgba(255,45,110,0.15)",
            }}
            aria-label="Restart game"
          >
            🔄
          </button>
        )}
      </div>

      {/* Main content — fixed like a mobile app, no scroll bleed */}
      <main
        className="relative z-10 w-full flex flex-col items-center"
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          /* hide scrollbar but keep scrollability */
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          main::-webkit-scrollbar { display: none; }
        `}</style>

        <div
          className="w-full max-w-md px-4 flex flex-col"
          style={{
            minHeight: "100%",
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 72px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
          }}
        >
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