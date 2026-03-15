"use client";

// All visual tokens come from src/lib/theme.ts — change there, updates here.

import { ButtonHTMLAttributes, ReactNode, useState } from "react";
import { getBtnTokens, type ButtonVariant } from "@/lib/theme";

export type { ButtonVariant };

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  children,
  fullWidth = false,
  disabled,
  style,
  className = "",
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const t = getBtnTokens(disabled ? "ghost" : variant);
  const isHover = hovered && !disabled;

  return (
    <button
      {...rest}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "font-display rounded-2xl py-4 text-lg",
        "transition-all duration-200 active:scale-[0.97]",
        "flex items-center justify-center",
        fullWidth ? "w-full" : "",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      ].join(" ")}
      style={{
        background:  t.bg,
        border:      `1.5px solid ${isHover ? t.borderH : t.border}`,
        color:       t.text,
        boxShadow:   isHover ? t.shadowH : t.shadow,
        transform:   isHover && !disabled ? "translateY(-1px)" : "translateY(0)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
