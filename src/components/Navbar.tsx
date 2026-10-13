"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Sparkles, Send, Users, CalendarClock } from "lucide-react";
import { Identity } from "@/lib/types";

interface NavbarProps {
  identities: Identity[];
  activeIdentityId: string;
  onSelectIdentity: (id: string) => void;
}

export function Navbar({ identities, activeIdentityId, onSelectIdentity }: NavbarProps) {
  const pathname = usePathname();
  const currentIdentity = identities.find((i) => i.id === activeIdentityId) || identities[0];

  const navLinks = [
    { href: "/", label: "Drop & Post", icon: Send },
    { href: "/accounts", label: "Feeds & Accounts", icon: Users },
    { href: "/queue", label: "Scheduled Queue", icon: CalendarClock },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-surface-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="group flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 shadow-md shadow-brand-500/20 transition group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-white">
                SOCIAL DROP
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-medium text-emerald-400">
                  Vercel Live
                </span>
              </span>
              <p className="text-[11px] text-zinc-400">Human-Cadence Multi-Feed Publisher</p>
            </div>
          </Link>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden items-center space-x-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-brand-400" : "text-zinc-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Identity Selector & Safety Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
            <label htmlFor="identity-nav" className="text-[11px] text-zinc-400">Identity:</label>
            <select
              id="identity-nav"
              value={activeIdentityId}
              onChange={(e) => onSelectIdentity(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              {identities.map((id) => (
                <option key={id.id} value={id.id} className="bg-zinc-900 text-zinc-100">
                  {id.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="font-medium">Shield Active</span>
          </div>
        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="flex border-t border-zinc-800/80 px-4 py-2 md:hidden">
        <div className="flex w-full justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center space-y-1 py-1 text-[10px] font-medium ${
                  isActive ? "text-brand-400" : "text-zinc-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
