import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Drop | Multi-Identity Feeds on Vercel",
  description: "Human-cadence social media publisher for TikTok, YouTube Shorts, Instagram Reels, Threads, and Facebook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060608] text-zinc-100 flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
