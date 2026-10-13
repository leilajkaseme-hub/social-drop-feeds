"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileVideo, FileImage, X, CheckCircle2 } from "lucide-react";

interface MediaDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function MediaDropzone({ onFileSelect, selectedFile }: MediaDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragover" || e.type === "dragenter") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const isVideo = selectedFile?.type.startsWith("video/") || selectedFile?.name.endsWith(".mp4") || selectedFile?.name.endsWith(".mov");

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`group flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? "border-brand-500 bg-brand-500/10"
              : "border-zinc-700/80 bg-zinc-900/40 hover:border-brand-500/60 hover:bg-zinc-800/30"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 shadow-inner transition group-hover:scale-105 group-hover:border-brand-500/40">
            <UploadCloud className="h-6 w-6 text-zinc-400 group-hover:text-brand-400" />
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-200">
            Drop your video or photo here, or <span className="text-brand-400 underline decoration-brand-500/30">browse</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            MP4, MOV, JPG, PNG • Ideal for TikTok, Reels & Shorts (9:16)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-zinc-700/80 bg-zinc-900 p-4 shadow-lg">
          <div className="flex items-center space-x-3.5 overflow-hidden">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              {isVideo ? <FileVideo className="h-6 w-6" /> : <FileImage className="h-6 w-6" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-100">{selectedFile.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-zinc-400 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Format Verified
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
