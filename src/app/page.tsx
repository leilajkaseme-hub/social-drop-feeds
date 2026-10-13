"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MediaDropzone } from "@/components/MediaDropzone";
import { PlatformToggles } from "@/components/PlatformToggles";
import { AntiShadowbanShield } from "@/components/AntiShadowbanShield";
import { INITIAL_IDENTITIES } from "@/lib/store";
import { PlatformId, PostSubmission } from "@/lib/types";
import { calculateStaggeredTimeline } from "@/lib/humanizer";
import { Calendar, Clock, Send, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DropAndPostPage() {
  const [identities, setIdentities] = useState(INITIAL_IDENTITIES);
  const [activeIdentityId, setActiveIdentityId] = useState("main");

  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([
    "youtube",
    "tiktok",
    "instagram",
    "threads",
  ]);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [enableShield, setEnableShield] = useState(true);

  // Timing Presets
  const [scheduleOption, setScheduleOption] = useState<"today_now" | "today_3pm" | "tomorrow_11am">("today_3pm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPost, setSubmittedPost] = useState<PostSubmission | null>(null);

  const activeIdentity = identities.find((i) => i.id === activeIdentityId) || identities[0];

  const handleTogglePlatform = (platformId: PlatformId) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform to publish to.");
      return;
    }
    if (!caption.trim() && !selectedFile) {
      alert("Please enter a caption or attach media.");
      return;
    }

    setIsSubmitting(true);

    // Calculate base date
    const now = new Date();
    let baseDate = now;
    if (scheduleOption === "today_3pm") {
      baseDate = new Date();
      baseDate.setHours(15, 0, 0, 0);
      if (baseDate < now) baseDate = new Date(now.getTime() + 10 * 60000); // 10 min from now if 3pm passed
    } else if (scheduleOption === "tomorrow_11am") {
      baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + 1);
      baseDate.setHours(11, 0, 0, 0);
    }

    const staggered = calculateStaggeredTimeline(
      baseDate,
      selectedPlatforms,
      caption,
      title,
      enableShield
    );

    const submission: PostSubmission = {
      id: `post_${Date.now()}`,
      identityId: activeIdentity.id,
      baseCaption: caption,
      title: title || undefined,
      mediaName: selectedFile ? selectedFile.name : undefined,
      mediaType: selectedFile?.type.startsWith("video/") ? "video" : "image",
      targetPlatforms: selectedPlatforms,
      requestedDate: baseDate.toISOString(),
      enableAntiShadowban: enableShield,
      staggeredSchedule: staggered,
      createdAt: new Date().toISOString(),
    };

    // Save submission to local storage queue
    try {
      const existingQueue = JSON.parse(localStorage.getItem("social_drop_queue") || "[]");
      existingQueue.unshift(submission);
      localStorage.setItem("social_drop_queue", JSON.stringify(existingQueue));

      // Increment identity daily count
      setIdentities((prev) =>
        prev.map((id) =>
          id.id === activeIdentity.id ? { ...id, dailyPostCount: id.dailyPostCount + 1 } : id
        )
      );
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedPost(submission);
    }, 700);
  };

  const resetForm = () => {
    setSubmittedPost(null);
    setTitle("");
    setCaption("");
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060608]">
      <Navbar
        identities={identities}
        activeIdentityId={activeIdentityId}
        onSelectIdentity={setActiveIdentityId}
      />

      <main className="flex-1 mx-auto max-w-5xl w-full p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: activeIdentity.badgeColor }} />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {activeIdentity.name}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Drop your media once. Auto-distributes across TikTok, Reels, Shorts & Feeds with human cadence.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/accounts"
              className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-xs text-zinc-300 font-medium transition"
            >
              Manage Feeds ({Object.values(activeIdentity.accounts).filter(a => a.connected).length} Connected)
            </Link>
          </div>
        </div>

        {/* Success Modal / Banner */}
        {submittedPost ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
              <div>
                <h2 className="text-base font-bold text-white">Post Queued with Human Cadence Protection!</h2>
                <p className="text-xs text-emerald-300/90">
                  Your content has been scheduled and will release organically across your selected feeds.
                </p>
              </div>
            </div>

            {/* Staggered summary list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {submittedPost.staggeredSchedule.map((item) => (
                <div key={item.platformId} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs flex justify-between items-center">
                  <span className="font-semibold text-zinc-200 capitalize">{item.platformId}</span>
                  <span className="font-mono text-brand-300">
                    {new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="text-[10px] text-zinc-500 ml-1">({item.offsetMinutes === 0 ? "Immediate" : `+${item.offsetMinutes}m`})</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition"
              >
                Schedule Another Post
              </button>
              <Link
                href="/queue"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition shadow-lg shadow-brand-500/20"
              >
                <span>View Queue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Composer Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Main Form (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* 1. Media Upload */}
              <div className="rounded-2xl border border-zinc-800 bg-surface-900/90 p-5 shadow-xl space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <span>1. Media Asset</span>
                  <span className="text-[10px] text-brand-400 font-normal">(Video / Photo)</span>
                </label>
                <MediaDropzone onFileSelect={setSelectedFile} selectedFile={selectedFile} />
              </div>

              {/* 2. Platform Selection */}
              <div className="rounded-2xl border border-zinc-800 bg-surface-900/90 p-5 shadow-xl space-y-3">
                <PlatformToggles
                  selectedPlatforms={selectedPlatforms}
                  onTogglePlatform={handleTogglePlatform}
                  baseCaption={caption}
                  title={title}
                />
              </div>

              {/* 3. Content Composer */}
              <div className="rounded-2xl border border-zinc-800 bg-surface-900/90 p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="caption" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    2. Content & Captions
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {caption.length} chars
                  </span>
                </div>

                {/* Title (YouTube Shorts / Video) */}
                {selectedPlatforms.includes("youtube") && (
                  <div>
                    <label htmlFor="title-input" className="text-xs font-medium text-zinc-400 block mb-1">
                      YouTube Video Title:
                    </label>
                    <input
                      id="title-input"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Catchy YouTube Shorts title (e.g. 3 Secrets To Rapid Growth #shorts)"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                )}

                {/* Caption Textarea */}
                <div>
                  <textarea
                    id="caption"
                    rows={4}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write your main caption here... (The humanizer automatically formats hashtags and hooks for each platform)"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 custom-scrollbar"
                  />
                </div>

                {/* Timing Presets */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-400" />
                    <span>When should it release?</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setScheduleOption("today_now")}
                      className={`p-2.5 rounded-xl border text-xs text-left transition ${
                        scheduleOption === "today_now"
                          ? "border-brand-500 bg-brand-500/10 text-brand-300"
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="font-semibold text-zinc-200">Post Today</div>
                      <div className="text-[10px] text-zinc-500">Stagger starting now</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleOption("today_3pm")}
                      className={`p-2.5 rounded-xl border text-xs text-left transition ${
                        scheduleOption === "today_3pm"
                          ? "border-brand-500 bg-brand-500/10 text-brand-300"
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="font-semibold text-zinc-200">Today at 3:00 PM</div>
                      <div className="text-[10px] text-zinc-500">Optimal creator peak</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleOption("tomorrow_11am")}
                      className={`p-2.5 rounded-xl border text-xs text-left transition ${
                        scheduleOption === "tomorrow_11am"
                          ? "border-brand-500 bg-brand-500/10 text-brand-300"
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="font-semibold text-zinc-200">Tomorrow 11 AM</div>
                      <div className="text-[10px] text-zinc-500">Morning window</div>
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <span>Queuing with Human Protection...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Schedule & Auto-Post to {selectedPlatforms.length} Feeds</span>
                      </span>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Sidebar: Anti-Shadowban Guard (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <AntiShadowbanShield
                identity={activeIdentity}
                selectedPlatforms={selectedPlatforms}
                enableShield={enableShield}
                onToggleShield={setEnableShield}
              />
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
