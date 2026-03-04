import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWebhookSignature } from "@/lib/pagarme";
import { grantXp } from "@/lib/xp";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature") ?? "";

  // Validate signature
  if (!validateWebhookSignature(rawBody, signature)) {
    console.warn("Invalid Pagar.me webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const { type, data } = event;

  console.log(`Pagar.me webhook: ${type}`);

  try {
    // ── Order paid (PIX confirmation for one-time payments) ──────────────
    if (type === "order.paid") {
      const orderId = data.id;
      const purchase = await prisma.purchase.findUnique({
        where: { pagarmeOrderId: orderId },
        include: { user: true },
      });

      if (!purchase || purchase.status === "paid") {
        return NextResponse.json({ ok: true }); // idempotent
      }

      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "paid" },
      });

      if (purchase.type === "basic_access") {
        const planExpiry = getPlanExpiry(purchase.planType);
        await prisma.user.update({
          where: { id: purchase.userId },
          data: {
            hasBasicAccess: true,
            planType: purchase.planType,
            planExpiresAt: planExpiry,
          },
        });
        // Welcome XP bonus on first access purchase
        await grantXp(purchase.userId, 20, "welcome_bonus");
      }

      if (purchase.type === "skin" && purchase.itemId) {
        await prisma.userSkin.upsert({
          where: {
            userId_skinId: {
              userId: purchase.userId,
              skinId: purchase.itemId,
            },
          },
          create: { userId: purchase.userId, skinId: purchase.itemId },
          update: {},
        });
      }
    }

    // ── Subscription paid ────────────────────────────────────────────────
    if (type === "subscription.payment_succeeded") {
      const subscriptionId = data.id;
      const purchase = await prisma.purchase.findFirst({
        where: { pagarmeSubscriptionId: subscriptionId },
      });

      if (purchase) {
        const planExpiry = getPlanExpiry(purchase.planType);
        await prisma.user.update({
          where: { id: purchase.userId },
          data: {
            hasBasicAccess: true,
            planType: purchase.planType,
            planExpiresAt: planExpiry,
          },
        });
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { status: "paid" },
        });
      }
    }

    // ── Subscription canceled / expired ─────────────────────────────────
    if (
      type === "subscription.canceled" ||
      type === "subscription.payment_failed"
    ) {
      const subscriptionId = data.id;
      const purchase = await prisma.purchase.findFirst({
        where: { pagarmeSubscriptionId: subscriptionId },
      });

      if (purchase) {
        await prisma.user.update({
          where: { id: purchase.userId },
          data: {
            hasBasicAccess: false,
            planType: null,
            planExpiresAt: null,
          },
        });
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { status: "canceled" },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function getPlanExpiry(planType: string | null): Date | null {
  if (!planType || planType === "lifetime") return null;
  const now = new Date();
  if (planType === "monthly") {
    now.setMonth(now.getMonth() + 1);
  } else if (planType === "yearly") {
    now.setFullYear(now.getFullYear() + 1);
  }
  return now;
}
