import { prisma } from "@/lib/prisma";
import { xpRequiredForLevel, getSkinRewardForLevel } from "@/lib/skins";

export interface XpGrantResult {
  xpGained: number;
  leveledUp: boolean;
  newLevel: number;
  skinUnlocked: string | null;
}

/**
 * Grants XP to a user and handles level-ups atomically.
 * Returns the result including any level-up or skin unlock info.
 */
export async function grantXp(
  userId: string,
  amount: number,
  reason: string
): Promise<XpGrantResult> {
  return await prisma.$transaction(async (tx) => {
    // Get current user state
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    let currentXp = user.xp + amount;
    let currentLevel = user.level;
    let leveledUp = false;
    let skinUnlocked: string | null = null;

    // Check for level-up (can level up multiple times with big XP gains)
    while (currentXp >= xpRequiredForLevel(currentLevel)) {
      currentXp -= xpRequiredForLevel(currentLevel);
      currentLevel += 1;
      leveledUp = true;

      // Check if this level grants a free skin
      const skinReward = getSkinRewardForLevel(currentLevel);
      if (skinReward) {
        skinUnlocked = skinReward;
        // Unlock the skin (upsert to avoid duplicates)
        await tx.userSkin.upsert({
          where: { userId_skinId: { userId, skinId: skinReward } },
          create: { userId, skinId: skinReward },
          update: {},
        });
      }
    }

    // Persist XP event
    await tx.xpEvent.create({
      data: { userId, amount, reason },
    });

    // Update user
    await tx.user.update({
      where: { id: userId },
      data: {
        xp: currentXp,
        level: currentLevel,
        totalXpAllTime: { increment: amount },
      },
    });

    return {
      xpGained: amount,
      leveledUp,
      newLevel: currentLevel,
      skinUnlocked,
    };
  });
}

/**
 * Grants XP for completing a calculation (1 XP per operation).
 */
export async function grantCalcXp(userId: string): Promise<XpGrantResult> {
  return grantXp(userId, 1, "calc_operation");
}

/**
 * Grants session bonus XP (5 XP for 5+ min active session).
 */
export async function grantSessionBonus(userId: string): Promise<XpGrantResult> {
  return grantXp(userId, 5, "session_bonus");
}
