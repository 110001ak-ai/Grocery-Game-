"use client";

import Button from "@/components/ui/Button";

interface RestartModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function RestartModal({ show, onConfirm, onCancel }: RestartModalProps) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[99998] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onCancel}
    >
      <div
        className="rounded-[20px] p-7 max-w-xs w-full text-center"
        style={{
          background: "var(--card)",
          border: "2px solid var(--border)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          animation: "cardIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-3">🔄</div>
        <div className="font-display text-2xl mb-1" style={{ color: "var(--text)" }}>
          Restart the game?
        </div>
        <div className="text-sm font-semibold mb-5" style={{ color: "var(--text2)" }}>
          All your progress will be lost.
        </div>
        <div className="flex gap-3">
          <Button variant="primary" onClick={onConfirm} className="flex-1 py-3 text-base">Yes, restart</Button>
          <Button variant="secondary" onClick={onCancel} className="flex-1 py-3 text-base">Keep going</Button>
        </div>
      </div>
    </div>
  );
}
