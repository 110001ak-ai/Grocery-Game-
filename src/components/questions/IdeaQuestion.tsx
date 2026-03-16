"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { THEME } from "@/lib/theme";

interface Props {
  textValue: string;
  onTextChange: (value: string) => void;
  onSelect: (value: string) => void;
}

const PLACEHOLDERS = [
  "What's the one thing that drives you crazy about grocery apps?",
  "If you were the CEO, what would you change tomorrow?",
  "What feature would make you never switch apps again?",
  "What problem does no grocery app solve yet?",
  "Be brutally honest — what's broken?",
];

type MicState = "idle" | "listening";

export default function IdeaQuestion({
  textValue,
  onTextChange,
  onSelect,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [placeholderIdx, setIdx] = useState(0);
  const [placeholderVisible, setPV] = useState(true);
  const [micState, setMicState] = useState<MicState>("idle");
  const [interim, setInterim] = useState("");
  const [micSupported, setMicSupported] = useState(false);
  const [justStopped, setJustStopped] = useState(false);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const hasIdea = textValue.trim().length > 5;
  const charCount = textValue.length;
  const isListening = micState === "listening";

  const vibrate = (p: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(p);
  };

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;
    setMicSupported(!!SR);
  }, []);

  useEffect(() => {
    if (textValue || focused) return;
    const t = setInterval(() => {
      setPV(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % PLACEHOLDERS.length);
        setPV(true);
      }, 400);
    }, 3000);
    return () => clearInterval(t);
  }, [textValue, focused]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${Math.max(140, textRef.current.scrollHeight)}px`;
    }
  }, [textValue]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const handleChange = (val: string) => {
    onTextChange(val);
    if (val.trim().length > 5) onSelect(val.trim());
  };

  const toggleMic = useCallback(() => {
    if (!micSupported) return;

    if (isListening) {
      vibrate([40, 60, 40]);
      recognitionRef.current?.stop();
      setMicState("idle");
      setInterim("");
      setJustStopped(true);
      setTimeout(() => setJustStopped(false), 2000);
      return;
    }

    const SR =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;
    const recognition: any = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      vibrate(60);
      setMicState("listening");
      setInterim("");
    };
    recognition.onresult = (e: any) => {
      let interimText = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interimText += t;
      }
      setInterim(interimText);
      if (finalText) {
        vibrate(20);
        const updated = (textValue ? textValue + " " : "") + finalText;
        handleChange(updated);
        setInterim("");
      }
    };
    recognition.onerror = () => {
      vibrate([30, 50, 30]);
      setMicState("idle");
      setInterim("");
    };
    recognition.onend = () => {
      setMicState("idle");
      setInterim("");
    };
    recognition.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micSupported, isListening, textValue]);

  return (
    <div className="flex flex-col gap-3">
      <style>{`
        @keyframes ideasWaveBar {
          0%,100% { transform: scaleY(0.2); }
          50%      { transform: scaleY(1);   }
        }
        @keyframes ideasRingOut {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0;   }
        }
        @keyframes ideasRingOut2 {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @keyframes ideasMicPulse {
          0%,100% { box-shadow: 0 0 0 0    rgba(255,45,110,0.5), 0 4px 20px rgba(255,45,110,0.3); }
          50%      { box-shadow: 0 0 0 12px rgba(255,45,110,0),   0 8px 30px rgba(255,45,110,0.6); }
        }
        @keyframes ideasDonePulse {
          0%,100% { box-shadow: 0 0 0 0    rgba(0,229,195,0.5); }
          50%      { box-shadow: 0 0 0 10px rgba(0,229,195,0);   }
        }
        @keyframes ideasBreathe {
          0%,100% { transform: scale(1);    }
          50%      { transform: scale(1.08); }
        }
        @keyframes ideasShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ideasFadeUp {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0);   }
        }
        @keyframes ideasCheckDraw {
          0%   { stroke-dashoffset: 50; opacity: 0; }
          40%  { opacity: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ideasStopBlink {
          0%,100% { opacity: 1;   }
          50%      { opacity: 0.5; }
        }
        @keyframes ideasGlowPulse {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1;   }
        }
      `}</style>

      {/* ── Textarea container ────────────────────────────────────────────── */}
      <div className="relative">
        {/* Recording mode — frosted overlay with existing text shown cleanly */}
        {isListening && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none z-10 overflow-hidden">
            {/* Dark tinted backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(10,4,20,0.72)",
                backdropFilter: "blur(1px)",
              }}
            />
            {/* Pink shimmer sweep */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg,transparent 0%,rgba(255,45,110,0.06) 50%,transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "ideasShimmer 2s linear infinite",
              }}
            />
            {/* Existing text rendered cleanly on top */}
            <div
              className="absolute inset-0 px-5 py-5 overflow-hidden"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "1.625",
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.01em",
              }}
            >
              {textValue && (
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  {textValue}
                </span>
              )}
              {/* Interim text appended inline */}
              {interim && (
                <span
                  style={{
                    color: "#ff8fab",
                    fontStyle: "italic",
                    marginLeft: textValue ? "0.25em" : 0,
                  }}
                >
                  {interim}
                </span>
              )}
              {/* Blinking cursor */}
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1em",
                  background: "#ff2d6e",
                  marginLeft: 2,
                  verticalAlign: "text-bottom",
                  animation: "ideasStopBlink 0.8s ease-in-out infinite",
                  borderRadius: 1,
                }}
              />
            </div>
            {/* Empty state */}
            {!textValue && !interim && (
              <div
                className="absolute top-5 left-5 right-16 pointer-events-none"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "rgba(255,45,110,0.5)",
                  animation: "ideasFadeUp 0.3s ease-out both",
                }}
              >
                Listening... speak now 🎙️
              </div>
            )}
          </div>
        )}

        <textarea
          ref={textRef}
          value={textValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-2xl px-5 py-5 text-[14px] font-semibold resize-none outline-none leading-relaxed"
          style={{
            background: "var(--opt-bg)",
            border: `2px solid ${
              isListening
                ? "#ff2d6e"
                : justStopped
                  ? "#00e5c3"
                  : focused
                    ? "rgba(232,104,10,0.5)"
                    : hasIdea
                      ? "rgba(0,229,195,0.35)"
                      : "var(--border)"
            }`,
            color: isListening ? "transparent" : "var(--text)",
            caretColor: isListening ? "transparent" : "var(--primary)",
            transition: "border-color 0.3s, box-shadow 0.3s, color 0.2s",
            boxShadow: isListening
              ? "0 0 0 4px rgba(255,45,110,0.10), 0 8px 40px rgba(255,45,110,0.10)"
              : justStopped
                ? "0 0 0 4px rgba(0,229,195,0.10)"
                : focused
                  ? "0 0 0 4px rgba(232,104,10,0.08)"
                  : hasIdea
                    ? "0 0 0 3px rgba(0,229,195,0.06)"
                    : "none",
            minHeight: "140px",
            paddingRight: "56px",
            resize: "none",
          }}
          placeholder=""
        />

        {/* Animated placeholder — idle only */}
        {!textValue && !isListening && !focused && (
          <div
            className="absolute top-5 left-5 right-16 pointer-events-none font-semibold leading-relaxed"
            style={{
              fontSize: "14px",
              color: "var(--text3)",
              opacity: placeholderVisible ? 1 : 0,
              transform: placeholderVisible
                ? "translateY(0)"
                : "translateY(6px)",
              transition: "opacity 0.35s, transform 0.35s",
            }}
          >
            {PLACEHOLDERS[placeholderIdx]}
          </div>
        )}

        {/* Progress bar */}
        {charCount > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl overflow-hidden"
            style={{ zIndex: 20 }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (charCount / 200) * 100)}%`,
                background: isListening
                  ? "linear-gradient(90deg,#ff2d6e,#ff7a9a)"
                  : charCount > 60
                    ? "linear-gradient(90deg,#00e5c3,#06d6a0)"
                    : `linear-gradient(90deg,${THEME.primary},${THEME.gold})`,
                transition: "width 0.3s, background 0.5s",
              }}
            />
          </div>
        )}

        {/* ── Mic button ───────────────────────────────────────────────── */}
        {micSupported && (
          <div className="absolute top-3.5 right-3.5" style={{ zIndex: 20 }}>
            {/* Rings — listening */}
            {isListening && (
              <>
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    border: "1.5px solid rgba(255,45,110,0.7)",
                    animation: "ideasRingOut 1.3s ease-out infinite",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    border: "1.5px solid rgba(255,45,110,0.4)",
                    animation: "ideasRingOut2 1.3s 0.35s ease-out infinite",
                  }}
                />
              </>
            )}

            <button
              onClick={toggleMic}
              className="relative flex items-center justify-center rounded-full border-none cursor-pointer"
              style={{
                width: 40,
                height: 40,
                background: isListening
                  ? "linear-gradient(135deg,#ff2d6e,#c0184e)"
                  : justStopped
                    ? "linear-gradient(135deg,#00e5c3,#06b89a)"
                    : "var(--opt-bg-h)",
                border: `1.5px solid ${
                  isListening
                    ? "rgba(255,45,110,0.7)"
                    : justStopped
                      ? "rgba(0,229,195,0.7)"
                      : "var(--border)"
                }`,
                boxShadow: isListening
                  ? "0 4px 20px rgba(255,45,110,0.45)"
                  : justStopped
                    ? "0 4px 16px rgba(0,229,195,0.35)"
                    : "none",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                animation: isListening
                  ? "ideasMicPulse 1.3s ease-in-out infinite, ideasBreathe 1.5s ease-in-out infinite"
                  : justStopped
                    ? "ideasDonePulse 0.8s ease-in-out 2"
                    : "none",
              }}
              title={isListening ? "Tap to stop" : "Tap to speak"}
            >
              {isListening ? (
                // Stop square
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 3,
                    background: "#fff",
                    animation: "ideasStopBlink 1s ease-in-out infinite",
                  }}
                />
              ) : justStopped ? (
                // Check
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    strokeDasharray="50"
                    style={{ animation: "ideasCheckDraw 0.5s ease-out both" }}
                  />
                </svg>
              ) : (
                // Mic
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Recording banner ──────────────────────────────────────────────── */}
      {isListening && (
        <div
          className="relative flex items-center gap-3 px-4 py-3 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,45,110,0.07)",
            border: "1.5px solid rgba(255,45,110,0.22)",
            animation: "ideasFadeUp 0.3s ease-out both",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,45,110,0.07),transparent)",
              backgroundSize: "200% 100%",
              animation: "ideasShimmer 2s linear infinite",
            }}
          />

          {/* Mic orb */}
          <div
            className="relative flex-shrink-0"
            style={{ width: 34, height: 34 }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1.5px solid rgba(255,45,110,0.6)",
                animation: "ideasRingOut 1.3s ease-out infinite",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1.5px solid rgba(255,45,110,0.3)",
                animation: "ideasRingOut2 1.3s 0.35s ease-out infinite",
              }}
            />
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,45,110,0.15)",
                animation: "ideasBreathe 1.5s ease-in-out infinite",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff2d6e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            </div>
          </div>

          <div className="flex-1 relative z-10">
            <div
              className="font-extrabold text-[12px]"
              style={{ color: "#ff6b95" }}
            >
              Recording in progress
            </div>
            <div
              className="text-[10px] font-semibold mt-0.5"
              style={{ color: "var(--text3)" }}
            >
              Tap the red ■ to stop
            </div>
          </div>

          {/* Waveform */}
          <div
            className="flex items-end gap-[3px] flex-shrink-0 relative z-10"
            style={{ height: 20 }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: 20,
                  borderRadius: 3,
                  background: "linear-gradient(to top,#ff2d6e,#ff8fab)",
                  opacity: 0.85,
                  animation: `ideasWaveBar 0.55s ${i * 0.07}s ease-in-out infinite`,
                  transformOrigin: "bottom",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Done banner ───────────────────────────────────────────────────── */}
      {justStopped && (
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
          style={{
            background: "rgba(0,229,195,0.08)",
            border: "1.5px solid rgba(0,229,195,0.25)",
            animation: "ideasFadeUp 0.3s ease-out both",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00e5c3",
              boxShadow: "0 0 8px rgba(0,229,195,0.6)",
              animation: "ideasGlowPulse 1s ease-in-out 3",
            }}
          />
          <span
            className="font-extrabold text-[12px]"
            style={{ color: "#00e5c3" }}
          >
            Recorded! Your words have been captured ✓
          </span>
        </div>
      )}

      {/* ── Status row ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <span
          className="text-[11px] font-semibold"
          style={{ color: "var(--text3)" }}
        >
          {isListening
            ? "🎙️ Listening..."
            : justStopped
              ? "✅ Recording saved"
              : charCount === 0
                ? "No wrong answers here 🎯"
                : charCount < 30
                  ? "Keep going… 💭"
                  : charCount < 80
                    ? "Now we're talking 🚀"
                    : "That's a real take 🔥"}
        </span>
        <div className="flex items-center gap-1.5">
          {charCount > 0 && (
            <span
              className="text-[10px] font-bold"
              style={{ color: "var(--text3)" }}
            >
              {charCount}
            </span>
          )}
          <span
            className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg"
            style={{
              background: THEME.tag.xpBg,
              border: `1.5px solid ${THEME.tag.xpBorder}`,
              color: THEME.tag.xpText,
            }}
          >
            +300 XP
          </span>
          {hasIdea && (
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg"
              style={{
                background: "rgba(0,229,195,0.1)",
                border: "1.5px solid rgba(0,229,195,0.3)",
                color: "#00e5c3",
                animation: "cardIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
              }}
            >
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
