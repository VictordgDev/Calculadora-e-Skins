import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

type Period = "week" | "month" | "year" | "alltime";

async function getRanking(period: Period) {
  const now = new Date();
  let since: Date | null = null;

  if (period === "week") {
    since = new Date(now);
    since.setDate(since.getDate() - 7);
  } else if (period === "month") {
    since = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "year") {
    since = new Date(now.getFullYear(), 0, 1);
  }

  if (period === "alltime") {
    return prisma.user.findMany({
      where: { totalXpAllTime: { gt: 0 } },
      orderBy: { totalXpAllTime: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, level: true, totalXpAllTime: true },
    }).then((users) =>
      users.map((u) => ({ ...u, periodXp: u.totalXpAllTime }))
    );
  }

  // For time-based periods, aggregate XpEvents
  const events = await prisma.xpEvent.groupBy({
    by: ["userId"],
    where: { createdAt: { gte: since! } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 10,
  });

  const userIds = events.map((e) => e.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, level: true },
  });

  return events.map((e) => {
    const user = users.find((u) => u.id === e.userId)!;
    return { ...user, periodXp: e._sum.amount ?? 0 };
  });
}

async function getUserRank(userId: string, period: Period) {
  // Simplified: just return their position
  const all = await getRanking(period);
  const idx = all.findIndex((u) => u.id === userId);
  return idx >= 0 ? idx + 1 : null;
}

export default async function RankingPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const session = await auth();
  const period = (searchParams.period ?? "alltime") as Period;

  const ranking = await getRanking(period);
  const tabs: { id: Period; label: string }[] = [
    { id: "week", label: "Semana" },
    { id: "month", label: "Mês" },
    { id: "year", label: "Ano" },
    { id: "alltime", label: "Global" },
  ];

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg">
          Calc<span className="text-orange-400">Skins</span>
        </Link>
        {session?.user ? (
          <Link href="/app" className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Voltar ao app
          </Link>
        ) : (
          <Link href="/register" className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Começar agora
          </Link>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">🏆 Ranking</h1>
          <p className="text-zinc-400 text-sm">Os calculadores mais dedicados do CalcSkins</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/ranking?period=${tab.id}`}
              className={`flex-1 text-center py-2 text-sm rounded-lg transition-colors font-medium ${period === tab.id ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Ranking list */}
        <div className="space-y-2">
          {ranking.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <p className="text-3xl mb-3">🧮</p>
              <p>Nenhum dado ainda para este período.</p>
              <p className="text-sm mt-1">Seja o primeiro no ranking!</p>
            </div>
          ) : (
            ranking.map((user, i) => {
              const isMe = session?.user?.id === user.id;
              const name = session?.user ? (user.name ?? user.email ?? "Anônimo") : maskName(user.name ?? user.email ?? "Anônimo");
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 border transition-colors ${isMe ? "border-orange-500/40 bg-orange-500/5" : i < 3 ? "border-white/10 bg-white/[0.03]" : "border-white/5"}`}
                >
                  <div className="w-8 text-center font-mono font-bold text-sm">
                    {i < 3 ? medals[i] : <span className="text-zinc-500">#{i + 1}</span>}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                    {(user.name ?? user.email ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{name} {isMe && <span className="text-orange-400 text-xs">(você)</span>}</p>
                    <p className="text-xs text-zinc-500">Lv {user.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-orange-400 text-sm">{user.periodXp.toLocaleString()}</p>
                    <p className="text-xs text-zinc-600">XP</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!session?.user && (
          <div className="mt-8 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 text-center">
            <p className="font-display font-bold text-lg mb-2">Entre para o ranking!</p>
            <p className="text-zinc-400 text-sm mb-4">Cada cálculo vale XP. Comece agora e apareça aqui.</p>
            <Link href="/register" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
              Criar conta — R$ 5/mês
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function maskName(name: string): string {
  const parts = name.split(" ");
  return parts[0] + (parts.length > 1 ? " " + parts[1][0] + "." : "");
}
