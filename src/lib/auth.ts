import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Busca dados extras do usuário
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
});
