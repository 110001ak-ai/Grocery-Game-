"use client";

import { useRef, useEffect } from "react";
import type { DropdownQuestion as DropdownQ } from "@/types";
import { THEME } from "@/lib/theme";
import { useGameStore } from "@/store/gameStore";

interface Props {
  question: DropdownQ;
  selected: string | null;
  textValue: string;
  onSelect: (value: string) => void;
  onTextChange: (value: string) => void;
}

export default function DropdownQuestion({
  question,
  selected,
  textValue,
  onSelect,
  onTextChange,
}: Props) {
  // ── All open/close state lives in Zustand ──────────────────────────────
  const { dropdownOpen, setDropdownOpen } = useGameStore();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOpt = question.opts.find((o) => o.nm === selected);
  const isOther = selected === "Other";

  // Close on click outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen, setDropdownOpen]);

  // Close on any scroll
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [dropdownOpen, setDropdownOpen]);

  const handleSelect = (nm: string) => {
    onSelect(nm);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full flex items-center justify-between px-4 py-4 rounded-2xl cursor-pointer text-left"
        style={{
          background: selectedOpt ? THEME.opt.selectedBg : "var(--opt-bg)",
          border: `1.5px solid ${selectedOpt ? THEME.opt.selectedBorder : "var(--border)"}`,
          boxShadow: selectedOpt ? THEME.opt.selectedShadow : "none",
          transition: "all 0.2s",
        }}
      >
        <div className="flex items-center gap-3">
          {selectedOpt ? (
            <>
              <span className="text-2xl leading-none">{selectedOpt.em}</span>
              <span
                className="font-extrabold text-[15px]"
                style={{ color: "var(--text)" }}
              >
                {selectedOpt.nm}
              </span>
            </>
          ) : (
            <span
              className="font-semibold text-[14px]"
              style={{ color: "var(--text3)" }}
            >
              Select your kitchen tradition…
            </span>
          )}
        </div>
        <span
          className="text-base flex-shrink-0 ml-2 select-none"
          style={{
            color: "var(--text2)",
            display: "inline-block",
            transition: "transform 0.25s",
            transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>

      {/* ── Option list — inline, never clipped ─────────────────────────── */}
      {dropdownOpen && (
        <div
          ref={listRef}
          className="rounded-2xl"
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
            overflow: "hidden",
            animation: "cardIn 0.18s cubic-bezier(0.34,1.4,0.64,1) both",
          }}
        >
          {question.opts.map((opt, i) => {
            const isSel = selected === opt.nm;
            const isLast = i === question.opts.length - 1;
            return (
              <button
                key={opt.nm}
                type="button"
                onClick={() => handleSelect(opt.nm)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer border-none"
                style={{
                  background: isSel ? THEME.opt.selectedBg : "transparent",
                  borderBottom: isLast ? "none" : "1px solid var(--border2)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isSel)
                    e.currentTarget.style.background = "var(--opt-bg-h)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSel
                    ? THEME.opt.selectedBg
                    : "transparent";
                }}
              >
                <span className="text-xl flex-shrink-0 w-8 text-center leading-none">
                  {opt.em}
                </span>
                <span
                  className="font-extrabold text-[13px] flex-1"
                  style={{ color: isSel ? THEME.primary : "var(--text)" }}
                >
                  {opt.nm}
                </span>
                {isSel && (
                  <span
                    className="text-sm flex-shrink-0 ml-2"
                    style={{ color: THEME.primary }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── "Other" → free-text field ────────────────────────────────────── */}
      {isOther && (
        <div
          style={{
            animation: "cardIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[11px] font-extrabold uppercase tracking-widest"
              style={{ color: "var(--text3)" }}
            >
              ✍️ Tell us your tradition
            </span>
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg"
              style={{
                background: THEME.tag.xpBg,
                border: `1.5px solid ${THEME.tag.xpBorder}`,
                color: THEME.tag.xpText,
              }}
            >
              +40 XP
            </span>
          </div>
          <textarea
            value={textValue}
            onChange={(e) => {
              onTextChange(e.target.value);

              /* optional: auto grow */
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            rows={2}
            inputMode="text"
            placeholder="e.g. Sindhi, Konkani, Bihari…"
            className="w-full rounded-xl px-3.5 py-3 text-[13px] font-semibold resize-none outline-none"
            style={{
              background: "var(--opt-bg)",
              border: "2px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(232,104,10,0.4)";

              /* keep textarea visible when keyboard opens */
              setTimeout(() => {
                e.target.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 250);
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
            }}
          />
        </div>
      )}

      {/* ── Any other selection → signature dish bonus ───────────────────── */}
      {selected && !isOther && (
        <div
          style={{
            animation: "cardIn 0.25s cubic-bezier(0.34,1.4,0.64,1) both",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[11px] font-extrabold uppercase tracking-widest"
              style={{ color: "var(--text3)" }}
            >
              💬 Any signature dish in mind?
            </span>
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg"
              style={{
                background: THEME.tag.xpBg,
                border: `1.5px solid ${THEME.tag.xpBorder}`,
                color: THEME.tag.xpText,
              }}
            >
              +40 XP
            </span>
          </div>
          <textarea
            value={textValue}
            onChange={(e) => {
              onTextChange(e.target.value);

              /* optional: auto grow while typing */
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            rows={2}
            inputMode="text"
            placeholder="e.g. Butter chicken every Sunday…"
            className="w-full rounded-xl px-3.5 py-3 text-[13px] font-semibold resize-none outline-none"
            style={{
              background: "var(--opt-bg)",
              border: "2px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(232,104,10,0.4)";

              /* keeps textarea visible when mobile keyboard opens */
              setTimeout(() => {
                e.target.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 250);
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
            }}
          />
        </div>
      )}
    </div>
  );
}
