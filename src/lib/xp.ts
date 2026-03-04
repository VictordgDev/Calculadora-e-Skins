export const XP_REASONS = {
  CALC_OPERATION: "calc_operation",
  SESSION_BONUS: "session_bonus",
  DAILY_LOGIN: "daily_login",
  WELCOME_BONUS: "welcome_bonus",
} as const;

export type XpReason = (typeof XP_REASONS)[keyof typeof XP_REASONS];

export const XP_AMOUNTS: Record<XpReason, number> = {
  calc_operation: 1,
  session_bonus: 5,
  daily_login: 10,
  welcome_bonus: 20,
};

/**
 * Retorna o XP necessário para subir do level atual para o próximo.
 * Level 0 → 1 requer 10 XP, e assim por diante conforme tabela.
 */
export function xpRequiredForLevel(level: number): number {
  if (level === 0) return 10;
  if (level === 1) return 10;
  if (level === 2) return 15;
  if (level === 3) return 20;
  if (level === 4) return 25;
  if (level === 5) return 30;
  // Level 6+: 35 XP cada
  return 35;
}

export interface LevelUpResult {
  newLevel: number;
  newXp: number; // XP após reset (excedente é descartado conforme regra)
  leveledUp: boolean;
  unlockedSkinId?: string;
}

/**
 * Calcula novo level e XP após adicionar `xpToAdd` ao estado atual.
 * XP excedente NÃO carrega para o próximo level (zera ao subir).
 */
export function calculateLevelUp(
  currentLevel: number,
  currentXp: number,
  xpToAdd: number
): LevelUpResult {
  const newXpTotal = currentXp + xpToAdd;
  const required = xpRequiredForLevel(currentLevel);

  if (newXpTotal >= required) {
    const newLevel = currentLevel + 1;
    const unlockedSkinId = LEVEL_SKIN_REWARDS[newLevel];
    return {
      newLevel,
      newXp: 0, // XP zera ao subir de level
      leveledUp: true,
      unlockedSkinId,
    };
  }

  return {
    newLevel: currentLevel,
    newXp: newXpTotal,
    leveledUp: false,
  };
}

/** Mapa de recompensas de skin por level */
export const LEVEL_SKIN_REWARDS: Record<number, string> = {
  0: "inverted",  // Classic Light (10 cálculos iniciais)
  2: "lv2_skin",  // Midnight Blue
  4: "lv4_skin",  // Forest Matrix
  5: "lv5_skin",  // Aurora
};
