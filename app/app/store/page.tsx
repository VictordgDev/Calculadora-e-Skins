import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SKINS } from "@/lib/skins";
import Link from "next/link";
import { StoreClient } from "./StoreClient";

export default async function StorePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      level: true,
      skins: { select: { skinId: true } },
    },
  });

  const ownedSkinIds = ["default", ...user.skins.map((s) => s.skinId)];

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

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold mb-2">🛒 Loja de Skins</h1>
        <p className="text-zinc-400 text-sm mb-8">Personalize sua calculadora com temas exclusivos.</p>

        <StoreClient
          userLevel={user.level}
          ownedSkinIds={ownedSkinIds}
          allSkins={Object.values(SKINS)}
        />
      </div>
    </div>
  );
}
