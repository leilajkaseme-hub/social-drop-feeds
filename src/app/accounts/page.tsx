"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { INITIAL_IDENTITIES, PLATFORMS_CONFIG } from "@/lib/store";
import { PlatformId } from "@/lib/types";
import { Plus, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

export default function AccountsPage() {
  const [identities, setIdentities] = useState(INITIAL_IDENTITIES);
  const [activeIdentityId, setActiveIdentityId] = useState("main");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIdName, setNewIdName] = useState("");

  const activeIdentity = identities.find((i) => i.id === activeIdentityId) || identities[0];

  const handleCreateIdentity = () => {
    if (!newIdName.trim()) return;
    const newId = {
      id: `id_${Date.now()}`,
      name: newIdName.trim(),
      slug: newIdName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      badgeColor: "#10b981",
      dailyPostCount: 0,
      maxRecommendedPosts: 3,
      accounts: {
        tiktok: { platformId: "tiktok" as PlatformId, connected: false, handle: "" },
        youtube: { platformId: "youtube" as PlatformId, connected: false, handle: "" },
        instagram: { platformId: "instagram" as PlatformId, connected: false, handle: "" },
        threads: { platformId: "threads" as PlatformId, connected: false, handle: "" },
        facebook: { platformId: "facebook" as PlatformId, connected: false, handle: "" },
      },
    };

    setIdentities([...identities, newId]);
    setActiveIdentityId(newId.id);
    setNewIdName("");
    setIsModalOpen(false);
  };

  const handleToggleConnect = (platformId: PlatformId) => {
    setIdentities((prev) =>
      prev.map((ident) => {
        if (ident.id !== activeIdentity.id) return ident;
        const currentAcc = ident.accounts[platformId];
        const updated = {
          ...currentAcc,
          connected: !currentAcc.connected,
          handle: !currentAcc.connected ? `${ident.slug}_feed` : "",
        };
        return {
          ...ident,
          accounts: {
            ...ident.accounts,
            [platformId]: updated,
          },
        };
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060608]">
      <Navbar
        identities={identities}
        activeIdentityId={activeIdentityId}
        onSelectIdentity={setActiveIdentityId}
      />

      <main className="flex-1 mx-auto max-w-5xl w-full p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Feeds & Connected Accounts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Manage your connected profiles across all identities. Each identity keeps separate tokens and sessions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-lg shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Identity</span>
          </button>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(PLATFORMS_CONFIG).map((plat) => {
            const acc = activeIdentity.accounts[plat.id];
            const isConnected = acc?.connected;

            return (
              <div
                key={plat.id}
                className="rounded-2xl border border-zinc-800 bg-surface-900/90 p-5 shadow-xl flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <span
                      className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-sm"
                      style={{ backgroundColor: plat.color }}
                    >
                      {plat.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {plat.name}
                        {isConnected ? (
                          <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-medium">
                            <CheckCircle2 className="h-3 w-3" /> Connected
                          </span>
                        ) : (
                          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-medium">
                            Not Linked
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {isConnected ? `@${acc.handle}` : "No channel connected"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-zinc-500">
                    {isConnected ? `${acc.followerCount || "Active"} followers` : plat.algorithmTip}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleConnect(plat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isConnected
                        ? "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        : "bg-zinc-100 text-zinc-900 hover:bg-white"
                    }`}
                  >
                    {isConnected ? "Disconnect" : "Connect Account"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: New Identity */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-surface-900 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Create New Identity Profile</h3>
              <p className="text-xs text-zinc-400">
                Use this to separate your personal feeds, clients, or distinct brand identities.
              </p>
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Identity Name:
                </label>
                <input
                  type="text"
                  value={newIdName}
                  onChange={(e) => setNewIdName(e.target.value)}
                  placeholder="e.g. Fitness Channel, Brand Gamma"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateIdentity}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
