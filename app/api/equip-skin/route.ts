import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skinId } = await req.json();

  // Verify ownership
  const isDefault = skinId === "default";
  const owned = isDefault || await prisma.userSkin.findUnique({
    where: { userId_skinId: { userId: session.user.id, skinId } },
  });

  if (!owned) {
    return NextResponse.json({ error: "Skin not owned" }, { status: 403 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { equippedSkinId: skinId },
  });

  return NextResponse.json({ ok: true });
}
