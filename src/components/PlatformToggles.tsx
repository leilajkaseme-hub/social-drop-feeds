"use client";

import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { PlatformId } from "@/lib/types";
import { PLATFORMS_CONFIG } from "@/lib/store";
import { adaptCaptionForPlatform } from "@/lib/humanizer";

interface PlatformTogglesProps {
  selectedPlatforms: PlatformId[];
  onTogglePlatform: (platformId: PlatformId) => void;
  baseCaption: string;
  title: string;
}

export function PlatformToggles({
  selectedPlatforms,
  onTogglePlatform,
  baseCaption,
  title,
}: PlatformTogglesProps) {
  const [previewPlatform, setPreviewPlatform] = useState<PlatformId | null>(null);

  const platformsList = Object.values(PLATFORMS_CONFIG);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Target Feeds
        </label>
        <span className="text-[11px] text-zinc-500">
          {selectedPlatforms.length} of {platformsList.length} Selected
        </span>
      </div>

      {/* Grid of Platform Pills */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {platformsList.map((plat) => {
          const isSelected = selectedPlatforms.includes(plat.id);
          const isPreviewing = previewPlatform === plat.id;

          return (
            <div
              key={plat.id}
              onClick={() => onTogglePlatform(plat.id)}
              className={`group relative flex flex-col justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                isSelected
                  ? "border-zinc-500/80 bg-zinc-800/90 shadow-md"
                  : "border-zinc-800 bg-zinc-900/40 opacity-70 hover:border-zinc-700 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="h-2.5 w-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: plat.color }}
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                    isSelected
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-zinc-700 bg-zinc-800 text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs font-semibold text-zinc-100">{plat.name}</p>
                <p className="text-[10px] text-zinc-400">{plat.badge}</p>
              </div>

              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPlatform(isPreviewing ? null : plat.id);
                  }}
                  className="mt-2.5 flex items-center justify-center space-x-1 rounded bg-zinc-700/60 py-0.5 text-[10px] text-zinc-300 hover:bg-zinc-600 hover:text-white"
                >
                  {isPreviewing ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span>{isPreviewing ? "Close" : "Adapted"}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Adapted Caption Preview Drawer */}
      {previewPlatform && (
        <div className="rounded-xl border border-brand-500/30 bg-zinc-950 p-3.5">
          <div className="flex items-center justify-between text-xs text-brand-400 font-semibold mb-1.5">
            <span>
              {PLATFORMS_CONFIG[previewPlatform].name} Algorithm-Adapted Caption:
            </span>
            <span className="text-[10px] text-zinc-500 font-normal">
              {PLATFORMS_CONFIG[previewPlatform].algorithmTip}
            </span>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-200 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
            {adaptCaptionForPlatform(previewPlatform, baseCaption || "(Your caption preview here)", title)}
          </pre>
        </div>
      )}
    </div>
  );
}
