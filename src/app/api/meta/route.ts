import { NextRequest, NextResponse } from "next/server";
import type { DeviceMeta, IpMeta } from "@/types";

const GAS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ?? "";

export async function POST(req: NextRequest) {

  const { device }: { device: DeviceMeta } = await req.json();

  // ── Get IP from request headers ──────────────────────────────────────────
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  const ip: IpMeta = {
    ip: forwarded?.split(",")[0] || realIp || null,
    country: req.headers.get("x-vercel-ip-country") ?? null,
    region: req.headers.get("x-vercel-ip-country-region") ?? null,
    city: req.headers.get("x-vercel-ip-city") ?? null,
    isp: null
  };
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌐 IP CAPTURED");
  console.log(`IP       : ${ip.ip}`);
  console.log(`Country  : ${ip.country}`);
  console.log(`Region   : ${ip.region}`);
  console.log(`City     : ${ip.city}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // ── Forward to Google Sheets ──────────────────────────────────────────────
   if (GAS_URL) {
    try {
      await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      type: "meta",
      device,
      ip
  })
});

    } catch (err) {
      console.error("❌ Failed to forward to Google Sheets:", err);
    }
  } else {
    console.warn("⚠️  GOOGLE_SHEET_URL not set — skipping Google Sheets");
  }

  return NextResponse.json({ ok: true });
}
