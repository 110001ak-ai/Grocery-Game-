import type {
  GameMode,
  Answers,
  SurveySubmission,
  DeviceMeta,
  IpMeta,
} from "@/types";

let _sessionId: string | null = null;

export function getSessionId(): string {
  if (!_sessionId) {
    _sessionId = `gg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
  return _sessionId;
}

export function buildSubmissionPayload(params: {
  mode: GameMode;
  answers: Answers;
  textAnswers: Record<string, string>;
  xp: number;
  coins: number;
  streak: number;
  textBonusXp: number;
  device: DeviceMeta;
  ip: IpMeta;
}): SurveySubmission {
  return {
    submittedAt: new Date().toISOString(),
    sessionId: getSessionId(),
    mode: params.mode,
    answers: params.answers,
    textAnswers: Object.fromEntries(
      Object.entries(params.textAnswers).filter(([, v]) => v.trim().length > 0),
    ),
    score: {
      xp: params.xp,
      coins: params.coins,
      streak: params.streak,
      textBonusXp: params.textBonusXp,
    },
    meta: {
      device: params.device,
      ip: params.ip,
    },
  };
}

export async function submitSurvey(payload: SurveySubmission): Promise<void> {

  // ── Step 1: Local API — terminal logging only, never blocks success ───────
  try {
    await fetch("/api/survey", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
  } catch {
    // Local server unreachable — fine, not critical
  }

  // ── Step 2: Google Sheets — the real submission ───────────────────────────
  const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;
    console.log("Google Sheet URL:", sheetUrl); // add here


  // Case 1: URL not configured
  if (!sheetUrl) {
    throw new Error("NEXT_PUBLIC_GOOGLE_SHEET_URL is not set");
  }

  let res: Response;

  // Case 2: Network offline or URL unreachable — fetch throws TypeError
  try {
    res = await fetch(sheetUrl, {
      method:  "POST",
      headers: { "Content-Type": "text/plain" },
      body:    JSON.stringify({ ...payload, type: "survey" }),
    });
  } catch (err) {
    // Offline / DNS failure / CORS / timeout
    throw new Error(`Network error — could not reach Google Sheets: ${err}`);
  }

  // Case 3: Server responded but with an error status (4xx, 5xx)
  if (!res.ok) {
    throw new Error(`Google Sheets rejected the submission: ${res.status} ${res.statusText}`);
  }

  // Case 4: Empty or malformed response body
  let body: string;
  try {
    body = await res.text();
  } catch {
    throw new Error("Could not read response from Google Sheets");
  }

  // Case 5: Apps Script returned an error in the body
  try {
    const json = JSON.parse(body);
    if (json.ok === false) {
      throw new Error(`Apps Script error: ${json.error ?? "unknown"}`);
    }
  } catch (parseErr) {
    // Body is not JSON — that's fine, Apps Script sometimes returns plain text
    // Only re-throw if it was our own error above
    if (parseErr instanceof Error && parseErr.message.startsWith("Apps Script error")) {
      throw parseErr;
    }
  }

  // ── All cases passed — submission successful ──────────────────────────────
}
