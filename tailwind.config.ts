import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF7A00",
        accent: "#7C3AED",
        pink: "#ff2d6e",
        gold: "#ffd166",
        teal: "#00e5c3",
        purple: "#b16fff",
        orange: "#ff7a3c",
        "dark-bg": "#04040f",
        "dark-bg2": "#0a0a1e",
        "dark-card": "#0c0c22",
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "cursive"],
        body: ["var(--font-nunito)", "sans-serif"],
        bebas: ["var(--font-bebas)", "cursive"],
        orbitron: ["var(--font-orbitron)", "sans-serif"],
      },
      animation: {
        "float": "float 2.5s ease-in-out infinite",
        "bob": "bob 2s ease-in-out infinite",
        "pulse-glow": "pulseGlow 1s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "card-in": "cardIn 0.44s cubic-bezier(0.34, 1.4, 0.64, 1) both",
        "card-in-back": "cardInBack 0.44s cubic-bezier(0.34, 1.4, 0.64, 1) both",
        "trophy-drop": "trophyDrop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "score-pop": "scorePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "confetti-fall": "confettiFall var(--dur, 2s) ease-in forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-5deg)" },
          "50%": { transform: "translateY(-12px) rotate(5deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-3px) scale(1.14)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 6px rgba(255,122,0,0.5)" },
          "50%": { boxShadow: "0 0 14px rgba(255,122,0,0.9)" },
        },
        shimmer: {
          "0%": { left: "-100%" },
          "100%": { left: "200%" },
        },
        cardIn: {
          "0%": { opacity: "0", transform: "translateX(65px) scale(0.93)" },
          "100%": { opacity: "1", transform: "none" },
        },
        cardInBack: {
          "0%": { opacity: "0", transform: "translateX(-65px) scale(0.93)" },
          "100%": { opacity: "1", transform: "none" },
        },
        trophyDrop: {
          "0%": { transform: "translateY(-60px) scale(0) rotate(-20deg)", opacity: "0" },
          "70%": { transform: "translateY(8px) scale(1.12) rotate(4deg)" },
          "100%": { transform: "none", opacity: "1" },
        },
        scorePop: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
