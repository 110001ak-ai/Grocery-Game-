import type { DeviceMeta } from "@/types";

// ── Collect ALL device metadata ───────────────────────────────────────────────
export async function collectDeviceMeta(): Promise<DeviceMeta> {
  const nav = typeof navigator !== "undefined" ? navigator : null;
  const win = typeof window    !== "undefined" ? window    : null;
  const doc = typeof document  !== "undefined" ? document  : null;

  // ── Battery ──────────────────────────────────────────────────────────────
  let batteryLevel:            number | null = null;
  let batteryCharging:         boolean | null = null;
  let batteryChargingTime:     number | null = null;
  let batteryDischargingTime:  number | null = null;
  try {
    // @ts-ignore
    const b = await nav?.getBattery();
    batteryLevel           = Math.round(b.level * 100);
    batteryCharging        = b.charging;
    batteryChargingTime    = b.chargingTime    === Infinity ? null : b.chargingTime;
    batteryDischargingTime = b.dischargingTime === Infinity ? null : b.dischargingTime;
  } catch { /* not supported */ }

  // ── Network ───────────────────────────────────────────────────────────────
  // @ts-ignore
  const conn = nav?.connection ?? nav?.mozConnection ?? nav?.webkitConnection ?? null;
  const networkEffectiveType = conn?.effectiveType ?? null;
  const networkDownlink      = conn?.downlink      ?? null;
  const networkRtt           = conn?.rtt           ?? null;
  const networkSaveData      = conn?.saveData      ?? null;

  // ── Storage ───────────────────────────────────────────────────────────────
  let storageQuotaMB: number | null = null;
  let storageUsageMB: number | null = null;
  try {
    const estimate  = await navigator.storage.estimate();
    storageQuotaMB  = estimate.quota ? Math.round(estimate.quota / 1024 / 1024) : null;
    storageUsageMB  = estimate.usage ? Math.round(estimate.usage / 1024 / 1024) : null;
  } catch { /* not supported */ }

  // ── Permissions ───────────────────────────────────────────────────────────
  let permNotifications: string | null = null;
  let permGeolocation:   string | null = null;
  let permCamera:        string | null = null;
  let permMicrophone:    string | null = null;
  let permClipboard:     string | null = null;
  try {
    const [notif, geo, cam, mic, clip] = await Promise.all([
      navigator.permissions.query({ name: "notifications" }),
      navigator.permissions.query({ name: "geolocation" }),
      // @ts-ignore
      navigator.permissions.query({ name: "camera" }),
      // @ts-ignore
      navigator.permissions.query({ name: "microphone" }),
      // @ts-ignore
      navigator.permissions.query({ name: "clipboard-read" }),
    ]);
    permNotifications = notif.state;
    permGeolocation   = geo.state;
    permCamera        = cam.state;
    permMicrophone    = mic.state;
    permClipboard     = clip.state;
  } catch { /* not supported */ }

  // ── GPU ───────────────────────────────────────────────────────────────────
  let gpu: string | null = null;
  try {
    const canvas = doc?.createElement("canvas");
    const gl = canvas?.getContext("webgl") as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      gpu = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null;
    }
  } catch { /* not supported */ }

  return {
    // ── Browser / UA ────────────────────────────────────────────────────────
    userAgent:        nav?.userAgent        ?? "unknown",
    language:         nav?.language         ?? "unknown",
    languages:        Array.from(nav?.languages ?? []),
    platform:         nav?.platform         ?? "unknown",
    vendor:           nav?.vendor           ?? "unknown",
    cookieEnabled:    nav?.cookieEnabled     ?? false,
    doNotTrack:       nav?.doNotTrack        ?? null,
    online:           nav?.onLine            ?? false,
    // @ts-ignore
    pdfViewerEnabled: nav?.pdfViewerEnabled  ?? null,

    // ── Display ─────────────────────────────────────────────────────────────
    screenWidth:      win?.screen.width       ?? 0,
    screenHeight:     win?.screen.height      ?? 0,
    availWidth:       win?.screen.availWidth  ?? 0,
    availHeight:      win?.screen.availHeight ?? 0,
    windowWidth:      win?.innerWidth         ?? 0,
    windowHeight:     win?.innerHeight        ?? 0,
    devicePixelRatio: win?.devicePixelRatio   ?? 1,
    colorDepth:       win?.screen.colorDepth  ?? 0,
    pixelDepth:       win?.screen.pixelDepth  ?? 0,
    orientation:      win?.screen.orientation?.type ?? null,
    isFullscreen:     !!doc?.fullscreenElement,

    // ── Hardware ────────────────────────────────────────────────────────────
    cpuCores:         nav?.hardwareConcurrency ?? null,
    // @ts-ignore
    deviceMemoryGB:   nav?.deviceMemory        ?? null,
    maxTouchPoints:   nav?.maxTouchPoints      ?? null,
    gpu,

    // ── Battery ─────────────────────────────────────────────────────────────
    batteryLevel,
    batteryCharging,
    batteryChargingTime,
    batteryDischargingTime,


    // ── Network ─────────────────────────────────────────────────────────────
    networkEffectiveType,
    networkDownlink,
    networkRtt,
    networkSaveData,

    // ── Theme / Preferences ─────────────────────────────────────────────────
    deviceTheme:          (win?.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") as "dark" | "light",
    prefersReducedMotion:  win?.matchMedia("(prefers-reduced-motion: reduce)").matches  ?? false,
    prefersContrast:      (win?.matchMedia("(prefers-contrast: more)").matches ? "more" : "none") as "more" | "none",
    forcedColors:          win?.matchMedia("(forced-colors: active)").matches            ?? false,

    // ── Storage ─────────────────────────────────────────────────────────────
    storageQuotaMB,
    storageUsageMB,

    // ── Permissions ─────────────────────────────────────────────────────────
    permNotifications,
    permGeolocation,
    permCamera,
    permMicrophone,
    permClipboard,

    // ── Time / Locale ────────────────────────────────────────────────────────
    timezone:       Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    locale:         Intl.DateTimeFormat().resolvedOptions().locale,
    landedAt:       new Date().toISOString(),

    // ── Page ────────────────────────────────────────────────────────────────
    url:      win?.location.href ?? "",
    referrer: doc?.referrer      ?? "",
    title:    doc?.title         ?? "",
  };
}

// ── Send to server ────────────────────────────────────────────────────────────
export async function sendMetaToServer(device: DeviceMeta,): Promise<void> {
  try {
    await fetch("/api/meta", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ device }),
    });
  } catch {
   console.warn("Failed to send metadata to server");

  }
}