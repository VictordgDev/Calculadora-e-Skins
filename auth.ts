import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // Magic Link via email (não requer senha)
    Resend({
      from: "CalcSkins <noreply@calcskins.com>",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Attach gamification data to session
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            hasBasicAccess: true,
            planType: true,
            planExpiresAt: true,
            xp: true,
            level: true,
            totalXpAllTime: true,
            equippedSkinId: true,
          },
        });
        if (dbUser) {
          session.user.hasBasicAccess = dbUser.hasBasicAccess;
          session.user.planType = dbUser.planType ?? undefined;
          session.user.planExpiresAt = dbUser.planExpiresAt ?? undefined;
          session.user.xp = dbUser.xp;
          session.user.level = dbUser.level;
          session.user.totalXpAllTime = dbUser.totalXpAllTime;
          session.user.equippedSkinId = dbUser.equippedSkinId;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (!isNewUser && user.id) {
        // Daily login XP bonus
        await grantDailyLoginXp(user.id);
      }
    },
  },
});

async function grantDailyLoginXp(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already granted today
  const existingEvent = await prisma.xpEvent.findFirst({
    where: {
      userId,
      reason: "daily_login",
      createdAt: { gte: today },
    },
  });

  if (!existingEvent) {
    await prisma.$transaction(async (tx) => {
      await tx.xpEvent.create({
        data: { userId, amount: 10, reason: "daily_login" },
      });
      await tx.user.update({
        where: { id: userId },
        data: {
          xp: { increment: 10 },
          totalXpAllTime: { increment: 10 },
        },
      });
    });
  }
}
