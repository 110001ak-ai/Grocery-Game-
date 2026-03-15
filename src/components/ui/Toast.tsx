"use client";

import { useEffect, useRef } from "react";

interface ToastProps {
  message: string;
  icon?: string;
  show: boolean;
}

export default function Toast({ message, icon = "✅", show }: ToastProps) {
  return (
    <div
      className={`toast ${show ? "show" : ""}`}
      aria-live="polite"
    >
      <span>{icon}</span> <span>{message}</span>
    </div>
  );
}
