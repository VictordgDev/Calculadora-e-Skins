import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createOrder, createSkinOrder, PlanType } from "@/lib/pagarme";
import { SKINS, SkinId } from "@/lib/skins";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, planType, skinId } = body;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true },
  });

  try {
    if (type === "basic_access") {
      const plan = planType as PlanType;
      if (!["monthly", "yearly", "lifetime"].includes(plan)) {
        return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
      }

      const order = await createOrder({
        customerId: user.id,
        customerName: user.name ?? "Cliente",
        customerEmail: user.email!,
        planType: plan,
      });

      // Create pending purchase record
      await prisma.purchase.create({
        data: {
          userId: user.id,
          pagarmeOrderId: order.id,
          type: "basic_access",
          planType: plan,
          status: "pending",
          amount: order.amount,
        },
      });

      return NextResponse.json({
        orderId: order.id,
        pixQrCode: order.charges?.[0]?.last_transaction?.qr_code,
        pixQrCodeUrl: order.charges?.[0]?.last_transaction?.qr_code_url,
        expiresAt: order.charges?.[0]?.last_transaction?.expires_at,
      });
    }

    if (type === "skin") {
      const skin = SKINS[skinId as SkinId];
      if (!skin || skin.type !== "premium") {
        return NextResponse.json({ error: "Invalid skin" }, { status: 400 });
      }

      // Check if user already owns the skin
      const existing = await prisma.userSkin.findUnique({
        where: { userId_skinId: { userId: user.id, skinId } },
      });
      if (existing) {
        return NextResponse.json({ error: "Skin already owned" }, { status: 400 });
      }

      const order = await createSkinOrder({
        customerId: user.id,
        customerName: user.name ?? "Cliente",
        customerEmail: user.email!,
        skinId,
        skinName: skin.name,
        amount: skin.price!,
      });

      await prisma.purchase.create({
        data: {
          userId: user.id,
          pagarmeOrderId: order.id,
          type: "skin",
          itemId: skinId,
          status: "pending",
          amount: skin.price!,
        },
      });

      return NextResponse.json({
        orderId: order.id,
        pixQrCode: order.charges?.[0]?.last_transaction?.qr_code,
        pixQrCodeUrl: order.charges?.[0]?.last_transaction?.qr_code_url,
        expiresAt: order.charges?.[0]?.last_transaction?.expires_at,
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
