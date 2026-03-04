import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      hasBasicAccess: boolean;
      planType?: string;
      planExpiresAt?: Date;
      xp: number;
      level: number;
      totalXpAllTime: number;
      equippedSkinId: string;
    };
  }
}
