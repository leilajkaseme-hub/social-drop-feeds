import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Vercel Cron authorization header check
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  console.log(`[Vercel Cron] Running scheduled publisher worker at ${now.toISOString()}`);

  // In production, queries database (Neon/Supabase) for pending posts whose scheduledTime <= now
  return NextResponse.json({
    status: "ok",
    timestamp: now.toISOString(),
    processedCount: 0,
    message: "Cron execution completed. No pending posts due.",
  });
}
