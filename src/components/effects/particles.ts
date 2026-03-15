// Particle & confetti helpers — called imperatively from components

export function triggerBurst(el: HTMLElement, em: string) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = em;
    p.style.fontSize = `${10 + Math.random() * 12}px`;
    const a = (i / 8) * Math.PI * 2;
    const d = 36 + Math.random() * 58;
    p.style.setProperty("--px", `${Math.cos(a) * d}px`);
    p.style.setProperty("--py", `${Math.sin(a) * d}px`);
    p.style.setProperty("--pr", `${-200 + Math.random() * 400}deg`);
    p.style.setProperty("--dur", `${0.5 + Math.random() * 0.4}s`);
    Object.assign(p.style, {
      position: "fixed",
      left: `${cx}px`,
      top: `${cy}px`,
      pointerEvents: "none",
      zIndex: "9997",
    });
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

export function triggerBigBurst() {
  const ems = ["🎉", "⭐", "🪙", "🔥", "💫", "✨", "🎊", "💥", "🏆", "⚡", "🥑", "🍳"];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = ems[Math.floor(Math.random() * ems.length)];
    p.style.fontSize = `${14 + Math.random() * 20}px`;
    const a = (i / 22) * Math.PI * 2;
    const d = 60 + Math.random() * 130;
    p.style.setProperty("--px", `${Math.cos(a) * d}px`);
    p.style.setProperty("--py", `${Math.sin(a) * d}px`);
    p.style.setProperty("--pr", `${-200 + Math.random() * 400}deg`);
    p.style.setProperty("--dur", `${0.7 + Math.random() * 0.5}s`);
    Object.assign(p.style, {
      position: "fixed",
      left: `${cx}px`,
      top: `${cy}px`,
      pointerEvents: "none",
      zIndex: "9997",
    });
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
  if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 80]);
}

export function triggerConfettiBurst() {
  const colors = ["#FF7A00", "#FFE5B4", "#7C3AED", "#ff2d6e", "#ffd166", "#00e5c3", "#ff7a3c"];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    const col = colors[Math.floor(Math.random() * colors.length)];
    const w = 6 + Math.random() * 8;
    const h = w * (0.5 + Math.random());
    c.style.cssText = [
      `width:${w}px`,
      `height:${h}px`,
      `background:${col}`,
      `left:${Math.random() * 100}vw`,
      `top:-20px`,
      `--y0:-${20 + Math.random() * 200}px`,
      `--dx:${-60 + Math.random() * 120}px`,
      `--rot:${Math.random() * 720}deg`,
      `--dur:${1.5 + Math.random() * 1.5}s`,
      `animation-delay:${Math.random() * 0.5}s`,
    ].join(";");
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3500);
  }
}

export function triggerFloatScore(text: string, anchorEl: HTMLElement) {
  const r = anchorEl.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "float-score";
  el.textContent = text;
  el.style.left = `${r.left + r.width / 2}px`;
  el.style.top = `${r.top}px`;
  el.style.transform = "translateX(-50%)";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

export function triggerCombo(streak: number) {
  const msgs = ["COMBO! 🔥", "ON FIRE! 🔥🔥", "UNSTOPPABLE! ⚡", "LEGENDARY! 👑"];
  const el = document.createElement("div");
  el.className = "combo-text";
  el.textContent = msgs[Math.min(streak - 3, msgs.length - 1)];
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
