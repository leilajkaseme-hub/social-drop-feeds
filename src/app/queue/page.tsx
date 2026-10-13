"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { INITIAL_IDENTITIES, PLATFORMS_CONFIG } from "@/lib/store";
import { PostSubmission } from "@/lib/types";
import { CalendarClock, CheckCircle2, Clock, Trash2, Play, Sparkles } from "lucide-react";

export default function QueuePage() {
  const [identities] = useState(INITIAL_IDENTITIES);
  const [activeIdentityId, setActiveIdentityId] = useState("main");
  const [queue, setQueue] = useState<PostSubmission[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("social_drop_queue");
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClearQueue = () => {
    if (confirm("Are you sure you want to clear the queue?")) {
      localStorage.removeItem("social_drop_queue");
      setQueue([]);
    }
  };

  const handleSimulatePublish = (postId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setQueue((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            staggeredSchedule: post.staggeredSchedule.map((item) => ({
              ...item,
              status: "published" as const,
            })),
          };
        })
      );
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060608]">
      <Navbar
        identities={identities}
        activeIdentityId={activeIdentityId}
        onSelectIdentity={setActiveIdentityId}
      />

      <main className="flex-1 mx-auto max-w-5xl w-full p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <CalendarClock className="h-6 w-6 text-brand-400" />
              <span>Scheduled Publishing Queue</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Active posts queued with human staggered intervals to protect your accounts from spam filters.
            </p>
          </div>

          {queue.length > 0 && (
            <button
              type="button"
              onClick={handleClearQueue}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-xs text-rose-400 font-medium transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Queue</span>
            </button>
          )}
        </div>

        {/* Queue List */}
        {queue.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center space-y-3">
            <CalendarClock className="h-10 w-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">No scheduled posts in the queue</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Drop a post on the homepage and schedule it to see your staggered delivery timeline here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-zinc-800 bg-surface-900/90 p-5 shadow-xl space-y-4"
              >
                {/* Post Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-brand-400 font-mono">
                      {post.id}
                    </span>
                    <span className="text-xs text-zinc-500 ml-2">
                      Queued {new Date(post.createdAt).toLocaleDateString()} at{" "}
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePublish(post.id)}
                    disabled={isProcessing}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>{isProcessing ? "Publishing..." : "Publish Live Test"}</span>
                  </button>
                </div>

                {/* Post Caption Preview */}
                <div>
                  {post.title && (
                    <p className="text-xs font-bold text-white mb-1">
                      Title: {post.title}
                    </p>
                  )}
                  <p className="text-xs text-zinc-300 line-clamp-2">
                    {post.baseCaption}
                  </p>
                  {post.mediaName && (
                    <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      Attachment: {post.mediaName} ({post.mediaType})
                    </span>
                  )}
                </div>

                {/* Staggered Timeline Grid */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                    Staggered Delivery Sequence:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {post.staggeredSchedule.map((item) => {
                      const cfg = PLATFORMS_CONFIG[item.platformId];
                      const isPublished = item.status === "published";

                      return (
                        <div
                          key={item.platformId}
                          className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-200 capitalize">
                              {cfg.name}
                            </span>
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: cfg.color }}
                            />
                          </div>

                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(item.scheduledTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                isPublished
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {isPublished ? "● Published" : "○ Queued"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
