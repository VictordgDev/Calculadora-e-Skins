import "next-auth";
import "next-auth/jwt";

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

  interface User {
    hasBasicAccess?: boolean;
    planType?: string | null;
    planExpiresAt?: Date | null;
    xp?: number;
    level?: number;
    totalXpAllTime?: number;
    equippedSkinId?: string;
  }
}
