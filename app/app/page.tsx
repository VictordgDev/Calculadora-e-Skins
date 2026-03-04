import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AppDashboardClient } from "./AppDashboardClient";

export default async function AppPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!session.user.hasBasicAccess) redirect("/checkout?reason=no_access");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      xp: true,
      level: true,
      totalXpAllTime: true,
      equippedSkinId: true,
      skins: { select: { skinId: true } },
    },
  });

  const unlockedSkinIds = [
    "default",
    ...user.skins.map((s) => s.skinId),
  ];

  return (
    <AppDashboardClient
      userId={session.user.id}
      userName={session.user.name ?? "Calculador"}
      initialXp={user.xp}
      initialLevel={user.level}
      equippedSkinId={user.equippedSkinId}
      unlockedSkinIds={unlockedSkinIds}
    />
  );
}
