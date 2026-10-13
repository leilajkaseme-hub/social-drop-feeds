import { NextRequest, NextResponse } from "next/server";
import { calculateStaggeredTimeline } from "@/lib/humanizer";
import { PlatformId } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      identityId = "main",
      baseCaption = "",
      title = "",
      targetPlatforms = ["tiktok", "youtube", "instagram", "threads"],
      requestedDate,
      enableAntiShadowban = true,
    } = body;

    const baseDate = requestedDate ? new Date(requestedDate) : new Date();

    const staggeredSchedule = calculateStaggeredTimeline(
      baseDate,
      targetPlatforms as PlatformId[],
      baseCaption,
      title,
      enableAntiShadowban
    );

    const submission = {
      id: `post_${Date.now()}`,
      identityId,
      baseCaption,
      title,
      targetPlatforms,
      requestedDate: baseDate.toISOString(),
      enableAntiShadowban,
      staggeredSchedule,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Post queued with human cadence anti-shadowban protection",
      submission,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process publish request" },
      { status: 500 }
    );
  }
}
