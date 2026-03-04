import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { grantCalcXp, grantSessionBonus } from "@/lib/xp";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reason } = await req.json();

  try {
    let result;
    if (reason === "session_bonus") {
      result = await grantSessionBonus(session.user.id);
    } else {
      result = await grantCalcXp(session.user.id);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("XP grant error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
