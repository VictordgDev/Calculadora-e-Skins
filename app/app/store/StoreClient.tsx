"use client";

import { useState } from "react";
import { Skin, SkinId } from "@/lib/skins";
import { cn } from "@/lib/utils";

interface Props {
  userLevel: number;
  ownedSkinIds: string[];
  allSkins: Skin[];
}

export function StoreClient({ userLevel, ownedSkinIds, allSkins }: Props) {
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{ skinId: string; qrCode: string; qrCodeUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function buySkin(skin: Skin) {
    setPurchasing(skin.id);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "skin", skinId: skin.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPixData({ skinId: skin.id, qrCode: data.pixQrCode, qrCodeUrl: data.pixQrCodeUrl });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao processar compra");
    } finally {
      setPurchasing(null);
    }
  }

  async function copyPix() {
    if (!pixData?.qrCode) return;
    await navigator.clipboard.writeText(pixData.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const premiumSkins = allSkins.filter((s) => s.type === "premium");
  const xpSkins = allSkins.filter((s) => s.type === "free_xp");

  return (
    <div className="space-y-10">
      {/* PIX modal */}
      {pixData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPixData(null)} />
          <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center z-10 space-y-4">
            <div className="text-3xl">📱</div>
            <h2 className="font-display font-bold text-xl">PIX gerado!</h2>
            <p className="text-zinc-400 text-sm">Escaneie o QR Code para concluir a compra</p>
            {pixData.qrCodeUrl && (
              <img src={pixData.qrCodeUrl} alt="QR PIX" className="mx-auto w-40 h-40 rounded-xl bg-white p-2" />
            )}
            <button onClick={copyPix} className="w-full border border-orange-500/40 hover:bg-orange-500/10 text-orange-400 py-2.5 rounded-xl text-sm transition-colors">
              {copied ? "✓ Copiado!" : "Copiar código PIX"}
            </button>
            <p className="text-xs text-zinc-600">Após o pagamento, a skin será liberada automaticamente.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Premium skins */}
      <section>
        <h2 className="font-display font-bold text-lg mb-4">✨ Skins Premium</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {premiumSkins.map((skin) => {
            const owned = ownedSkinIds.includes(skin.id);
            return (
              <div
                key={skin.id}
                className={cn(
                  "rounded-2xl border p-4 space-y-3 transition-colors",
                  owned ? "border-green-500/30 bg-green-500/5" : "border-white/8 hover:border-white/20"
                )}
              >
                {/* Preview */}
                <div className={cn("rounded-xl h-20 flex items-center justify-center", skin.preview.bg)}>
                  <div className={cn("font-mono font-bold text-xl", skin.preview.display.includes("text-") ? "" : "text-white")}>
                    1,337
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm">{skin.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{skin.description}</p>
                </div>
                {owned ? (
                  <div className="text-center text-green-400 text-sm font-medium py-2">✓ Você já tem essa skin</div>
                ) : (
                  <button
                    onClick={() => buySkin(skin)}
                    disabled={!!purchasing}
                    className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
                  >
                    {purchasing === skin.id ? "Processando..." : `Comprar — R$ ${(skin.price! / 100).toFixed(2)}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* XP skins */}
      <section>
        <h2 className="font-display font-bold text-lg mb-1">⚡ Skins por XP</h2>
        <p className="text-zinc-400 text-sm mb-4">Desbloqueie gratuitamente subindo de nível.</p>
        <div className="grid sm:grid-cols-4 gap-3">
          {xpSkins.map((skin) => {
            const owned = ownedSkinIds.includes(skin.id);
            const canUnlock = userLevel >= (skin.unlockLevel ?? 0);
            return (
              <div
                key={skin.id}
                className={cn(
                  "rounded-xl border p-3 space-y-2 transition-colors",
                  owned ? "border-green-500/30 bg-green-500/5" : canUnlock ? "border-yellow-500/20 bg-yellow-500/5" : "border-white/5 opacity-60"
                )}
              >
                <div className={cn("rounded-lg h-12", skin.preview.bg)} />
                <p className="text-xs font-bold">{skin.name}</p>
                <p className={cn("text-xs font-mono", owned ? "text-green-400" : canUnlock ? "text-yellow-400" : "text-zinc-500")}>
                  {owned ? "✓ Desbloqueada" : canUnlock ? "Disponível!" : `Lv ${skin.unlockLevel}`}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
