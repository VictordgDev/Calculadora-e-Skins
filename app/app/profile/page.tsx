import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SKINS, xpRequiredForLevel } from "@/lib/skins";
import Link from "next/link";
import { XpBar } from "@/components/calculator/XpBar";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      xp: true,
      level: true,
      totalXpAllTime: true,
      planType: true,
      planExpiresAt: true,
      skins: { select: { skinId: true, unlockedAt: true } },
      xpEvents: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { amount: true, reason: true, createdAt: true },
      },
    },
  });

  const ownedSkinIds = ["default", ...user.skins.map((s) => s.skinId)];
  const allSkins = Object.values(SKINS);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg">
          Calc<span className="text-orange-400">Skins</span>
        </Link>
        <Link href="/app" className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Voltar ao app
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* User card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-xl font-bold">
              {(user.name ?? user.email ?? "?")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-display font-bold text-xl">{user.name ?? "Calculador"}</h1>
              <p className="text-zinc-400 text-sm">{user.email}</p>
              {user.planType && (
                <span className="inline-block mt-1 text-xs bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-full px-2 py-0.5">
                  Plano {user.planType === "monthly" ? "Mensal" : user.planType === "yearly" ? "Anual" : "Vitalício"}
                </span>
              )}
            </div>
          </div>
          <XpBar xp={user.xp} level={user.level} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="font-mono font-bold text-orange-400 text-xl">{user.level}</p>
              <p className="text-xs text-zinc-400 mt-0.5">Nível</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="font-mono font-bold text-orange-400 text-xl">{user.totalXpAllTime.toLocaleString()}</p>
              <p className="text-xs text-zinc-400 mt-0.5">XP Total</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="font-mono font-bold text-orange-400 text-xl">{ownedSkinIds.length}</p>
              <p className="text-xs text-zinc-400 mt-0.5">Skins</p>
            </div>
          </div>
        </div>

        {/* Skins collection */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">🎨 Coleção de Skins</h2>
          <div className="grid grid-cols-4 gap-3">
            {allSkins.map((skin) => {
              const owned = ownedSkinIds.includes(skin.id);
              return (
                <div
                  key={skin.id}
                  className={`rounded-xl border p-2.5 text-center transition-colors ${owned ? "border-orange-500/30 bg-orange-500/5" : "border-white/5 opacity-40"}`}
                >
                  <div className={`rounded-lg h-10 mb-2 ${skin.preview.bg}`} />
                  <p className="text-xs font-bold truncate">{skin.name}</p>
                  {!owned && (
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {skin.type === "premium" ? "💰" : `Lv ${skin.unlockLevel}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent XP history */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">⚡ Histórico de XP</h2>
          <div className="space-y-1.5">
            {user.xpEvents.length === 0 ? (
              <p className="text-zinc-500 text-sm">Nenhuma atividade ainda. Vá calcular!</p>
            ) : (
              user.xpEvents.map((event, i) => (
                <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm">{reasonLabel(event.reason)}</p>
                    <p className="text-xs text-zinc-500">{new Date(event.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                  <span className="font-mono font-bold text-orange-400 text-sm">+{event.amount} XP</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function reasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    calc_operation: "🧮 Cálculo realizado",
    session_bonus: "⏱️ Bônus de sessão (5 min)",
    daily_login: "📅 Login diário",
    welcome_bonus: "🎉 Bônus de boas-vindas",
    level_up_bonus: "🆙 Subiu de nível",
  };
  return labels[reason] ?? reason;
}
