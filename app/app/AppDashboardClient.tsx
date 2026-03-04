"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Calculator } from "@/components/calculator/Calculator";
import { XpBar } from "@/components/calculator/XpBar";
import { SKINS, SkinId, xpRequiredForLevel } from "@/lib/skins";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  userName: string;
  initialXp: number;
  initialLevel: number;
  equippedSkinId: string;
  unlockedSkinIds: string[];
}

interface LevelUpToast {
  level: number;
  skinUnlocked: string | null;
}

export function AppDashboardClient({
  userId,
  userName,
  initialXp,
  initialLevel,
  equippedSkinId,
  unlockedSkinIds,
}: Props) {
  const [xp, setXp] = useState(initialXp);
  const [level, setLevel] = useState(initialLevel);
  const [activeSkin, setActiveSkin] = useState<SkinId>(equippedSkinId as SkinId);
  const [skinDrawerOpen, setSkinDrawerOpen] = useState(false);
  const [levelUpToast, setLevelUpToast] = useState<LevelUpToast | null>(null);
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(unlockedSkinIds);
  const [sessionStart] = useState(Date.now());

  // Session bonus: grant 5 XP after 5 minutes of activity
  useEffect(() => {
    const timer = setTimeout(async () => {
      await grantXp("session_bonus");
    }, 5 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  async function grantXp(reason = "calc_operation") {
    const res = await fetch("/api/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setXp(data.leveledUp ? data.newLevel === level + 1 ? 0 : xp : xp + 1);
    if (data.leveledUp) {
      setLevel(data.newLevel);
      setXp(0);
      if (data.skinUnlocked) {
        setUnlockedSkins((prev) => [...prev, data.skinUnlocked]);
      }
      setLevelUpToast({ level: data.newLevel, skinUnlocked: data.skinUnlocked });
      setTimeout(() => setLevelUpToast(null), 4000);
    } else {
      setXp((prev) => prev + data.xpGained);
    }
  }

  async function equipSkin(skinId: SkinId) {
    setActiveSkin(skinId);
    setSkinDrawerOpen(false);
    await fetch("/api/equip-skin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skinId }),
    });
  }

  const required = xpRequiredForLevel(level);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top nav */}
      <header className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg">
          Calc<span className="text-orange-400">Skins</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/ranking" className="text-zinc-400 hover:text-white text-sm transition-colors">🏆 Ranking</Link>
          <Link href="/app/store" className="text-zinc-400 hover:text-white text-sm transition-colors">🛒 Loja</Link>
          <Link href="/app/profile" className="text-zinc-400 hover:text-white text-sm transition-colors">👤 Perfil</Link>
          <button onClick={() => signOut()} className="text-zinc-600 hover:text-white text-sm transition-colors">Sair</button>
        </div>
      </header>

      {/* XP bar banner */}
      <div className="border-b border-white/5 px-6 py-2.5">
        <div className="max-w-sm mx-auto">
          <XpBar xp={xp} level={level} compact />
        </div>
      </div>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-4 py-12 gap-6">
        <div className="text-center mb-2">
          <p className="text-zinc-400 text-sm">Olá, {userName.split(" ")[0]}! Cada cálculo vale +1 XP ⚡</p>
        </div>

        {/* Calculator */}
        <Calculator skinId={activeSkin} onCalcComplete={() => grantXp("calc_operation")} />

        {/* Skin switcher */}
        <button
          onClick={() => setSkinDrawerOpen(true)}
          className="flex items-center gap-2 border border-white/10 hover:border-white/30 rounded-xl px-4 py-2.5 text-sm text-zinc-300 hover:text-white transition-colors"
        >
          <span>🎨</span>
          <span>Trocar Skin — {SKINS[activeSkin]?.name}</span>
        </button>
      </main>

      {/* Skin Drawer */}
      {skinDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSkinDrawerOpen(false)} />
          <div className="relative bg-[#111] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg">Minhas Skins</h2>
              <button onClick={() => setSkinDrawerOpen(false)} className="text-zinc-400 hover:text-white text-xl">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(SKINS).map((skin) => {
                const owned = unlockedSkins.includes(skin.id);
                const active = activeSkin === skin.id;
                return (
                  <button
                    key={skin.id}
                    onClick={() => owned && equipSkin(skin.id as SkinId)}
                    className={cn(
                      "relative rounded-xl p-3 border text-left transition-all",
                      active ? "border-orange-500 bg-orange-500/10" : "border-white/8 hover:border-white/20",
                      !owned && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {active && <span className="absolute top-2 right-2 text-orange-400 text-xs">✓</span>}
                    {!owned && <span className="absolute top-2 right-2 text-zinc-500 text-xs">🔒</span>}
                    <div className={cn("w-full h-8 rounded-lg mb-2", skin.preview.bg)} />
                    <p className="text-xs font-bold text-white">{skin.name}</p>
                    <p className="text-xs text-zinc-500">
                      {skin.type === "free_xp" ? `Lv ${skin.unlockLevel}` : skin.type === "premium" ? `R$ ${(skin.price! / 100).toFixed(2)}` : "Padrão"}
                    </p>
                  </button>
                );
              })}
            </div>
            <Link
              href="/app/store"
              onClick={() => setSkinDrawerOpen(false)}
              className="mt-4 w-full block text-center border border-orange-500/30 hover:bg-orange-500/10 text-orange-400 text-sm py-2.5 rounded-xl transition-colors"
            >
              Ver loja de skins →
            </Link>
          </div>
        </div>
      )}

      {/* Level up toast */}
      {levelUpToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1200] border border-yellow-500/40 rounded-2xl px-6 py-4 text-center shadow-2xl shadow-yellow-500/20 animate-bounce">
          <div className="text-3xl mb-1">🎉</div>
          <p className="font-display font-bold text-yellow-400">Level {levelUpToast.level} alcançado!</p>
          {levelUpToast.skinUnlocked && (
            <p className="text-sm text-zinc-300 mt-1">
              Desbloqueou: <span className="text-yellow-300">{SKINS[levelUpToast.skinUnlocked as SkinId]?.name}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
