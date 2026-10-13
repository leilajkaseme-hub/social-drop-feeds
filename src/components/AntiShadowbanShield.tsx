"use client";

import { ShieldCheck, Clock, Shuffle, FileCheck2, Gauge, AlertCircle } from "lucide-react";
import { Identity, PlatformId } from "@/lib/types";
import { getVelocitySafety } from "@/lib/humanizer";
import { PLATFORMS_CONFIG } from "@/lib/store";

interface AntiShadowbanShieldProps {
  identity: Identity;
  selectedPlatforms: PlatformId[];
  enableShield: boolean;
  onToggleShield: (val: boolean) => void;
}

export function AntiShadowbanShield({
  identity,
  selectedPlatforms,
  enableShield,
  onToggleShield,
}: AntiShadowbanShieldProps) {
  const safety = getVelocitySafety(identity.dailyPostCount);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-surface-900/90 p-5 shadow-xl">
      {/* Header & Toggle */}
      <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Anti-Shadowban Human Shield</h3>
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                ENABLED
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Guarantees platform algorithms recognize your posts as genuine human activity.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleShield(!enableShield)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            enableShield ? "bg-emerald-600" : "bg-zinc-700"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enableShield ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Account Velocity Meter */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4 text-brand-400" />
            <span className="font-medium text-zinc-200">Daily Publishing Cadence</span>
          </div>
          <span
            className={`font-semibold ${
              safety.level === "safe"
                ? "text-emerald-400"
                : safety.level === "moderate"
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {identity.dailyPostCount} / {identity.maxRecommendedPosts} Posts Today ({safety.label})
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full transition-all duration-300 ${
              safety.level === "safe"
                ? "bg-emerald-500"
                : safety.level === "moderate"
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
            style={{
              width: `${Math.min(100, (identity.dailyPostCount / identity.maxRecommendedPosts) * 100)}%`,
            }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-zinc-400">{safety.description}</p>
      </div>

      {/* The 3 Core Anti-Spam Protections */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200">
            <Clock className="h-3.5 w-3.5 text-brand-400" />
            <span>Smart Staggering</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
            Spreads delivery over a 15–60 min natural curve instead of a bot-like instant blast.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200">
            <Shuffle className="h-3.5 w-3.5 text-brand-400" />
            <span>Organic Jitter</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
            Randomizes release times by ±3 to 8 minutes so posts don’t align on round timestamps.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-200">
            <FileCheck2 className="h-3.5 w-3.5 text-brand-400" />
            <span>Platform Adapting</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
            Adjusts hashtag density and structure per platform to avoid duplicate content flags.
          </p>
        </div>

      </div>

      {/* Live Timeline Preview */}
      {selectedPlatforms.length > 0 && enableShield && (
        <div className="mt-4 border-t border-zinc-800/80 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Estimated Human Delivery Stagger:
          </span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {selectedPlatforms.map((platId, idx) => {
              const cfg = PLATFORMS_CONFIG[platId];
              const delayMins = idx === 0 ? 0 : idx * 18 + 4;
              return (
                <div
                  key={platId}
                  className="flex items-center space-x-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="font-medium">{cfg.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {delayMins === 0 ? "Now" : `+${delayMins}m`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
